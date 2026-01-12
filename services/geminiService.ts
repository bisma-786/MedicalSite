import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      temperature: 0.7,
      systemInstruction: `You are 'Lumi', the intelligent virtual assistant for Lumina Medical, a premium medical clinic specializing in Dental Implants, IV Therapy, and Weight Loss. 
      
      Your goal is to assist website visitors by:
      1. Answering questions about our services pleasantly and professionally.
      2. Encouraging them to book an appointment.
      3. Collecting their name and interest if they seem interested (lead generation).
      
      Tone: Professional, empathetic, trustworthy, and concise.
      Do not provide specific medical advice (diagnoses). Always suggest a consultation with Dr. Chen or Dr. Ross for medical concerns.
      If asked about prices, give the ranges provided in your knowledge base or suggest booking a free consultation for a quote.`
    }
  });
};

export const generateMarketingContent = async (topic: string, type: 'blog' | 'service_desc'): Promise<string> => {
  try {
    const prompt = type === 'blog' 
      ? `Write a short, engaging, SEO-friendly blog post intro (approx 150 words) for a medical clinic about: "${topic}". Focus on patient benefits and trust.`
      : `Write a compelling 2-sentence service description for: "${topic}". Focus on luxury, comfort, and results.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Content generation failed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate content at this time. Please try again later.";
  }
};

export const analyzeLeads = async (leadsData: any[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these anonymized leads and suggest 3 actionable marketing improvements in JSON format (just the insights text, no markdown): ${JSON.stringify(leadsData)}`,
    });
    return response.text || "No insights available.";
  } catch (error) {
    return "Analysis unavailable.";
  }
};