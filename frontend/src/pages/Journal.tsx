import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { MoodSelector } from '../components/MoodSelector';
import { 
  Brain, ArrowLeft, Send, Sparkles, Heart, 
  Smile, Flame, AlertCircle, RefreshCw, CheckCircle2,
  Search, Download, Printer, Filter, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastProvider, useToast } from '../components/ui/Toast';
import { Journal as JournalType } from '../types';

const JournalContent: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [moodSaved, setMoodSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  
  // History and Filtering States
  const [pastJournals, setPastJournals] = useState<JournalType[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmotion, setFilterEmotion] = useState('All');
  const [filterSentiment, setFilterSentiment] = useState('All');
  const [minStressScore, setMinStressScore] = useState(0);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchHistory = async () => {
    try {
      setFetchingHistory(true);
      const data = await api.journals.getAll();
      setPastJournals(data);
    } catch (err: any) {
      console.error('Error fetching journal history:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [navigate]);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setError(null);
    try {
      await api.moods.create(mood);
      setMoodSaved(true);
      showToast('Mood check-in successfully saved!', 'success');
      setTimeout(() => setMoodSaved(false), 2500);
    } catch (err: any) {
      console.error('Error saving mood:', err);
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
      showToast('Journal submitted and analyzed by Gemini!', 'success');
      fetchHistory(); // reload history
    } catch (err: any) {
      setError(err.message || 'AI failed to analyze. Please try again.');
      showToast(err.message || 'AI analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Advanced Filtering logic
  const filteredJournals = pastJournals.filter((j) => {
    const matchesSearch = j.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (j.stress_trigger && j.stress_trigger.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesEmotion = filterEmotion === 'All' || j.emotion === filterEmotion;
    const matchesSentiment = filterSentiment === 'All' || j.sentiment === filterSentiment;
    const matchesStress = (j.stress_score || 0) >= minStressScore;

    return matchesSearch && matchesEmotion && matchesSentiment && matchesStress;
  });

  // Export to CSV (Excel format)
  const exportToCSV = () => {
    if (filteredJournals.length === 0) {
      showToast('No entries available to export.', 'info');
      return;
    }
    const headers = ['ID', 'Date', 'Mood', 'Detected Emotion', 'Sentiment', 'Stress Score', 'Trigger', 'Content'];
    const rows = filteredJournals.map(j => [
      j.id,
      new Date(j.created_at).toLocaleString(),
      j.mood || 'N/A',
      j.emotion || 'N/A',
      j.sentiment || 'N/A',
      j.stress_score !== undefined ? `${j.stress_score}%` : 'N/A',
      j.stress_trigger || 'N/A',
      j.content.replace(/"/g, '""').replace(/\n/g, ' ')
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mindmate_student_wellness_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Spreadsheet downloaded successfully!', 'success');
  };

  // Export to PDF (Native browser layout styling)
  const exportToPDF = () => {
    if (filteredJournals.length === 0) {
      showToast('No entries available to print.', 'info');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const html = `
      <html>
      <head>
        <title>MindMate AI Wellness Report</title>
        <style>
          body { font-family: sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
          h1 { color: #854d0e; margin-bottom: 5px; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 30px; }
          .meta { color: #64748b; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-size: 12px; }
          th { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
          .stress-high { color: #dc2626; font-weight: bold; }
          .stress-med { color: #d97706; font-weight: bold; }
          .stress-low { color: #16a34a; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MindMate AI - Student Wellness History Report</h1>
          <div class="meta">Generated: ${new Date().toLocaleString()} | Filters: Query="${searchQuery || 'None'}" Emotion="${filterEmotion}" Sentiment="${filterSentiment}"</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 12%">Date</th>
              <th style="width: 10%">Declared Mood</th>
              <th style="width: 15%">Detected Emotion</th>
              <th style="width: 10%">Stress Index</th>
              <th style="width: 18%">Stress Trigger</th>
              <th>Diary Entry Text</th>
            </tr>
          </thead>
          <tbody>
            ${filteredJournals.map(j => `
              <tr>
                <td>${new Date(j.created_at).toLocaleDateString()}</td>
                <td>${j.mood || 'N/A'}</td>
                <td>${j.emotion || 'N/A'}</td>
                <td class="${j.stress_score && j.stress_score >= 80 ? 'stress-high' : j.stress_score && j.stress_score >= 50 ? 'stress-med' : 'stress-low'}">
                  ${j.stress_score !== undefined ? `${j.stress_score}%` : 'N/A'}
                </td>
                <td>${j.stress_trigger || 'N/A'}</td>
                <td>${j.content}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Get unique emotions from list to populate filters
  const uniqueEmotions = Array.from(new Set(pastJournals.map(j => j.emotion).filter(Boolean)));

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
            <span>Step 2: Tell MindMate about your study day...</span>
          </h2>
          <form onSubmit={handleSubmitJournal} className="space-y-4">
            <div>
              <label htmlFor="journal-textarea" className="sr-only">Write your journal entry here</label>
              <textarea
                id="journal-textarea"
                name="journal-textarea"
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="Studied 10 hours but still feel anxious about Physics... Or say how mock test went..."
                rows={5}
                disabled={loading}
                className="w-full p-4 bg-slate-950/60 border border-glassBorder rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-neonPurple/60 focus:ring-1 focus:ring-neonPurple/40 transition-colors resize-none leading-relaxed text-sm"
                aria-required="true"
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

        {/* History Log with Search & Advanced Filter Controls */}
        <div className="p-6 rounded-2xl glass-panel border-glassBorder mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-glassBorder/60 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-neonPurple" />
                <span>Journal History Log</span>
              </h2>
              <p className="text-xs text-slate-500">Filter, search, and export your historical wellness records.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={exportToCSV}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg border border-glassBorder bg-glassBg hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV Excel</span>
              </button>
              <button
                onClick={exportToPDF}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg border border-glassBorder bg-glassBg hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF Print</span>
              </button>
            </div>
          </div>

          {/* Filtering Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search query */}
            <div className="relative">
              <label htmlFor="search-input" className="sr-only">Search by keyword or trigger</label>
              <input
                id="search-input"
                type="text"
                placeholder="Search trigger/text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950/60 border border-glassBorder rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-neonPurple/50"
              />
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            </div>

            {/* Emotion selector */}
            <div className="relative">
              <label htmlFor="emotion-filter" className="sr-only">Filter by emotion</label>
              <select
                id="emotion-filter"
                value={filterEmotion}
                onChange={(e) => setFilterEmotion(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-xs bg-slate-950/60 border border-glassBorder rounded-xl text-slate-200 focus:outline-none focus:border-neonPurple/50 appearance-none"
              >
                <option value="All">All Emotions</option>
                {uniqueEmotions.map((emo, idx) => (
                  <option key={idx} value={emo}>{emo}</option>
                ))}
              </select>
              <Filter className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            </div>

            {/* Sentiment selector */}
            <div className="relative">
              <label htmlFor="sentiment-filter" className="sr-only">Filter by sentiment</label>
              <select
                id="sentiment-filter"
                value={filterSentiment}
                onChange={(e) => setFilterSentiment(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-xs bg-slate-950/60 border border-glassBorder rounded-xl text-slate-200 focus:outline-none focus:border-neonPurple/50 appearance-none"
              >
                <option value="All">All Sentiments</option>
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>
              <Filter className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            </div>

            {/* Stress threshold */}
            <div className="flex items-center gap-2 bg-slate-950/60 border border-glassBorder px-3 py-1.5 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase truncate">Stress &gt; {minStressScore}%</span>
              <input
                id="stress-slider"
                type="range"
                min="0"
                max="90"
                step="10"
                value={minStressScore}
                onChange={(e) => setMinStressScore(Number(e.target.value))}
                className="w-full accent-neonPurple cursor-pointer"
                title="Min stress score threshold"
              />
            </div>
          </div>

          {/* List display */}
          <div className="space-y-4">
            {fetchingHistory ? (
              <div className="py-12 text-center text-xs text-slate-500 animate-pulse flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-neonPurple" />
                <span>Loading your diary logs...</span>
              </div>
            ) : filteredJournals.length > 0 ? (
              filteredJournals.map((j) => (
                <div
                  key={j.id}
                  className="p-4 rounded-xl border border-glassBorder/40 bg-slate-950/20 hover:border-glassBorder/80 transition-colors space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <span className="text-md">{j.mood}</span>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(j.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {j.emotion && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 border border-purple-500/20 text-neonPurple font-bold">
                          {j.emotion}
                        </span>
                      )}
                      {j.stress_score !== undefined && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          j.stress_score >= 80 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                          j.stress_score >= 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                          Stress: {j.stress_score}%
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-sans">{j.content}</p>
                  {j.stress_trigger && (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 border-t border-glassBorder/30 pt-2 font-medium">
                      <span>Identified Stress Trigger:</span>
                      <span className="text-amber-400">{j.stress_trigger}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                No matching journal entries found. Adjust your search or filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Journal: React.FC = () => {
  return (
    <ToastProvider>
      <JournalContent />
    </ToastProvider>
  );
};
