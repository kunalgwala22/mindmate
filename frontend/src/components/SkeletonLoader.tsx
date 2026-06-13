import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const SkeletonBase: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <div
      className={`relative overflow-hidden bg-slate-900/60 rounded-xl border border-glassBorder/40 shimmer-effect ${className}`}
      style={{ minHeight: '1rem', ...style }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl glass-panel border-glassBorder flex items-center space-x-4">
      <SkeletonBase className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <SkeletonBase className="h-3 w-16" />
        <SkeletonBase className="h-5 w-24" />
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl glass-panel border-glassBorder space-y-4">
      <div className="flex justify-between items-center">
        <SkeletonBase className="h-4 w-32" />
        <SkeletonBase className="h-3 w-20" />
      </div>
      <div className="h-64 flex items-end justify-between pt-6 px-4">
        {[40, 60, 20, 80, 50, 95, 30, 70, 45, 60].map((h, i) => (
          <SkeletonBase
            key={i}
            className="w-6 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export const TimelineSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl glass-panel border-glassBorder space-y-6">
      <div className="flex justify-between items-center border-b border-glassBorder/60 pb-4">
        <SkeletonBase className="h-5 w-36" />
        <SkeletonBase className="h-3 w-16" />
      </div>
      <div className="space-y-6 pl-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex gap-4">
            <SkeletonBase className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <SkeletonBase className="h-4 w-24" />
                <SkeletonBase className="h-3 w-16" />
              </div>
              <SkeletonBase className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
