import { useAuth } from "../context/AuthContext.jsx";
import { Heart, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";
import LotusLoader from "@/components/ui/LotusLoader.jsx";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <LotusLoader size={80} message="Preparing your sacred space..." />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
        <div 
          className="max-w-md w-full p-8 rounded-2xl text-center space-y-6"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(143, 191, 159, 0.15)',
            border: '1px solid rgba(143, 191, 159, 0.2)'
          }}
        >
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.2), rgba(212, 175, 55, 0.1))'
            }}
          >
            <Lock className="w-8 h-8 text-[#8fbf9f]" />
          </div>
          
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#2f5d5d] mb-2">
              Protected Space
            </h2>
            <p className="text-muted-foreground">
              Sign in to access your journal, mood tracking, and wellness tools.
            </p>
          </div>
          
          <a href="/api/login" className="block">
            <Button 
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-white hover:opacity-90 gap-2"
              data-testid="button-protected-login"
            >
              <Heart className="w-4 h-4" />
              Sign In to Continue
            </Button>
          </a>
          
          <p className="text-xs text-muted-foreground">
            Your data is private and secure. We use encrypted sessions.
          </p>
        </div>
      </div>
    );
  }
  
  return children;
}
