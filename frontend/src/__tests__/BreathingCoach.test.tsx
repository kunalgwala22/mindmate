import { render, screen, fireEvent } from '@testing-library/react';
import { BreathingCoach } from '../components/BreathingCoach';
import { describe, it, expect } from 'vitest';

describe('BreathingCoach Component', () => {
  it('renders in idle state initially', () => {
    render(<BreathingCoach />);
    
    expect(screen.getByText('Interactive Breathing Coach')).toBeDefined();
    expect(screen.getByText('Actionable Coping Coach')).toBeDefined();
    expect(screen.getByText('Begin Guided Session')).toBeDefined();
  });

  it('starts guided cycle on clicking start', () => {
    render(<BreathingCoach />);
    
    const startButton = screen.getByText('Begin Guided Session');
    fireEvent.click(startButton);
    
    expect(screen.getByText('Inhale...')).toBeDefined();
    expect(screen.getByText('End Session')).toBeDefined();
  });

  it('stops guided cycle on clicking stop', () => {
    render(<BreathingCoach />);
    
    const startButton = screen.getByText('Begin Guided Session');
    fireEvent.click(startButton);
    
    const stopButton = screen.getByText('End Session');
    fireEvent.click(stopButton);
    
    expect(screen.getByText('Actionable Coping Coach')).toBeDefined();
    expect(screen.getByText('Begin Guided Session')).toBeDefined();
  });
});
