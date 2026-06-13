import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Heart, Sparkles, TrendingUp } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="relative min-h-screen grid-bg overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />

      {/* Header */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-neonPurple" />
          <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-neonPurple to-neonBlue bg-clip-text text-transparent">
            MINDMATE AI
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200">
            Log In
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-neonPurple to-neonBlue hover:from-purple-600 hover:to-cyan-500 shadow-glow-purple text-white transition-all duration-300 transform hover:scale-105">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs text-neonPurple font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empathetic Digital Mental Wellness Companion</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6">
            Understand Your Mind <br />
            <span className="bg-gradient-to-r from-neonPurple via-purple-400 to-neonBlue bg-clip-text text-transparent">
              Before It Burns Out
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered emotional wellness tracking designed specifically for exam warriors. Discover hidden stress triggers and get empathetic coping advice for JEE, NEET, UPSC, and board prep.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
            <Link to="/register" className="px-8 py-4 rounded-xl text-md font-bold bg-gradient-to-r from-neonPurple to-neonBlue hover:from-purple-600 hover:to-cyan-500 shadow-glow-purple transition-all duration-300 transform hover:scale-105 text-white">
              Start Free Check-in
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-xl text-md font-bold glass-panel hover:bg-white/5 border border-glassBorder hover:border-glassBorderHover transition-all duration-300 text-slate-300 hover:text-white">
              Access Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Mockup Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 w-full max-w-5xl rounded-2xl glass-panel p-2 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-neonPurple/10 to-neonBlue/10 rounded-2xl pointer-events-none" />
          <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-900 aspect-[16/9] flex flex-col">
            {/* Mock Top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-900 bg-slate-950">
              <div className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs text-slate-500 font-mono">mindmate-ai.com/dashboard</div>
              <div className="w-12" />
            </div>
            {/* Mock Dashboard content */}
            <div className="flex-1 p-6 grid grid-cols-3 gap-4 text-left select-none pointer-events-none opacity-85">
              <div className="col-span-2 space-y-4">
                <div className="h-24 rounded-lg bg-slate-900/50 border border-slate-800 p-4 flex flex-col justify-between">
                  <div className="text-xs text-slate-500">AI WELLNESS INSIGHT</div>
                  <div className="text-sm text-slate-300 font-medium font-sans">"The student experiences high stress regarding Math practice. Consider breaking down algebra papers into 20-minute chunks."</div>
                </div>
                <div className="h-40 rounded-lg bg-slate-900/50 border border-slate-800 p-4 flex flex-col justify-between">
                  <div className="text-xs text-slate-500">STRESS INTENSITY TREND (LAST 7 DAYS)</div>
                  <div className="flex items-end justify-between h-20 pt-2 px-6">
                    <div className="w-6 bg-purple-500/20 h-[30%] rounded-t" />
                    <div className="w-6 bg-purple-500/40 h-[50%] rounded-t" />
                    <div className="w-6 bg-purple-500/60 h-[80%] rounded-t" />
                    <div className="w-6 bg-cyan-500/40 h-[45%] rounded-t" />
                    <div className="w-6 bg-cyan-500/70 h-[92%] rounded-t" />
                    <div className="w-6 bg-purple-500/50 h-[60%] rounded-t" />
                    <div className="w-6 bg-purple-500/90 h-[98%] rounded-t" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-32 rounded-lg bg-slate-900/50 border border-slate-800 p-4 flex flex-col justify-between">
                  <div className="text-xs text-slate-500">TOP STRESS TRIGGER</div>
                  <div className="text-2xl font-bold text-rose-400">Physics Anxiety</div>
                  <div className="text-xs text-slate-400">Recurring in 43% of journals</div>
                </div>
                <div className="h-32 rounded-lg bg-slate-900/50 border border-slate-800 p-4 flex flex-col justify-between">
                  <div className="text-xs text-slate-500">CURRENT STATUS</div>
                  <div className="text-lg font-bold text-amber-400">Elevated Stress</div>
                  <div className="text-xs text-slate-400">Coping plan ready</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-slate-900 relative z-10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl text-slate-100">
              Specially Built for Competitive Exam Stress
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Jeopardy of NEET, JEE, GATE, and UPSC require smart emotional analytics that generic trackers overlook.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass-panel border-glassBorder hover:border-neonPurple/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-neonPurple mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Empathetic Companion</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive conversational, validation-based, non-judgmental guidance that reads between the lines of your diary.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel border-glassBorder hover:border-neonBlue/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-neonBlue mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hidden Trigger Analysis</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Gemini uncovers persistent patterns—such as mock test performance fear or comparison with friends—across multiple logs.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel border-glassBorder hover:border-neonPurple/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-neonPurple mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Stress Score Tracking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visualize stress metrics over time using Recharts trends, signaling early indicators of burnout before it hits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl text-slate-100">How It Works</h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              A quick 60-second daily routine to understand your mental state and restore energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Check Mood', desc: 'Select one of 6 moods matching your instant state.' },
              { step: '02', title: 'Write Log', desc: 'Jot down free-form thoughts about your study day, parents, or exams.' },
              { step: '03', title: 'Get AI Review', desc: 'Gemini reviews your log to calculate stress scores and triggers.' },
              { step: '04', title: 'Track Insights', desc: 'Watch long-term trends and implement localized coping plans.' },
            ].map((s, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-glassBg border border-glassBorder">
                <div className="text-5xl font-black text-purple-500/10 absolute top-4 right-4">{s.step}</div>
                <h3 className="text-lg font-bold mb-2 text-slate-200 mt-4">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative z-10 text-center bg-gradient-to-t from-purple-950/20 to-transparent border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">Take Control of Your Prep Journey</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Join other students who track their wellness, optimize studies, and avoid exam burnout.
          </p>
          <Link to="/register" className="px-8 py-4 rounded-xl text-md font-bold bg-gradient-to-r from-neonPurple to-neonBlue hover:from-purple-600 hover:to-cyan-500 shadow-glow-purple text-white transition-all duration-300 inline-block transform hover:scale-105">
            Register Instantly
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 relative z-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div>&copy; 2026 MindMate AI. Built for Wellness Hackathon.</div>
          <div className="flex space-x-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
