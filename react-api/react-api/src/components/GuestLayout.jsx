import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../Context/ContextProvider";
import "../styles/GuestLayout.css";

function GuestLayout() {
    const { token } = useStateContext();
    if (token) {
        return <Navigate to={"/todos"} />;
    }
    return (
        <div className="container d-flex align-items-center justify-content-center">
            <Outlet />
        </div>
    );
}

export default GuestLayout;
