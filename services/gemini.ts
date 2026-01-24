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
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        maxOutputTokens: 12000, 
        responseMimeType: "application/json",
      }
    });

    const rawText = response.text || "{}";
    const cleaned = cleanJsonResponse(rawText);
    const parsed = JSON.parse(cleaned);
    
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

export const finalizeAndPolishResume = async (data: ResumeData): Promise<ResumeData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `FINAL POLISH: Review this resume data.
  1. Fix minor grammatical errors or spelling mistakes.
  2. Make experience bullet points more impactful using strong action verbs.
  3. Ensure the summary is executive-level and professional.
  4. Correct any formatting inconsistencies in the text.
  
  Return the exact same JSON structure but with polished text content.
  DATA: ${JSON.stringify(data)}`;

  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const polished = JSON.parse(cleanJsonResponse(response.text || "{}"));
    return { ...data, ...polished };
  } catch (e) {
    return data;
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
    return { isResume: true, score: 70 };
  }
};

export const simulateATSAnalysis = async (fileData: { data: string, mimeType: string }): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `ACT AS AN ADVANCED ATS (Applicant Tracking System).
  Scan the provided resume file and provide a deep simulation report in JSON format.
  
  REQUIRED JSON STRUCTURE:
  {
    "score": number (0-100),
    "extractedText": "Short snippet of how the ATS reads the raw text",
    "parsingStatus": "Success" | "Partial" | "Failure",
    "criticalIssues": string[],
    "foundSections": string[],
    "missingSections": string[],
    "formattingScore": number (0-100),
    "keywordAnalysis": {
      "strengths": string[],
      "weaknesses": string[]
    },
    "optimizationChecklist": {
      "item": string,
      "status": "pass" | "fail",
      "fix": string
    }[]
  }
  
  Consider: Non-standard fonts, tables, complex headers, images, and keyword density.`;

  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: fileData }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    
    const cleaned = cleanJsonResponse(response.text || "{}");
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("ATS Simulation Error:", e);
    throw new Error("The AI failed to simulate ATS parsing. The file might be corrupted or unreadable.");
  }
};

export const analyzeRejectionReasons = async (fileData: { data: string, mimeType: string }): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `ACT AS A BRUTALLY HONEST EXECUTIVE RECRUITER with 20 years of experience at top firms like Google, McKinsey, and Goldman Sachs.
  Audit this resume to explain EXACTLY why a candidate might NOT be getting interview calls.
  
  Look for:
  1. "Red Flags": Employment gaps, job hopping, lack of progression.
  2. "Recruiter Dislikes": Poor formatting, generic summaries, fluff words (e.g., 'hardworking', 'team player'), wall of text.
  3. "Missing Impact": Duties instead of accomplishments, lack of numbers/metrics.
  4. "Technical Gaps": Obsolete tech, missing core industry skills.

  REQUIRED JSON STRUCTURE:
  {
    "brutalVerdict": "A 2-sentence harsh but helpful overview",
    "callProbability": number (0-100),
    "redFlags": { "issue": string, "impact": "High" | "Medium", "fix": string }[],
    "recruiterPetPeeves": string[],
    "missingImpactStatements": string[],
    "top3Fixes": string[]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: COMPLEX_MODEL,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: fileData }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    
    const cleaned = cleanJsonResponse(response.text || "{}");
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Call Analyzer Error:", e);
    throw new Error("The AI failed to audit the recruiter's perspective.");
  }
};

export const generateInterviewPrep = async (fileData: { data: string, mimeType: string }): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `ACT AS AN EXPERT TECHNICAL INTERVIEWER from a top firm.
  Analyze this resume and generate a highly personalized interview preparation guide.
  
  Predict 10 questions based on their specific experience, skills, and potential industry.
  Include:
  1. 3 Behavioral questions (STAR method focus).
  2. 4 Technical questions (based on their tech stack).
  3. 3 "Curveball" or "Cultural Fit" questions.
  
  REQUIRED JSON STRUCTURE:
  {
    "predictedQuestions": {
       "type": "Behavioral" | "Technical" | "Cultural",
       "question": string,
       "whyAsked": string,
       "modelAnswer": string,
       "keyKeywords": string[]
    }[],
    "interviewStrategy": string,
    "confidenceBooster": string
  }`;

  try {
    const response = await ai.models.generateContent({
      model: COMPLEX_MODEL,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: fileData }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    
    const cleaned = cleanJsonResponse(response.text || "{}");
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Interview Prep Error:", e);
    throw new Error("Failed to generate interview preparation materials.");
  }
};

export const analyzeSkillGap = async (fileData: { data: string, mimeType: string }, jobDescription: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `ACT AS A SENIOR CAREER ARCHITECT.
  Analyze the provided resume against this Target Job Description: "${jobDescription}".
  
  Map out exactly where the user stands, where the job requirements are, and how to bridge the gap.
  
  REQUIRED JSON STRUCTURE:
  {
    "matchScore": number (0-100),
    "summary": "Short overview of compatibility",
    "skillsMap": {
       "skill": string,
       "userLevel": number (0-10),
       "requiredLevel": number (0-10),
       "status": "Match" | "Gap" | "Surplus"
    }[],
    "priorityGaps": string[],
    "learningPath": {
       "topic": string,
       "resourceType": "Course" | "Project" | "Certification",
       "effort": "Low" | "Medium" | "High",
       "description": string
    }[],
    "missingKeywords": string[]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: COMPLEX_MODEL,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: fileData }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    
    const cleaned = cleanJsonResponse(response.text || "{}");
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Skill Gap Analysis Error:", e);
    throw new Error("Failed to analyze skill gap.");
  }
};

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