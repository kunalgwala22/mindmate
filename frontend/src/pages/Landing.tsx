import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, Heart, Sparkles, TrendingUp, AlertCircle, 
  CheckCircle2, Cpu, Database, Layout, ShieldCheck, FileText 
} from 'lucide-react';

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
          <Link to="/guide" className="text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
            <FileText className="w-4 h-4 text-neonBlue" />
            <span>Walkthrough Guide</span>
          </Link>
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200">
            Log In
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-neonPurple to-neonBlue hover:from-purple-600 hover:to-cyan-500 shadow-glow-purple text-white transition-all duration-300 transform hover:scale-105">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center relative z-10 flex flex-col items-center">
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
            <Link to="/guide" className="px-8 py-4 rounded-xl text-md font-bold glass-panel hover:bg-white/5 border border-glassBorder hover:border-glassBorderHover transition-all duration-300 text-slate-300 hover:text-white flex items-center justify-center gap-2">
              <FileText className="w-5 h-5 text-neonPurple" />
              <span>Interactive Tech Guide</span>
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

      {/* Problem & Solution Showcase Section */}
      <section className="py-24 border-t border-slate-900 relative z-10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* The Problem */}
            <div className="p-8 rounded-3xl border border-rose-500/20 bg-rose-950/5 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-xs text-rose-400 font-bold mb-6">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>THE PROBLEM STATEMENT</span>
                </span>
                <h2 className="text-3xl font-extrabold text-slate-100 mb-6">
                  The Silent Toll of Competitive Prep
                </h2>
                <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
                  <p>
                    Students prepping for high-stakes exams (like JEE, NEET, UPSC) operate under constant pressure. Burnout accumulates silently, with no feedback loop to catch it early.
                  </p>
                  <p>
                    Traditional wellness apps fail because they are not contextualized for students. They offer generic advice instead of addressing specific pain points like mock test fear, peer comparison, and study schedules.
                  </p>
                </div>
              </div>
              <div className="mt-8 border-t border-rose-500/10 pt-6">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Key Vulnerabilities</div>
                <ul className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                  <li className="flex items-center gap-2">❌ Sleep deprivation</li>
                  <li className="flex items-center gap-2">❌ Performance anxiety</li>
                  <li className="flex items-center gap-2">❌ Unhealthy peer comparison</li>
                  <li className="flex items-center gap-2">❌ Emotional suppression</li>
                </ul>
              </div>
            </div>

            {/* The Solution */}
            <div className="p-8 rounded-3xl border border-emerald-500/20 bg-emerald-950/5 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400 font-bold mb-6">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>THE SOLUTION</span>
                </span>
                <h2 className="text-3xl font-extrabold text-slate-100 mb-6">
                  Empathetic, Data-Driven Guidance
                </h2>
                <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
                  <p>
                    MindMate AI acts as a 24/7 mental wellness coach. By check-in of mood emojis and diary journals, Gemini AI extracts hidden stress triggers and quantifies burnout risk.
                  </p>
                  <p>
                    Students get personalized study adjustments, real-time companion support, and an interactive 4-7-8 breathing coach, enabling active stress regulation in a mock-ready dashboard.
                  </p>
                </div>
              </div>
              <div className="mt-8 border-t border-emerald-500/10 pt-6">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Core Features</div>
                <ul className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                  <li className="flex items-center gap-2">✨ Gemini stress indexing</li>
                  <li className="flex items-center gap-2">✨ Interactive Breathing Coach</li>
                  <li className="flex items-center gap-2">✨ AI Chat Companion</li>
                  <li className="flex items-center gap-2">✨ Detailed stress & mood analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Visual Grid */}
      <section className="py-24 border-t border-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl text-slate-100">
              Modern Technology Stack & Architecture
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Clean architecture designed for security, fast page renders, and reliable database indexing.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* React Frontend */}
            <div className="p-6 rounded-2xl glass-panel border-glassBorder flex flex-col justify-between">
              <Layout className="w-10 h-10 text-neonBlue mb-6" />
              <div>
                <h3 className="text-md font-bold mb-1">React Client</h3>
                <p className="text-slate-400 text-xs">Vite, TypeScript, Tailwind CSS, Recharts for trends, and Framer Motion.</p>
              </div>
            </div>

            {/* Node Backend */}
            <div className="p-6 rounded-2xl glass-panel border-glassBorder flex flex-col justify-between">
              <Cpu className="w-10 h-10 text-neonPurple mb-6" />
              <div>
                <h3 className="text-md font-bold mb-1">Express Server</h3>
                <p className="text-slate-400 text-xs">Modular controllers, rate limiters, JWT authorization, and custom security headers.</p>
              </div>
            </div>

            {/* MariaDB Database */}
            <div className="p-6 rounded-2xl glass-panel border-glassBorder flex flex-col justify-between">
              <Database className="w-10 h-10 text-amber-400 mb-6" />
              <div>
                <h3 className="text-md font-bold mb-1">MariaDB</h3>
                <p className="text-slate-400 text-xs">Relational mapping with database indexing for high query speeds on mood & journal trends.</p>
              </div>
            </div>

            {/* Gemini AI */}
            <div className="p-6 rounded-2xl glass-panel border-glassBorder flex flex-col justify-between">
              <Sparkles className="w-10 h-10 text-neonPink mb-6" />
              <div>
                <h3 className="text-md font-bold mb-1">Gemini AI Model</h3>
                <p className="text-slate-400 text-xs">Empathetic analysis pipeline, stress triggers extraction, and chat response fallbacks.</p>
              </div>
            </div>
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
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
            <Link to="/register" className="px-8 py-4 rounded-xl text-md font-bold bg-gradient-to-r from-neonPurple to-neonBlue hover:from-purple-600 hover:to-cyan-500 shadow-glow-purple text-white transition-all duration-300 transform hover:scale-105">
              Register Instantly
            </Link>
            <Link to="/guide" className="px-8 py-4 rounded-xl text-md font-bold glass-panel hover:bg-white/5 border border-glassBorder hover:border-glassBorderHover transition-all duration-300 text-slate-300 hover:text-white">
              Read Walkthrough Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 relative z-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div>&copy; 2026 MindMate AI. Built for Wellness Hackathon.</div>
          <div className="flex space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
