import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../Context/ContextProvider";
import { useEffect } from "react";
import "../styles/DefaultLayout.css";
import AxiosClient from "../AxiosClient";

function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();
    if (!token) {
        return <Navigate to={"login"} />;
    }

    const onLogout = async (e) => {
        e.preventDefault();
        try {
            await AxiosClient.get("/logout");
            setUser(null);
            setToken(null);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        AxiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <div id="default-layout">
            <div className="content">
                <header>
                    <div className="header-text">
                        <p className="header">Todo List</p>
                    </div>
                    <div className="user-info">
                        <p className="user">{user.name}</p>
                        <button
                            onClick={onLogout}
                            className="btn btn-outline-danger"
                        >
                            Logout
                        </button>
                    </div>
                </header>
            </div>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default DefaultLayout;
