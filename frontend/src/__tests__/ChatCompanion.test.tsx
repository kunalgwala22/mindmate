import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ChatCompanion } from '../components/ChatCompanion';

// Stub global fetch for vitest
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('ChatCompanion Component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
  });

  it('renders initial welcoming message and chat interface', () => {
    render(<ChatCompanion currentMood="Anxious" />);

    expect(screen.getByText('Empathy Companion Chat')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("I'm feeling stressed about mock scores...")).toBeInTheDocument();
    expect(screen.getByText(/Hi there! I'm MindMate, your empathetic companion/)).toBeInTheDocument();
  });

  it('sends user message and displays mocked AI response successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response: 'Keep studying, you are doing awesome!' })
    });

    render(<ChatCompanion currentMood="Anxious" />);

    const input = screen.getByPlaceholderText("I'm feeling stressed about mock scores...") as HTMLInputElement;
    const submitButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'I failed my chemistry exam' } });
    fireEvent.click(submitButton);

    // Verify user message immediately enters screen
    expect(screen.getByText('I failed my chemistry exam')).toBeInTheDocument();

    // Verify thinking loader shows up
    expect(screen.getByText('MindMate is thinking...')).toBeInTheDocument();

    // Wait for the mock fetch response to render
    await waitFor(() => {
      expect(screen.getByText('Keep studying, you are doing awesome!')).toBeInTheDocument();
    });

    // Loader should be hidden
    expect(screen.queryByText('MindMate is thinking...')).not.toBeInTheDocument();
  });

  it('displays fallback response on API failures gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    render(<ChatCompanion currentMood="Neutral" />);

    const input = screen.getByPlaceholderText("I'm feeling stressed about mock scores...") as HTMLInputElement;
    const submitButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Is anyone there?' } });
    fireEvent.click(submitButton);

    // Wait for fallback text
    await waitFor(() => {
      expect(screen.getByText(/I'm having a little trouble connecting right now/)).toBeInTheDocument();
    });
  });
});
