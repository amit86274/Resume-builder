
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

// Using Gemini 3 Pro for superior reasoning in document structure analysis
const COMPLEX_MODEL = 'gemini-3-pro-preview';
const FLASH_MODEL = 'gemini-3-flash-preview';

/**
 * CLEAN JSON HELPER
 * Ensures we can parse even if the AI includes markdown decorators
 */
const cleanJsonResponse = (text: string) => {
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return jsonMatch ? jsonMatch[0] : text;
};

export const improveSummary = async (summary: string, jobTitle: string, skills: string[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contents = `Improve this professional summary: "${summary}". 
    Target Job Title: "${jobTitle}". 
    Key Skills to include: [${skills.join(', ')}].`;
    
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: contents,
    config: {
      systemInstruction: "You are a world-class executive resume writer. Rewrite the summary to be punchy, impactful, and tailored to the job title. Highlight the provided skills naturally. Use action-oriented language. Keep it under 60 words.",
    }
  });
  return response.text?.trim() || summary;
};

export const extractResumeData = async (fileData?: { data: string, mimeType: string }, textContent?: string): Promise<Partial<ResumeData>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [{ text: "Extract all professional details from this resume into the structured JSON format. Map every piece of information accurately to the provided schema. If a section is missing, return an empty array or string for that field. Pay special attention to Indian degree formats (B.Tech, M.Tech) and phone numbers." }];
  
  if (fileData) {
    parts.push({
      inlineData: {
        data: fileData.data,
        mimeType: fileData.mimeType
      }
    });
  } else if (textContent) {
    parts.push({ text: textContent });
  }

  const response = await ai.models.generateContent({
    model: COMPLEX_MODEL,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalInfo: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING, description: "Professional title or headline" },
              linkedin: { type: Type.STRING },
              portfolio: { type: Type.STRING },
              summary: { type: Type.STRING }
            }
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                position: { type: Type.STRING },
                location: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                current: { type: Type.BOOLEAN },
                description: { type: Type.STRING, description: "Bullet points separated by newlines" }
              }
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                school: { type: Type.STRING },
                degree: { type: Type.STRING },
                location: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                grade: { type: Type.STRING }
              }
            }
          },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                level: { type: Type.NUMBER }
              }
            }
          },
          languages: { type: Type.ARRAY, items: { type: Type.STRING } },
          certifications: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      systemInstruction: "You are a professional resume parser. Extract details with extreme precision. For work experience descriptions, keep the original bullet points but clean up any formatting artifacts. Ensure dates are parsed into a readable string format (e.g., 'Jan 2020')."
    }
  });

  try {
    const cleaned = cleanJsonResponse(response.text || "{}");
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse extracted data:", e);
    return {};
  }
};

export const analyzeResumeATS = async (filename: string, fileData?: { data: string, mimeType: string }, textContent?: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [{ text: `Strict Verification: Is the file "${filename}" a professional Resume or CV? Look for career history, skills, and contact info. If it's a random photo, a recipe, an essay, or generic text, set isResume to false.` }];

  if (fileData) {
    parts.push({
      inlineData: {
        data: fileData.data,
        mimeType: fileData.mimeType
      }
    });
  } else if (textContent) {
    parts.push({ text: textContent });
  }

  const response = await ai.models.generateContent({
    model: COMPLEX_MODEL,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isResume: { type: Type.BOOLEAN },
          rejectionMessage: { type: Type.STRING, description: "Detailed reason for rejection if isResume is false." },
          score: { type: Type.NUMBER },
          missingSections: { type: Type.ARRAY, items: { type: Type.STRING } },
          generalFeedback: { type: Type.STRING }
        },
        required: ["isResume", "rejectionMessage"]
      },
      systemInstruction: "You are an Elite AI Gatekeeper. You must reject anything that is not clearly a professional resume. Provide a clear reason for rejection."
    }
  });
  
  try {
    const cleaned = cleanJsonResponse(response.text || "{}");
    return JSON.parse(cleaned);
  } catch (e) {
    return { isResume: true, score: 70, rejectionMessage: "", missingSections: [], generalFeedback: "Validation failed, assuming valid." };
  }
};

export const generateSummarySuggestions = async (jobTitle: string, skills: string[]): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `Generate 3 distinct, professional resume summary options for a "${jobTitle}" with these skills: [${skills.join(', ')}].`,
    config: {
      systemInstruction: "Provide 3 high-quality summary options. Return as a JSON array of strings.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  
  try {
    const cleaned = cleanJsonResponse(response.text || "[]");
    return JSON.parse(cleaned);
  } catch (e) {
    return [];
  }
};

export const rewriteExperience = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `Rewrite this resume experience bullet point to use strong action verbs: "${text}"`,
    config: {
      systemInstruction: "Ensure the output is professional and suitable for an ATS-friendly resume.",
    }
  });
  return response.text?.trim() || text;
};

export const getResponsibilitiesSuggestions = async (jobTitle: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `Generate 6 professional resume bullet points for the job title: "${jobTitle}"`,
    config: {
      systemInstruction: "Provide high-impact, results-oriented bullet points. Return as a JSON array of strings.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  
  try {
    const cleaned = cleanJsonResponse(response.text || "[]");
    return JSON.parse(cleaned);
  } catch (e) {
    return [];
  }
};

export const getSkillSuggestions = async (jobTitle: string, existingSkills: string[] = []): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: `Suggest relevant skills for a "${jobTitle}".`,
    config: {
      systemInstruction: "Return a JSON array of 12 relevant skills.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  
  try {
    const cleaned = cleanJsonResponse(response.text || "[]");
    return JSON.parse(cleaned);
  } catch (e) {
    return [];
  }
};
