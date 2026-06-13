import React, { useState } from 'react';
import { Bell, Flame, Award, Sparkles, X, Check } from 'lucide-react';
import { DashboardStats } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

interface NotificationsCenterProps {
  stats: DashboardStats | null;
}

interface NotificationItem {
  id: string;
  type: 'streak' | 'stress' | 'tip' | 'reminder';
  title: string;
  message: string;
  iconColor: string;
  bgColor: string;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ stats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);

  // Generate dynamic notifications based on dashboard statistics
  const notifications: NotificationItem[] = [];

  const journalCount = stats?.metrics?.journalCount || 0;
  const avgStress = stats?.metrics?.averageStressScore || 0;
  const latestEmotion = stats?.metrics?.latestEmotion || '';
  const topTrigger = stats?.metrics?.topTrigger || '';

  // 1. Streak / consistency notification
  if (journalCount > 0) {
    const streak = Math.min(7, journalCount);
    notifications.push({
      id: 'streak-notif',
      type: 'streak',
      title: `${streak}-Day Consistency Streak!`,
      message: `🔥 Excellent work! You've logged ${journalCount} journal entries. Consistently tracking your thoughts builds exam resilience.`,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10 border-amber-500/20'
    });
  } else {
    notifications.push({
      id: 'streak-notif-empty',
      type: 'reminder',
      title: 'Start Your Streak Today!',
      message: '📝 Log your first mood check-in and write a journal entry to unlock AI stress trigger analysis.',
      iconColor: 'text-neonBlue',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20'
    });
  }

  // 2. High stress warning
  if (avgStress >= 75) {
    notifications.push({
      id: 'stress-warning',
      type: 'stress',
      title: 'High Stress Alert',
      message: `⚠️ Average stress index is at ${avgStress}%. Highly recommend running a 4-7-8 breathing session before your next mock exam slot.`,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-500/10 border-rose-500/20'
    });
  }

  // 3. Personalized study tips based on emotion/trigger
  if (topTrigger && topTrigger !== 'None' && topTrigger !== 'None detected yet') {
    notifications.push({
      id: 'tip-trigger',
      type: 'tip',
      title: `Study Tip: Handling ${topTrigger}`,
      message: `💡 Trigger focus: Mute student chat groups temporarily to avoid comparison pressure. Solve 3 easy problems to regain flow.`,
      iconColor: 'text-neonPurple',
      bgColor: 'bg-purple-500/10 border-purple-500/20'
    });
  }

  // 4. Default exam focus tips
  notifications.push({
    id: 'tip-general',
    type: 'tip',
    title: 'Daily Exam Hack',
    message: '🧠 Active Recall: Close the textbook and write down everything you remember from memory before reading solutions.',
    iconColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20'
  });

  const activeNotifications = notifications.filter(n => !readIds.includes(n.id));
  const unreadCount = activeNotifications.length;

  const markAsRead = (id: string) => {
    setReadIds(prev => [...prev, id]);
  };

  const markAllAsRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  return (
    <div className="relative">
      {/* Bell Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border border-glassBorder bg-glassBg hover:border-glassBorderHover text-slate-400 hover:text-white transition-colors relative"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel border-glassBorder/80 z-50 overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-glassBorder/60 flex justify-between items-center bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-neonPurple" />
                  <span className="font-bold text-sm text-slate-200">Alert Notification Center</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-neonBlue hover:text-cyan-300 font-semibold transition-colors flex items-center gap-0.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              <div className="p-4 max-h-[350px] overflow-y-auto space-y-3 custom-scrollbar">
                {activeNotifications.length > 0 ? (
                  activeNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border flex gap-3 relative group transition-all duration-200 hover:bg-slate-900/40 ${n.bgColor}`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'streak' && <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />}
                        {n.type === 'stress' && <Flame className="w-4 h-4 text-rose-500" />}
                        {n.type === 'tip' && <Sparkles className="w-4 h-4 text-neonPurple" />}
                        {n.type === 'reminder' && <Award className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="text-xs font-bold text-slate-200">{n.title}</div>
                        <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.message}</div>
                      </div>
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="absolute top-2 right-2 text-slate-600 hover:text-slate-300 transition-colors p-0.5 rounded"
                        title="Mark as read"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                    <Check className="w-8 h-8 text-emerald-500 bg-emerald-500/10 rounded-full p-1.5" />
                    <span>You're all caught up! No unread notifications.</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
