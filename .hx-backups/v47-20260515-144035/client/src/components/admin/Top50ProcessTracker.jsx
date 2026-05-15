/**
 * Top50ProcessTracker - Admin dashboard component
 * Shows A→Z 360 platform process completion status
 */

import { top50Processes, getProcessStats, PROCESS_CATEGORIES } from '../../content/processes/top50ProcessMap.ts';

const STATUS_COLORS = {
  done: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  not_started: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
};

const STATUS_LABELS = {
  done: 'Done',
  in_progress: 'In Progress',
  not_started: 'Not Started'
};

function StatusBadge({ status }) {
  return (
    <span 
      className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}
      data-testid={`status-badge-${status}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function CategorySection({ categoryKey, processes }) {
  const categoryName = PROCESS_CATEGORIES[categoryKey];
  const done = processes.filter(p => p.status === 'done').length;
  
  return (
    <div className="mb-6" data-testid={`category-${categoryKey}`}>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
        <span>{categoryKey}. {categoryName}</span>
        <span className="text-xs font-normal text-gray-500">
          {done}/{processes.length} complete
        </span>
      </h4>
      <div className="space-y-2">
        {processes.map(process => (
          <div 
            key={process.id}
            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
            data-testid={`process-${process.id}`}
          >
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {process.id}. {process.name}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {process.description}
              </p>
            </div>
            <StatusBadge status={process.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Top50ProcessTracker() {
  const stats = getProcessStats();
  
  const processesByCategory = {
    A: top50Processes.filter(p => p.category === 'A'),
    B: top50Processes.filter(p => p.category === 'B'),
    C: top50Processes.filter(p => p.category === 'C'),
    D: top50Processes.filter(p => p.category === 'D'),
    E: top50Processes.filter(p => p.category === 'E')
  };
  
  return (
    <div 
      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6"
      data-testid="top50-process-tracker"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          A→Z 360 Platform Processes
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Top-50 platform processes implementation status
        </p>
      </div>
      
      {/* Progress Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.done}
          </div>
          <div className="text-xs text-gray-500">Done</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.inProgress}
          </div>
          <div className="text-xs text-gray-500">In Progress</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {stats.notStarted}
          </div>
          <div className="text-xs text-gray-500">Not Started</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.percentComplete}%
          </div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
            style={{ width: `${stats.percentComplete}%` }}
          />
        </div>
      </div>
      
      {/* Category Sections */}
      <div className="max-h-[600px] overflow-y-auto pr-2">
        {Object.entries(processesByCategory).map(([key, processes]) => (
          <CategorySection 
            key={key} 
            categoryKey={key} 
            processes={processes} 
          />
        ))}
      </div>
    </div>
  );
}
