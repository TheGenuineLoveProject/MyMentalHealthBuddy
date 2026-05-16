import { createContext, useContext, useState, useRef, useEffect, ReactNode, KeyboardEvent, useId } from "react";

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  baseId: string;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect() {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Select components must be used within a Select provider");
  return context;
}

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  disabled?: boolean;
}

function Select({ value: controlledValue, defaultValue = "", onValueChange, children, disabled = false }: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const baseId = useId();
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, setOpen, baseId }}>
      <div className="relative inline-block w-full" data-select-root="">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
  placeholder?: string;
}

function SelectTrigger({ children, className = "", "data-testid": testId, placeholder }: SelectTriggerProps) {
  const { open, setOpen, baseId, value } = useSelect();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={`${baseId}-content`}
      id={`${baseId}-trigger`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-testid={testId}
      data-state={open ? "open" : "closed"}
      className={`
        flex h-10 w-full items-center justify-between rounded-xl border-2 
        border-[var(--glp-border)] bg-[var(--glp-surface)] px-3 py-2 text-sm 
        text-[var(--glp-text)] placeholder:text-[var(--glp-text-tertiary)]
        focus:outline-none focus:ring-2 focus:ring-[var(--glp-gold)] focus:border-[var(--glp-sage)]
        disabled:cursor-not-allowed disabled:opacity-50
        dark:border-[var(--glp-teal-700)] dark:bg-[var(--glp-teal-900)] dark:text-[var(--glp-paper)]
        transition-all duration-200 cursor-pointer
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <span className="flex-1 text-left truncate">
        {children}
      </span>
      <ChevronDownIcon className={`h-4 w-4 opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

function SelectValue({ placeholder = "Select..." }: SelectValueProps) {
  const { value } = useSelect();
  return <span className={value ? "" : "text-[var(--glp-text-tertiary)]"}>{value || placeholder}</span>;
}

interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

function SelectContent({ children, className = "" }: SelectContentProps) {
  const { open, setOpen, baseId } = useSelect();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        const trigger = document.getElementById(`${baseId}-trigger`);
        if (trigger && !trigger.contains(e.target as Node)) {
          setOpen(false);
        }
      }
    };

    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen, baseId]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      role="listbox"
      id={`${baseId}-content`}
      aria-labelledby={`${baseId}-trigger`}
      className={`
        absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-xl 
        border-2 border-[var(--glp-border)] bg-[var(--glp-surface)] 
        shadow-lg animate-in fade-in-0 zoom-in-95 duration-200
        dark:border-[var(--glp-teal-700)] dark:bg-[var(--glp-teal-900)]
        max-h-60 overflow-y-auto
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  );
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

function SelectItem({ value: itemValue, children, className = "", disabled = false }: SelectItemProps) {
  const { value, onValueChange, baseId } = useSelect();
  const isSelected = value === itemValue;

  const handleClick = () => {
    if (!disabled) {
      onValueChange(itemValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) {
        onValueChange(itemValue);
      }
    }
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-value={itemValue}
      data-state={isSelected ? "checked" : "unchecked"}
      className={`
        relative flex w-full cursor-pointer select-none items-center rounded-lg 
        py-2 px-3 text-sm outline-none transition-colors duration-150
        hover:bg-[var(--glp-sage-100)] focus:bg-[var(--glp-sage-100)]
        dark:hover:bg-[var(--glp-teal-800)] dark:focus:bg-[var(--glp-teal-800)]
        ${isSelected ? "bg-[var(--glp-sage-100)] dark:bg-[var(--glp-teal-800)]" : ""}
        ${disabled ? "pointer-events-none opacity-50" : ""}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <span className="flex-1">{children}</span>
      {isSelected && <CheckIcon className="h-4 w-4 text-[var(--glp-sage-deep)]" />}
    </div>
  );
}

interface SelectGroupProps {
  children: ReactNode;
}

function SelectGroup({ children }: SelectGroupProps) {
  return <div role="group">{children}</div>;
}

interface SelectLabelProps {
  children: ReactNode;
  className?: string;
}

function SelectLabel({ children, className = "" }: SelectLabelProps) {
  return (
    <div className={`px-3 py-1.5 text-xs font-semibold text-[var(--glp-text-secondary)] ${className}`}>
      {children}
    </div>
  );
}

function SelectSeparator() {
  return <div className="my-1 h-px bg-[var(--glp-border)]" />;
}

export { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem, 
  SelectGroup, 
  SelectLabel, 
  SelectSeparator 
};
