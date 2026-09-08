import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <div>
            <Header />
            <div className="mt-18.5">
                <Outlet />
            </div>
        </div>
    )
}
export default Layout;