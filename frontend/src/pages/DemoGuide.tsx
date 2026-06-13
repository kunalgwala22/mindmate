import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Brain, FileText, ArrowRight, ShieldAlert, Sparkles, 
  Database, Cpu, Layout, Play, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { ToastProvider, useToast } from '../components/ui/Toast';

const DemoGuideContent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handlePopulateData = async () => {
    if (!api.auth.isAuthenticated()) {
      showToast('Please Log In or Register first to populate demo data!', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('mindmate_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/demo/populate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to populate database.');
      }

      showToast('7 Days of historical logs successfully loaded!', 'success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      console.error('Error populating demo data:', err);
      showToast(err.message || 'Error populating data', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg pb-20 relative">
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="border-b border-glassBorder/60 bg-glassBg backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
            <Brain className="w-5 h-5 text-neonPurple" />
            <span className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-neonPurple to-neonBlue bg-clip-text text-transparent">
              MINDMATE AI
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-xs font-semibold text-slate-400 hover:text-white">Log In</Link>
            <Link to="/register" className="px-3 py-1.5 text-xs font-bold rounded bg-gradient-to-r from-neonPurple to-neonBlue text-white shadow-glow-purple">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 gap-12">
        {/* Intro Header */}
        <div className="text-center">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs text-neonBlue font-semibold mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Judge Evaluation & System Architecture Guide</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-none mb-4">
            Interactive Walkthrough Guide
          </h1>
          <p className="text-slate-400 text-sm sm:text-md max-w-2xl mx-auto leading-relaxed">
            Welcome, Hackathon Evaluators! Follow this page to understand our technical design, explore our code stack, and load pre-populated data to demonstrate the dashboard features instantly.
          </p>
        </div>

        {/* Quick Demo Populate Banner */}
        <div className="p-8 rounded-3xl border border-neonPurple/40 bg-gradient-to-br from-purple-950/20 via-slate-950 to-cyan-950/10 shadow-glow-purple text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-neonPurple/10 to-transparent pointer-events-none" />
          <h2 className="text-xl font-bold text-slate-200 mb-2">⚡ Speed Up Your Evaluation!</h2>
          <p className="text-slate-400 text-xs max-w-xl mx-auto mb-6 leading-relaxed">
            Rather than writing multiple mock journals manually to see Recharts trends and AI forecasts, click the button below. This will populate the database with a realistic 7-day timeline of student logs (thermodynamics success, mechanics test anxiety, peer comparison, and sleep exhaustion).
          </p>
          <button
            onClick={handlePopulateData}
            disabled={loading}
            className="px-8 py-4 rounded-xl text-sm font-black bg-gradient-to-r from-neonPurple to-neonBlue hover:from-purple-600 hover:to-cyan-500 shadow-glow-purple transition-all duration-300 transform hover:scale-105 text-white flex items-center justify-center gap-2 mx-auto disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? 'Populating Databases...' : 'POPULATE 7-DAY DEMO DATA'}</span>
          </button>
        </div>

        {/* System Architecture Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Architecture Visual block */}
          <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border-glassBorder flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-neonPurple" />
                <span>System Data Flow Architecture</span>
              </h3>
              
              {/* Graphic Flowchart */}
              <div className="space-y-4 font-mono text-xs text-slate-400 py-4 border border-glassBorder/40 rounded-xl p-4 bg-slate-950/60">
                <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-glassBorder/30">
                  <span className="w-6 h-6 bg-neonBlue/10 text-neonBlue rounded flex items-center justify-center font-bold">1</span>
                  <div>
                    <span className="text-slate-200 font-bold">React Frontend:</span> User inputs mood emoji + journal thoughts.
                  </div>
                </div>
                <div className="flex items-center justify-center text-neonPurple py-0.5"><ChevronRight className="w-4 h-4 transform rotate-90" /></div>
                
                <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-glassBorder/30">
                  <span className="w-6 h-6 bg-neonPurple/10 text-neonPurple rounded flex items-center justify-center font-bold">2</span>
                  <div>
                    <span className="text-slate-200 font-bold">Express API Router:</span> Authenticates request via JWT, runs Rate Limiting check.
                  </div>
                </div>
                <div className="flex items-center justify-center text-neonPurple py-0.5"><ChevronRight className="w-4 h-4 transform rotate-90" /></div>

                <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-glassBorder/30">
                  <span className="w-6 h-6 bg-neonPink/10 text-neonPink rounded flex items-center justify-center font-bold">3</span>
                  <div>
                    <span className="text-slate-200 font-bold">Gemini AI Engine:</span> Extracts emotional metadata (stress score, key trigger).
                  </div>
                </div>
                <div className="flex items-center justify-center text-neonPurple py-0.5"><ChevronRight className="w-4 h-4 transform rotate-90" /></div>

                <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-glassBorder/30">
                  <span className="w-6 h-6 bg-amber-500/10 text-amber-500 rounded flex items-center justify-center font-bold">4</span>
                  <div>
                    <span className="text-slate-200 font-bold">MariaDB Instance:</span> Persists records with custom performance indexes.
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-4 leading-relaxed border-t border-glassBorder/40 pt-4">
              🛡️ **Security Highlight:** Security headers (Helmet-like configuration) protect against Clickjacking, rate limiters protect all API endpoints, and XSS sanitizers cleanse input fields before DB insertion.
            </div>
          </div>

          {/* Key Evaluation Features */}
          <div className="p-6 rounded-2xl glass-panel border-glassBorder flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neonPink" />
                <span>Walkthrough Steps</span>
              </h3>
              
              <ul className="space-y-4 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-neonPurple font-bold">01.</span>
                  <div>
                    <strong className="text-slate-200">Register / Log In:</strong> Use the Header link to create a fresh student account.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neonPurple font-bold">02.</span>
                  <div>
                    <strong className="text-slate-200">Load Mock History:</strong> Return to this guide page and click the "POPULATE 7-DAY DEMO DATA" button above.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neonPurple font-bold">03.</span>
                  <div>
                    <strong className="text-slate-200">Inspect Dashboard:</strong> Review the Recharts stress score line graph and mood valency metrics.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neonPurple font-bold">04.</span>
                  <div>
                    <strong className="text-slate-200">Use Companion Widgets:</strong> Test the real-time AI Chat Companion panel or breathe with the animated 4-7-8 Breathing Guide.
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-glassBorder/40 pt-4 flex justify-between items-center text-xs">
              <span className="text-slate-500">MINDMATE AI MVP</span>
              <Link to="/dashboard" className="text-neonBlue hover:underline flex items-center gap-0.5 font-bold">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DemoGuide: React.FC = () => {
  return (
    <ToastProvider>
      <DemoGuideContent />
    </ToastProvider>
  );
};
