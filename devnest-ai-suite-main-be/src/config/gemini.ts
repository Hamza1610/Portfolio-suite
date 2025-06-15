import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// List available models
const listModels = async () => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + API_KEY);
    const data = await response.json();
    console.log('Available models:', data);
    return data;
  } catch (error) {
    console.error('Error listing models:', error);
    throw error;
  }
};

// Call listModels when initializing
// listModels().catch(console.error);

export default genAI; 