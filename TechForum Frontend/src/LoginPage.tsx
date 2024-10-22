import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import api from "./axiosinstance";
import { useDispatch } from "react-redux";
import { setUser } from "./userSlice";
import { LockPerson } from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/login/authorize", {
        email,
        password,
      });
      if (response.status === 200) {
        const userData = response.data;
        dispatch(setUser(userData));
        console.log("Login successful:", userData);
        navigate("/");
      }
    } catch (error) {
      setError(
        "Error during login. Please check your credentials and try again."
      );
      console.error("Error during login:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <div className="login-container">
      <h2>
        <LockPerson style={{ fontSize: "40px", color: "rgb(10, 29, 53)" }} />
        Login
      </h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log in</button>
      </form>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          style={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
