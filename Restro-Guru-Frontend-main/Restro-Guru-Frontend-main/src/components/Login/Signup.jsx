// src/Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/register`,
        {
          Fname: firstName,
          Lname: lastName,
          Phone: phone,
          address,
          pin,
          email,
          password,
        }
      ).then((response)=>{
        {
          alert("Signup successful");
          navigate("/login"); 
          console.log(response)// Redirect to login page after successful sign-up
        }
      }) 
     .catch ((e)=>{
      console.error("Signup error:", e);
      alert("Error signing up");
     })
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="PIN Code"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Sign Up
        </button>
      </form>
      <p className="mt-3">
        Already have an account?{" "}
        <button className="btn btn-link" onClick={() => navigate("/login")}>
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;
