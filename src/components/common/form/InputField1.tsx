import { forwardRef, useId } from "react";

interface InputField1Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelClassName?: string;
    inputClassName?: string;
    icon?: string;
}

const InputField1 = forwardRef<HTMLInputElement, InputField1Props> (
    ({ 
        id,
        label,
        labelClassName,
        inputClassName,
        icon,
        ...rest
    }, ref) => {
        // id가 없으면 useId()로 자동 생성
        const generatedId = useId();
        const inputId = id ?? generatedId;

        return (
            <div className="flex md:flex-row flex-col">
                {label && (
                    <label 
                        htmlFor={inputId}
                        className={`${labelClassName ?? ""} shrink-0 w-35 leading-9 text-sm xl:text-md text-black-5 font-semibold`}
                    >
                        {label}
                    </label>
                )}
                <div className={icon ? 'relative' : 'w-full'}>
                    <input
                        ref={ref}
                        id={inputId}
                        {...rest}
                        className={`${inputClassName ?? ""} datepicker-icn h-9 md:h-10 py-2.5 px-3 text-sm xl:text-md border border-gray-e5 rounded-sm`}
                    />
                    {icon && (
                        <span className="absolute top-3 right-3 block">
                            <img src={icon} alt="" />
                        </span>
                    )}
                </div>
            </div>
        )
    }
);

InputField1.displayName = "InputField1";

export default InputField1;