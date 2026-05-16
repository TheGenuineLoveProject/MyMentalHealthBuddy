import { CheckCircle, Circle, Trophy, Star } from "lucide-react";

export function MilestoneTracker({ milestones = [], currentProgress = 0 }) {
  const sortedMilestones = [...milestones].sort((a, b) => a.target - b.target);
  
  return (
    <div className="relative">
      <div className="absolute top-6 left-6 right-6 h-1 bg-muted rounded-full">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, (currentProgress / (sortedMilestones[sortedMilestones.length - 1]?.target || 100)) * 100)}%` }}
        />
      </div>
      
      <div className="relative flex justify-between">
        {sortedMilestones.map((milestone, index) => {
          const isCompleted = currentProgress >= milestone.target;
          const isCurrent = index === 0 
            ? currentProgress < milestone.target 
            : currentProgress >= sortedMilestones[index - 1].target && currentProgress < milestone.target;
          
          return (
            <div key={milestone.id || index} className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center z-10
                  ${isCompleted 
                    ? "bg-primary text-primary-foreground" 
                    : isCurrent 
                      ? "bg-primary/20 text-primary border-2 border-primary" 
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : milestone.icon === "trophy" ? (
                  <Trophy className="w-6 h-6" />
                ) : milestone.icon === "star" ? (
                  <Star className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>
              <div className="mt-3 text-center">
                <p className={`text-sm font-medium ${isCompleted ? "text-primary" : ""}`}>
                  {milestone.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {milestone.target} {milestone.unit || ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SimpleMilestoneCard({ title, current, target, unit = "", icon: Icon = Star }) {
  const percentage = Math.min(100, (current / target) * 100);
  const isComplete = current >= target;

  return (
    <div className={`p-4 rounded-xl border ${isComplete ? "bg-primary/5 border-primary/20" : "bg-background"}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isComplete ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          {isComplete ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">
            {current} / {target} {unit}
          </p>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-primary" : "bg-primary/60"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default MilestoneTracker;
