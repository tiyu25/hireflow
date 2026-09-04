import { supabase } from "../../lib/supabase";
import GoogleLoginButton from "./button/GoogleLoginButton";
import GuestLoginButton from "./button/GuestLoginButton";
import KakaoLoginButton from "./button/KaKaoLoginButton";

import Logo from "@/assets/images/logo_col.svg"

const LoginContainer = () => {

    // 카카오톡 로그인
    const handleKakaoLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "kakao",
        })
        if (error) {
            console.error("카카오 로그인 실패: ", error.message);
        }
    }

    // 구글 로그인
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        })
        if (error) {
            console.error("구글 로그인 실패: ", error.message);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#F7FAFE]">
            <div className="w-100">
                <div className="flex flex-col justify-center items-center">
                    <img src={Logo} alt="" />
                    <strong>취업 준비의 모든 과정을 한 곳에서</strong>
                    <p className="mt-1 text-sm text-black-6">지원 관리, 공고 분석, AI 면접 준비를 간편하게!</p>
                </div>
                <div className="flex flex-col gap-2 mt-10">
                    <KakaoLoginButton onClick={handleKakaoLogin} />
                    <GoogleLoginButton onClick={handleGoogleLogin} />
                    <div className="border-t border-gray-e5 pt-4 mt-4">
                        <GuestLoginButton />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoginContainer;