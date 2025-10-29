import { Link, useLocation } from "wouter";
import { Home, MessageCircle, Heart, BookOpen, Info, Phone, CreditCard, Palette, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { path: "/", label: "Home", icon: Home },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/mood", label: "Mood", icon: Heart },
    { path: "/journal", label: "Journal", icon: BookOpen },
    { path: "/productivity", label: "Productivity", icon: Zap },
    { path: "/designs", label: "Designs", icon: Palette },
    { path: "/billing", label: "Billing", icon: CreditCard },
    { path: "/resources", label: "Resources", icon: Info },
    { path: "/crisis", label: "Crisis", icon: Phone },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">
            <Link href="/" aria-label="MyMentalHealthBuddy - Home">
              MyMentalHealthBuddy
            </Link>
          </h1>
          <div className="hidden lg:flex gap-4" role="menubar" aria-label="Main menu">
            {links.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                href={path}
                data-testid={`link-${label.toLowerCase()}`}
                aria-label={`Navigate to ${label}`}
                aria-current={location === path ? 'page' : undefined}
                role="menuitem"
              >
                <span
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    location === path
                      ? "bg-blue-700 font-semibold"
                      : "hover:bg-blue-500"
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </span>
              </Link>
            ))}
          </div>
          <div className="ml-4" aria-label="Theme settings">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
