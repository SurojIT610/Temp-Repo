import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(15); // Countdown starts at 15 seconds
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/adminLogin`,
        { email, password }
      );
      // Assuming the response contains tokens or other info
      const { _accessToken, _refreshToken } = response.data;

      // Save tokens to local storage or state management as needed
      localStorage.setItem("accesstoken", _accessToken);
      localStorage.setItem("refreshtoken", _refreshToken);
      console.log(localStorage.getItem("accesstoken"));

      // Start loading and countdown
      setLoading(true);

      // Countdown interval
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(countdownInterval); // Clear interval when countdown finishes
          }
          return prevCountdown - 1;
        });
      }, 1000);

      // 15-second delay before navigating
      setTimeout(() => {
        setLoading(false); // Stop loading animation
        navigate("/admin"); // Redirect to /admin after 15 seconds
      }, 5000);
    } catch (error) {
      // Handle errors
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h4>Admin Login</h4>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Redirecting in {countdown} seconds...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
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
                  {error && <div className="alert alert-danger">{error}</div>}
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
