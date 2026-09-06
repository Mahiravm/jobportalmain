import { useState } from "react";
import { registerUser } from "../services/authService";
import "./Register.css";
import { Link } from "react-router-dom";

function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CANDIDATE"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await registerUser(formData);
            alert("Registration Successful");
            console.log(response.data);

            setFormData({
                name: "",
                email: "",
                password: "",
                role: "CANDIDATE"
            });

        } catch (error) {
            console.error(error);
            alert("Registration Failed");
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="CANDIDATE">Candidate</option>
                    <option value="RECRUITER">Recruiter</option>
                </select>

                <button type="submit">
                    Register
                </button>

                <p>
  Already have an account? <Link to="/login">Login</Link>
</p>
            </form>
        </div>
    );
}

export default Register;