import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getUser } from '../services/api';
import { DashboardStats, AnalyticsData, User, Journal } from '../types';
import { StressChart } from '../components/StressChart';
import { EmotionChart } from '../components/EmotionChart';
import { ChatCompanion } from '../components/ChatCompanion';
import { BreathingCoach } from '../components/BreathingCoach';
import { Timeline } from '../components/Timeline';
import { NotificationsCenter } from '../components/NotificationsCenter';
import { CardSkeleton, ChartSkeleton, TimelineSkeleton } from '../components/SkeletonLoader';
import { ToastProvider, useToast } from '../components/ui/Toast';
import { 
  Brain, LogOut, BookOpen, AlertCircle, Sparkles, 
  Smile, ShieldAlert, Zap, Award, Flame, Calendar, FileText, TrendingUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastData {
  burnoutRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  forecastSummary: string;
  predictedTrend: { dayOffset: number; predictedStressScore: number }[];
  studyAdjustments: string[];
}

const DashboardContent: React.FC = () => {
  const [user, setUserState] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [populating, setPopulating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setError(null);
      const [statsData, analyticsData, forecastData, journalsData] = await Promise.all([
        api.dashboard.getStats(),
        api.analytics.get(),
        api.forecast.get(),
        api.journals.getAll()
      ]);
      setStats(statsData);
      setAnalytics(analyticsData);
      setForecast(forecastData);
      setJournals(journalsData);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to retrieve metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const userData = getUser();
    setUserState(userData);
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    api.auth.logout();
    navigate('/');
  };

  // Direct demo loader function from dashboard
  const handlePopulateDemo = async () => {
    setPopulating(true);
    try {
      const token = localStorage.getItem('mindmate_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/demo/populate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load demo records.');
      }

      showToast('7 Days of mock wellness logs loaded successfully!', 'success');
      // Re-fetch everything immediately to refresh the charts
      await fetchData();
    } catch (err: any) {
      console.error('Error populating demo logs:', err);
      showToast(err.message || 'Failed to load mock data', 'error');
    } finally {
      setPopulating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg pb-16 relative">
        {/* Navigation Skeleton */}
        <nav className="border-b border-glassBorder/60 bg-glassBg backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-neonPurple" />
              <span className="text-xl font-extrabold text-slate-500">MINDMATE AI</span>
            </div>
            <div className="w-24 h-8 bg-slate-900 rounded-lg animate-pulse" />
          </div>
        </nav>
        
        <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <div><TimelineSkeleton /></div>
        </div>
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
          <div className="flex items-center space-x-4">
            <Link to="/guide" className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
              <FileText className="w-3.5 h-3.5 text-neonBlue" />
              <span>Guide</span>
            </Link>
            <Link to="/admin" className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
              <Award className="w-3.5 h-3.5 text-neonPurple" />
              <span>Admin Panel</span>
            </Link>
            
            {/* Notifications Bell Dropdown */}
            <NotificationsCenter stats={stats} />

            <div className="hidden sm:block text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">STUDENT</div>
              <div className="text-xs font-semibold text-slate-300">{user?.name}</div>
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
          <div className="flex gap-3">
            {/* Quick Demo populator button */}
            <button
              onClick={handlePopulateDemo}
              disabled={populating}
              className="px-5 py-3 rounded-xl border border-glassBorder bg-glassBg hover:border-glassBorderHover shadow-glow-blue text-sm font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{populating ? 'Loading Logs...' : '⚡ Load Demo Data'}</span>
            </button>
            
            <Link
              to="/journal"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-neonPurple to-neonBlue hover:from-purple-600 hover:to-cyan-500 shadow-glow-purple text-sm font-bold text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Check-in & Journal Today</span>
            </Link>
          </div>
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

        {/* Middle Row: Charts */}
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

        {/* AI Forecast & Timeline Row (Phases 3 & 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* AI Burnout Forecast chart and details */}
          <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border-glassBorder flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-200 flex items-center gap-1.5">
                    <TrendingUp className="w-5 h-5 text-neonPurple" />
                    <span>AI Weekly Stress Forecast</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Predictive analytics index showing burnout timelines.</p>
                </div>
                {forecast && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    forecast.burnoutRisk === 'Critical' ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse' :
                    forecast.burnoutRisk === 'High' ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' :
                    forecast.burnoutRisk === 'Moderate' ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' :
                    'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  }`}>
                    {forecast.burnoutRisk} Risk
                  </span>
                )}
              </div>

              {forecast && forecast.predictedTrend.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Predict chart */}
                  <div className="md:col-span-2 h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={forecast.predictedTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" />
                        <XAxis dataKey="dayOffset" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `Day +${val}`} />
                        <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f0720',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            borderRadius: '8px',
                            color: '#f8fafc',
                          }}
                          formatter={(value) => [`${value}%`, 'Predicted Stress']}
                        />
                        <Line type="monotone" dataKey="predictedStressScore" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary info */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-glassBorder/60 space-y-3">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Stress Summary</div>
                    <p className="text-slate-300 text-xs leading-relaxed">{forecast.forecastSummary}</p>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
                  Create a journal entry to generate stress forecast charts.
                </div>
              )}
            </div>

            {/* Smart Study adjustments */}
            {forecast && forecast.studyAdjustments.length > 0 && (
              <div className="mt-6 border-t border-glassBorder/40 pt-4">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">AI Study Adjustments</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forecast.studyAdjustments.slice(0, 2).map((adj, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-cyan-950/10 border border-cyan-500/20 text-xs text-slate-300 leading-relaxed">
                      {adj}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Activity History Timeline */}
          <div>
            <Timeline journals={journals.slice(0, 3)} />
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
                  {topTriggers.slice(0, 4).map((t, idx) => (
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

export const Dashboard: React.FC = () => {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
};
