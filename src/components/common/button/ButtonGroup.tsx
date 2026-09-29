import type { ReactNode } from "react"

interface ButtonGroupProps {
    children: ReactNode;
}

const ButtonGroup = ({ children }: ButtonGroupProps) => {
    return (
        <div className="flex justify-center md:flex-row flex-col gap-2 mt-3 md:mt-6">
            {children}
        </div>
    )
}
export default ButtonGroup;