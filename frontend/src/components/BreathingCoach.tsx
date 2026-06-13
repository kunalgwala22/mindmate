import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Wind, ShieldCheck } from 'lucide-react';

type BreatheState = 'idle' | 'inhale' | 'hold' | 'exhale';

export const BreathingCoach: React.FC = () => {
  const [breatheState, setBreatheState] = useState<BreatheState>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    let timer: any;
    if (breatheState === 'idle') return;

    if (secondsLeft <= 0) {
      // Transition state
      if (breatheState === 'inhale') {
        setBreatheState('hold');
        setSecondsLeft(7);
      } else if (breatheState === 'hold') {
        setBreatheState('exhale');
        setSecondsLeft(8);
      } else if (breatheState === 'exhale') {
        setBreatheState('inhale');
        setSecondsLeft(4);
      }
    } else {
      timer = setTimeout(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [breatheState, secondsLeft]);

  const handleStart = () => {
    setBreatheState('inhale');
    setSecondsLeft(4);
  };

  const handleStop = () => {
    setBreatheState('idle');
    setSecondsLeft(0);
  };

  // Timing scale mappings
  const getScale = () => {
    if (breatheState === 'inhale') return 2.0;
    if (breatheState === 'hold') return 2.0;
    if (breatheState === 'exhale') return 1.0;
    return 1.0;
  };

  const getDuration = () => {
    if (breatheState === 'inhale') return 4;
    if (breatheState === 'exhale') return 8;
    return 0.5; // Instant holds
  };

  const getLabel = () => {
    if (breatheState === 'inhale') return 'Inhale...';
    if (breatheState === 'hold') return 'Hold Breath';
    if (breatheState === 'exhale') return 'Exhale...';
    return 'Actionable Coping Coach';
  };

  const getColorClass = () => {
    if (breatheState === 'inhale') return 'border-cyan-400 shadow-glow-blue bg-cyan-500/10 text-cyan-400';
    if (breatheState === 'hold') return 'border-purple-400 shadow-glow-purple bg-purple-500/10 text-purple-400';
    if (breatheState === 'exhale') return 'border-rose-400 shadow-neonPink bg-rose-500/10 text-rose-400';
    return 'border-glassBorder bg-glassBg text-slate-300';
  };

  return (
    <div className="p-6 rounded-2xl glass-panel border-glassBorder flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-md font-bold text-slate-200 flex items-center space-x-2">
          <Wind className="w-4 h-4 text-neonBlue" />
          <span>Interactive Breathing Coach</span>
        </h3>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-neonBlue font-bold uppercase tracking-wider">4-7-8 Cycle</span>
      </div>

      {/* Dynamic Animated Bubble */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-4">
        <motion.div
          animate={{
            scale: getScale(),
            boxShadow: breatheState === 'inhale' ? '0 0 25px rgba(34, 211, 238, 0.4)' :
                       breatheState === 'hold' ? '0 0 25px rgba(168, 85, 247, 0.4)' :
                       breatheState === 'exhale' ? '0 0 25px rgba(244, 63, 94, 0.4)' : '0 8px 32px 0 rgba(0,0,0,0.3)',
          }}
          transition={{
            duration: getDuration(),
            ease: "easeInOut"
          }}
          className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${getColorClass()}`}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={secondsLeft}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-xs font-black font-mono select-none"
            >
              {breatheState === 'idle' ? <Wind className="w-6 h-6 animate-pulse" /> : `${secondsLeft}s`}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <div className="mt-8 text-center min-h-[40px]">
          <h4 className="text-sm font-bold text-slate-200 transition-all duration-300">
            {getLabel()}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
            {breatheState === 'idle' && 'Breathe along to reduce JEE/NEET stress and lower anxiety scores.'}
            {breatheState === 'inhale' && 'Expand your chest slowly and breathe in.'}
            {breatheState === 'hold' && 'Keep the air inside and relax your mind.'}
            {breatheState === 'exhale' && 'Release the breath completely through your mouth.'}
          </p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="w-full flex justify-center mt-2 border-t border-glassBorder/60 pt-4">
        {breatheState === 'idle' ? (
          <button
            onClick={handleStart}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-xs font-bold text-white shadow-glow-blue flex items-center space-x-2 transform hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Begin Guided Session</span>
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-6 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center space-x-2 transform hover:scale-105 active:scale-95 transition-all"
          >
            <Square className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        )}
      </div>
    </div>
  );
};
