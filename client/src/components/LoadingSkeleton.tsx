interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "button";
  count?: number;
}

export function Skeleton({ className = "", variant = "text", count = 1 }: SkeletonProps) {
  const baseClasses = "skeleton animate-pulse";
  
  const variantClasses = {
    text: "h-4 rounded",
    card: "h-32 rounded-xl",
    avatar: "w-12 h-12 rounded-full",
    button: "h-10 w-24 rounded-lg"
  };

  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      data-testid={`skeleton-${variant}-${i}`}
    />
  ));

  return <>{elements}</>;
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-fade-in" data-testid="dashboard-skeleton">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="button" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="p-6 rounded-xl"
            style={{ background: "var(--surface)", boxShadow: "var(--shadow)" }}
          >
            <Skeleton variant="text" className="w-20 h-4 mb-2" />
            <Skeleton variant="text" className="w-16 h-8" />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton variant="card" className="h-64" />
        <Skeleton variant="card" className="h-64" />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4" data-testid="chat-skeleton">
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" />
        <div className="flex-1">
          <Skeleton variant="text" className="w-32 h-4 mb-2" />
          <Skeleton variant="text" className="w-48 h-3" />
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
            <Skeleton 
              variant="text" 
              className={`h-16 rounded-2xl ${i % 2 === 0 ? "w-2/3" : "w-3/4"}`} 
            />
          </div>
        ))}
      </div>
      
      <Skeleton variant="text" className="h-12 rounded-full" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen p-6" style={{ background: "var(--background)" }} data-testid="page-skeleton">
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton variant="text" className="w-64 h-10 mb-8" />
        <Skeleton variant="card" className="h-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
