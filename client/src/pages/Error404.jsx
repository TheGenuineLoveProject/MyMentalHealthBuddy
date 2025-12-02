import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";

export default function Error404() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-neutral-700 mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4" data-testid="text-error-title">Page Not Found</h1>
        <p className="text-neutral-400 mb-8" data-testid="text-error-description">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link 
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            data-testid="link-home"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition"
            data-testid="link-dashboard"
          >
            Dashboard
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-neutral-800 rounded-xl" data-testid="section-help">
          <p className="text-neutral-400 text-sm mb-3">Need help? Try these:</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/chat" className="text-blue-400 hover:text-blue-300 text-sm font-medium" data-testid="link-chat">
              Talk to Buddy
            </Link>
            <Link href="/mood" className="text-blue-400 hover:text-blue-300 text-sm font-medium" data-testid="link-mood">
              Track Mood
            </Link>
            <Link href="/journal" className="text-blue-400 hover:text-blue-300 text-sm font-medium" data-testid="link-journal">
              Journal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
