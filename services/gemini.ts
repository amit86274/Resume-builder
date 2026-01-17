
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
  // Use response.text property directly
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
  // Use response.text property directly
  return response.text?.trim() || text;
};

/**
 * Enhanced analysis with document type validation.
 * First checks if content is a resume, then performs ATS analysis.
 */
export const analyzeResumeATS = async (filename: string, content: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Upgraded to gemini-3-pro-preview for complex reasoning tasks like resume analysis
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this document. 
    STEP 1: Determine if it is a professional resume/CV. 
    STEP 2: If it IS a resume, perform a deep ATS analysis. 
    Filename: ${filename}. 
    Content: "${content}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isResume: { 
            type: Type.BOOLEAN, 
            description: "Strictly true if the content is a professional resume, CV, or LinkedIn profile export. False for everything else (essays, recipes, photos, generic letters)." 
          },
          rejectionMessage: { 
            type: Type.STRING, 
            description: "If isResume is false, explain why (e.g., 'This document appears to be a school essay rather than a professional resume')." 
          },
          score: { type: Type.NUMBER, description: "Overall quality score 0-100" },
          missingSections: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sections needed for ATS compliance" },
          contentSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific free-text improvements" },
          atsScore: { type: Type.NUMBER, description: "Technical parsing score 0-100" },
          generalFeedback: { type: Type.STRING, description: "Executive summary of the resume quality" }
        },
        required: ["isResume", "score", "missingSections", "contentSuggestions", "atsScore", "generalFeedback"]
      },
      systemInstruction: `Act as a senior Recruiter and ATS Expert. 
      VALIDATION IS CRITICAL: If the input content lacks work history, education history, or contact details, set isResume to false.
      If it is a resume, analyze it for:
      1. Action-oriented language.
      2. Quantifiable metrics.
      3. Section hierarchy.
      4. Keyword density relevant to the filename/title.`
    }
  });
  
  try {
    // response.text property returns the extracted string output
    return JSON.parse(response.text || '{}');
  } catch (e) {
    // Fallback if AI output is malformed
    return {
      isResume: true,
      score: 0,
      missingSections: [],
      contentSuggestions: [],
      atsScore: 0,
      generalFeedback: "Analysis encountered an error."
    };
  }
};