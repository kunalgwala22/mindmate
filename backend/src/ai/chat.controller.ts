import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const handleAIChat = async (req: AuthenticatedRequest, res: Response) => {
  const { message, mood } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ message: 'Message is required' });
  }

  const moodContext = mood || 'Neutral';

  try {
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Using mock chat fallback.');
      return res.json({ response: getMockChatResponse(message, moodContext, user.name) });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      You are MindMate, a warm, empathetic, and encouraging digital mental wellness companion for a student preparing for stressful competitive board exams (such as JEE, NEET, CAT, GATE, UPSC, CUET).
      
      Student Name: ${user.name}
      Current Declared Mood: ${moodContext}
      Student says: "${message}"
      
      Respond directly to what they said in a warm, conversational, validating, and comforting manner. 
      Help them put things into perspective. Keep your response short and punchy (maximum 3 sentences). 
      Do not offer complex diagnostic advice or sound clinical.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    return res.json({ response: responseText });
  } catch (error: any) {
    console.error('Gemini chat error, falling back to mock:', error);
    return res.json({ response: getMockChatResponse(message, moodContext, user.name) });
  }
};

const getMockChatResponse = (message: string, mood: string, name: string): string => {
  const msgLower = message.toLowerCase();
  
  if (msgLower.includes('physics') || msgLower.includes('math') || msgLower.includes('chemistry') || msgLower.includes('subject')) {
    return `Hey ${name}, subjects like Physics and Math can feel incredibly daunting, especially when derivations don't click immediately. Remember, understanding takes time—try breaking your study block into 20-minute intervals and focus on solving just one small concept at a time. You've got this!`;
  }
  
  if (msgLower.includes('tired') || msgLower.includes('sleep') || msgLower.includes('exhausted') || msgLower.includes('burn')) {
    return `It sounds like you're running on empty, ${name}. Your brain cannot retain info effectively when it is exhausted, so please consider taking a true screen-free break or calling it a night. Rest is an active part of your preparation, not a waste of time.`;
  }

  if (msgLower.includes('parent') || msgLower.includes('expect') || msgLower.includes('pressure')) {
    return `Exam pressure from family expectations can feel like carrying a heavy weight, ${name}. Try to remind yourself that your worth as a person is completely separate from test scores. Focus on your effort today, as that is the only thing within your control.`;
  }

  if (msgLower.includes('fail') || msgLower.includes('scared') || msgLower.includes('worry')) {
    return `It is completely natural to feel scared about exam outcomes when you're working so hard, ${name}. Try not to let fear of the future steal your energy today. Just take things one single day, one single page, and one single step at a time.`;
  }

  return `Thank you for sharing that with me, ${name}. I hear you, and it's completely valid to feel this way during prep season. Let's take a deep breath together—you are doing the best you can, and that is more than enough!`;
};
