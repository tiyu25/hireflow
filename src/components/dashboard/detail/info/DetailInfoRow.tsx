import type { ReactNode } from "react";

interface DetailInfoRowProps {
    label: string;
    children: ReactNode;
    className?: string;
}

const DetailInfoRow = ({ label, children, className }: DetailInfoRowProps) => {
    return (
        <div className={`flex items-center sm:flex-row flex-col gap-1 ${className}`}>
            <strong className="block shrink-0 w-30 text-black-6 text-sm xl:text-md">
                {label}
            </strong>
            <div className="text-black-6 text-sm xl:text-md">
                {children}
            </div>
        </div>
    )
}
export default DetailInfoRow;