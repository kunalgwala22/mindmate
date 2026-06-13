import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export interface ForecastAndSuggestions {
  burnoutRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  forecastSummary: string;
  predictedTrend: { dayOffset: number; predictedStressScore: number }[];
  studyAdjustments: string[];
}

export const generateWeeklyForecastAndSuggestions = async (
  journals: { content: string; mood: string; stressScore: number; date: string }[],
  name: string
): Promise<ForecastAndSuggestions> => {
  if (journals.length === 0) {
    return {
      burnoutRisk: 'Low',
      forecastSummary: 'Share your first journal entries to enable AI predictive stress forecasts.',
      predictedTrend: [],
      studyAdjustments: [
        'Establish a consistent sleep schedule of 7-8 hours.',
        'Integrate short, 5-minute study breaks every hour using the Pomodoro technique.'
      ]
    };
  }

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined. Using mock predictive forecast.');
    return getMockForecast(journals, name);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const journalLogsStr = journals
      .map((j, i) => `Log ${i + 1} (${j.date}): Mood="${j.mood}", StressScore=${j.stressScore}%, Content="${j.content.substring(0, 150)}..."`)
      .join('\n');

    const prompt = `
      You are an advanced exam-wellness AI analytics engine. You study a student's daily journals, moods, and calculated stress scores to predict burnout risk and offer high-value study structure adjustments.

      Student Name: ${name}
      Recent Journal History:
      ${journalLogsStr}

      Analyze the trend. If stress scores are rising or diary mentions burnout/sleep deprivation, burnout risk is High/Critical. If stable, it is Moderate/Low.
      Predict their stress scores for the next 4 days (Day +1 to Day +4) based on their trajectory.
      Recommend 2 or 3 highly personalized, practical study schedule adjustments (e.g. Pomodoro timings, active recall suggestions, specific study slot changes, mock paper practice pacing).

      Return ONLY a JSON object matching this structure:
      {
        "burnoutRisk": "Low" | "Moderate" | "High" | "Critical",
        "forecastSummary": "A concise, empathetic prediction of their stress trend for the upcoming week (max 2 sentences).",
        "predictedTrend": [
          { "dayOffset": 1, "predictedStressScore": number },
          { "dayOffset": 2, "predictedStressScore": number },
          { "dayOffset": 3, "predictedStressScore": number },
          { "dayOffset": 4, "predictedStressScore": number }
        ],
        "studyAdjustments": [
          "Personalized suggestion 1 (max 2 sentences)",
          "Personalized suggestion 2 (max 2 sentences)",
          "Personalized suggestion 3 (max 2 sentences)"
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText.trim()) as ForecastAndSuggestions;
  } catch (error) {
    console.error('Error with Gemini forecast, falling back to mock:', error);
    return getMockForecast(journals, name);
  }
};

const getMockForecast = (
  journals: { content: string; mood: string; stressScore: number; date: string }[],
  name: string
): ForecastAndSuggestions => {
  // Calculate average of past stress scores
  const avgStress = journals.reduce((sum, j) => sum + j.stressScore, 0) / journals.length;
  
  // Determine trajectory based on latest vs average
  const latestStress = journals[0].stressScore;
  const isRising = latestStress > avgStress;

  let burnoutRisk: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Moderate';
  let forecastSummary = `${name}'s stress levels are currently stable. The upcoming week presents a manageable workload if balanced with healthy breaks.`;
  let adjustments = [
    'Break mock exam practice into 45-minute sections followed by a 10-minute visual break.',
    'Review formulas or high-yield concepts using active recall cards rather than passive re-reading.'
  ];

  if (latestStress >= 80) {
    burnoutRisk = 'Critical';
    forecastSummary = `Warning: ${name}'s stress scores indicate immediate burnout danger due to intensive prep pressure. A decline in retention is expected without active recovery.`;
    adjustments = [
      'IMMEDIATE ACTION: Reduce study slots by 2 hours today and establish a strict screen-free boundary at 9:30 PM.',
      'Study highly complex formulas in 25-minute Pomodoros. Avoid taking on new topics for the next 48 hours.',
      'Dedicate 10 minutes at 5:00 PM to physical movement or outdoor relaxation.'
    ];
  } else if (latestStress >= 50) {
    burnoutRisk = 'High';
    forecastSummary = `An upward trend in stress suggests accumulating mental fatigue, ${name}. Consistent check-ins show high exam anxiety, which could impact focus in mock tests.`;
    adjustments = [
      'Schedule mock tests only in the morning when mental stamina is peak. Dedicate afternoons strictly to corrections and easy review.',
      'Use 4-7-8 breathing cycles immediately before starting complex problem sheets.'
    ];
  } else if (latestStress < 30) {
    burnoutRisk = 'Low';
    forecastSummary = `Great work, ${name}! Your stress scores are highly optimal, indicating excellent study-life balance and high cognitive readiness.`;
    adjustments = [
      'Maintain this routine. Continue tracking logs to catch any future stress spikes early.',
      'Feel free to attempt full-length simulated mock exams to lock in your exam stamina.'
    ];
  }

  // Generate a predicted score trend for the next 4 days
  const predictedTrend = [
    { dayOffset: 1, predictedStressScore: Math.round(latestStress + (isRising ? 3 : -3)) },
    { dayOffset: 2, predictedStressScore: Math.round(latestStress + (isRising ? 5 : -5)) },
    { dayOffset: 3, predictedStressScore: Math.round(latestStress + (isRising ? 4 : -7)) },
    { dayOffset: 4, predictedStressScore: Math.round(latestStress + (isRising ? 2 : -8)) }
  ].map(t => ({
    ...t,
    predictedStressScore: Math.max(10, Math.min(98, t.predictedStressScore)) // boundary check
  }));

  return {
    burnoutRisk,
    forecastSummary,
    predictedTrend,
    studyAdjustments: adjustments
  };
};
