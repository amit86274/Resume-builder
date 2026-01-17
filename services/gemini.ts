import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, AnalyzerResult } from "../types";

export const improveSummary = async (summary: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Improve the following professional resume summary for clarity, impact, and tone: "${summary}"`,
    config: {
      systemInstruction: "You are an expert HR recruiter. Rewrite the text to be professional, punchy, and results-oriented. Use action verbs and highlight seniority.",
    }
  });
  return response.text?.trim() || summary;
};

export const rewriteExperience = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Rewrite this resume experience bullet point to use strong action verbs and emphasize quantifiable results: "${text}"`,
    config: {
      systemInstruction: "Ensure the output is professional and suitable for an ATS-friendly resume. Focus on X-Y-Z formula: Accomplished [X] as measured by [Y], by doing [Z].",
    }
  });
  return response.text?.trim() || text;
};

/**
 * Enhanced analysis with strict document type validation.
 * First checks if content is a resume, then performs ATS analysis.
 */
export const analyzeResumeATS = async (filename: string, content: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the provided text.
    
    PRIMARY TASK: Is this a Resume, CV, or LinkedIn Profile?
    
    CRITERIA FOR REJECTION (isResume: false):
    - It is a recipe, book chapter, poem, or song lyrics.
    - It is a casual letter or email without structured work history.
    - It is a technical manual or purely academic paper.
    - It lacks ANY of the following: Contact Info, Work Experience, or Education history.
    
    Filename: ${filename}
    Document Text: "${content}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isResume: { 
            type: Type.BOOLEAN, 
            description: "Strictly true ONLY if the content is a professional resume/CV. False for any other document type." 
          },
          rejectionMessage: { 
            type: Type.STRING, 
            description: "A professional reason explaining why the document was rejected if isResume is false." 
          },
          score: { type: Type.NUMBER, description: "Overall quality score 0-100" },
          missingSections: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sections needed for ATS compliance" },
          contentSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific improvements" },
          atsScore: { type: Type.NUMBER, description: "Technical parsing score 0-100" },
          generalFeedback: { type: Type.STRING, description: "Summary of the resume quality" }
        },
        required: ["isResume", "score", "missingSections", "contentSuggestions", "atsScore", "generalFeedback"]
      },
      systemInstruction: `You are a strict ATS (Applicant Tracking System) Validation Gatekeeper. 
      Your first and most important job is to filter out non-resume content. 
      Users might try to upload random text, essays, or recipes to test the system. 
      Only return isResume: true if you see a clear intent to present professional credentials.
      If it is a resume, provide deep technical analysis for ATS compatibility.`
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {
      isResume: false,
      rejectionMessage: "Document analysis failed. Please ensure you are uploading a standard PDF/Word resume.",
      score: 0,
      missingSections: [],
      contentSuggestions: [],
      atsScore: 0,
      generalFeedback: ""
    };
  }
};