import React, { useState } from "react";
import axios from "axios";
import "./Login.scss";
import { getBaseURL } from "../apiConfig";
import TokenRefresher from "../Utils/token";

function Login(props) {
  const [uname, setUname] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pwd) => pwd.length >= 6;

  const validateInputs = () => {
    if (!validateEmail(uname)) {
      setError("Please provide a valid email address.");
      return false;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    const user = { email: uname, password };

    try {
      const url = `${getBaseURL()}api/users/login`;
      const res = await axios.post(url, user);

      if (res.data && res.data.length > 0) {
        const userData = res.data[0];

        sessionStorage.setItem("isUserAuthenticated", true);
        sessionStorage.setItem("customerId", userData.userId);
        sessionStorage.setItem("isAdmin", userData.isAdmin ? true : false);
        sessionStorage.setItem("jwt_token", userData.token);
        sessionStorage.setItem("jwt_refresh_token", userData.refreshToken);

        TokenRefresher(userData.refreshToken);
        props.setUserAuthenticatedStatus(
          userData.isAdmin ? true : false,
          userData.userId
        );
      } else {
        setError("Incorrect email or password.");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !uname || !password;

  return (
    <div className="login-page">
      <div className="brand">
        <div className="logo-dot" />
        <span>E-Commerce App</span>
      </div>

      <div className="login-card">
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Sign in to your account</p>

        {error && (
          <div className="error-banner" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm1 15h-2v2h2v-2zm0-8h-2v6h2V9z"></path>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <span className="icon">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M12 13L2 6.76V18h20V6.76L12 13zm0-2L2 4h20L12 11z"></path>
                </svg>
              </span>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={uname}
                onChange={(e) => setUname(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="icon">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M17 8V7a5 5 0 10-10 0v1H5v12h14V8h-2zm-8 0V7a3 3 0 016 0v1H9z"></path>
                </svg>
              </span>
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPass(e.target.value)}
              />
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="row between">
              <span className="hint">At least 6 characters</span>
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={isDisabled}>
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => props.navigateToRegisterPage()}
          >
            Create an Account
          </button>
        </form>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} E-Commerce App
      </footer>
    </div>
  );
}

export default Login;
