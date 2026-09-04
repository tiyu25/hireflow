import LoginButton from "../LoginButton"
import GuestIcon from "@/assets/images/guest_icn.svg"
import Bubble from "@/assets/images/bubble_tri.svg"

interface GuestLoginButtonProps {
    onClick?: () => void;
}

const GuestLoginButton = ({ onClick }: GuestLoginButtonProps) => {
    return (
        <div>
            <LoginButton
                icon={GuestIcon}
                className="text-primary border border-primary"
                onClick={onClick}
            >
                게스트로 계속하기
            </LoginButton>
            <div className="relative flex justify-center py-2 mt-2">
                <img
                    src={Bubble}
                    alt=""
                    className="absolute left-50 top-0"
                />
                <p className="inline-block py-1 px-3 text-sm text-white bg-primary rounded-2xl">
                    서비스의 주요 기능을 <b>로그인 없이 바로 체험</b>해보세요!
                </p>
            </div>
        </div>
    )
}

export default GuestLoginButton;