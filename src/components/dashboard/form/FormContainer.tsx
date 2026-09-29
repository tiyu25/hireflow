import { useEffect, useState } from "react";
import ButtonBase from "../../common/button/ButtonBase";
import InterviewQuestionSection, { type QuestionAnswer } from "./InterviewQuestionSection";
import JobInfoSection, { STATUS_TO_FIELDS } from "./JobInfoSection";
import MemoSection from "./MemoSection";

import PagePrev from "@/assets/images/page_prev_icn.svg";
import { supabase } from "../../../lib/supabase";
import { createApplication, createInterviewQuestions, deleteInterviewQuestions, getApplicationById, getInterviewQuestions, updateApplication } from "../../../api/applications";
import type { ApplicationStatus } from "../../../constants/ApplicationStatus";
import { useNavigate, useParams } from "react-router-dom";
import ShadowCard from "../ShadowCard";
import ButtonGroup from "../../common/button/ButtonGroup";
import LoadingOverlay from "../../common/loading/LoadingOverlay";

const FormContainer = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [status, setStatus] = useState<ApplicationStatus>("planned");
    const [url, setUrl] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [platform, setPlatform] = useState("saramin");
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [applicationDate, setApplicationDate] = useState<Date | null>(null);
    const [interviewDate, setInterviewDate] = useState<Date | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [questions, setQuestions] = useState<QuestionAnswer[]>([
        { question: "", answer: "" },
    ]);
    const [memo, setMemo] = useState("");

    const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // 수정 모드일 때 기존 데이터 불러오기
    useEffect(() => {
        if (!id) return;

        const applicationId = Number(id);

        const fetchExisting = async () => {
            try {
                const { data: application, error: applicationError } = await getApplicationById(applicationId);
                if (applicationError || !application) {
                    console.error(applicationError);
                    return;
                }
    
                setStatus(application.status);
                setUrl(application.url ?? "");
                setCompanyName(application.company_name ?? "");
                setJobTitle(application.job_title ?? "");
                setPlatform(application.platform ?? "saramin");
                setDeadline(application.deadline ? new Date(application.deadline) : null);
                setApplicationDate(application.application_date ? new Date(application.application_date) : null);
                setInterviewDate(application.interview_date ? new Date(application.interview_date) : null);
                setStartDate(application.start_date ? new Date(application.start_date) : null);
                setMemo(application.memo ?? "");
    
                const { data: questionsData, error: questionsError } = await getInterviewQuestions(applicationId);
                if (questionsError || !questionsData) {
                    console.error(questionsError);
                    return;
                }
                if (questionsData.length > 0) {
                    setQuestions(questionsData.map((q) => ({ question: q.question, answer: q.answer })))
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchExisting();
    }, [id]);

    // 필수 입력값 검사
    const validateForm = (): string | null => {
        const visibleFields = STATUS_TO_FIELDS[status];

        if (visibleFields.includes("url") && url.trim() === "") return "채용공고 URL을 입력해주세요.";
        if (visibleFields.includes("companyName") && companyName.trim() === "") return "회사명을 입력해주세요.";
        if (visibleFields.includes("jobTitle") && jobTitle.trim() === "") return "채용공고명을 입력해주세요.";
        if (visibleFields.includes("deadline") && !deadline) return "서류 마감일을 선택해주세요.";
        if (visibleFields.includes("applicationDate") && !applicationDate) return "서류 지원일을 선택해주세요.";
        if (visibleFields.includes("interviewDate") && !interviewDate) return "면접일을 선택해주세요."
        if (visibleFields.includes("startDate") && !startDate) return "출근 예정일을 선택해주세요."

        return null
    }

    const applicationInput = {
        status,
        url,
        companyName,
        jobTitle,
        platform,
        deadline,
        applicationDate,
        interviewDate,
        startDate,
        memo,
    };

    // 등록
    const handleCreate = async () => {
        // 현재 로그인한 사용자 정보 가져오기
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        const { data: application, error: applicationError } = await createApplication({
            userId: userData.user.id,
            ...applicationInput,
        });

        if (applicationError || !application) {
            alert("등록에 실패했습니다.");
            console.error(applicationError);
            return;
        }

        const { error: questionsError } = await createInterviewQuestions(application.id, questions);
        if (questionsError) {
            alert("면접 질문 등록에 실패했습니다.");
            console.error(questionsError);
            return;
        }

        alert("등록되었습니다.");
        navigate(`/dashboard/detail/${application.id}`);
    }

    // 수정
    const handleUpdate = async (applicationId: number) => {
        const { error: updateError } = await updateApplication(applicationId, applicationInput);
        if (updateError) {
            alert("수정에 실패했습니다.");
            console.error(updateError);
            return;
        }

        const { error: deleteError } = await deleteInterviewQuestions(applicationId);
        if (deleteError) {
            alert("면접 질문 수정에 실패했습니다.");
            console.error(deleteError);
            return;
        }

        const { error: questionsError } = await createInterviewQuestions(applicationId, questions);
        if (questionsError) {
            alert("면접 질문 수정에 실패했습니다.");
            console.error(questionsError);
            return;
        }

        alert("수정되었습니다.");
        navigate(`/dashboard/detail/${applicationId}`);
    }


    const handleSubmit = async () => {
        if (isSubmitting) return; // 중복 실행 방지 이미 저장 중이면 무시

        // 필수값 검사
        const errorMsg = validateForm();
        if (errorMsg) {
            alert(errorMsg);
            return;
        }

        setIsSubmitting(true);

        try {
            if (id) {
                await handleUpdate(Number(id));
            } else {
                await handleCreate();
            }
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <div className="bg-[#F7FAFE] pb-10 xl:pb-18">
            <LoadingOverlay isVisible={isLoading || isSubmitting} />
            <button 
                className="p-7 cursor-pointer"
                onClick={() => navigate(-1)}
            >
                <img src={PagePrev} alt="" />
            </button>
            <div className="w-full xl:w-250 mx-auto xl:px-0 px-8">
                <strong className="block text-xl xl:text-3xl text-center mb-7 md:mb-10">{isEditMode ? "일정 수정" : "일정 등록"}</strong>
                <div className="flex flex-col gap-4">
                    {/* 채용 정보 */}
                    <ShadowCard>
                        <JobInfoSection
                            status={status} onStatusChange={setStatus}
                            url={url} onUrlChange={setUrl}
                            companyName={companyName} onCompanyNameChange={setCompanyName}
                            jobTitle={jobTitle} onJobTitleChange={setJobTitle}
                            platform={platform} onPlatformChange={setPlatform}
                            deadline={deadline} onDeadlineChange={setDeadline}
                            applicationDate={applicationDate} onApplicationDateChange={setApplicationDate}
                            interviewDate={interviewDate} onInterviewDateChange={setInterviewDate}
                            startDate={startDate} onStartDateChange={setStartDate}
                        />
                    </ShadowCard>
                    {/* 예상 면접 질문 */}
                    <ShadowCard>
                        <InterviewQuestionSection
                            questions={questions} onQuestionsChange={setQuestions}
                        />
                    </ShadowCard>
                    {/* 메모 */}
                    <ShadowCard>
                        <MemoSection 
                            memo={memo} onMemoChange={setMemo}
                        />
                    </ShadowCard>
                </div>
            </div>
            <ButtonGroup>
                <ButtonBase
                    base="base2"
                    className="bg-primary text-white"
                    onClick={handleSubmit}
                >
                    {isEditMode ? "수정하기" : "등록하기"}
                </ButtonBase>
            </ButtonGroup>
        </div>
    )
}
export default FormContainer;