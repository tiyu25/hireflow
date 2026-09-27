import { Route, Routes } from "react-router-dom"
import Layout from "../layout/Layout"
import Form from "../pages/dashboard/Form";
import Detail from "../pages/dashboard/Detail";
import List from "../pages/dashboard/List";
import Login from "../pages/Login";

const Router = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/dashboard/form" element={<Form />} />
                <Route path="/dashboard/form/:id" element={<Form />} />
                <Route path="/dashboard/detail/:id" element={<Detail />} />
                <Route path="/dashboard" element={<List />} />
            </Route>
            <Route path="/login" element={<Login />}/>
        </Routes>
    )
}
export default Router;