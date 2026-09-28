import { useEffect, useState } from "react";
import ButtonBase from "../../common/button/ButtonBase";
import FormCard from "./FormCard";
import InterviewQuestionSection, { type QuestionAnswer } from "./InterviewQuestionSection";
import JobInfoSection, { STATUS_TO_FIELDS } from "./JobInfoSection";
import MemoSection from "./MemoSection";

import PagePrev from "@/assets/images/page_prev_icn.svg";
import { supabase } from "../../../lib/supabase";
import { createApplication, createInterviewQuestions, deleteInterviewQuestions, getApplicationById, getInterviewQuestions, updateApplication } from "../../../api/applications";
import type { ApplicationStatus } from "../../../constants/ApplicationStatus";
import { useNavigate, useParams } from "react-router-dom";

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

    // 수정 모드일 때 기존 데이터 불러오기
    useEffect(() => {
        if (!id) return;

        const fetchExisting = async () => {
            const { data: application, error: applicationError } = await getApplicationById(Number(id));
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

            const { data: questionsData, error: questionsError } = await getInterviewQuestions(Number(id));
            if (questionsError || !questionsData) {
                console.error(questionsError);
                return;
            }
            if (questionsData.length > 0) {
                setQuestions(questionsData.map((q) => ({ question: q.question, answer: q.answer })))
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

    const handleSubmit = async () => {
        // 필수값 검사
        const errorMsg = validateForm();
        if (errorMsg) {
            alert(errorMsg);
            return;
        }

        // 현재 로그인한 사용자 정보 가져오기
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
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

        if (isEditMode && id) {
            // 수정 모드
            const { error: updateError } = await updateApplication(Number(id), applicationInput);
            if (updateError) {
                alert("수정에 실패했습니다.");
                console.error(updateError);
                return;
            }

            const { error: deleteError } = await deleteInterviewQuestions(Number(id));
            if (deleteError) {
                alert("면접 질문 수정에 실패했습니다.");
                console.error(deleteError);
                return;
            }

            const { error: questionsError } = await createInterviewQuestions(Number(id), questions);
            if (questionsError) {
                alert("면접 질문 수정에 실패했습니다.");
                console.error(questionsError);
                return;
            }

            alert("수정되었습니다.");
            navigate(`/dashboard/detail/${id}`);
        } else {
            // 등록 모드
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
    }

    
    return (
        <div className="bg-[#F7FAFE] pb-10 xl:pb-18">
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
                    <FormCard>
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
                    </FormCard>
                    {/* 예상 면접 질문 */}
                    <FormCard>
                        <InterviewQuestionSection
                            questions={questions} onQuestions={setQuestions}
                        />
                    </FormCard>
                    {/* 메모 */}
                    <FormCard>
                        <MemoSection 
                            memo={memo} onMemo={setMemo}
                        />
                    </FormCard>
                </div>
            </div>
            <div className="flex justify-center mt-8">
                <ButtonBase
                    base="base2"
                    className="bg-primary text-white"
                    onClick={handleSubmit}
                >
                    {isEditMode ? "수정하기" : "등록하기"}
                </ButtonBase>
            </div>
        </div>
    )
}
export default FormContainer;