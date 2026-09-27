import type { QuestionAnswer } from "../components/dashboard/form/InterviewQuestionSection";
import type { ApplicationStatus } from "../constants/ApplicationStatus";
import { supabase } from "../lib/supabase";

interface CreateApplicationInput {
    userId: string;
    status: ApplicationStatus;
    url: string;
    companyName: string;
    jobTitle: string;
    platform: string;
    deadline: Date | null;
    applicationDate: Date | null;
    interviewDate: Date | null;
    startDate: Date | null;
    memo: string;
}

// 채용 일정 생성
export const createApplication = async (input: CreateApplicationInput) => {
    return supabase
        .from("applications")
        .insert({
            user_id: input.userId,
            status: input.status,
            url: input.url,
            company_name: input.companyName,
            job_title: input.jobTitle,
            platform: input.platform,
            deadline: input.deadline,
            application_date: input.applicationDate,
            interview_date: input.interviewDate,
            start_date: input.startDate,
            memo: input.memo,
        })
        .select()
        .single();
}

// 예상 면접 질문 생성
export const createInterviewQuestions = async (applicationId: number, questions: QuestionAnswer[]) => {
    const validQuestions = questions.filter((qa) => qa.question.trim() !== "");
    if (validQuestions.length === 0) return { error: null };

    return supabase.from("interview_questions").insert(
        validQuestions.map((qa) => ({
            application_id: applicationId,
            question: qa.question,
            answer: qa.answer,
        }))
    );
}




export interface Application {
    id: number;
    user_id: string;
    status: ApplicationStatus;
    url: string | null;
    company_name: string | null;
    job_title: string | null;
    platform: string | null;
    deadline: string | null;
    application_date: string | null;
    interview_date: string | null;
    start_date: string | null;
    memo: string | null;
    created_at: string;
}
// (GET) 채용 일정 가져오기
export const getApplications = async (userId: string) => {
    return supabase
        .from("applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
}


// (GET) 지원 내역 단일 조회
export const getApplicationById = async (id: number) => {
    return supabase
            .from("applications")
            .select("*")
            .eq("id", id)
            .single();
};

// (GET) 지원 내역 -> 면접 질문 목록 조회
export interface InterviewQuestion {
    id: number;
    application_id: number;
    question: string;
    answer: string;
}
export const getInterviewQuestions = async (applicationId: number) => {
    return supabase
            .from("interview_questions")
            .select("*")
            .eq("application_id", applicationId)
            .order("id", { ascending: true })
}

// (PUT) 지원 내역 수정
export const updateApplication = async (id: number, input: Omit<CreateApplicationInput, "userId">) => {
    return supabase
            .from("applications")
            .update({
                status: input.status,
                url: input.url,
                company_name: input.companyName,
                job_title: input.jobTitle,
                platform: input.platform,
                deadline: input.deadline,
                application_date: input.applicationDate,
                interview_date: input.interviewDate,
                start_date: input.startDate,
                memo: input.memo
            })
            .eq("id", id);
}

// (PUT) 예상 면접 질문 수정
export const deleteInterviewQuestions = async (applicationId: number) => {
    return supabase
            .from("interview_questions")
            .delete()
            .eq("application_id", applicationId);
};

// (DEL) 지원 내역 삭제
export const deleteApplication = async (id: number) => {
    // interview_questions 먼저 삭제
    const { error: questionError } = await supabase
        .from("interview_questions")
        .delete()
        .eq("application_id", id);
    
    if (questionError) return { error: questionError }

    // applications 삭제
    const { error: applicationError } = await supabase
        .from("applications")
        .delete()
        .eq("id", id);

    return { error: applicationError };
}