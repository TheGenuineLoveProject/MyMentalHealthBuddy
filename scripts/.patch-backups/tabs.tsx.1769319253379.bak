import { createContext, useContext, useState, HTMLAttributes, ButtonHTMLAttributes, forwardRef, useId } from "react";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used within a Tabs provider");
  return context;
}

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  defaultValue?: string;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ value, onValueChange, children, className = "", ...props }, ref) => {
    const baseId = useId();
    return (
      <TabsContext.Provider value={{ value, onValueChange, baseId }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation="horizontal"
        className={`inline-flex h-10 items-center justify-center rounded-xl bg-[var(--glp-sage-100)] p-1 text-[var(--glp-text-secondary)] dark:bg-[var(--glp-teal-800)] dark:text-[var(--glp-teal-300)] ${className}`}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className = "", value, ...props }, ref) => {
    const { value: selectedValue, onValueChange, baseId } = useTabs();
    const isSelected = selectedValue === value;
    const triggerId = `${baseId}-trigger-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onValueChange(value);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={triggerId}
        aria-selected={isSelected}
        aria-controls={panelId}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => onValueChange(value)}
        onKeyDown={handleKeyDown}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          isSelected
            ? "bg-[var(--glp-surface)] text-[var(--glp-teal-700)] shadow-[var(--glp-shadow-sm)] dark:bg-[var(--glp-teal-900)] dark:text-[var(--glp-paper)]"
            : "hover:bg-[var(--glp-sage-50)] dark:hover:bg-[var(--glp-teal-700)]"
        } ${className}`}
        data-state={isSelected ? "active" : "inactive"}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className = "", value, ...props }, ref) => {
    const { value: selectedValue, baseId } = useTabs();
    const triggerId = `${baseId}-trigger-${value}`;
    const panelId = `${baseId}-panel-${value}`;
    
    if (selectedValue !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={triggerId}
        tabIndex={0}
        className={`mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] ${className}`}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
