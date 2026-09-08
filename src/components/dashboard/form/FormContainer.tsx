import ButtonBase from "../../common/button/ButtonBase";
import FormCard from "./FormCard";
import InterviewQuestionSection from "./InterviewQuestionSection";
import JobInfoSection from "./JobInfoSection";
import MemoSection from "./MemoSection";

import PagePrev from "@/assets/images/page_prev_icn.svg";

const FormContainer = () => {
    return (
        <div className="bg-[#F7FAFE] pb-18">
            <button className="p-7">
                <img src={PagePrev} alt="" />
            </button>
            <div className="w-250 mx-auto">
                <strong className="block text-[30px] text-center mb-10">일정 등록</strong>
                <div className="flex flex-col gap-4">
                    {/* 채용 정보 */}
                    <FormCard>
                        <JobInfoSection />
                    </FormCard>
                    {/* 예상 면접 질문 */}
                    <FormCard>
                        <InterviewQuestionSection />
                    </FormCard>
                    {/* 메모 */}
                    <FormCard>
                        <MemoSection />
                    </FormCard>
                </div>
            </div>
            <div className="flex justify-center mt-8">
                <ButtonBase
                    base="base2"
                    className="bg-primary text-white"
                >
                    등록하기
                </ButtonBase>
            </div>
        </div>
    )
}
export default FormContainer;