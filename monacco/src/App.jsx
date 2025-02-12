import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashbord from "./pages/Dashbord";
import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import Login from "./Auth/login/Login";
import SignupPage from "./Auth/signup/Signup";
import PageNotFound from "./pages/pagenotfound";
import Question from "./pages/questions";
import QuestionDetailPage from "../src/components/questions/QuestionPage";

function App() {
    const auth = window.localStorage.getItem("auth") === "true";

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={auth ? <Navigate to="/" /> : <Login />} />
                    <Route path="/signup" element={auth ? <Navigate to="/" /> : <SignupPage />} />
                    <Route path="/question" element={<QuestionDetailPage />} />{" "}
                    {/* Route for the new page, outside the Sidebar */}
                    <Route path="*" element={<PageNotFound />} />
                    <Route path="/" element={auth ? <Sidebar /> : <Navigate to="/login" />}>
                        <Route index element={<Dashbord />} />
                        <Route path="monaco" element={<Question />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
