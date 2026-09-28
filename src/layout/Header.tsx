import Logo from "@/assets/images/logo_row.svg";
import Logout from "@/assets/images/logout_icn.svg";

const Header = () => {
    return (
        <header className="fixed inset-0 h-18.5 bg-white border-b border-gray-e5 z-99">
            <div className="h-full flex items-center justify-between px-6">
                <a href="/dashboard">
                    <img src={Logo} alt="HIREFLOW 로고" />
                </a>
                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-1 font-medium text-sm text-black-6"
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