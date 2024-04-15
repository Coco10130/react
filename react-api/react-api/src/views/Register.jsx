import "../styles/Register.css";
import { useRef } from "react";
import { Link } from "react-router-dom";
import AxiosClient from "../AxiosClient";
import { useStateContext } from "../Context/ContextProvider";

function Register() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const { setUser, setToken } = useStateContext();

    const Submit = (e) => {
        e.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        AxiosClient.post("/register", payload)
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
        <div className="reigster-container">
            <div className="register">
                <h2 className="register-text">Register</h2>

                <form onSubmit={Submit} className="register-form">
                    <input
                        type="text"
                        ref={nameRef}
                        placeholder="Enter user name"
                    />{" "}
                    <br />
                    <input
                        type="email"
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
                    <br />
                    <button className="register-button btn btn-outline-secondary">
                        Register
                    </button>
                    <p className="login-here">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
