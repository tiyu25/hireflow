import LoginButton from "../LoginButton"
import KakaoIcon from "@/assets/images/kakao_icn.svg"

interface KakaoLoginButtonProps {
    onClick?: () => void;
}

const KakaoLoginButton = ({ onClick }: KakaoLoginButtonProps) => {
    return (
        <LoginButton
            icon={KakaoIcon}
            className="bg-[#F9E000] text-[#391C1F]"
            onClick={onClick}
        >
            카카오로 계속하기
        </LoginButton>
    )
}
export default KakaoLoginButton;