import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/login`, {
        email,
        password,
      });
      console.log(response.data.userId)

      if (response.status === 200 && response.data._accessToken) {
        // Store tokens in local storage
        localStorage.setItem("USERID", response.data.userId);
        localStorage.setItem("_accesstoken", response.data._accessToken);
        localStorage.setItem("_refreshtoken", response.data._refreshToken);
        
        // Log the access token for debugging purposes
        console.log("Access Token:", response.data._accessToken);

        navigate("/my-account"); // Redirect to a protected route or dashboard
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error.response || error.message);
      alert("Error logging in. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="text-end">
          <button
            type="button"
            className="btn btn-subtle me-2"
            onClick={() => navigate("/signup")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      <p className="mt-3">
        Don't have an account?{" "}
        <button className="btn btn-link" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
