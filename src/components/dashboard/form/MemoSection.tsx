import TextareaField1 from "../../common/form/TextareaField1";
import Collapsible from "./Collapsible";

interface MemoSectionProps {
    memo: string;
    onMemo: (value: string) => void;
}

const MemoSection = ({ memo, onMemo }: MemoSectionProps) => {
    return (
        <Collapsible title="메모">
            <TextareaField1
                textareaClassName="w-full h-50 xl:text-base text-sm"
                placeholder="메모를 입력해주세요."
                value={memo}
                onChange={(e) => onMemo(e.target.value)}
            />
        </Collapsible>
    )
}
export default MemoSection;