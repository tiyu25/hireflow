/// <reference types="node" />

// 채용공고를 바탕으로 AI 예상 면접 질문을 만들어주는 함수
const MAX_TEXT_LENGTH = 15000;
const MIN_TEXT_LENGTH = 50;
const QUESTION_COUNT = 5;

const GEMINI_MODEL = 'gemini-3.5-flash-lite';

const SYSTEM_PROMPT =
  `너는 채용 면접관이다. 주어진 채용공고를 바탕으로 지원자가 실제 면접에서 받을 가능성이 높은 예상 면접 질문을 한국어로 ${QUESTION_COUNT}개 만들어라. ` +
  '공고의 주요업무와 자격요건에 나온 구체적인 업무, 기술, 경험을 근거로 질문하고, ' +
  '자기소개나 지원동기처럼 어떤 공고에나 할 수 있는 일반적인 질문은 피하라. ' +
  '각 질문은 한 문장으로 간결하게 작성하라. ' +
  '다음 JSON 형식으로만 답하라: {"questions": string[]}';

interface GeminiResponse {
    candidates: {
        content: {
            parts: { text: string }[];
        };
    }[];
}

export async function POST(request: Request): Promise<Response> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return Response.json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
        }

        const body = (await request.json()) as { text?: unknown };

        if (typeof body.text !== 'string') {
            return Response.json({ error: '채용공고 내용을 입력해주세요.' }, { status: 400 });
        }

        const trimmedText = body.text.trim();

        if (trimmedText.length < MIN_TEXT_LENGTH) {
            return Response.json(
                { error: `채용공고 내용을 ${MIN_TEXT_LENGTH}자 이상 입력해주세요.` },
                { status: 400 },
            );
        }

        const jobText = trimmedText.slice(0, MAX_TEXT_LENGTH);

        const aiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
                },
                body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [{ role: 'user', parts: [{ text: jobText }] }],
                generationConfig: { responseMimeType: 'application/json' },
                }),
            },
        );

        if (!aiResponse.ok) {
            const errorText = await aiResponse.text();
            console.error('Gemini 에러:', errorText);
            return Response.json({ error: 'AI 질문 생성 요청에 실패했습니다.' }, { status: 500 });
        }

        const aiData = (await aiResponse.json()) as GeminiResponse;
        const resultText = aiData.candidates[0].content.parts[0].text;
        const result: unknown = JSON.parse(resultText);

        return Response.json(result);
    } catch (error) {
        console.error('서버 에러:', error);
        return Response.json({ error: '서버에서 오류가 발생했습니다.' }, { status: 500 });
    }
}