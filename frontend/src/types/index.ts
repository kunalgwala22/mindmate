export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Journal {
  id: number;
  content: string;
  created_at: string;
  emotion?: string;
  sentiment?: string;
  stress_score?: number;
  stress_trigger?: string;
  summary?: string;
  coping_strategy?: string;
  motivation?: string;
}

export interface Mood {
  id: number;
  mood: string;
  created_at: string;
}

export interface DashboardMetrics {
  currentMood: string;
  journalCount: number;
  averageStressScore: number | null;
  latestEmotion: string;
  topTrigger: string;
  wellnessStatus: string;
  wellnessColor: string;
}

export interface TopStressTrigger {
  trigger: string;
  percentage: number;
}

export interface LatestInsight {
  summary: string;
  copingStrategy: string;
  motivation: string;
  stressScore: number;
  emotion: string;
}

export interface DashboardStats {
  metrics: DashboardMetrics;
  topStressTriggers: TopStressTrigger[];
  latestInsight: LatestInsight | null;
}

export interface StressTrendItem {
  date: string;
  stressScore: number;
  emotion: string;
}

export interface MoodTrendItem {
  date: string;
  mood: string;
  value: number;
}

export interface EmotionDistItem {
  name: string;
  value: number;
}

export interface AnalyticsData {
  stressTrend: StressTrendItem[];
  moodTrend: MoodTrendItem[];
  emotionDistribution: EmotionDistItem[];
}
