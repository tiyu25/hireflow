import LoginButton from "../LoginButton"
import GoogleIcon from "@/assets/images/google_icn.svg"

interface GoogleLoginButtonProps {
    onClick?: () => void;
}

const GoogleLoginButton = ({ onClick }: GoogleLoginButtonProps) => {
    return (
        <LoginButton
            icon={GoogleIcon}
            className="bg-white text-black-4"
            onClick={onClick}
        >
            구글로 계속하기
        </LoginButton>
    )
}
export default GoogleLoginButton;