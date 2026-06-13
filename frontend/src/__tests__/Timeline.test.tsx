import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Timeline } from '../components/Timeline';
import { Journal } from '../types';

describe('Timeline Component', () => {
  it('renders empty state correctly when there are no journals', () => {
    render(<Timeline journals={[]} />);
    
    expect(screen.getByText('Activity Timeline')).toBeInTheDocument();
    expect(screen.getByText(/No recent activity found/)).toBeInTheDocument();
  });

  it('renders journal logs list chronologically with AI summary details', () => {
    const mockJournals: Journal[] = [
      {
        id: 1,
        content: 'I did revision for physics mechanics today.',
        created_at: '2026-06-13T10:00:00.000Z',
        emotion: 'Hopeful',
        sentiment: 'Positive',
        stress_score: 30,
        stress_trigger: 'Physics mechanics',
        summary: 'Felt confident after doing mechanics revisions.',
        coping_strategy: 'None needed',
        motivation: 'Keep it up!',
        mood: '🙂 Good'
      },
      {
        id: 2,
        content: 'Extremely anxious about next weeks UPSC mock exam.',
        created_at: '2026-06-12T09:00:00.000Z',
        emotion: 'Anxiety',
        sentiment: 'Negative',
        stress_score: 85,
        stress_trigger: 'Exam fear',
        summary: 'Struggling with exam jitters.',
        coping_strategy: 'Take a break',
        motivation: 'You can do this',
        mood: '😟 Anxious'
      }
    ];

    render(<Timeline journals={mockJournals} />);

    expect(screen.getByText('Activity History Timeline')).toBeInTheDocument();
    expect(screen.getByText('2 Entries')).toBeInTheDocument();

    // Verify journal contents are shown
    expect(screen.getByText('"I did revision for physics mechanics today."')).toBeInTheDocument();
    expect(screen.getByText('"Extremely anxious about next weeks UPSC mock exam."')).toBeInTheDocument();

    // Verify emotions are rendered
    expect(screen.getByText('Hopeful')).toBeInTheDocument();
    expect(screen.getByText('Anxiety')).toBeInTheDocument();

    // Verify stress scores
    expect(screen.getByText('Stress: 30%')).toBeInTheDocument();
    expect(screen.getByText('Stress: 85%')).toBeInTheDocument();

    // Verify AI summaries
    expect(screen.getByText('Felt confident after doing mechanics revisions.')).toBeInTheDocument();
    expect(screen.getByText('Struggling with exam jitters.')).toBeInTheDocument();
  });
});
