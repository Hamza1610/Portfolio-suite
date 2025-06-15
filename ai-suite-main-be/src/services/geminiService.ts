import genAI from '../config/gemini';

// Generate content using Gemini AI
export const generateContent = async (prompt: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Generate a blog post using Gemini AI
export const generateBlogPost = async (
  topic: string,
  tone: string,
  length: string,
  keywords: string[] = []
): Promise<{
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}> => {
  const prompt = `
    Write a ${tone} blog post about "${topic}" with approximately ${length} words.
    ${keywords.length > 0 ? `Include these keywords: ${keywords.join(', ')}.` : ''}
    
    The response should be in the following format:
    TITLE: [Your engaging title here]
    EXCERPT: [A brief 2-3 sentence summary]
    CONTENT: [The full blog post content in HTML format with proper headings and paragraphs]
    TAGS: [Comma-separated list of relevant tags]
  `;

  const result = await generateContent(prompt);
  
  // Parse the response
  const titleMatch = result.match(/TITLE: (.*?)(?=\n|$)/);
  const excerptMatch = result.match(/EXCERPT: (.*?)(?=\n|$)/);
  const contentMatch = result.match(/CONTENT: ([\s\S]*?)(?=\nTAGS:|$)/);
  const tagsMatch = result.match(/TAGS: (.*?)(?=\n|$)/);

  return {
    title: titleMatch?.[1]?.trim() || `A ${tone} Guide to ${topic}`,
    excerpt: excerptMatch?.[1]?.trim() || `Explore ${topic} in this comprehensive ${tone} guide.`,
    content: contentMatch?.[1]?.trim() || result,
    tags: tagsMatch?.[1]?.split(',').map(tag => tag.trim()) || [topic, tone]
  };
};

// Refine blog content using Gemini AI
export const refineBlogContent = async (
  content: string,
  tone: string,
  improvements: string[] = []
): Promise<string> => {
  const prompt = `
    Refine the following blog content to be more ${tone}.
    ${improvements.length > 0 ? `Focus on these improvements: ${improvements.join(', ')}.` : ''}
    
    Original content:
    ${content}
    
    Provide the refined content in HTML format, maintaining the same structure but improving clarity, flow, and engagement.
  `;

  return generateContent(prompt);
};

// Generate SEO meta tags using Gemini AI
export const generateMetaTags = async (
  title: string,
  content: string
): Promise<{
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}> => {
  const prompt = `
    Generate SEO meta tags for a blog post titled "${title}" with the following content:
    ${content}
    
    Provide the response in this format:
    META_TITLE: [SEO-optimized title]
    META_DESCRIPTION: [SEO-optimized description under 160 characters]
    KEYWORDS: [Comma-separated list of relevant keywords]
  `;

  const result = await generateContent(prompt);
  
  const metaTitleMatch = result.match(/META_TITLE: (.*?)(?=\n|$)/);
  const metaDescMatch = result.match(/META_DESCRIPTION: (.*?)(?=\n|$)/);
  const keywordsMatch = result.match(/KEYWORDS: (.*?)(?=\n|$)/);

  return {
    metaTitle: metaTitleMatch?.[1]?.trim() || title,
    metaDescription: metaDescMatch?.[1]?.trim() || content.substring(0, 160),
    keywords: keywordsMatch?.[1]?.split(',').map(k => k.trim()) || []
  };
}; 