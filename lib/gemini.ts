
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const FLASH_MODEL = 'gemini-3-flash-preview';

const cleanJsonResponse = (text: string) => {
  try {
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      return text.substring(startIndex, endIndex + 1);
    }
    return text.trim();
  } catch (e) {
    return text;
  }
};

export const extractResumeData = async (fileData?: { data: string, mimeType: string }, textContent?: string): Promise<Partial<ResumeData>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `PARSING TASK: Extract resume details into structured JSON. STRICT RULE: Return ONLY valid JSON.`;
  
  const contents = {
    parts: [
      { text: prompt },
      fileData ? { inlineData: fileData } : { text: textContent || "" }
    ]
  };

  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents,
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(cleanJsonResponse(response.text || "{}"));
    return {
      personalInfo: parsed.personalInfo || {},
      experience: (parsed.experience || []).map((exp: any) => ({ ...exp, id: Math.random().toString(36).substring(7) })),
      education: (parsed.education || []).map((edu: any) => ({ ...edu, id: Math.random().toString(36).substring(7) })),
      skills: (parsed.skills || []).map((s: any) => ({ name: s.name || s, level: s.level || 80 })),
      languages: parsed.languages || [],
      certifications: parsed.certifications || [],
      projects: parsed.projects || []
    };
  } catch (e) {
    throw new Error("Failed to parse document structure.");
  }
};

export const finalizeAndPolishResume = async (data: ResumeData): Promise<ResumeData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `FINAL POLISH: Review and improve this resume data. Return JSON. DATA: ${JSON.stringify(data)}`;
  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return { ...data, ...JSON.parse(cleanJsonResponse(response.text || "{}")) };
  } catch (e) {
    return data;
  }
};

export const analyzeResumeATS = async (filename: string, fileData?: { data: string, mimeType: string }, textContent?: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `VALIDATION: Is "${filename}" a resume? Return JSON with boolean 'isResume'.`;
  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: { parts: [{ text: prompt }, fileData ? { inlineData: fileData } : { text: textContent || "" }] },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonResponse(response.text || "{}"));
  } catch (e) {
    return { isResume: true };
  }
};

export const improveSummary = async (summary: string, jobTitle: string, skills: string[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `Improve summary for ${jobTitle}: "${summary}". Skills: ${skills.join(', ')}`,
    config: { systemInstruction: "Make it professional and under 50 words." }
  });
  return response.text?.trim() || summary;
};

export const generateSummarySuggestions = async (jobTitle: string, skills: string[]): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `3 summary options for ${jobTitle}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || "[]"));
};

export const getResponsibilitiesSuggestions = async (jobTitle: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `6 bullet points for ${jobTitle}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || "[]"));
};

export const getSkillSuggestions = async (jobTitle: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `12 skills for ${jobTitle}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || "[]"));
};
