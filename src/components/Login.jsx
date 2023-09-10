import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, Button } from "./shared";
import apiRequest from "../utils/apiRequest"; // Import the utility function
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Check for username errors
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    // Check for password errors
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters long";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const [data, error] = await apiRequest("post", "/auth/login", {
      username,
      password,
    });

    if (data?.data) {
      login(data.data);
      toast.success(data.message);
      navigate("/dashboard");
    } else {
      const errorMessage = error.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-gray-100 mx-2">
      <div className="p-8 max-w-md w-full bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-1 p-2 w-full border rounded-md"
            />
            {errors.username && (
              <div className="text-sm text-red-500">{errors.username}</div>
            )}
          </div>

          <div className="input-group mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 p-2 w-full border rounded-md"
            />
            {errors.password && (
              <div className="text-sm text-red-500">{errors.password}</div>
            )}
          </div>

          <Button type="submit" rounded fullWidth>
            Login
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account?</span>
          <Button variant="link" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
