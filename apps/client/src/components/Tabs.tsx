/**
 * Tabs Component
 * Accessible tab navigation with keyboard support
 */

import { useState, ReactNode, useRef, KeyboardEvent } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'line' | 'pills';
  'data-testid'?: string;
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'line',
  'data-testid': testId,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;
    
    setActiveTab(tabId);
    onChange?.(tabId);
    tabRefs.current.get(tabId)?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const enabledIndex = enabledTabs.findIndex((t) => t.id === tabs[currentIndex].id);
    
    if (enabledIndex === -1) return;

    let nextIndex = enabledIndex;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (enabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
        handleTabChange(enabledTabs[nextIndex].id);
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (enabledIndex + 1) % enabledTabs.length;
        handleTabChange(enabledTabs[nextIndex].id);
        break;

      case 'Home':
        e.preventDefault();
        handleTabChange(enabledTabs[0].id);
        break;

      case 'End':
        e.preventDefault();
        handleTabChange(enabledTabs[enabledTabs.length - 1].id);
        break;
    }
  };

  return (
    <div className="w-full" {...(testId && { 'data-testid': testId })}>
      {/* Tab List */}
      <div
        role="tablist"
        className={`
          flex gap-1
          ${variant === 'line' ? 'border-b border-gray-200 dark:border-gray-700' : 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'}
        `}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
              else tabRefs.current.delete(tab.id);
            }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={tab.disabled}
            className={`
              relative flex items-center gap-2 px-4 py-2 font-medium transition-all
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${variant === 'line' ? `
                border-b-2 -mb-px
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              ` : `
                rounded-md
                ${activeTab === tab.id
                  ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            `}
            {...(testId && { 'data-testid': `${testId}-tab-${tab.id}` })}
          >
            {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-full">
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            tabIndex={0}
            {...(testId && { 'data-testid': `${testId}-panel-${tab.id}` })}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Vertical Tabs
 */
export function VerticalTabs({ tabs, defaultTab, onChange, 'data-testid': testId }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;
    
    setActiveTab(tabId);
    onChange?.(tabId);
    tabRefs.current.get(tabId)?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const enabledIndex = enabledTabs.findIndex((t) => t.id === tabs[currentIndex].id);
    
    if (enabledIndex === -1) return;

    let nextIndex = enabledIndex;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (enabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
        handleTabChange(enabledTabs[nextIndex].id);
        break;

      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (enabledIndex + 1) % enabledTabs.length;
        handleTabChange(enabledTabs[nextIndex].id);
        break;

      case 'Home':
        e.preventDefault();
        handleTabChange(enabledTabs[0].id);
        break;

      case 'End':
        e.preventDefault();
        handleTabChange(enabledTabs[enabledTabs.length - 1].id);
        break;
    }
  };

  return (
    <div className="flex gap-6" {...(testId && { 'data-testid': testId })}>
      {/* Vertical Tab List */}
      <div role="tablist" className="flex flex-col gap-2 min-w-[200px]">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
              else tabRefs.current.delete(tab.id);
            }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={tab.disabled}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${activeTab === tab.id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
            {...(testId && { 'data-testid': `${testId}-tab-${tab.id}` })}
          >
            {tab.icon && <span className="h-5 w-5">{tab.icon}</span>}
            <span className="flex-1">{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-2 py-0.5 text-xs bg-red-600 text-white rounded-full">
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <div className="flex-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            tabIndex={0}
            {...(testId && { 'data-testid': `${testId}-panel-${tab.id}` })}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
