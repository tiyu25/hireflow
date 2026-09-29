import type { Application } from "../api/applications";

export const getDday = (deadline: string | null): string => {
    if (!deadline) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(deadline);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "D-DAY";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
}

export const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}. ${mm}. ${dd}`;
};

type DdayInfo = {
    label: string;
    dday: string;
}

// 상태에 따라 D-day 보여줄지
export const getDdayInfo = (application: Application): DdayInfo | null => {
    if (application.status === "planned" || application.status === "applied") {
        return { label: "서류 마감", dday: getDday(application.deadline) }
    }
    if (application.status === "interview") {
        return { label: "면접", dday: getDday(application.interview_date) };
    }
    return null;
}