
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const COMPLEX_MODEL = 'gemini-3-pro-preview';
const FLASH_MODEL = 'gemini-3-flash-preview';

/**
 * Robust JSON extraction helper.
 * Strips markdown and extraneous text to ensure a valid JSON object is returned.
 */
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
  
  const prompt = `PARSING TASK:
  Extract every possible detail from this document into a structured JSON format.
  
  REQUIRED STRUCTURE:
  - personalInfo: { fullName, email, phone, location, linkedin, summary }
  - experience: Array of { company, position, location, startDate, endDate, current (boolean), description (string with \\n bullet points) }
  - education: Array of { school, degree, location, startDate, endDate, grade }
  - skills: Array of { name, level (0-100) }
  - languages: Array of strings
  - certifications: Array of strings
  
  STRICT RULE: Return ONLY valid JSON. If a section is missing, return an empty array or null for that field. Do not make up data.`;
  
  const contents = {
    parts: [
      { text: prompt },
      fileData ? { inlineData: fileData } : { text: textContent || "" }
    ]
  };

  try {
    // Using Flash for extraction because it is significantly faster and very accurate for JSON mapping
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents,
      config: {
        // Correctly balancing thinking and output tokens to prevent empty responses
        thinkingConfig: { thinkingBudget: 4000 },
        maxOutputTokens: 12000, 
        responseMimeType: "application/json",
      }
    });

    const rawText = response.text || "{}";
    const cleaned = cleanJsonResponse(rawText);
    const parsed = JSON.parse(cleaned);
    
    // Normalize nested structures to prevent builder crashes
    return {
      personalInfo: parsed.personalInfo || {},
      experience: (parsed.experience || []).map((exp: any) => ({
        ...exp,
        id: Math.random().toString(36).substring(7),
        isRemote: false,
        current: !!exp.current
      })),
      education: (parsed.education || []).map((edu: any) => ({
        ...edu,
        id: Math.random().toString(36).substring(7)
      })),
      skills: (parsed.skills || []).map((s: any) => ({
        name: s.name || s,
        level: s.level || 80
      })),
      languages: parsed.languages || [],
      certifications: parsed.certifications || [],
      projects: parsed.projects || []
    };
  } catch (e) {
    console.error("Gemini Extraction Failure:", e);
    throw new Error("The AI failed to parse this document structure. It might be a scanned image or restricted PDF.");
  }
};

export const analyzeResumeATS = async (filename: string, fileData?: { data: string, mimeType: string }, textContent?: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `VALIDATION: Is "${filename}" a professional resume? Return JSON with boolean 'isResume'.`;

  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: {
        parts: [
          { text: prompt },
          fileData ? { inlineData: fileData } : { text: textContent || "" }
        ]
      },
      config: { responseMimeType: "application/json" }
    });
    
    const cleaned = cleanJsonResponse(response.text || "{}");
    return JSON.parse(cleaned);
  } catch (e) {
    // Permissive fallback
    return { isResume: true, score: 70 };
  }
};

// ... keep other services same or slightly simplified for brevity ...
export const improveSummary = async (summary: string, jobTitle: string, skills: string[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `Improve this summary for a ${jobTitle}: "${summary}". Skills: ${skills.join(', ')}`,
    config: { systemInstruction: "Make it professional and under 50 words." }
  });
  return response.text?.trim() || summary;
};

export const generateSummarySuggestions = async (jobTitle: string, skills: string[]): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `3 summary options for ${jobTitle} with ${skills.join(', ')}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  });
  try { return JSON.parse(cleanJsonResponse(response.text || "[]")); } catch { return []; }
};

export const rewriteExperience = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `Rewrite to be impactful: "${text}"`
  });
  return response.text?.trim() || text;
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
  try { return JSON.parse(cleanJsonResponse(response.text || "[]")); } catch { return []; }
};

export const getSkillSuggestions = async (jobTitle: string, existingSkills: string[] = []): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `12 skills for ${jobTitle}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  });
  try { return JSON.parse(cleanJsonResponse(response.text || "[]")); } catch { return []; }
};
