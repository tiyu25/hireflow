import ButtonBace from "../../common/button/ButtonBase";
import InputField1 from "../../common/form/InputField1";
import TextareaField1 from "../../common/form/TextareaField1";

import Delete from "@/assets/images/del_icn.svg";
import Collapsible from "./Collapsible";
import Star from "@/assets/images/star_white_icn.svg";

export interface QuestionAnswer {
    question: string;
    answer: string;
}

interface InterviewQuestionProps {
    questions: QuestionAnswer[];
    onQuestionsChange: (value: QuestionAnswer[]) => void;
    onGenerateQuestions: () => void;
}

const InterviewQuestionSection = ({ questions, onQuestionsChange, onGenerateQuestions }: InterviewQuestionProps) => {

    const handleQuestionChange = (index: number, value: string) => {
        const updated = questions.map((qa, i) => 
            i === index ? {...qa, question: value} : qa
        );
        onQuestionsChange(updated);
    };

    const handleAnswerChange = (index: number, value: string) => {
        const updated = questions.map((qa, i) => 
            i === index ? {...qa, answer: value} : qa
        );
        onQuestionsChange(updated);
    };

    const handleDelete = (index: number) => {
        if(confirm("질문을 삭제하시겠습니까?")) {
            const updated = questions.filter((_, i) => i !== index);
            onQuestionsChange(updated);
        }
    };

    const handleAdd = () => {
        onQuestionsChange([...questions, { question: "", answer: "" }]);
    };

    const handleDeleteAll = () => {
        if(confirm("전체 삭제 하시겠습니까?")) {
            onQuestionsChange([{ question: "", answer: "" }]);
        }
    };
    
    return (
        <Collapsible title="예상 면접 질문">
            <button
                onClick={onGenerateQuestions}
                className="flex items-center gap-1 w-full py-2 px-3 bg-linear-to-r from-[#71B4FF] to-[#A055FF] text-sm text-white font-bold text-left rounded-md cursor-pointer"
            >
                <img src={Star} alt="" />
                AI 질문 생성하기
            </button>
            <div className="flex flex-col gap-3 mt-4">
                {questions.map((qa, i) => (
                    <div key={i} className="p-4 bg-gray-f9 rounded-lg">
                        <div className="flex justify-between mb-4">
                            <p className="text-black-6 lg:text-md font-semibold">Q. 질문 {i + 1}</p>
                            <button
                                className="cursor-pointer"
                                onClick={() => handleDelete(i)}
                            >
                                <img src={Delete} alt="" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputField1
                                type="text"
                                inputClassName="w-full bg-white"
                                placeholder="질문"
                                value={qa.question}
                                onChange={(e) =>
                                    handleQuestionChange(i, e.target.value)
                                }
                            />
                            <TextareaField1
                                textareaClassName="w-full"
                                placeholder="답변"
                                value={qa.answer}
                                onChange={(e) =>
                                    handleAnswerChange(i, e.target.value)
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-3">
                <ButtonBace
                    className="bg-black-6 text-white"
                    onClick={handleDeleteAll}
                    base="base1"
                >
                    전체 삭제
                </ButtonBace>
                <ButtonBace
                    className="bg-primary text-white"
                    onClick={handleAdd}
                    base="base1"
                >
                    질문 추가
                </ButtonBace>
            </div>
        </Collapsible>
    )
}
export default InterviewQuestionSection;