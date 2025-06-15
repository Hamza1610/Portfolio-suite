import genAI from '../config/gemini';

// Email Generation
export const generateEmail = async (data: {
  category: string;
  purpose: string;
  recipientName?: string;
  additionalContext?: string;
}): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const prompt = `
    Generate a professional ${data.category} email with the following details:
    Purpose: ${data.purpose}
    ${data.recipientName ? `Recipient: ${data.recipientName}` : ''}
    ${data.additionalContext ? `Additional Context: ${data.additionalContext}` : ''}

    Requirements:
    1. Use a professional and appropriate tone for ${data.category} communication
    2. Include a clear subject line
    3. Structure the email with proper greeting, body, and closing
    4. Keep the content concise and focused on the purpose
    5. Include a professional signature
    6. Format the email in a way that's ready to be sent

    Format the response as a complete email with subject line and proper formatting.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Resume Generation
export const generateResume = async (data: {
  roleTitle: string;
  targetCompany: string;
  jobDescription?: string;
  personalHighlights?: string;
}): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const prompt = `
    Create an ATS-optimized resume for a ${data.roleTitle} position at ${data.targetCompany}.
    ${data.jobDescription ? `Job Description: ${data.jobDescription}` : ''}
    ${data.personalHighlights ? `Personal Highlights: ${data.personalHighlights}` : ''}

    Requirements:
    1. Format the resume in a clear, professional structure
    2. Include sections for: Professional Summary, Experience, Skills, Education
    3. Optimize keywords for ATS systems
    4. Focus on achievements and measurable results
    5. Use action verbs and industry-specific terminology
    6. Keep the content concise and impactful
    7. Format in a way that's easy to read and scan

    Format the response as a complete resume with proper sections and formatting.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Cover Letter Generation
export const generateCoverLetter = async (data: {
  roleTitle: string;
  targetCompany: string;
  hiringManager?: string;
  jobDescription?: string;
  personalMotivation?: string;
}): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const prompt = `
    Create a compelling cover letter for a ${data.roleTitle} position at ${data.targetCompany}.
    ${data.hiringManager ? `Hiring Manager: ${data.hiringManager}` : ''}
    ${data.jobDescription ? `Job Description: ${data.jobDescription}` : ''}
    ${data.personalMotivation ? `Personal Motivation: ${data.personalMotivation}` : ''}

    Requirements:
    1. Write in a professional yet engaging tone
    2. Include a strong opening that captures attention
    3. Connect personal experience to the role requirements
    4. Show enthusiasm for the company and position
    5. Include specific examples of relevant achievements
    6. End with a strong call to action
    7. Format as a proper business letter

    Format the response as a complete cover letter with proper business letter formatting.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Refine Content
export const refineContent = async (
  content: string,
  type: 'email' | 'resume' | 'cover-letter',
  improvements: string[] = []
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  
  const prompt = `
    Refine the following ${type} to improve:
    ${improvements.join(', ')}

    Original content:
    ${content}

    Requirements:
    1. Maintain the original format and structure
    2. Enhance clarity and impact
    3. Improve professional tone
    4. Strengthen key points
    5. Optimize for the intended purpose
    6. Keep the same length and style

    Provide the refined content with the same formatting as the original.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}; 