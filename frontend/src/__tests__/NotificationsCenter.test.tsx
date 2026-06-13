import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NotificationsCenter } from '../components/NotificationsCenter';
import { DashboardStats } from '../types';

describe('NotificationsCenter Component', () => {
  const mockStats: DashboardStats = {
    metrics: {
      currentMood: '🙂 Good',
      journalCount: 5,
      averageStressScore: 82,
      latestEmotion: 'Anxiety',
      topTrigger: 'Physics mechanics',
      wellnessStatus: 'Elevated Stress',
      wellnessColor: 'yellow'
    },
    topStressTriggers: [
      { trigger: 'Physics mechanics', percentage: 70 }
    ],
    latestInsight: {
      summary: 'Mock summary',
      copingStrategy: 'Mock coping',
      motivation: 'Mock motivation',
      stressScore: 82,
      emotion: 'Anxiety'
    }
  };

  it('renders the bell icon with unread count badge', () => {
    render(<NotificationsCenter stats={mockStats} />);
    
    // There should be 4 generated notifications: streak, high stress warning, top trigger study tip, general daily hack
    expect(screen.getByLabelText('View notifications')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument(); // Unread badge count
  });

  it('opens panel dropdown and displays all notifications', () => {
    render(<NotificationsCenter stats={mockStats} />);
    
    const triggerBtn = screen.getByLabelText('View notifications');
    fireEvent.click(triggerBtn);

    expect(screen.getByText('Alert Notification Center')).toBeInTheDocument();
    expect(screen.getByText('5-Day Consistency Streak!')).toBeInTheDocument();
    expect(screen.getByText('High Stress Alert')).toBeInTheDocument();
    expect(screen.getByText('Study Tip: Handling Physics mechanics')).toBeInTheDocument();
    expect(screen.getByText('Daily Exam Hack')).toBeInTheDocument();
  });

  it('allows user to clear a single notification', () => {
    render(<NotificationsCenter stats={mockStats} />);
    
    // Open panel
    fireEvent.click(screen.getByLabelText('View notifications'));

    const closeButtons = screen.getAllByTitle('Mark as read');
    // Click mark as read on the first notification (Streak)
    fireEvent.click(closeButtons[0]);

    // Badge count should decrease to 3
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('5-Day Consistency Streak!')).not.toBeInTheDocument();
  });

  it('allows user to clear all notifications', () => {
    render(<NotificationsCenter stats={mockStats} />);
    
    // Open panel
    fireEvent.click(screen.getByLabelText('View notifications'));

    const clearAllButton = screen.getByText('Clear All');
    fireEvent.click(clearAllButton);

    // Unread count badge should be gone
    expect(screen.queryByText('4')).not.toBeInTheDocument();
    expect(screen.getByText("You're all caught up! No unread notifications.")).toBeInTheDocument();
  });
});
