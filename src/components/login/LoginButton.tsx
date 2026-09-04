interface LoginButtonProps {
    icon?: string;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const LoginButton = ({ icon, className, children, onClick }: LoginButtonProps) => {
    return (
        <button
            className={`${className} flex items-center justify-center gap-2 w-full h-14 rounded-sm font-semibold`}
            onClick={onClick}
        >
            <img src={icon} alt="" />
            {children}
        </button>
    )
}
export default LoginButton;