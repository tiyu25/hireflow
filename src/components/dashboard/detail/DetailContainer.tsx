import Star from "@/assets/images/star_icn.svg";
import ButtonBase from "../../common/button/ButtonBase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type InterviewQuestion, type Application, getApplicationById, getInterviewQuestions, deleteApplication } from "../../../api/applications";
import ShadowCard from "../ShadowCard";
import DetailApplicationInfo from "./info/DetailApplicationInfo";
import DetailQuestionList from "./question/DetailQuestionList";
import ButtonGroup from "../../common/button/ButtonGroup";
import LoadingOverlay from "../../common/loading/LoadingOverlay";

const DetailContainer = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [ application, setApplication ] = useState<Application | null>(null);
    const [ questions, setQuestions ] = useState<InterviewQuestion[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        const fetchDetail = async () => {
            try {
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
            } finally {
                setIsLoading(false);
            }
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

        setIsLoading(true);

        try {
            const { error } = await deleteApplication(Number(id));
            if (error) {
                alert("삭제에 실패했습니다.");
                console.error(error);
                return;
            }
    
            alert("삭제되었습니다.");
            navigate("/dashboard")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-[#F7FAFE] py-10 xl:py-18 xl:px-0 px-8">
            <LoadingOverlay isVisible={isLoading} />
            <div className="flex flex-col gap-4 w-full xl:w-250 mx-auto">
                {/* 채용 정보 */}
                <ShadowCard>
                    <DetailApplicationInfo application={application} />
                </ShadowCard>

                {/* AI가 요약한 채용공고 */}
                <div className="rounded-2xl bg-linear-to-r from-[#71B4FF] to-[#A055FF] p-0.5">
                    <div className="rounded-[calc(1rem-2px)] bg-[#F7FAFE] p-6">
                        <div className="flex gap-1 items-center">
                            <img src={Star} alt="" />
                            <strong className="text-md xl:text-lg bg-linear-to-r from-[#71B4FF] to-[#A055FF] bg-clip-text text-transparent">
                                AI가 요약한 채용공고
                            </strong>
                        </div>
                        <p className="mt-2 text-sm xl:text-md text-black-5">
                            {application.job_summary ?? "요약된 내용이 없습니다. 채용공고 상세 내용을 입력하면 AI가 요약해드려요."}
                        </p>
                    </div>
                </div>

                {/* 메모 */}
                <ShadowCard title="메모" className="h-75">
                    <p className="text-sm xl:text-md text-black-5">{application.memo}</p>
                </ShadowCard>

                {/* 예상 면접 질문 */}
                <ShadowCard title="예상 면접 질문">
                    <DetailQuestionList questions={questions} />
                </ShadowCard>

                <ButtonGroup>
                    <ButtonBase
                        base="base2"
                        className="bg-black-6 text-white"
                        onClick={() => navigate(`/dashboard`)}
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
                </ButtonGroup>
            </div>
        </div>
    )
}
export default DetailContainer;