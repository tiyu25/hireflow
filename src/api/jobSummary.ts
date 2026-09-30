interface JobSummaryResult {
    summary: string | null;
    error: string | null;
}

export const summarizeJobDetails = async (jobDetails: string): Promise<JobSummaryResult> => {
    try {
        const response = await fetch("/api/analyze-job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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