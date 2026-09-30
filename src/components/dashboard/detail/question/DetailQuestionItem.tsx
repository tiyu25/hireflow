import ToggleArrow from "@/assets/images/question_toggle_arr.svg";
import ToggleArrowActive from "@/assets/images/question_toggle_arr_active.svg";
import { useToggle } from "../../../../hooks/useToggle";

const DetailQuestionItem = ({ question, answer }: { question: string; answer: string; }) => {
    const [ open, toggleOpen ] = useToggle(true);

    return (
        <div>
            <button
                className="flex items-center gap-1 font-semibold text-sm xl:text-[1.063rem] cursor-pointer"
                onClick={toggleOpen}
            >
                Q. {question}
                <img src={open ? ToggleArrowActive : ToggleArrow} alt="" />
            </button>
            <div className={`${open ? "" : "hidden"}`}>
                <p className="mt-1 text-sm xl:text-base text-black-6">{answer.trim() ? answer : "등록된 답변이 없습니다."}</p>
            </div>
        </div>
    )
}
export default DetailQuestionItem;