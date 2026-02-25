import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import { ResearchSource, AnalysisResult } from '../types';

// Initialize API Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Step 1: Smart Analysis using Gemini 2.5 Flash
 * Returns structured data: Score, Category, and Improvement Suggestions.
 */
export const analyzeIdeaFast = async (idea: string): Promise<AnalysisResult | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this prompt idea. Provide a clarity score (0-100), a category, and 3 specific suggestions to make it better.
      
      CRITICAL INSTRUCTION: The suggestions MUST be in Turkish and strictly follow this specific format:
      "Daha iyi bir [field_name] için şunu deneyin: [suggestion]"
      
      Example Output Format:
      "Daha iyi bir bağlam için şunu deneyin: Hedef kitlenin kim olduğunu belirtin."
      "Daha iyi bir ton için şunu deneyin: Profesyonel mi samimi mi olacağını ekleyin."

      Idea: ${idea}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            category: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    return null;
  } catch (error) {
    console.error("Smart analysis failed:", error);
    return {
      score: 0,
      category: "Genel",
      suggestions: ["Analiz servisi şu an yanıt vermiyor."]
    };
  }
};

/**
 * Step 2: Deep Research using Gemini 2.5 Flash with Google Search Grounding
 * Finds domain-specific terminology and context.
 */
export const researchTopic = async (idea: string): Promise<{ text: string; sources: ResearchSource[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Research this topic to find expert terminology, industry standards, and key performance indicators (KPIs). Summary in Turkish. Topic: ${idea}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract grounding chunks for sources
    const sources: ResearchSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Research failed:", error);
    return { text: "", sources: [] };
  }
};

/**
 * Step 3: Generate Super Prompt using Gemini 3 Pro Preview
 * Uses CO-STAR framework for high-intelligence output.
 */
export const generateSuperPrompt = async (idea: string, researchContext: string): Promise<string> => {
  try {
    const systemInstruction = `
      You are an elite AI Prompt Engineer using the CO-STAR framework.
      Transform the user's idea into a high-performance prompt for LLMs (GPT-4, Claude 3.5, Gemini 1.5 Pro).
      
      FRAMEWORK (CO-STAR):
      C (Context): Set a detailed expert persona and background. Use the provided Research Context.
      O (Objective): Define the precise goal.
      S (Style): Define the writing style (e.g., Professional, Persuasive, Technical).
      T (Tone): Define the emotional tone.
      A (Audience): Define the target audience.
      R (Response): Specify the output format (Markdown, Code, Table, etc.).

      RULES:
      1. Identify missing details in the user's idea and create placeholder variables like [TARGET_AUDIENCE] or [SPECIFIC_METRIC].
      2. Use industry-specific terminology found in the research.
      3. The output MUST be in TURKISH (unless the idea is clearly in another language).
      4. Provide ONLY the prompt inside a code block for easy copying.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `User Idea: ${idea}\n\nResearch Context: ${researchContext}`,
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text || "Prompt oluşturulamadı.";
  } catch (error) {
    console.error("Generation failed:", error);
    return "Üzgünüz, bir hata oluştu.";
  }
};

/**
 * Step 4: Refine Prompt (New Feature)
 * Regenerates the prompt with a different strategy/framework.
 */
export const refinePrompt = async (idea: string, currentPrompt: string, refinementType: string): Promise<string> => {
  try {
    const systemInstruction = `
      You are a master Prompt Engineer. The user is NOT satisfied with the previous prompt generated for their idea.
      
      YOUR TASK:
      Generate a completely NEW version of the prompt using a DIFFERENT thinking framework and priority set.
      
      REFINEMENT STRATEGY: ${refinementType}
      
      available frameworks to switch to:
      - TAG (Task, Action, Goal) -> Best for directness.
      - GRADE (Goal, Request, Action, Detail, Examples) -> Best for complexity.
      - APE (Action, Purpose, Expectation) -> Best for simplicity.
      
      RULES:
      1. Do NOT just edit the old prompt. Rewrite it from scratch.
      2. Change the structure, the persona, and the focus based on the Refinement Strategy.
      3. Output MUST be in TURKISH.
      4. Provide ONLY the new prompt text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Original Idea: ${idea}\n\nRefinement Instruction: ${refinementType}`,
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text || "Prompt geliştirilemedi.";
  } catch (error) {
    console.error("Refinement failed:", error);
    return "Geliştirme sırasında hata oluştu.";
  }
};

/**
 * Chat Service using Gemini 3 Pro Preview
 */
export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "Sen uzman bir Prompt Mühendisisin. Kullanıcının fikirlerini netleştirmesine, eksikleri bulmasına ve daha iyi promptlar yazmasına yardım et. Kısa ve öz cevaplar ver.",
    }
  });
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "";
  } catch (error) {
    console.error("Chat failed:", error);
    return "Hata oluştu.";
  }
};