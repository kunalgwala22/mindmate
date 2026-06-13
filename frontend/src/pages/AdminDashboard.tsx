import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Brain, ArrowLeft, Users, FileText, Activity, ShieldAlert, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminStats {
  totalUsers: number;
  totalJournals: number;
  totalMoods: number;
  globalAvgStress: number;
  topTriggers: { trigger: string; count: number }[];
  emotionDistribution: { emotion: string; count: number }[];
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        // We use fetch with JWT token directly to call `/admin/stats`
        const token = localStorage.getItem('mindmate_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Unauthorized or failed to retrieve admin data.');
        }

        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        console.error('Error fetching admin stats:', err);
        setError(err.message || 'Failed to fetch global stats');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center space-y-4">
        <Activity className="w-12 h-12 text-neonBlue animate-spin" />
        <p className="text-slate-400 text-sm animate-pulse">Fetching global system metrics...</p>
      </div>
    );
  }

  const COLORS = ['#a855f7', '#22d3ee', '#f43f5e', '#fbbf24', '#34d399', '#60a5fa'];

  return (
    <div className="min-h-screen bg-darkBg pb-16 relative">
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-900/15 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-glassBorder/60 bg-glassBg backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-neonPurple" />
            <span className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-neonPurple to-neonBlue bg-clip-text text-transparent">
              MINDMATE AI ADMIN
            </span>
          </div>
        </div>
      </nav>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-2">
            <Award className="w-8 h-8 text-neonPurple" />
            <span>Administrative Metrics Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Aggregated, anonymized statistics showing system-wide engagement.</p>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Users */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-neonPurple">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Registrations</div>
              <div className="text-2xl font-black text-slate-200 mt-0.5">{stats?.totalUsers}</div>
            </div>
          </div>

          {/* Card 2: Diaries */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-neonBlue">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Diaries Logged</div>
              <div className="text-2xl font-black text-slate-200 mt-0.5">{stats?.totalJournals}</div>
            </div>
          </div>

          {/* Card 3: Mood Checks */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Mood Check-ins</div>
              <div className="text-2xl font-black text-slate-200 mt-0.5">{stats?.totalMoods}</div>
            </div>
          </div>

          {/* Card 4: Avg stress */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-neonPink">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Global Stress Index</div>
              <div className="text-2xl font-black text-slate-200 mt-0.5">{stats?.globalAvgStress}%</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Global Triggers */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder">
            <h3 className="text-lg font-bold text-slate-200 mb-6">System-Wide Stress Triggers</h3>
            {stats && stats.topTriggers.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topTriggers} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                    <YAxis dataKey="trigger" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f0720',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar dataKey="count" fill="#a855f7" radius={[0, 4, 4, 0]}>
                      {stats.topTriggers.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">No triggers logged system-wide yet.</div>
            )}
          </div>

          {/* Chart 2: Emotion Distribution */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder">
            <h3 className="text-lg font-bold text-slate-200 mb-6">Global Emotion Distribution</h3>
            {stats && stats.emotionDistribution.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.emotionDistribution.map(d => ({ name: d.emotion, count: d.count }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.08)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f0720',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]}>
                      {stats.emotionDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">No emotions analyzed system-wide yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
