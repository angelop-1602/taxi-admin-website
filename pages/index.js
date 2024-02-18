import LoginForm from "../components/LoginForm";
import React, { useState, useEffect } from "react";

import Router from "next/router";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [error, setError] = useState(null);
  const handleLogin = (username, password) => {
    const validUsername = "admin";
    const validPassword = "password";

    if (username === validUsername && password === validPassword) {
      localStorage.setItem("token", "your_token");
      setAuthenticated(true);
      setShowLoginForm(false);

      if (Router.pathname !== "./Dashboard") {
        Router.push("./Dashboard");
      }
    } else {
      setError("Invalid credentials");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token === "your_token") {
      setAuthenticated(true);
      setShowLoginForm(false);
    } else {
      setAuthenticated(false);
      setShowLoginForm(true);
    }
  }, []);

  return (
    <div>
      <LoginForm onLogin={handleLogin} error={error} setError={setError} />
    </div>
  );
}
