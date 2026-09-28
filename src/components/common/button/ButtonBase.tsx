interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    base?: "base1" | "base2";
}

const buttonStyle = {
    base1 : "h-9 px-3 text-sm font-semibold rounded-sm",
    base2 : "min-w-47 h-11 xl:h-13 text-sm xl:text-base px-3 font-semibold rounded-sm"
}

const ButtonBase = ({ children, disabled, className, type="button", base="base1", ...rest }: ButtonBaseProps) => {
    return (
        <button
            type={type}
            disabled={disabled}
            {...rest}
            className={`${className ?? ""} ${buttonStyle[base]} cursor-pointer`}
        >
            {children}
        </button>
    )
}
export default ButtonBase;