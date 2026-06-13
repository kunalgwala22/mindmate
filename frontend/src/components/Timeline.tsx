import React from 'react';
import { Calendar, Smile, Flame, Sparkles } from 'lucide-react';
import { Journal } from '../types';

interface TimelineProps {
  journals: Journal[];
}

export const Timeline: React.FC<TimelineProps> = ({ journals }) => {
  if (journals.length === 0) {
    return (
      <div className="p-6 rounded-2xl glass-panel border-glassBorder text-center">
        <h3 className="text-lg font-bold text-slate-200 mb-2">Activity Timeline</h3>
        <p className="text-slate-500 text-sm py-4">No recent activity found. Submitting a journal will populate your timeline.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl glass-panel border-glassBorder">
      <div className="flex justify-between items-center mb-6 border-b border-glassBorder/60 pb-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-neonPurple" />
          <span>Activity History Timeline</span>
        </h3>
        <span className="text-xs text-slate-500 font-semibold">{journals.length} Entries</span>
      </div>

      <div className="relative border-l border-glassBorder/40 pl-6 ml-2 space-y-6">
        {journals.map((j) => {
          const formattedDate = new Date(j.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          const score = j.stress_score || 0;

          return (
            <div key={j.id} className="relative group">
              {/* Timeline dot */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-darkBg transition-colors ${
                score >= 80 ? 'border-rose-500 text-rose-500' :
                score >= 50 ? 'border-amber-400 text-amber-400' :
                'border-emerald-400 text-emerald-400'
              }`} />

              <div className="flex flex-col space-y-1.5">
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">{formattedDate}</span>
                  {j.emotion && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-neonPurple font-semibold">
                      {j.emotion}
                    </span>
                  )}
                </div>

                {/* Journal content snippet */}
                <p className="text-slate-300 text-sm font-sans line-clamp-2 leading-relaxed bg-slate-950/20 p-3 rounded-lg border border-glassBorder/40">
                  "{j.content}"
                </p>

                {/* AI response details */}
                {j.summary && (
                  <div className="flex items-center gap-4 text-xs font-semibold pt-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Sparkles className="w-3.5 h-3.5 text-neonPink" />
                      <span className="text-slate-500 truncate max-w-[200px]" title={j.summary}>{j.summary}</span>
                    </span>
                    {j.stress_score !== undefined && (
                      <span className={`flex items-center gap-0.5 ${
                        score >= 80 ? 'text-rose-400' :
                        score >= 50 ? 'text-amber-400' :
                        'text-emerald-400'
                      }`}>
                        <Flame className="w-3.5 h-3.5" />
                        <span>Stress: {score}%</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
