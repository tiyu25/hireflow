import { useToggle } from "../../../hooks/useToggle";

import Arrow from "@/assets/images/acco_arr.svg";
import ArrowOff from "@/assets/images/acco_arr_off.svg";

interface CollapsibleProps {
    title: string;
    children: React.ReactNode;
    toggle?: boolean;
}

const Collapsible = ({ title, children, toggle }: CollapsibleProps) => {
    const [open, toggleOpen] = useToggle(true);

    const handleClick = () => {
        if (toggle === false) return;
        toggleOpen();
    }

    return (
        <div>
            <button
                className="w-full flex items-center justify-between cursor-pointer"
                onClick={handleClick}
            >
                <span className="font-bold">{title}</span>
                {toggle ?? (
                    <img src={`${open ? Arrow : ArrowOff}`} alt="" />
                )}
            </button>
            <div className={`${open ? "mt-4" : "hidden"}`}>
                {children}
            </div>
        </div>
    )
}
export default Collapsible;