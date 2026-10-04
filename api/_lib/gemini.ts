// Gemini 호출 함수

/// <reference types="node" />

const GEMINI_MODEL = 'gemini-3.5-flash-lite';

// Gemini 응답에서 사용하는 부분만 타입으로 정의
interface GeminiResponse {
candidates: {
    content: {
    parts: { text: string }[];
    };
}[];
}

type GeminiResult =
| { data: unknown; error: null }
| { data: null; error: string };

// 시스템 프롬프트와 입력 텍스트로 Gemini에 JSON 응답을 요청
export async function requestGeminiJson(systemPrompt: string, userText: string): Promise<GeminiResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { data: null, error: 'GEMINI_API_KEY가 설정되지 않았습니다.' };
    }

    const aiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: 'user', parts: [{ text: userText }] }],
                generationConfig: { responseMimeType: 'application/json' },
            }),
        },
    );

    if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('Gemini 에러:', errorText);
        return { data: null, error: 'AI 요청에 실패했습니다.' };
    }

    const aiData = (await aiResponse.json()) as GeminiResponse;
    const resultText = aiData.candidates[0].content.parts[0].text;
    const data: unknown = JSON.parse(resultText);

    return { data, error: null };
}