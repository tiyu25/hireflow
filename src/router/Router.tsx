import { Route, Routes } from "react-router-dom"
import Layout from "../layout/Layout"
import Form from "../pages/dashboard/Form";

const Router = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/dashboard/form" element={<Form />} />
            </Route>
        </Routes>
    )
}
export default Router;