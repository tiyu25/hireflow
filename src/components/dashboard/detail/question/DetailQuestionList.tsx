
import type { InterviewQuestion } from "../../../../api/applications";
import DetailQuestionItem from "./DetailQuestionItem";

interface DetailQuestionListProps {
    questions: InterviewQuestion[];
}

const DetailQuestionList = ({questions}: DetailQuestionListProps) => {
    return (
        <div className="flex flex-col gap-4">
            {questions.length > 0 ? (
                questions.map((qa) => (
                    <DetailQuestionItem key={qa.id} question={qa.question} answer={qa.answer} />
                ))
            ) : (
                <div className="py-10 text-sm text-gray-7 text-center">등록된 질문이 없습니다.</div>
            )}
        </div>
    )
}
export default DetailQuestionList;