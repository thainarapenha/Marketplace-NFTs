import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import { generateReport } from "lighthouse";

import { lighthouseConfig } from "../lighthouse.config.mjs";

const projectDirectory = dirname(fileURLToPath(import.meta.url));
const reportDirectory = join(projectDirectory, "..", lighthouseConfig.reportDirectory);
const chromePath = process.env.CHROME_PATH;
const port = 4173;

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const waitForPreview = async (preview) => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`${lighthouseConfig.baseUrl}/`);
      if (response.ok) return;
    } catch {
      // The preview is still starting.
    }
    await sleep(500);
  }

  preview.kill();
  throw new Error("O preview não ficou disponível em 15 segundos.");
};

const preview = spawn(
  "npm",
  ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  { cwd: join(projectDirectory, ".."), stdio: "inherit" },
);

const results = [];
let browser;

try {
  await waitForPreview(preview);
  await mkdir(reportDirectory, { recursive: true });
  browser = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
  });

  for (const scenario of lighthouseConfig.scenarios) {
    for (const profileName of scenario.profiles) {
      const profile = lighthouseConfig.profiles[profileName];
      const scenarioResults = [];

      for (let run = 1; run <= lighthouseConfig.runsPerScenario; run += 1) {
        const url = `${lighthouseConfig.baseUrl}${scenario.path}`;
        console.log(`Auditing ${scenario.name}/${profileName}, run ${run}/3...`);
        const audit = await lighthouse(url, {
          port: browser.port,
          output: ["html", "json"],
          logLevel: "error",
          onlyCategories: lighthouseConfig.categories,
          ...profile,
        });

        const directory = join(reportDirectory, scenario.name, profileName);
        await mkdir(directory, { recursive: true });
        await writeFile(join(directory, `run-${run}.html`), generateReport(audit.lhr, "html"));
        await writeFile(join(directory, `run-${run}.json`), generateReport(audit.lhr, "json"));

        const values = {
          page: scenario.name,
          profile: profileName,
          run,
          performance: audit.lhr.categories.performance.score * 100,
          accessibility: audit.lhr.categories.accessibility.score * 100,
          bestPractices: audit.lhr.categories["best-practices"].score * 100,
          seo: audit.lhr.categories.seo.score * 100,
          lcp: audit.lhr.audits["largest-contentful-paint"].numericValue,
          cls: audit.lhr.audits["cumulative-layout-shift"].numericValue,
          tbt: audit.lhr.audits["total-blocking-time"].numericValue,
        };
        scenarioResults.push(values);
        results.push(values);
      }

      results.push({
        page: scenario.name,
        profile: profileName,
        run: "median",
        performance: median(scenarioResults.map((item) => item.performance)),
        accessibility: median(scenarioResults.map((item) => item.accessibility)),
        bestPractices: median(scenarioResults.map((item) => item.bestPractices)),
        seo: median(scenarioResults.map((item) => item.seo)),
        lcp: median(scenarioResults.map((item) => item.lcp)),
        cls: median(scenarioResults.map((item) => item.cls)),
        tbt: median(scenarioResults.map((item) => item.tbt)),
      });
    }
  }

  await writeFile(join(reportDirectory, "summary.json"), `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    targets: lighthouseConfig.targets,
    results,
  }, null, 2)}\n`);
  console.table(results);
} finally {
  if (browser) await browser.kill();
  preview.kill();
}
