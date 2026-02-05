import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { env } from '@/config/env';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
    if (aiInstance) return aiInstance;
    const key = env.GEMINI_API_KEY;
    if (!key) {
        console.error('Gemini API Key missing! Set GEMINI_API_KEY environment variable');
        return null;
    }
    aiInstance = new GoogleGenAI({ apiKey: key });
    return aiInstance;
};

export async function POST(request: Request) {
    const ai = getAI();
    if (!ai) {
        return apiError('Gemini API Key is missing on the server.', 500);
    }

    try {
        const { action, content, title, text } = await request.json();

        switch (action) {
            case 'generateSummary': {
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: `Summarize the following technical portfolio content into a concise, 2-sentence excerpt suitable for a preview card:\n\n${content}`,
                });
                return apiSuccess(
                    { result: response.text || '' },
                    'Summary generated successfully'
                );
            }

            case 'polishContent': {
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: `You are a technical editor. Improve the grammar, flow, and clarity of the following MDX/Markdown content while preserving all code blocks and markdown syntax exactly:\n\n${content}`,
                });
                return apiSuccess(
                    { result: response.text || content },
                    'Content polished successfully'
                );
            }

            case 'polishText': {
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: `You are a professional copywriter. Rewrite the following text to be more engaging, professional, and concise. Return only the polished text without quotes:\n\n${text}`,
                });
                return apiSuccess(
                    { result: response.text?.trim() || text },
                    'Text polished successfully'
                );
            }

            case 'generateTags': {
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: `Analyze the following technical content and title. Generate a list of 5-8 relevant, comma-separated tags (keywords) for a developer portfolio. Return ONLY the comma-separated string, no other text.

Title: ${title}

Content: ${content}`,
                });
                const tagsText = response.text || '';
                const tags = tagsText
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
                return apiSuccess({ result: tags }, 'Tags generated successfully');
            }

            default:
                return apiError('Invalid action', 400);
        }
    } catch (error: any) {
        console.error('API Gemini Error:', error);
        return apiError(error.message || 'Internal Server Error', 500);
    }
}
