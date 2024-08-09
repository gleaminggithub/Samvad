import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import "../css/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

const Register = () => {
    const navigate = useNavigate();
    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };
    const [values, setValues] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  
    useEffect(() => {
      if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/");
      }
    }, [navigate]);
  
    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;
        if (password !== confirmPassword) {
          toast.error(
            "Password and confirm password should be same.",
            toastOptions
          );
          return false;
        } else if (username.length < 3) {
          toast.error(
            "Username should be greater than 3 characters.",
            toastOptions
          );
          return false;
        } else if (password.length < 8) {
          toast.error(
            "Password should be equal or greater than 8 characters.",
            toastOptions
          );
          return false;
        } else if (email === "") {
          toast.error("Email is required.", toastOptions);
          return false;
        }
    
        return true;
      };
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          "Users",
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
};


  return(
  <>
    <div className="FormContainer">
      <form onSubmit={(event) => handleSubmit(event)} className="FormR">
        <div className="brand">
          <img src={Logo} alt="Logo" className="logo"/>
          <h1 className="logoHead">ChatApp</h1>
        </div>
        <input
          type="text"
          placeholder="username"
          name="username" 
          className="inputForm"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="inputForm"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="inputForm"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          className="inputForm"
          onChange={(e) => handleChange(e)}
        />
        <button type="submit" className="Button">Create User</button>
        <span className="Link">
          Already You have an account?<Link to="/login">Login</Link>
        </span>
      </form>
      </div>
      <ToastContainer/>
  </>)
};

export default Register;
