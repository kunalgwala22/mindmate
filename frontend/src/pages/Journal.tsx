import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { MoodSelector } from '../components/MoodSelector';
import { 
  Brain, ArrowLeft, Send, Sparkles, Heart, 
  Smile, Flame, AlertCircle, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Journal: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [moodSaved, setMoodSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setError(null);
    try {
      await api.moods.create(mood);
      setMoodSaved(true);
      setTimeout(() => setMoodSaved(false), 2500);
    } catch (err: any) {
      console.error('Error saving mood:', err);
      // Don't block the user, just let them write journal
    }
  };

  const handleSubmitJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      setError('Please select a mood emoji first to give AI the context.');
      return;
    }
    if (!journalContent.trim()) {
      setError('Please write down your thoughts before submitting.');
      return;
    }

    setLoading(true);
    setError(null);
    setAiAnalysis(null);

    try {
      const response = await api.journals.create(journalContent);
      setAiAnalysis(response.analysis);
      setJournalContent(''); // clear form
    } catch (err: any) {
      setError(err.message || 'AI failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg pb-20 relative">
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="border-b border-glassBorder/60 bg-glassBg backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-neonPurple" />
            <span className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-neonPurple to-neonBlue bg-clip-text text-transparent">
              MINDMATE AI
            </span>
          </div>
        </div>
      </nav>

      {/* Content wrapper */}
      <div className="max-w-4xl mx-auto px-6 mt-10 grid grid-cols-1 gap-8">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center space-x-3">
            <Heart className="w-8 h-8 text-neonPink animate-pulse" />
            <span>Empathetic AI Journal</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Check-in your mood and let Gemini find emotional stress triggers.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Step 1: Mood Check-in */}
        <div className="p-6 rounded-2xl glass-panel border-glassBorder">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
              <Smile className="w-5 h-5 text-neonBlue" />
              <span>Step 1: How are you feeling right now?</span>
            </h2>
            <AnimatePresence>
              {moodSaved && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0 }}
                  className="text-xs text-emerald-400 flex items-center space-x-1 font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mood check-in saved</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <MoodSelector selectedMood={selectedMood} onSelect={handleMoodSelect} disabled={loading} />
        </div>

        {/* Step 2: Journal Entry */}
        <div className="p-6 rounded-2xl glass-panel border-glassBorder">
          <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-neonPurple" />
            <span>Step 2: Tell MindMate about your day...</span>
          </h2>
          <form onSubmit={handleSubmitJournal} className="space-y-4">
            <div>
              <textarea
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="Studied 10 hours but still feel anxious about Physics... Or say how mock test went..."
                rows={5}
                disabled={loading}
                className="w-full p-4 bg-slate-950/60 border border-glassBorder rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-neonPurple/60 focus:ring-1 focus:ring-neonPurple/40 transition-colors resize-none leading-relaxed text-sm"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-mono">
                {journalContent.length} characters
              </span>
              <button
                type="submit"
                disabled={loading || !selectedMood || !journalContent.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-neonPurple to-neonBlue hover:from-purple-600 hover:to-cyan-500 shadow-glow-purple text-sm font-bold text-white transition-all duration-300 flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini is analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Submit to Gemini</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* AI Analysis response panel */}
        <AnimatePresence>
          {aiAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl glass-panel border-neonPurple/40 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-l from-neonPurple/10 to-transparent w-40 h-full pointer-events-none" />
              <div className="flex items-center space-x-2 text-neonPurple mb-6 border-b border-glassBorder/60 pb-4">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <h2 className="text-xl font-bold tracking-wide uppercase">Empathetic Analysis Summary</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Metric 1 */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-glassBorder">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Primary Emotion</div>
                  <div className="text-xl font-bold text-slate-200 mt-1">{aiAnalysis.emotion}</div>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-glassBorder flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Stress Score</div>
                    <div className="text-2xl font-black text-rose-400 mt-1 flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-rose-500" />
                      <span>{aiAnalysis.stressScore}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden mt-2">
                    <div 
                      className="bg-rose-500 h-full rounded-full" 
                      style={{ width: `${aiAnalysis.stressScore}%` }}
                    />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-glassBorder">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Stress Trigger</div>
                  <div className="text-md font-bold text-amber-400 mt-1 truncate" title={aiAnalysis.stressTrigger}>
                    {aiAnalysis.stressTrigger}
                  </div>
                </div>
              </div>

              {/* Multi-line blocks */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">AI Summary</h3>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/30 p-4 rounded-xl border border-glassBorder/40">
                    {aiAnalysis.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Recommended Coping Strategy</h3>
                  <p className="text-slate-300 text-sm leading-relaxed bg-cyan-950/10 p-4 rounded-xl border border-cyan-500/20">
                    {aiAnalysis.copingStrategy}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Empathetic Motivation</h3>
                  <p className="text-slate-300 text-sm italic leading-relaxed bg-rose-950/10 p-4 rounded-xl border border-rose-500/20">
                    "{aiAnalysis.motivation}"
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-xl bg-glassBg border border-glassBorder hover:border-glassBorderHover hover:bg-white/5 text-sm font-semibold text-slate-200 transition-colors"
                >
                  View Trends on Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
