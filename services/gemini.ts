
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, AnalyzerResult } from "../types";

// Always use direct process.env.API_KEY and correct initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const improveSummary = async (summary: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Improve the following professional resume summary for clarity, impact, and tone: "${summary}"`,
    config: {
      systemInstruction: "You are an expert HR recruiter and professional resume writer. Rewrite the text to be professional, punchy, and results-oriented.",
    }
  });
  // response.text is a getter, trim() is a string method.
  return response.text?.trim() || summary;
};

export const rewriteExperience = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Rewrite this resume experience bullet point to use strong action verbs and emphasize quantifiable results: "${text}"`,
    config: {
      systemInstruction: "Ensure the output is professional and suitable for an ATS-friendly resume.",
    }
  });
  return response.text?.trim() || text;
};

export const analyzeResume = async (resume: ResumeData): Promise<AnalyzerResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this resume data and provide feedback: ${JSON.stringify(resume)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          missingSections: { type: Type.ARRAY, items: { type: Type.STRING } },
          contentSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          atsScore: { type: Type.NUMBER },
          generalFeedback: { type: Type.STRING }
        },
        required: ["score", "missingSections", "contentSuggestions", "atsScore", "generalFeedback"]
      }
    }
  });
  
  try {
    // response.text is a getter
    return JSON.parse(response.text || '{}') as AnalyzerResult;
  } catch (e) {
    return {
      score: 0,
      missingSections: [],
      contentSuggestions: ["Could not parse analysis results."],
      atsScore: 0,
      generalFeedback: "Error analyzing resume."
    };
  }
};

export const generateCoverLetter = async (resume: ResumeData, jobDescription: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a professional cover letter for the following person based on their resume: ${JSON.stringify(resume.personalInfo)} ${JSON.stringify(resume.experience)}. Job Description: "${jobDescription}"`,
    config: {
      systemInstruction: "Write a 3-paragraph compelling cover letter that highlights key achievements mentioned in the resume.",
    }
  });
  return response.text || '';
};
