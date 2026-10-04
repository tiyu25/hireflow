/// <reference types="node" />

import { verifyUser } from "./_lib/auth.js";
import { requestGeminiJson } from "./_lib/gemini.js";
import { parseJobText } from "./_lib/jobText.js";

const SYSTEM_PROMPT =
  '너는 구직자를 돕는 채용공고 분석가다. 구직자가 공고를 빠르게 파악할 수 있도록 한국어 2~3문장으로 요약하라. ' +
  '첫 문장에는 어떤 경력 수준의 어떤 직무인지와 핵심 담당 업무를 담아라. ' +
  '둘째 문장에는 반드시 갖춰야 할 자격요건을 중요한 순서로 담아라. ' +
  '셋째 문장에는 지원자에게 유리한 우대사항을 담아라. ' +
  '"본 채용공고는", "~를 모집합니다" 같은 불필요한 서두는 쓰지 말고, 공고 내용을 그대로 나열하지 말고 핵심만 압축하라. ' +
  '공고에 없는 내용은 추측하지 마라. ' +
  '다음 JSON 형식으로만 답하라: {"summary": string}';

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