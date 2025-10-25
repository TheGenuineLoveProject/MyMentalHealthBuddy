import { Link, useLocation } from "wouter";
import { MessageCircle, Heart, BookOpen, Info, Phone } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { path: "/", label: "Chat", icon: MessageCircle },
    { path: "/mood", label: "Mood", icon: Heart },
    { path: "/journal", label: "Journal", icon: BookOpen },
    { path: "/resources", label: "Resources", icon: Info },
    { path: "/crisis", label: "Crisis", icon: Phone },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">MyMentalHealthBuddy</h1>
          <div className="flex gap-4">
            {links.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                href={path}
                data-testid={`link-${label.toLowerCase()}`}
              >
                <span
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    location === path
                      ? "bg-blue-700 font-semibold"
                      : "hover:bg-blue-500"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
