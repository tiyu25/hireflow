// 텍스트 길이 제한
const MAX_TEXT_LENGTH = 15000;

const GEMINI_MODEL = 'gemini-3.5-flash-lite';

const SYSTEM_PROMPT =
  '너는 채용공고 분석가다. 주어진 채용공고 텍스트를 분석해서 다음 JSON 형식으로만 답하라: ' +
  '{"companyName": string, "position": string, "requiredSkills": string[], ' +
  '"preferredSkills": string[], "responsibilities": string[], "summary": string}';

// Gemini 응답에서 사용하는 부분만 타입으로 정의
interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

// HTML에서 태그를 제거하고 텍스트만 뽑아내는 함수
function extractText(html: string): string {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
  const withoutTags = withoutScripts.replace(/<[^>]+>/g, ' ');
  const cleaned = withoutTags.replace(/\s+/g, ' ').trim();
  return cleaned.slice(0, MAX_TEXT_LENGTH);
}

// http/https로 시작하는 올바른 URL인지 확인하는 함수
function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
    }

    const body = (await request.json()) as { url?: unknown };
    const url = body.url;

    if (typeof url !== 'string' || !isValidUrl(url)) {
      return Response.json({ error: '올바른 URL이 아닙니다.' }, { status: 400 });
    }

    // 1. 채용공고 페이지의 HTML 가져오기
    const pageResponse = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!pageResponse.ok) {
      return Response.json({ error: '채용공고 페이지를 불러오지 못했습니다.' }, { status: 502 });
    }

    const html = await pageResponse.text();
    const text = extractText(html);

    if (text.length < 200) {
      return Response.json(
        { error: '공고 내용을 읽을 수 없는 페이지입니다. 내용을 직접 붙여넣어 주세요.' },
        { status: 422 },
      );
    }

    // 2. Gemini에게 분석 요청
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
          contents: [{ role: 'user', parts: [{ text }] }],
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