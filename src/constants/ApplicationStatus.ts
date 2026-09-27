import PlannedIcn from "@/assets/images/planned_icn.svg"
import AppliedIcn from "@/assets/images/applied_icn.svg"
import InterviewIcn from "@/assets/images/interview_icn.svg"
import WaitingIcn from "@/assets/images/waiting_icn.svg"
import HiredIcn from "@/assets/images/hired_icn.svg"
import RejectedIcn from "@/assets/images/rejected_icn.svg"

export const APPLICATION_STATUS = {
    planned: {
        label: "지원 예정",
        icon: PlannedIcn,
        className: "bg-gray-f9 text-gray-9"
    },
    applied: {
        label: "서류 지원 완료",
        icon: AppliedIcn,
        className: "bg-[#F7FCF8] text-[#5AC96C]"
    },
    interview: {
        label: "면접 예정",
        icon: InterviewIcn,
        className: "bg-[#F3F5FB] text-[#5A6AC9]"
    },
    pendingInterview: {
        label: "면접 결과 대기",
        icon: WaitingIcn,
        className: "bg-[#FBF7FC] text-[#AF5AC9]"
    },
    finalPass: {
        label: "최종 합격",
        icon: HiredIcn,
        className: "bg-[#F7FAFE] text-[#0077FF]"
    },
    reject: {
        label: "불합격",
        icon: RejectedIcn,
        className: "bg-gray-f9 text-gray-8"
    },
} as const;

export type ApplicationStatus = keyof typeof APPLICATION_STATUS;