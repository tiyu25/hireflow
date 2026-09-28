import { Navigate, Route, Routes } from "react-router-dom"
import type { Session } from '@supabase/supabase-js'
import Layout from "../layout/Layout"
import Form from "../pages/dashboard/Form";
import Detail from "../pages/dashboard/Detail";
import List from "../pages/dashboard/List";
import Login from "../pages/Login";

type RouterProps = {
    session: Session | null;
}

const Router = ({ session }: RouterProps) => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    session ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
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