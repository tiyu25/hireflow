import { supabase } from "../lib/supabase";

interface JobSummaryResult {
    summary: string | null;
    error: string | null;
}

export const summarizeJobDetails = async (jobDetails: string): Promise<JobSummaryResult> => {
    try {
        // 현재 로그인 세션에서 토큰 꺼내기
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) {
            return { summary: null, error: "로그인이 필요합니다." };
        }

        const response = await fetch("/api/analyze-job", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: jobDetails }),
        });

        const data = (await response.json()) as { summary?: string; error?: string };

        if (!response.ok || !data.summary) {
            return { summary: null, error: data.error ?? "요약에 실패했습니다." };
        }

        return { summary: data.summary, error: null };
    } catch {
        // 네트워크 오류나 JSON 응답이 아닌 경우
        return { summary: null, error: "요약 요청 중 문제가 발생했습니다." };
    }
}