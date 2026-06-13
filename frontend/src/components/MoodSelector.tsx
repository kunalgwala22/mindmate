import React from 'react';

interface MoodOption {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const moods: MoodOption[] = [
  { label: 'Happy', emoji: '😀', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  { label: 'Good', emoji: '🙂', color: 'text-teal-400', bgColor: 'bg-teal-500/10', borderColor: 'border-teal-500/30' },
  { label: 'Neutral', emoji: '😐', color: 'text-slate-400', bgColor: 'bg-slate-500/10', borderColor: 'border-slate-500/30' },
  { label: 'Anxious', emoji: '😟', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30' },
  { label: 'Sad', emoji: '😢', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  { label: 'Burned Out', emoji: '😫', color: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/30' },
];

interface MoodSelectorProps {
  selectedMood: string;
  onSelect: (mood: string) => void;
  disabled?: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {moods.map((m) => {
        const isSelected = selectedMood === m.label || (selectedMood.includes(m.emoji));
        return (
          <button
            key={m.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(`${m.emoji} ${m.label}`)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
              isSelected
                ? `${m.bgColor} border-${m.color.split('-')[1]}-500/60 shadow-lg scale-105`
                : 'bg-glassBg border-glassBorder hover:border-glassBorderHover'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="text-3xl mb-2 filter drop-shadow-md select-none transform hover:scale-125 transition-transform duration-200">
              {m.emoji}
            </span>
            <span className={`text-sm font-medium ${isSelected ? m.color : 'text-slate-400'}`}>
              {m.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
