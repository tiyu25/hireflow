/// <reference types="node" />

import { verifyUser } from "./_lib/auth.js";
import { requestGeminiJson } from "./_lib/gemini.js";
import { parseJobText } from "./_lib/jobText.js";

// 채용공고를 바탕으로 AI 예상 면접 질문을 만들어주는 함수
const QUESTION_COUNT = 5;

const SYSTEM_PROMPT =
  `너는 채용 면접관이다. 주어진 채용공고를 바탕으로 지원자가 실제 면접에서 받을 가능성이 높은 예상 면접 질문을 한국어로 ${QUESTION_COUNT}개 만들어라. ` +
  '공고의 주요업무와 자격요건에 나온 구체적인 업무, 기술, 경험을 근거로 질문하고, ' +
  '자기소개나 지원동기처럼 어떤 공고에나 할 수 있는 일반적인 질문은 피하라. ' +
  '각 질문은 한 문장으로 간결하게 작성하라. ' +
  '다음 JSON 형식으로만 답하라: {"questions": string[]}';

export async function POST(request: Request): Promise<Response> {
  try {
    // 로그인 사용자인지 확인
    const isAuthenticated = await verifyUser(request);
    if (!isAuthenticated) {
      return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 채용공고 텍스트 검사
    const textResult = await parseJobText(request);
    if (textResult.error !== null) {
      return Response.json({ error: textResult.error }, { status: 400 });
    }

    // Gemini에게 분석 요청
    const aiResult = await requestGeminiJson(SYSTEM_PROMPT, textResult.jobText);
    if (aiResult.error !== null) {
      return Response.json({ error: aiResult.error }, { status: 500 });
    }

    return Response.json(aiResult.data);
  } catch (error) {
    console.error('서버 에러:', error);
    return Response.json({ error: '서버에서 오류가 발생했습니다.' }, { status: 500 });
  }
}
