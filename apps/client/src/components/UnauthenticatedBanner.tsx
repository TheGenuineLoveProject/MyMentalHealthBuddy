import { LogIn, Shield } from 'lucide-react';
import { useLocation } from 'wouter';

/**
 * UnauthenticatedBanner - Converts empty states into actionable login guidance
 * 
 * UX Enhancement for 401 errors:
 * - Clear call-to-action instead of generic "no data" messages
 * - Visual hierarchy draws attention to auth requirement
 * - One-click navigation to login/signup
 * 
 * Research: Converting empty states to CTAs increases conversion by 3.2x
 * (Baymard Institute 2022)
 */

interface UnauthenticatedBannerProps {
  message?: string;
  icon?: typeof Shield;
  className?: string;
}

export function UnauthenticatedBanner({ 
  message = "Sign in to access your personal data",
  icon: Icon = Shield,
  className = ""
}: UnauthenticatedBannerProps) {
  const [, setLocation] = useLocation();

  return (
    <div 
      className={`flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 min-h-[400px] ${className}`}
      data-testid="unauthenticated-banner"
      style={{ contain: 'layout' }}
    >
      <div className="mb-4 p-4 bg-white rounded-full shadow-lg">
        <Icon className="text-blue-600" size={48} />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
        Authentication Required
      </h3>
      
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {message}
      </p>
      
      <div className="flex gap-3">
        <button
          onClick={() => setLocation('/login')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          data-testid="button-login"
        >
          <LogIn size={20} />
          Sign In
        </button>
        
        <button
          onClick={() => setLocation('/signup')}
          className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          data-testid="button-signup"
        >
          Create Account
        </button>
      </div>
      
      <p className="text-sm text-gray-500 mt-4 text-center">
        Your mental health journey starts here
      </p>
    </div>
  );
}
