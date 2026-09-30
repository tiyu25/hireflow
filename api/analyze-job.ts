/// <reference types="node" />

// 텍스트 길이 제한
const MAX_TEXT_LENGTH = 15000;

// 텍스트 최소 길이
const MIN_TEXT_LENGTH = 50;

const GEMINI_MODEL = 'gemini-3.5-flash-lite';

const SYSTEM_PROMPT =
  '너는 구직자를 돕는 채용공고 분석가다. 구직자가 공고를 빠르게 파악할 수 있도록 한국어 2~3문장으로 요약하라. ' +
  '첫 문장에는 어떤 경력 수준의 어떤 직무인지와 핵심 담당 업무를 담아라. ' +
  '둘째 문장에는 반드시 갖춰야 할 자격요건을 중요한 순서로 담아라. ' +
  '셋째 문장에는 지원자에게 유리한 우대사항을 담아라. ' +
  '"본 채용공고는", "~를 모집합니다" 같은 불필요한 서두는 쓰지 말고, 공고 내용을 그대로 나열하지 말고 핵심만 압축하라. ' +
  '공고에 없는 내용은 추측하지 마라. ' +
  '다음 JSON 형식으로만 답하라: {"summary": string}';

// Gemini 응답에서 사용하는 부분만 타입으로 정의
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

    // 앞뒤 공백을 제거한 뒤 길이 확인
    const trimmedText = body.text.trim();

    if (trimmedText.length < MIN_TEXT_LENGTH) {
      return Response.json(
        { error: `채용공고 내용을 ${MIN_TEXT_LENGTH}자 이상 입력해주세요.` },
        { status: 400 },
      );
    }

    const jobText = trimmedText.slice(0, MAX_TEXT_LENGTH);

    // Gemini에게 분석 요청
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
      return Response.json({ error: 'AI 분석 요청에 실패했습니다.' }, { status: 500 });
    }

    const aiData = (await aiResponse.json()) as GeminiResponse;
    const resultText = aiData.candidates[0].content.parts[0].text;
    const analysis: unknown = JSON.parse(resultText);

    return Response.json(analysis);
  } catch (error) {
    console.error('서버 에러:', error);
    return Response.json({ error: '서버에서 오류가 발생했습니다.' }, { status: 500 });
  }
}