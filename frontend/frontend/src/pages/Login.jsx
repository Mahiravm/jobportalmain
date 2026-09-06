import { useState } from "react";
 import { loginUser } from "../services/authService";
import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {




    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            // const response = await loginUser(loginData);

            // alert("Login Successful");

            // console.log(response.data);



            // const response = await loginUser(loginData);

            //     if(response.data.role === "CANDIDATE"){
            //         navigate("/candidate");
            //     }
            //     else if(response.data.role === "RECRUITER"){
            //         navigate("/recruiter");
            //     }



            const response = await loginUser(loginData);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data)
            );

            if (response.data.role === "CANDIDATE") {
                navigate("/candidate");
            } else {
                navigate("/recruiter");
            }

        } catch (error) {

            console.error(error);

            alert("Login Failed");
        }
    };

    return (
        <div className="login-container">

            <form className="login-form" onSubmit={handleSubmit}>

                <h2>Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Login
                </button>


<p>
  Don't have an account? <Link to="/">Register</Link>
</p>
            </form>

        </div>
    );
}

export default Login;