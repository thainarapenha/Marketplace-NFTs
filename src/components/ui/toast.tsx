import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error";
type ToastItem = { id: number; type: ToastType; message: string };
type ToastContextValue = { toast: (type: ToastType, message: string) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const dismiss = useCallback((id: number) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const toast = useCallback((type: ToastType, message: string) => {
    const id = nextId.current++;
    setItems((current) => [...current.slice(-2), { id, type, message }]);
    window.setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);

  return <ToastContext.Provider value={{ toast }}>
    {children}
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-end gap-2 sm:left-auto sm:max-w-sm" aria-live="polite" aria-atomic="true">
      {items.map((item) => <div key={item.id} className={cn("pointer-events-auto flex w-full items-start gap-3 rounded-lg border bg-card px-4 py-3 text-sm shadow-lg", item.type === "success" ? "border-primary/40" : "border-destructive/50")}>
        {item.type === "success" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> : <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />}
        <span className="min-w-0 flex-1 break-words">{item.message}</span>
        <button type="button" aria-label="Fechar aviso" onClick={() => dismiss(item.id)} className="shrink-0 text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
      </div>)}
    </div>
  </ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
