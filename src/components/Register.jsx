import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, Button } from "./shared";
import apiRequest from "../utils/apiRequest";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
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

    // Check for confirm password errors
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);

    const [data, error] = await apiRequest("post", "auth/signup", {
      username,
      password,
    });

    if (data) {
      toast.success(data.message);
      navigate("/login");
      // redirect to login page after successful registration
    } else {
      const errorMessage = error.message || "An error occurred";
      toast.error(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="register-container min-h-screen flex items-center justify-center bg-gray-100 mx-2">
      <div className="p-8 max-w-md w-full bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form onSubmit={handleRegister}>
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

          <div className="input-group mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="mt-1 p-2 w-full border rounded-md"
            />
            {errors.confirmPassword && (
              <div className="text-sm text-red-500">
                {errors.confirmPassword}
              </div>
            )}
          </div>
          <Button type="submit" rounded fullWidth isLoading={isLoading}>
            Register
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account?</span>
          <Button variant="link" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Register;
