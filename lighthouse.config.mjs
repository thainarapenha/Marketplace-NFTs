export const lighthouseConfig = {
  baseUrl: "http://127.0.0.1:4173",
  reportDirectory: "reports/lighthouse",
  runsPerScenario: 3,
  scenarios: [
    {
      name: "home",
      path: "/",
      profiles: ["mobile", "desktop"],
    },
    {
      name: "nft-detail",
      path: "/nft/1",
      profiles: ["mobile", "desktop"],
    },
  ],
  categories: ["performance", "accessibility", "best-practices", "seo"],
  metrics: ["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time"],
  targets: {
    performance: 90,
    accessibility: 95,
    bestPractices: 95,
    seo: 90,
  },
  profiles: {
    mobile: {
      formFactor: "mobile",
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
      },
      throttling: {
        rttMs: 150,
        throughputKbps: 1_600,
        requestLatencyMs: 150,
        downloadThroughputKbps: 1_600,
        uploadThroughputKbps: 750,
        cpuSlowdownMultiplier: 4,
      },
    },
    desktop: {
      formFactor: "desktop",
      screenEmulation: {
        mobile: false,
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
      },
      throttling: {
        rttMs: 40,
        throughputKbps: 10_000,
        requestLatencyMs: 40,
        downloadThroughputKbps: 10_000,
        uploadThroughputKbps: 5_000,
        cpuSlowdownMultiplier: 1,
      },
    },
  },
};
