const callAiEndpoint = async (action: string, payload: any): Promise<any> => {
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...payload }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error(`AI Client Error (${action}):`, error);
        throw error;
    }
};

export const polishContent = async (content: string): Promise<string> => {
    try {
        return await callAiEndpoint('polishContent', { content });
    } catch (error) {
        return content;
    }
};

export const polishText = async (text: string): Promise<string> => {
    try {
        return await callAiEndpoint('polishText', { text });
    } catch (error) {
        return text;
    }
};

export const generateTags = async (content: string, title: string): Promise<string[]> => {
    try {
        return await callAiEndpoint('generateTags', { content, title });
    } catch (error) {
        return [];
    }
};
