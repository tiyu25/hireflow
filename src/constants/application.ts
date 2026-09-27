import type { ApplicationStatus } from "./ApplicationStatus"

// 지원 플랫폼 한글 라벨
export const PLATFORM_LABELS: Record<string, string> = {
    saramin: "사람인",
    jobkorea: "잡코리아",
    wanted: "원티드",
}

// 지원 현황 한글 라벨
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
    planned: "지원 예정",
    applied: "서류 지원",
    pendingInterview: "면접 대기",
    interview: "면접 예정",
    finalPass: "최종 합격",
    reject: "불합격",
}