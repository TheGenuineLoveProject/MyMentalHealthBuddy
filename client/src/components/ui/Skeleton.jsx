/**
 * Skeleton.jsx - Loading skeleton components
 * Provides smooth loading states for better UX
 */

export function Skeleton({ className = '', variant = 'default' }) {
  const baseClasses = 'skeleton-shimmer rounded';
  
  const variants = {
    default: 'h-4 w-full',
    title: 'h-8 w-3/4',
    subtitle: 'h-6 w-1/2',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full rounded-xl',
    button: 'h-10 w-32 rounded-lg',
    text: 'h-4 w-full',
    image: 'h-64 w-full rounded-xl',
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant] || variants.default} ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4 border border-sage/10">
      <Skeleton variant="avatar" />
      <Skeleton variant="title" />
      <Skeleton variant="subtitle" />
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-4/5" />
        <Skeleton variant="text" className="w-3/5" />
      </div>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="min-h-screen bg-softWhite dark:bg-gray-900 p-6 space-y-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton variant="title" />
        <Skeleton variant="subtitle" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="space-y-4">
          <Skeleton variant="text" />
          <Skeleton variant="text" className="w-4/5" />
          <Skeleton variant="text" className="w-3/5" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="text-center space-y-6 py-16 px-4">
      <Skeleton variant="subtitle" className="mx-auto w-48" />
      <Skeleton variant="title" className="mx-auto" />
      <Skeleton variant="text" className="mx-auto w-2/3" />
      <div className="flex justify-center gap-4 pt-4">
        <Skeleton variant="button" />
        <Skeleton variant="button" />
      </div>
    </div>
  );
}

export default Skeleton;
