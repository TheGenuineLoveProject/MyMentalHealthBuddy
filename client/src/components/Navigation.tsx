import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  MessageCircle, 
  Brain, 
  BookOpen, 
  Library, 
  CreditCard, 
  LogOut, 
  User,
  Menu,
  X,
  Heart,
  Activity
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "AI Chat", href: "/chat", icon: MessageCircle },
  { name: "Mood Tracker", href: "/mood", icon: Activity },
  { name: "Resources", href: "/resources", icon: Library },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Subscription", href: "/subscription", icon: CreditCard }
];

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "See you soon!"
      });
      window.location.href = '/login';
    }
  });

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-purple-600" />
              <Brain className="h-7 w-7 text-pink-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MyMentalHealthBuddy
              </span>
            </div>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
                      isActive 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/profile"
                className="text-gray-600 hover:text-gray-900"
              >
                <User className="h-5 w-5" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Heart className="h-7 w-7 text-purple-600" />
              <Brain className="h-6 w-6 text-pink-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MMHB
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                      isActive 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <Link 
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutMutation.mutate();
                  }}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}