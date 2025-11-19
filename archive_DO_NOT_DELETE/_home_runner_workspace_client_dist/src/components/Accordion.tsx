/**
 * Accordion Component
 * Collapsible content sections
 */

import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  'data-testid'?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  'data-testid': testId,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item?.disabled) return;

    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(itemId);
      }
      return next;
    });
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg" data-testid={testId}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);

        return (
          <div key={item.id} data-testid={`accordion-item-${item.id}`}>
            <button
              onClick={() => toggleItem(item.id)}
              disabled={item.disabled}
              className={`
                w-full flex items-center justify-between px-6 py-4 text-left transition-colors
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}
              `}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              data-testid={`accordion-trigger-${item.id}`}
            >
              <div className="flex items-center gap-3">
                {item.icon && <span className="h-5 w-5">{item.icon}</span>}
                <span className="font-medium">{item.title}</span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                className="px-6 py-4 bg-gray-50 dark:bg-gray-900 animate-slide-down"
                data-testid={`accordion-content-${item.id}`}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Simple Accordion (single item)
 */
interface SimpleAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
  'data-testid'?: string;
}

export function SimpleAccordion({
  title,
  children,
  defaultOpen = false,
  icon,
  'data-testid': testId,
}: SimpleAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg" data-testid={testId}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={isOpen}
        data-testid={`${testId}-trigger`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="h-5 w-5">{icon}</span>}
          <span className="font-medium">{title}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down"
          data-testid={`${testId}-content`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
