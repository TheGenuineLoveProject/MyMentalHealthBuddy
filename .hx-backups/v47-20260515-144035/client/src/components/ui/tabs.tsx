import { createContext, useContext, useId, ReactNode, MouseEvent, KeyboardEvent, useRef, useCallback } from "react";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
  registerTab: (value: string) => void;
  unregisterTab: (value: string) => void;
  tabValues: string[];
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used within a Tabs provider");
  return context;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  defaultValue?: string;
  children: ReactNode;
  className?: string;
}

function Tabs({ value, onValueChange, children, className = "" }: TabsProps) {
  const baseId = useId();
  const tabValuesRef = useRef<string[]>([]);

  const registerTab = useCallback((tabValue: string) => {
    if (!tabValuesRef.current.includes(tabValue)) {
      tabValuesRef.current.push(tabValue);
    }
  }, []);

  const unregisterTab = useCallback((tabValue: string) => {
    tabValuesRef.current = tabValuesRef.current.filter(v => v !== tabValue);
  }, []);

  return (
    <TabsContext.Provider value={{ 
      value, 
      onValueChange, 
      baseId, 
      registerTab, 
      unregisterTab,
      tabValues: tabValuesRef.current 
    }}>
      <div className={className} data-tabs-root="">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

function TabsList({ className = "", children }: TabsListProps) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`inline-flex h-auto min-h-10 items-center justify-start flex-wrap gap-1 rounded-xl bg-gray-100 p-1.5 text-gray-600 dark:bg-gray-800 dark:text-gray-300 ${className}`}
      data-tabs-list=""
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  "data-testid"?: string;
}

function TabsTrigger({ className = "", value, children, disabled = false, "data-testid": testId }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange, baseId, tabValues } = useTabs();
  const isSelected = selectedValue === value;
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-panel-${value}`;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onValueChange(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const currentIndex = tabValues.indexOf(value);
    let nextIndex = -1;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        onValueChange(value);
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        nextIndex = currentIndex < tabValues.length - 1 ? currentIndex + 1 : 0;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabValues.length - 1;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = tabValues.length - 1;
        break;
    }

    if (nextIndex >= 0 && nextIndex < tabValues.length) {
      const nextValue = tabValues[nextIndex];
      onValueChange(nextValue);
      const nextButton = document.getElementById(`${baseId}-trigger-${nextValue}`);
      nextButton?.focus();
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      id={triggerId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      data-testid={testId}
      data-state={isSelected ? "active" : "inactive"}
      data-value={value}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium 
        transition-all duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50 
        cursor-pointer select-none
        ${isSelected
          ? "bg-white text-gray-900 shadow-md dark:bg-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-gray-700"
          : "text-gray-600 hover:bg-gray-200/80 hover:text-gray-900 active:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-700/80 dark:hover:text-white dark:active:bg-gray-600"
        } 
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
  forceMount?: boolean;
}

function TabsContent({ className = "", value, children, forceMount = false }: TabsContentProps) {
  const { value: selectedValue, baseId } = useTabs();
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-panel-${value}`;
  const isSelected = selectedValue === value;
  
  if (!isSelected && !forceMount) return null;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={triggerId}
      tabIndex={0}
      hidden={!isSelected}
      data-state={isSelected ? "active" : "inactive"}
      className={`
        mt-2 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] 
        animate-in fade-in-0 duration-200
        ${!isSelected && forceMount ? "hidden" : ""}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
