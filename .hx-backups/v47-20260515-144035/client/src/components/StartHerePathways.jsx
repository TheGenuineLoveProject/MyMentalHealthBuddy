import { Link } from "wouter";
import { Heart, Leaf, BookOpen, LifeBuoy, Wrench } from "lucide-react";

const PATHWAYS = [
  {
    id: "calm-now",
    title: "Calm Now",
    description: "Immediate relief when you're feeling overwhelmed",
    icon: Heart,
    color: "bg-[var(--blush-100)] text-[var(--blush-600)]",
    path: "/breathing",
  },
  {
    id: "build-habits",
    title: "Build Habits",
    description: "Create sustainable daily wellness routines",
    icon: Leaf,
    color: "bg-[var(--sage-100)] text-[var(--sage-600)]",
    path: "/daily-routines",
  },
  {
    id: "learn-skills",
    title: "Learn Skills",
    description: "Evidence-based techniques for emotional wellness",
    icon: BookOpen,
    color: "bg-[var(--teal-100)] text-[var(--teal-600)]",
    path: "/how-to-guides",
  },
  {
    id: "find-support",
    title: "Find Support",
    description: "Resources and guidance when you need help",
    icon: LifeBuoy,
    color: "bg-[var(--lavender-100)] text-[var(--lavender-600)]",
    path: "/support",
  },
  {
    id: "explore-tools",
    title: "Explore Tools",
    description: "Browse all available wellness exercises",
    icon: Wrench,
    color: "bg-[var(--gold-100)] text-[var(--gold-600)]",
    path: "/tools",
  },
];

export default function StartHerePathways() {
  return (
    <section className="mb-12" aria-labelledby="start-here-heading">
      <h2 id="start-here-heading" className="text-heading-md text-teal mb-6">
        Start Here
      </h2>
      <p className="text-body mb-6">
        Not sure where to begin? Choose based on what you need right now.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PATHWAYS.map((pathway) => {
          const Icon = pathway.icon;
          return (
            <Link
              key={pathway.id}
              href={pathway.path}
              className="group flex flex-col items-center text-center p-6 rounded-xl border-2 border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--glp-sage)] hover:shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
              data-testid={`pathway-${pathway.id}`}
            >
              <div className={`p-3 rounded-xl ${pathway.color} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-[var(--text-1)] mb-2">{pathway.title}</h3>
              <p className="text-sm text-[var(--text-2)]">{pathway.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
