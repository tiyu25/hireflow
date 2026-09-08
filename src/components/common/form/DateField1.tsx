import DatePicker from "react-datepicker";
import InputField1 from "./InputField1";
import "react-datepicker/dist/react-datepicker.css";

import dateIcon from "@/assets/images/date_icn.svg";

interface DateField1Props {
    id?: string;
    label?: string;
    selected?: Date | null;
    onChange?: (date: Date | null) => void;
    placeholder?: string;
    labelClassName?: string;
    inputClassName?: string;
}

const DateField1 = ({
    id,
    label,
    selected,
    onChange,
    placeholder,
    labelClassName,
    inputClassName
}: DateField1Props) => {
    return (
        <div className="relative">
            <DatePicker
                selected={selected}
                onChange={onChange}
                placeholderText={placeholder}
                portalId="datepicker-portal"
                popperPlacement="bottom-start"
                dateFormat="yyyy-MM-dd"
                customInput={
                    <InputField1
                        id={id}
                        label={label}
                        labelClassName={labelClassName}
                        inputClassName={inputClassName}
                        icon={dateIcon}
                        readOnly 
                    />
                }
            />
        </div>
    )
}
export default DateField1;