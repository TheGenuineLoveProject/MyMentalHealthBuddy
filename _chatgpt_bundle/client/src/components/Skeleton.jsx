export function Skeleton({ className = "", ...props }) {
  return (
    <div 
      className={`animate-pulse bg-[var(--surface-hover)] rounded-xl ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-elevated p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function JournalEntrySkeleton() {
  return (
    <div className="card-elevated p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

export function MoodEntrySkeleton() {
  return (
    <div className="card-elevated p-4 flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  );
}

export function ChatMessageSkeleton({ isUser = false }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />}
      <div className={`space-y-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <Skeleton className={`h-16 w-64 rounded-2xl ${isUser ? 'rounded-tr-md' : 'rounded-tl-md'}`} />
      </div>
      {isUser && <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function MoodPageSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      
      <div className="card-elevated p-6">
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="flex flex-wrap gap-3 mb-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-24 h-14 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        {[...Array(3)].map((_, i) => (
          <MoodEntrySkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function JournalPageSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      
      <div className="card-elevated p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-12 w-full mb-4 rounded-xl" />
        <Skeleton className="h-32 w-full mb-4 rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        {[...Array(3)].map((_, i) => (
          <JournalEntrySkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ChatPageSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-fade-in-up">
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="w-24 h-9 rounded-lg" />
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        <ChatMessageSkeleton />
        <ChatMessageSkeleton isUser />
        <ChatMessageSkeleton />
      </div>
      
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
