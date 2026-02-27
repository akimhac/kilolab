import { ReactNode } from 'react';

// Skeleton de base avec animation pulse
interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded-lg ${className}`}
      style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// Skeleton pour les cards de statistiques
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
      <Skeleton className="h-5 w-16 mx-auto mb-1" />
      <Skeleton className="h-3 w-12 mx-auto" />
    </div>
  );
}

// Skeleton pour les cards de commandes
export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
        <Skeleton className="h-16 rounded-2xl" />
      </div>
    </div>
  );
}

// Skeleton pour l'historique
export function HistoryRowSkeleton() {
  return (
    <div className="px-4 py-3.5 flex items-center justify-between border-b border-slate-50">
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-xl" />
        <div>
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

// Skeleton pour le dashboard complet Client
export function ClientDashboardSkeleton() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-24 md:pt-28 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="w-28 h-10 rounded-xl" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Active Orders */}
      <div className="mb-8 space-y-4">
        <Skeleton className="h-5 w-24" />
        <OrderCardSkeleton />
      </div>

      {/* History */}
      <div>
        <Skeleton className="h-5 w-20 mb-3" />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <HistoryRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton pour le dashboard Washer (dark theme)
export function WasherStatCardSkeleton() {
  return (
    <div className="relative bg-[#0f1729] border border-white/8 rounded-2xl p-5 overflow-hidden">
      <div className="animate-pulse">
        <div className="w-6 h-6 bg-white/10 rounded mb-3" />
        <div className="h-3 w-16 bg-white/10 rounded mb-2" />
        <div className="h-6 w-20 bg-white/10 rounded" />
      </div>
    </div>
  );
}

export function MissionCardSkeleton() {
  return (
    <div className="relative bg-[#0f1729] border border-white/8 rounded-2xl p-5 overflow-hidden">
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="h-3 w-16 bg-white/10 rounded mb-2" />
            <div className="h-7 w-24 bg-white/10 rounded" />
          </div>
          <div className="h-6 w-20 bg-white/10 rounded-full" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 w-48 bg-white/10 rounded" />
          <div className="h-4 w-32 bg-white/10 rounded" />
        </div>
        <div className="pt-3 border-t border-white/6 flex justify-between">
          <div className="h-3 w-28 bg-white/10 rounded" />
          <div className="h-3 w-16 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

export function WasherDashboardSkeleton() {
  return (
    <div className="pt-24 md:pt-28 px-4 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="h-3 w-28 bg-white/10 rounded mb-2 animate-pulse" />
          <div className="h-8 w-48 bg-white/10 rounded mb-1 animate-pulse" />
          <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-white/10 rounded-xl animate-pulse" />
          <div className="h-10 w-28 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <WasherStatCardSkeleton key={i} />
        ))}
      </div>

      {/* Tabs */}
      <div className="h-12 bg-white/5 rounded-2xl mb-6 animate-pulse" />

      {/* Mission Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <MissionCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Skeleton pour les formulaires
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

// Skeleton pour les cards de benefices (BecomeWasher)
export function BenefitCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100">
      <div className="animate-pulse">
        <Skeleton className="w-14 h-14 rounded-2xl mb-6" />
        <Skeleton className="h-6 w-40 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
