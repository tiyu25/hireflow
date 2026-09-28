import Logo from "@/assets/images/logo_row.svg";
import Logout from "@/assets/images/logout_icn.svg";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            alert("로그아웃에 실패했어요. 다시 시도해 주세요.");
            return;
        }

        if (confirm("로그아웃 하시겠습니까?")) {
            navigate("/login", {replace: true});
        } else {
            return;
        }

    }

    return (
        <header className="fixed inset-0 h-18.5 bg-white border-b border-gray-e5 z-99">
            <div className="h-full flex items-center justify-between px-6">
                <a href="/dashboard">
                    <img src={Logo} alt="HIREFLOW 로고" />
                </a>
                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-1 font-medium text-sm text-black-6 cursor-pointer"
                        onClick={handleLogout}
                    >
                        로그아웃
                        <img src={Logout} alt="" />
                    </button>
                </div>
            </div>
        </header>
    )
}
export default Header;