import { forwardRef, useId } from "react";

interface TextareaField1Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    labelClassName?: string;
    textareaClassName?: string;
}

const TextareaField1 = forwardRef<HTMLTextAreaElement, TextareaField1Props> (
    ({ id, label, labelClassName, textareaClassName, ...rest }, ref) => {

        // id가 없으면 useId()로 자동 생성
        const generatedId = useId();
        const inputId = id ?? generatedId;

        return (
            <div className="flex">
                {label && (
                    <label
                        htmlFor={inputId}
                        className={`${labelClassName ?? ""} shrink-0 w-35 leading-9 xl:text-md font-semibold`}
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    {...rest}
                    className={`${textareaClassName ?? ""} py-2.5 px-3 xl:text-md border border-gray-e5 bg-white resize-none rounded-sm`}
                ></textarea>
            </div>
        )
    }
)
export default TextareaField1;