import { supabase } from "../lib/supabase";

interface GenerateQuestionsResult {
    questions: string[] | null;
    error: string | null;
}

// 채용공고 내용을 AI 예상 면접 질문을 받아옴
export const generateInterviewQuestions = async (jobDetails: string): Promise<GenerateQuestionsResult> => {
    try {
        // 현재 로그인 세션에서 토큰 꺼내기
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) {
            return { questions: null, error: '로그인이 필요합니다.' };
        }

        const response = await fetch("/api/generate-questions", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: jobDetails }),
        });

        const data = (await response.json()) as { questions?: unknown; error?: string };

        if (!response.ok || !Array.isArray(data.questions)) {
            return { questions: null, error: data.error ?? "질문 생성에 실패했습니다." };
        }

        const questions = data.questions.filter(
            (question): question is string => typeof question === "string"
        );

        return { questions, error: null };
    } catch {
        return { questions: null, error: "질문 생성 요청 중 문제가 발생했습니다." };
    }
};