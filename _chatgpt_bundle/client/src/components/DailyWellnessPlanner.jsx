import { useState } from "react";
import { 
  Calendar, Plus, Check, Clock, Sun, Moon, Coffee, Sunset,
  Target, Heart, Brain, Wind, Trash2, GripVertical, Sparkles
} from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const TIME_BLOCKS = [
  { id: "morning", label: "Morning", icon: Sun, color: "from-amber-400 to-orange-500", time: "6:00 AM - 12:00 PM" },
  { id: "afternoon", label: "Afternoon", icon: Coffee, color: "from-blue-400 to-indigo-500", time: "12:00 PM - 5:00 PM" },
  { id: "evening", label: "Evening", icon: Sunset, color: "from-orange-400 to-rose-500", time: "5:00 PM - 9:00 PM" },
  { id: "night", label: "Night", icon: Moon, color: "from-indigo-400 to-purple-500", time: "9:00 PM - 11:00 PM" }
];

const WELLNESS_ACTIVITIES = [
  { id: "meditation", name: "Meditation", icon: Moon, duration: 10, category: "mindfulness" },
  { id: "breathing", name: "Breathing Exercise", icon: Wind, duration: 5, category: "mindfulness" },
  { id: "journaling", name: "Journaling", icon: Brain, duration: 15, category: "reflection" },
  { id: "gratitude", name: "Gratitude Practice", icon: Heart, duration: 5, category: "emotional" },
  { id: "exercise", name: "Light Exercise", icon: Target, duration: 20, category: "physical" },
  { id: "reading", name: "Mindful Reading", icon: Brain, duration: 15, category: "growth" },
  { id: "stretching", name: "Stretching", icon: Target, duration: 10, category: "physical" },
  { id: "walking", name: "Mindful Walk", icon: Wind, duration: 15, category: "mindfulness" }
];

const SUGGESTED_ROUTINES = [
  {
    name: "Calm Morning",
    activities: [
      { block: "morning", activity: "meditation" },
      { block: "morning", activity: "gratitude" },
      { block: "morning", activity: "stretching" }
    ]
  },
  {
    name: "Balanced Day",
    activities: [
      { block: "morning", activity: "breathing" },
      { block: "afternoon", activity: "walking" },
      { block: "evening", activity: "journaling" },
      { block: "night", activity: "meditation" }
    ]
  },
  {
    name: "Stress Relief",
    activities: [
      { block: "morning", activity: "breathing" },
      { block: "afternoon", activity: "meditation" },
      { block: "evening", activity: "stretching" },
      { block: "night", activity: "gratitude" }
    ]
  }
];

export default function DailyWellnessPlanner() {
  const [plannedActivities, setPlannedActivities] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [showActivityPicker, setShowActivityPicker] = useState(null);
  const { addXP } = useGamification();

  const addActivity = (blockId, activityId) => {
    const activity = WELLNESS_ACTIVITIES.find(a => a.id === activityId);
    if (activity) {
      setPlannedActivities(prev => [...prev, {
        id: `${blockId}-${activityId}-${Date.now()}`,
        blockId,
        ...activity
      }]);
      setShowActivityPicker(null);
    }
  };

  const removeActivity = (activityId) => {
    setPlannedActivities(prev => prev.filter(a => a.id !== activityId));
    setCompletedActivities(prev => prev.filter(id => id !== activityId));
  };

  const toggleComplete = (activityId) => {
    if (completedActivities.includes(activityId)) {
      setCompletedActivities(prev => prev.filter(id => id !== activityId));
    } else {
      setCompletedActivities(prev => [...prev, activityId]);
      addXP(15, "Completed wellness activity");
    }
  };

  const loadRoutine = (routine) => {
    const newActivities = routine.activities.map((item, index) => {
      const activity = WELLNESS_ACTIVITIES.find(a => a.id === item.activity);
      return {
        id: `${item.block}-${item.activity}-${Date.now()}-${index}`,
        blockId: item.block,
        ...activity
      };
    });
    setPlannedActivities(newActivities);
    setCompletedActivities([]);
    addXP(10, `Loaded ${routine.name} routine`);
  };

  const getBlockActivities = (blockId) => {
    return plannedActivities.filter(a => a.blockId === blockId);
  };

  const totalPlannedMinutes = plannedActivities.reduce((sum, a) => sum + a.duration, 0);
  const completedMinutes = plannedActivities
    .filter(a => completedActivities.includes(a.id))
    .reduce((sum, a) => sum + a.duration, 0);

  return (
    <div 
      className="card-elevated p-6"
      role="region"
      aria-label="Daily Wellness Planner"
      data-testid="daily-wellness-planner-container"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">Daily Wellness Planner</h2>
            <p className="text-sm text-[var(--text-secondary)]">Plan your wellness activities for today</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="text-[var(--text)]">
            <strong>{completedMinutes}</strong> / {totalPlannedMinutes} min
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-[var(--text-secondary)] mb-3">Quick Start with a Routine</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_ROUTINES.map(routine => (
            <button
              key={routine.name}
              onClick={() => loadRoutine(routine)}
              className="px-4 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] text-sm font-medium transition-colors flex items-center gap-2"
              data-testid={`routine-${routine.name.toLowerCase().replace(/\s/g, '-')}`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              {routine.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {TIME_BLOCKS.map(block => {
          const BlockIcon = block.icon;
          const activities = getBlockActivities(block.id);

          return (
            <div
              key={block.id}
              className="rounded-xl border border-[var(--border)] overflow-hidden"
              data-testid={`block-${block.id}`}
            >
              <div className={`p-4 bg-gradient-to-r ${block.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BlockIcon className="w-5 h-5" />
                    <div>
                      <h3 className="font-semibold">{block.label}</h3>
                      <p className="text-xs text-white/80">{block.time}</p>
                    </div>
                  </div>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {activities.length} activities
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[var(--surface)]">
                {activities.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {activities.map(activity => {
                      const ActivityIcon = activity.icon;
                      const isCompleted = completedActivities.includes(activity.id);

                      return (
                        <div
                          key={activity.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            isCompleted
                              ? "bg-emerald-500/10 border border-emerald-500/30"
                              : "bg-[var(--bg)] hover:bg-[var(--surface-hover)]"
                          }`}
                          data-testid={`activity-${activity.id}`}
                        >
                          <button
                            onClick={() => toggleComplete(activity.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "border-[var(--border)] hover:border-[var(--primary)]"
                            }`}
                            aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                            data-testid={`toggle-${activity.id}`}
                          >
                            {isCompleted && <Check className="w-4 h-4" />}
                          </button>
                          <ActivityIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                          <div className="flex-1">
                            <p className={`font-medium ${isCompleted ? "line-through text-[var(--text-secondary)]" : "text-[var(--text)]"}`}>
                              {activity.name}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">{activity.duration} min</p>
                          </div>
                          <button
                            onClick={() => removeActivity(activity.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                            aria-label="Remove activity"
                            data-testid={`remove-${activity.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {showActivityPicker === block.id ? (
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[var(--bg)]">
                    {WELLNESS_ACTIVITIES.map(activity => {
                      const ActivityIcon = activity.icon;
                      return (
                        <button
                          key={activity.id}
                          onClick={() => addActivity(block.id, activity.id)}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--surface-hover)] text-left transition-colors"
                          data-testid={`add-${activity.id}`}
                        >
                          <ActivityIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                          <div>
                            <p className="text-sm text-[var(--text)]">{activity.name}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{activity.duration} min</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowActivityPicker(block.id)}
                    className="w-full py-2 rounded-lg border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-2"
                    data-testid={`add-to-${block.id}`}
                  >
                    <Plus className="w-4 h-4" />
                    Add Activity
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {plannedActivities.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[var(--primary)]/10 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[var(--text)]">Today's Progress</p>
              <p className="text-sm text-[var(--text-secondary)]">
                {completedActivities.length} of {plannedActivities.length} activities completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--primary)]">
                {Math.round((completedActivities.length / plannedActivities.length) * 100)}%
              </p>
            </div>
          </div>
          <div className="mt-3 h-3 bg-[var(--surface)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${(completedActivities.length / plannedActivities.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
