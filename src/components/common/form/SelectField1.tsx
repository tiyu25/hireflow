import { forwardRef, useId } from "react";

import SelectArr from "@/assets/images/select_arr.svg"

interface SelectField1Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    selectClassName?: string;
    labelClassName?: string;
    placeholder?: string;
    options: SelectOption[];
}
interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

const SelectField1 = forwardRef<HTMLSelectElement, SelectField1Props>( 
    ({
        id,
        label,
        selectClassName,
        labelClassName,
        placeholder,
        options,
        ...rest
    }, ref) => {

        // id가 없으면 useId()로 자동 생성
        const generatedId = useId();
        const selectId = id ?? generatedId;

        return (
            <div className="flex">
                {label && (
                    <label 
                        htmlFor={selectId}
                        className={`${labelClassName ?? ""} shrink-0 w-35 leading-9 text-[15px] font-semibold`}
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        {...rest}
                        className={`${selectClassName ?? ""} appearance-none w-50 h-10 px-3 text-[15px] border border-gray-e5 rounded-sm`}
                    >
                        {placeholder && (
                            <option value="" hidden>{placeholder}</option>
                        )}
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <img src={SelectArr} alt="" className="absolute top-4 right-3.5" />
                </div>
            </div>
        )
    }
)
export default SelectField1;