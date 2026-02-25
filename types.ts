export interface AppContent {
  website_content: {
    hero_section: {
      title: string;
      subtitle: string;
      button_text: string;
    };
    features_section: Array<{
      id: number;
      title: string;
      description: string;
    }>;
    how_it_works: {
      step_1: string;
      step_2: string;
      step_3: string;
    };
    footer_slogan: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ResearchSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  score: number;
  category: string;
  suggestions: string[];
}

export interface SavedPrompt {
  id: string;
  idea: string;
  text: string;
  timestamp: number;
}

export interface GenerationResult {
  fastAnalysis: AnalysisResult | null;
  researchSources: ResearchSource[];
  superPrompt: string | null;
}

export enum AppState {
  LANDING = 'LANDING',
  GENERATOR = 'GENERATOR'
}