import { AuthData } from "./AuthWrapper";
import { Route, Routes, Link } from "react-router-dom";
import {NotFoundPage} from "../pages/NotFoundPage";
import { Logout } from "../pages/Logout";
import { LoginPage } from "../pages/LoginPage";
import { ChatPage } from "../pages/ChatPage";


const routesList = [
    //private nav bar items
    { path: "/chat", name: "Chat", element: <ChatPage/>, isPrivate: true },
    { path: "/log-out", name: "Log out", element: <Logout/>, isPrivate: true },
    // public routes
    { path: "/login", name: "Login", element: <LoginPage/>, isPrivate: false},
    //other
    { path: "*", name: "Not Found", element: <NotFoundPage/>, isPrivate: false },
]

export const RenderRoutes = () => {
    const { user } = AuthData();

    return <Routes>
            {
                routesList.map((r,i) => {
                    if (r.isPrivate && user.isAuthenticated)
                        return <Route key={i} path={r.path} element={r.element}/>;
                    else if (!r.isPrivate)
                        return <Route key={i} path={r.path} element={r.element}/>;
                    return false;
                })
            }
        </Routes>;
}