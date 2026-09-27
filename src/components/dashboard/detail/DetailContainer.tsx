import ApplicationStatusBadge from "../../common/status/ApplicationStatusBadge";

import Star from "@/assets/images/star_icn.svg";
import ButtonBase from "../../common/button/ButtonBase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type InterviewQuestion, type Application, getApplicationById, getInterviewQuestions, deleteApplication } from "../../../api/applications";
import { getDday } from "../../../utils/dateCount";
import DetailQuestionItem from "./DetailQuestionItem";
import { PLATFORM_LABELS, STATUS_LABELS } from "../../../constants/application";

const DetailContainer = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [ application, setApplication ] = useState<Application | null>(null);
    const [ questions, setQuestions ] = useState<InterviewQuestion[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchDetail = async () => {
            const { data: applicationDate, error: applicationError } = await getApplicationById(Number(id));
            if (applicationError || !applicationDate) {
                console.error(applicationError);
                return;
            }

            setApplication(applicationDate);

            const { data: questionDate, error: questionError } = await getInterviewQuestions(Number(id));
            if (questionError || !questionDate) {
                console.error(questionError);
                return;
            }

            setQuestions(questionDate);
        }

        fetchDetail();
    }, [id]);

    if (!application) {
        return;
    }

    // 지원 내역 삭제
    const handleDelete = async () => {
        if (!id) return;
        if (!confirm("삭제하시겠습니까?")) return;

        const { error } = await deleteApplication(Number(id));
        if (error) {
            alert("삭제에 실패했습니다.");
            console.error(error);
            return;
        }

        alert("삭제되었습니다.");
        navigate("/dashboard")
    }


    

    return (
        <div className="bg-[#F7FAFE] py-18">
            <div className="flex flex-col gap-4 w-250 mx-auto">
                {/* 채용 정보 */}
                <div className="p-6 bg-white shadow-[0_0_6px_0_#EBF1FA] rounded-2xl">
                    <div>
                        {/* 지원 전 */}
                        <span
                            className="inline-flex items-center h-7 px-2 text-primary text-sm font-medium bg-light-primary rounded-md"
                        >
                            {(application.status === "planned" || application.status === "applied") && `서류 마감 ${getDday(application.deadline)}`}
                            {application.status === "interview" && `면접 ${getDday(application.interview_date)}`}
                        </span>
                    </div>
                    <div className="mt-4">
                        <span className="text-lg text-black-5">{application?.company_name}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <strong className="text-2xl">{application.job_title}</strong>
                            <ApplicationStatusBadge status={application.status} />
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="grid grid-cols-2 gap-y-4">
                            {(application.status === "planned" || application.status === "interview" || application.status === "reject" || application.status === "pendingInterview" || application.status === "applied" || application.status === "finalPass") && (
                                <div className="flex">
                                    <strong className="block shrink-0 w-30 text-black-6 text-[15px]">서류 마감일</strong>
                                    <p className="text-black-6 text-[15px]">{application.deadline}</p>
                                </div>
                            )}
                            {(application.status === "interview" || application.status === "reject" || application.status === "pendingInterview" || application.status === "applied" || application.status === "finalPass") && (
                                <div className="flex">
                                    <strong className="block shrink-0 w-30 text-black-6 text-[15px]">서류 지원일</strong>
                                    <p className="text-black-6 text-[15px]">{application.application_date}</p>
                                </div>
                            )}
                            {(application.status === "interview" || application.status === "reject" || application.status === "pendingInterview" || application.status === "finalPass") && (
                                <div className="flex">
                                    <strong className="block shrink-0 w-30 text-black-6 text-[15px]">면접일</strong>
                                    <p className="text-black-6 text-[15px]">{application.interview_date}</p>
                                </div>
                            )}
                            {(application.status === "finalPass") && (
                                <div className="flex">
                                    <strong className="block shrink-0 w-30 text-black-6 text-[15px]">출근 예정일</strong>
                                    <p className="text-black-6 text-[15px]">{application.start_date}</p>
                                </div>
                            )}
                            <div className="flex">
                                <strong className="block shrink-0 w-30 text-black-6 text-[15px]">지원 현황</strong>
                                <p className="text-black-6 text-[15px]">{application.status ? STATUS_LABELS[application.status] : "-"}</p>
                            </div>
                            <div className="flex">
                                <strong className="block shrink-0 w-30 text-black-6 text-[15px]">지원 플랫폼</strong>
                                <p className="text-black-6 text-[15px]">{application.platform ? PLATFORM_LABELS[application.platform] ?? application.platform : ""}</p>
                            </div>
                            <div className="flex col-span-2">
                                <strong className="block shrink-0 w-30 text-black-6 text-[15px]">채용공고 URL</strong>
                                <a
                                    href={application.url ?? "#"}
                                    className="text-black-6 text-[15px] underline"
                                >
                                    채용공고 바로가기
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI가 분석한 채용공고 */}
                <div className="rounded-2xl bg-linear-to-r from-[#71B4FF] to-[#A055FF] p-0.5">
                    <div className="rounded-[calc(1rem-2px)] bg-[#F7FAFE] p-6">
                        <div className="flex gap-1 items-center">
                            <img src={Star} alt="" />
                            <strong className="text-lg bg-linear-to-r from-[#71B4FF] to-[#A055FF] bg-clip-text text-transparent">
                                AI가 분석한 채용공고
                            </strong>
                        </div>
                        <p className="mt-2 text-[15px] text-black-5">분석한 내용이 들어갑니다.</p>
                    </div>
                </div>

                {/* 메모 */}
                <div className="h-75 p-6 bg-white shadow-[0_0_6px_0_#EBF1FA] rounded-2xl">
                    <strong className="w-full flex items-center justify-between pb-6 text-lg">메모</strong>
                    <p className="text-[15px] text-black-5">{application.memo}</p>
                </div>

                {/* 예상 면접 질문 */}
                <div className="p-6 bg-white shadow-[0_0_6px_0_#EBF1FA] rounded-2xl">
                    <strong className="w-full flex items-center justify-between pb-6 text-lg">예상 면접 질문</strong>
                    <div>
                        <div className="flex flex-col gap-4">
                            {questions.length > 0 ? (
                                questions.map((qa) => (
                                    <DetailQuestionItem key={qa.id} question={qa.question} answer={qa.answer} />
                                ))
                            ) : (
                                <div className="py-10 text-sm text-gray-7 text-center">등록된 질문이 없습니다.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-2 mt-6">
                    <ButtonBase
                        base="base2"
                        className="bg-black-6 text-white"
                    >
                        이전으로
                    </ButtonBase>
                    <ButtonBase
                        base="base2"
                        className="bg-primary text-white"
                        onClick={() => navigate(`/dashboard/form/${id}`)}
                    >
                        수정하기
                    </ButtonBase>
                    <ButtonBase
                        base="base2"
                        className="bg-red1 text-white"
                        onClick={handleDelete}
                    >
                        삭제하기
                    </ButtonBase>
                </div>
            </div>
        </div>
    )
}
export default DetailContainer;