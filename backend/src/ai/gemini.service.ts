import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export interface SingleJournalAnalysis {
  emotion: string;
  sentiment: string;
  stressScore: number;
  stressTrigger: string;
  summary: string;
  copingStrategy: string;
  motivation: string;
}

export interface AggregatedTrigger {
  trigger: string;
  percentage: number;
}

export const analyzeJournalEntry = async (
  content: string,
  mood: string
): Promise<SingleJournalAnalysis> => {
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined. Using mock analysis.');
    return getMockAnalysis(content, mood);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `
      You are an empathetic digital mental wellness companion for students preparing for competitive and board exams (such as JEE, NEET, CAT, UPSC, GATE, board exams).
      
      Analyze the following student's journal entry and their current declared mood.
      
      Mood: ${mood}
      Journal Entry: "${content}"
      
      Return ONLY a JSON object matching this structure:
      {
        "emotion": "Detected primary emotion (e.g. Anxiety, Burnout, Hopeful, Frustrated, Calm, Fear, Overwhelmed)",
        "sentiment": "Overall sentiment (Negative, Neutral, Positive)",
        "stressScore": A number from 0 to 100 indicating stress level,
        "stressTrigger": "A concise identified stress trigger (e.g. Physics anxiety, Fear of exam performance, Lack of sleep, Family pressure, Peer comparison, Time management)",
        "summary": "An empathetic summary of how the student feels regarding exam readiness or mental state (max 2 sentences).",
        "copingStrategy": "A practical, small, actionable coping strategy tailored to their specific trigger and mood (max 2 sentences).",
        "motivation": "A short, highly inspiring and supportive motivational message (max 1 sentence)."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText.trim()) as SingleJournalAnalysis;
  } catch (error) {
    console.error('Error with Gemini API, falling back to mock analysis:', error);
    return getMockAnalysis(content, mood);
  }
};

export const analyzeMultipleJournalsForTriggers = async (
  journals: { content: string; mood: string; stress_trigger: string }[]
): Promise<AggregatedTrigger[]> => {
  if (journals.length === 0) {
    return [];
  }

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined. Using mock trigger aggregation.');
    return getMockAggregatedTriggers(journals);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const journalsSummary = journals
      .map((j, i) => `Journal ${i + 1}: Mood="${j.mood}", Trigger="${j.stress_trigger}", Content="${j.content.substring(0, 150)}..."`)
      .join('\n');

    const prompt = `
      You are a mental wellness analytics engine. 
      Analyze the following list of a student's daily journals and identified stress triggers.
      Group them into 3 to 5 main recurring stress categories (e.g. "Physics anxiety", "Exam fear", "Lack of sleep", "Family pressure", "Comparison with peers", "Time management", etc.).
      Calculate the percentage representation of each category based on the frequency and severity in the journals. The percentages must add up to 100.
      
      Journals:
      ${journalsSummary}
      
      Return ONLY a JSON array of objects, sorted from highest percentage to lowest, matching this structure:
      [
        {
          "trigger": "Name of the stress category",
          "percentage": Number representing percentage (0-100)
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText.trim()) as AggregatedTrigger[];
  } catch (error) {
    console.error('Error with Gemini aggregation, falling back to mock aggregation:', error);
    return getMockAggregatedTriggers(journals);
  }
};

// Fallback Mock System for offline/error robustness (critical for hackathons)
const getMockAnalysis = (content: string, mood: string): SingleJournalAnalysis => {
  const contentLower = content.toLowerCase();
  let emotion = 'Anxiety';
  let stressScore = 70;
  let stressTrigger = 'General Exam Stress';
  let copingStrategy = 'Practice 4-7-8 deep breathing exercises for 5 minutes.';
  let motivation = 'You are capable of handling hard things, one step at a time.';

  if (contentLower.includes('physic')) {
    stressTrigger = 'Physics anxiety';
    emotion = 'Fear';
    stressScore = 85;
    copingStrategy = 'Focus on solving 3 simple Physics problems to rebuild confidence.';
    motivation = 'A single subject does not define your potential.';
  } else if (contentLower.includes('sleep') || contentLower.includes('tired')) {
    stressTrigger = 'Lack of sleep';
    emotion = 'Burnout';
    stressScore = 90;
    copingStrategy = 'Turn off screens and aim for a strict 8-hour sleep window tonight.';
    motivation = 'Rest is part of the preparation, not a waste of time.';
  } else if (contentLower.includes('parent') || contentLower.includes('expect')) {
    stressTrigger = 'Family pressure';
    emotion = 'Overwhelmed';
    stressScore = 80;
    copingStrategy = 'Remind yourself that your worth is not tied directly to exam marks.';
    motivation = 'Focus on the effort, which is the only thing in your control.';
  } else if (contentLower.includes('friend') || contentLower.includes('peer') || contentLower.includes('better')) {
    stressTrigger = 'Comparison with peers';
    emotion = 'Self-doubt';
    stressScore = 75;
    copingStrategy = 'Mute study chat groups temporarily and focus purely on your own path.';
    motivation = 'Your only competitor is who you were yesterday.';
  }

  if (mood.toLowerCase() === 'happy' || mood.toLowerCase() === 'good') {
    stressScore = Math.max(20, stressScore - 40);
    emotion = 'Calm';
    motivation = 'Keep riding this positive wave and trust your prep!';
  }

  return {
    emotion,
    sentiment: stressScore > 50 ? 'Negative' : 'Positive',
    stressScore,
    stressTrigger,
    summary: `The student is experiencing thoughts related to "${stressTrigger}" while expressing a mood of "${mood}".`,
    copingStrategy,
    motivation,
  };
};

const getMockAggregatedTriggers = (
  journals: { content: string; mood: string; stress_trigger: string }[]
): AggregatedTrigger[] => {
  const counts: Record<string, number> = {};
  journals.forEach((j) => {
    const trigger = j.stress_trigger || 'General Exam Prep';
    counts[trigger] = (counts[trigger] || 0) + 1;
  });

  const total = journals.length;
  const list = Object.entries(counts).map(([trigger, count]) => ({
    trigger,
    percentage: Math.round((count / total) * 100),
  }));

  return list.sort((a, b) => b.percentage - a.percentage);
};
