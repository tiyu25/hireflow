import ButtonBace from "../../common/button/ButtonBase";
import InputField1 from "../../common/form/InputField1";
import TextareaField1 from "../../common/form/TextareaField1";

import Delete from "@/assets/images/del_icn.svg";
import Collapsible from "./Collapsible";

export interface QuestionAnswer {
    question: string;
    answer: string;
}

interface InterviewQuestionProps {
    questions: QuestionAnswer[];
    onQuestions: (value: QuestionAnswer[]) => void;
}

const InterviewQuestionSection = ({ questions, onQuestions }: InterviewQuestionProps) => {

    const handleQuestionChange = (index: number, value: string) => {
        const updated = questions.map((qa, i) => 
            i === index ? {...qa, question: value} : qa
        );
        onQuestions(updated);
    };

    const handleAnswerChange = (index: number, value: string) => {
        const updated = questions.map((qa, i) => 
            i === index ? {...qa, answer: value} : qa
        );
        onQuestions(updated);
    };

    const handleDelete = (index: number) => {
        if(confirm("질문을 삭제하시겠습니까?")) {
            const updated = questions.filter((_, i) => i !== index);
            onQuestions(updated);
        }
    };

    const handleAdd = () => {
        onQuestions([...questions, { question: "", answer: "" }]);
    };

    const handleDeleteAll = () => {
        if(confirm("전체 삭제 하시겠습니까?")) {
            onQuestions([{ question: "", answer: "" }]);
        }
    };
    
    return (
        <Collapsible title="예상 면접 질문">
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