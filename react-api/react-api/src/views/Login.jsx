import { Link } from "react-router-dom";
import { useRef } from "react";
import "../styles/Login.css";
import AxiosClient from "../AxiosClient";
import { useStateContext } from "../Context/ContextProvider";

function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const { setUser, setToken } = useStateContext();

    const Submit = (e) => {
        e.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        AxiosClient.post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    };
    return (
        <div className="login-container">
            <div className="login">
                <h2 className="login-text">Login</h2>
                <form onSubmit={Submit} className="login-form">
                    <input
                        type="text"
                        ref={emailRef}
                        placeholder="Enter email"
                    />{" "}
                    <br />
                    <input
                        type="password"
                        ref={passwordRef}
                        placeholder="Enter password"
                    />{" "}
                    <br />
                    <p className="forgot-password">forgot password</p>
                    <button
                        type="submit"
                        className="login-button btn btn-outline-secondary"
                    >
                        Login
                    </button>
                    <p className="register-here">
                        No Account yet?{" "}
                        <Link to="/register">Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
