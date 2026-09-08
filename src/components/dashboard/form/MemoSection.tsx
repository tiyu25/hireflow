import { useState } from "react";
import TextareaField1 from "../../common/form/TextareaField1";
import Collapsible from "./Collapsible";

const MemoSection = () => {
    const [memo, setMemo] = useState("");

    return (
        <Collapsible title="메모">
            <TextareaField1
                textareaClassName="w-full h-50"
                placeholder="메모를 입력해주세요."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
            />
        </Collapsible>
    )
}
export default MemoSection;