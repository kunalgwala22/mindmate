import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getUser } from '../services/api';
import { DashboardStats, AnalyticsData, User } from '../types';
import { StressChart } from '../components/StressChart';
import { EmotionChart } from '../components/EmotionChart';
import { ChatCompanion } from '../components/ChatCompanion';
import { BreathingCoach } from '../components/BreathingCoach';
import { 
  Brain, LogOut, BookOpen, AlertCircle, Sparkles, 
  Smile, ShieldAlert, Zap, Award, Flame, Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const [user, setUserState] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const userData = getUser();
    setUserState(userData);

    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const [statsData, analyticsData] = await Promise.all([
          api.dashboard.getStats(),
          api.analytics.get()
        ]);
        setStats(statsData);
        setAnalytics(analyticsData);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to retrieve metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    api.auth.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center space-y-4">
        <Brain className="w-12 h-12 text-neonPurple animate-pulse" />
        <p className="text-slate-400 text-sm animate-pulse">Analyzing wellness indicators...</p>
      </div>
    );
  }

  const metrics = stats?.metrics;
  const latestInsight = stats?.latestInsight;
  const topTriggers = stats?.topStressTriggers || [];

  return (
    <div className="min-h-screen bg-darkBg pb-16 relative">
      {/* Navigation */}
      <nav className="border-b border-glassBorder/60 bg-glassBg backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-neonPurple" />
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-neonPurple to-neonBlue bg-clip-text text-transparent">
              MINDMATE AI
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:block text-right">
              <div className="text-xs text-slate-500 font-medium">STUDENT</div>
              <div className="text-sm font-semibold text-slate-200">{user?.name}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg border border-glassBorder bg-glassBg hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dashboard Introduction banner */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-100">Welcome Back, {user?.name}!</h1>
            <p className="text-slate-400 text-sm mt-1">Here is your customized AI exam-wellness overview.</p>
          </div>
          <Link
            to="/journal"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-neonPurple to-neonBlue hover:from-purple-600 hover:to-cyan-500 shadow-glow-purple text-sm font-bold text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Check-in & Journal Today</span>
          </Link>
        </div>

        {/* Top Row Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Current Mood */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-neonBlue">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Current Mood</div>
              <div className="text-xl font-bold text-slate-200 mt-0.5">{metrics?.currentMood || 'No Entry'}</div>
            </div>
          </div>

          {/* Card 2: Stress Score */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-neonPurple">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Stress Score</div>
              <div className="text-xl font-bold text-slate-200 mt-0.5">
                {metrics?.averageStressScore !== null ? `${metrics?.averageStressScore}%` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Card 3: Detected Emotion */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-neonPink">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Detected Emotion</div>
              <div className="text-xl font-bold text-slate-200 mt-0.5">{metrics?.latestEmotion || 'N/A'}</div>
            </div>
          </div>

          {/* Card 4: Top Trigger */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Top Stress Trigger</div>
              <div className="text-xl font-bold text-slate-200 mt-0.5 truncate" title={metrics?.topTrigger}>
                {metrics?.topTrigger || 'None'}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Charts & Hidden Stress Trigger Detection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Stress score chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border-glassBorder">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-200">Stress Score Trend</h3>
              <span className="text-xs text-slate-500">Last 10 Entries</span>
            </div>
            {analytics ? (
              <StressChart data={analytics.stressTrend} />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">No trend data.</div>
            )}
          </div>

          {/* Mood Trend Line Chart */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-200">Mood Valency Trend</h3>
              <span className="text-xs text-slate-500">Last 10 Days</span>
            </div>
            {analytics && analytics.moodTrend.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.moodTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.08)" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} ticks={[10, 50, 90]} tickFormatter={(val) => {
                      if (val >= 75) return 'Good';
                      if (val >= 40) return 'Neutral';
                      return 'Sad/Tired';
                    }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f0720',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                      }}
                      formatter={((value: any, _name: any, props: any) => [props.payload?.mood, 'Mood']) as any}
                    />
                    <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: '#22d3ee' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">Check in your mood to see trends.</div>
            )}
          </div>
        </div>

        {/* Feature 5 Panel: Top Triggers Percentage and Emotion Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Triggers */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-200">Hidden Stress Triggers</h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 border border-purple-500/20 text-neonPurple font-bold">AI Detected</span>
              </div>
              {topTriggers.length > 0 ? (
                <div className="space-y-4">
                  {topTriggers.map((t, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300 font-medium">{t.trigger}</span>
                        <span className="text-neonBlue font-semibold">{t.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-950/60 rounded-full h-2 border border-glassBorder overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-neonPurple to-neonBlue h-full rounded-full"
                          style={{ width: `${t.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400 py-6 text-center">
                  AI will list stress percentages once more journals are added.
                </div>
              )}
            </div>
            <div className="mt-6 text-xs text-slate-500 leading-relaxed border-t border-glassBorder/60 pt-4">
              ✨ Gemini analyzes repeating themes across your diaries to extract deep-seated triggers.
            </div>
          </div>

          {/* Emotion Distribution */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder">
            <h3 className="text-lg font-bold text-slate-200 mb-6 font-sans">Emotion Distribution</h3>
            {analytics ? (
              <EmotionChart data={analytics.emotionDistribution} />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">Awaiting diary logs.</div>
            )}
          </div>

          {/* AI Wellness Status Card */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-200 mb-4 font-sans">AI Wellness Status</h3>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className={`px-4 py-2 rounded-full border font-bold text-sm tracking-wider uppercase ${
                  metrics?.wellnessColor === 'red' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-glow-purple' :
                  metrics?.wellnessColor === 'yellow' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-glow-purple' :
                  metrics?.wellnessColor === 'blue' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-glow-purple' :
                  'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-glow-purple'
                }`}>
                  {metrics?.wellnessStatus || 'Awaiting Logs'}
                </div>
                <p className="text-xs text-slate-400 mt-4 px-2 leading-relaxed">
                  {metrics?.wellnessColor === 'red' ? 'Your stress scores are critical. Take a 15-minute screen-free break right now.' :
                   metrics?.wellnessColor === 'yellow' ? 'Moderate stress levels detected. Focus on pacing yourself and getting sleep.' :
                   metrics?.wellnessColor === 'blue' ? 'Mind is relatively stable. Keep going and maintain daily schedules.' :
                   'Looking wonderful! You are managing exam pressure extremely well.'}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 border-t border-glassBorder/60 pt-4">
              <span>JOURNALS LOGGED: {metrics?.journalCount || 0}</span>
              <span className="flex items-center space-x-1"><Award className="w-3.5 h-3.5 text-neonPurple" /> <span>MindMate Premium</span></span>
            </div>
          </div>
        </div>

        {/* Hackathon Standout Features: AI Coping & Interactive Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ChatCompanion currentMood={metrics?.currentMood} />
          </div>
          <div>
            <BreathingCoach />
          </div>
        </div>

        {/* Bottom Row: AI Companion Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Today's Insight Card */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder bg-gradient-to-br from-purple-950/10 to-slate-950">
            <div className="flex items-center space-x-2 mb-4 text-neonPurple">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-md font-bold uppercase tracking-wider">Today's AI Insight</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed min-h-[80px]">
              {latestInsight ? latestInsight.summary : "No journal entry for today yet. Share your thoughts to get customized AI health feedback."}
            </p>
          </div>

          {/* Coping Strategy Card */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder bg-gradient-to-br from-cyan-950/10 to-slate-950">
            <div className="flex items-center space-x-2 mb-4 text-neonBlue">
              <Brain className="w-5 h-5" />
              <h3 className="text-md font-bold uppercase tracking-wider">Coping Strategy</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed min-h-[80px]">
              {latestInsight ? latestInsight.copingStrategy : "Strategies will be generated by Gemini based on details you discuss in your journal."}
            </p>
          </div>

          {/* Today's Motivation Card */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder bg-gradient-to-br from-rose-950/10 to-slate-950">
            <div className="flex items-center space-x-2 mb-4 text-neonPink">
              <Calendar className="w-5 h-5" />
              <h3 className="text-md font-bold uppercase tracking-wider">Companion Support</h3>
            </div>
            <p className="text-slate-300 text-sm italic leading-relaxed min-h-[80px]">
              "{latestInsight ? latestInsight.motivation : "Progress matters more than perfection. Take it one small step at a time."}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
