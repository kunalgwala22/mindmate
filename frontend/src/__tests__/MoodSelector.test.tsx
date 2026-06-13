import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MoodSelector } from '../components/MoodSelector';

describe('MoodSelector Component', () => {
  it('renders all mood options correctly', () => {
    render(<MoodSelector selectedMood="" onSelect={vi.fn()} />);

    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('Anxious')).toBeInTheDocument();
    expect(screen.getByText('Sad')).toBeInTheDocument();
    expect(screen.getByText('Burned Out')).toBeInTheDocument();
  });

  it('triggers onSelect callback when a mood is clicked', () => {
    const handleSelect = vi.fn();
    render(<MoodSelector selectedMood="" onSelect={handleSelect} />);

    const happyButton = screen.getByText('Happy').closest('button');
    expect(happyButton).toBeInTheDocument();

    if (happyButton) {
      fireEvent.click(happyButton);
    }

    expect(handleSelect).toHaveBeenCalledWith('😀 Happy');
  });

  it('shows selected state styling when a mood is selected', () => {
    render(<MoodSelector selectedMood="😀 Happy" onSelect={vi.fn()} />);
    
    const happyText = screen.getByText('Happy');
    expect(happyText).toHaveClass('text-emerald-400');
  });
});
