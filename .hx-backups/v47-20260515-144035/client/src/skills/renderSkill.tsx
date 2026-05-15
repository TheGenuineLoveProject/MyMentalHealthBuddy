import { Skill, SkillPack } from "./skillRegistry";

interface RenderSkillProps {
  skill: Skill;
  level?: "beginner" | "intermediate" | "advanced";
  className?: string;
}

export function RenderSkill({ skill, level, className = "" }: RenderSkillProps) {
  const showSkill = !level || skill.level === level;
  
  if (!showSkill) {
    return null;
  }

  const levelColors = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
  };

  return (
    <article 
      className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
      data-testid={`skill-${skill.id}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-gray-100" data-testid="skill-name">
          {skill.name}
        </h4>
        <span 
          className={`text-xs px-2 py-1 rounded-full ${levelColors[skill.level]}`}
          data-testid="skill-level"
        >
          {skill.level}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" data-testid="skill-description">
        {skill.description}
      </p>
      {skill.safetyNote && (
        <p className="text-xs text-amber-700 dark:text-amber-400 italic" data-testid="skill-safety">
          {skill.safetyNote}
        </p>
      )}
    </article>
  );
}

interface RenderSkillPackProps {
  pack: SkillPack;
  filterLevel?: "beginner" | "intermediate" | "advanced";
  showHeader?: boolean;
  className?: string;
}

export function RenderSkillPack({ 
  pack, 
  filterLevel, 
  showHeader = true,
  className = "" 
}: RenderSkillPackProps) {
  const filteredSkills = filterLevel 
    ? pack.skills.filter(s => s.level === filterLevel)
    : pack.skills;

  if (filteredSkills.length === 0) {
    return null;
  }

  return (
    <section 
      className={`space-y-4 ${className}`}
      aria-labelledby={`pack-${pack.id}-heading`}
      data-testid={`skill-pack-${pack.id}`}
    >
      {showHeader && (
        <header className="mb-6">
          <h3 
            id={`pack-${pack.id}-heading`}
            className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
            data-testid="pack-name"
          >
            {pack.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400" data-testid="pack-description">
            {pack.description}
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-2 italic" data-testid="pack-safety">
            {pack.safetyNote}
          </p>
        </header>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredSkills.map(skill => (
          <RenderSkill key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );
}

interface SkillCardProps {
  title: string;
  content: string;
  safetyNote?: string;
  level?: "beginner" | "intermediate" | "advanced";
  action?: string;
  className?: string;
}

export function SkillCard({
  title,
  content,
  safetyNote,
  level = "beginner",
  action,
  className = ""
}: SkillCardProps) {
  const levelColors = {
    beginner: "border-l-green-500",
    intermediate: "border-l-blue-500",
    advanced: "border-l-purple-500"
  };

  return (
    <div 
      className={`p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 border-l-4 ${levelColors[level]} ${className}`}
      data-testid="skill-card"
    >
      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2" data-testid="card-title">
        {title}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3" data-testid="card-content">
        {content}
      </p>
      {action && (
        <p className="text-sm text-primary font-medium mb-2" data-testid="card-action">
          Try this: {action}
        </p>
      )}
      {safetyNote && (
        <p className="text-xs text-amber-700 dark:text-amber-400 italic" data-testid="card-safety">
          {safetyNote}
        </p>
      )}
    </div>
  );
}

export default { RenderSkill, RenderSkillPack, SkillCard };
