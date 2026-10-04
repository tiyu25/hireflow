// 텍스트 검사 함수
const MAX_TEXT_LENGTH = 15000;
const MIN_TEXT_LENGTH = 50;

type JobTextResult =
  | { jobText: string; error: null }
  | { jobText: null; error: string };


// 채용공고 텍스트 꺼내고 길이 검사
export async function parseJobText(request: Request): Promise<JobTextResult> {
    const body = (await request.json()) as { text?: unknown };

    if (typeof body.text !== 'string') {
        return { jobText: null, error: '채용공고 내용을 입력해주세요.' };
    }

    // 앞 뒤 공백을 제거한 뒤 길이 확인
    const trimmedText = body.text.trim();

    if (trimmedText.length < MIN_TEXT_LENGTH) {
        return { jobText: null, error: `채용공고 내용을 ${MIN_TEXT_LENGTH}자 이상 입력해주세요.` };
    }

    return { jobText: trimmedText.slice(0, MAX_TEXT_LENGTH), error: null };
}