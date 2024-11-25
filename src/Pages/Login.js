import React, { useState } from "react";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Import the custom axios instance
import Automation from '../images/automation.png'; 
import LoginPix from '../images/LoginPix.png'; 

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.message === "Login successful") {
        console.log(response.data);
        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error: ", error);
      navigate("/dashboard");
      // alert("Invalid credentials or server error");
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        <div
          className="border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          style={{
            paddingBottom: "90px",
            paddingTop: "90px",
            paddingLeft: "70px",
            paddingRight: "70px",
            width: "70%",
          }}
        >
          <div className="flex justify-center mb-5">
            <img
            src={Automation}
            alt="Automation"
            className=""
            />
          </div> 
          <h2 className="text-2xl text-center font-bold mb-6">Sign In</h2>
          <form className="w-full max-w-sm">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="example@gmail.com"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <Input.Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                visibilityToggle
              />
            </div>
            <button
              className="bg-[#0070AD] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
            <div className="flex items-center justify-between mt-4 mb-6">
              <a href="#" className="text-blue-500 text-sm">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-center items-center bg-white">
          <img
            src={LoginPix}
            alt="LoginPix"
            className=""
            style={{width:"790px", height:"820px"}}
          />
        
      </div>
    </div>
  );
};

export default Login;
