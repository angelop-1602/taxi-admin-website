import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import "../styles/dashStyle.css"
import Layout from "../components/Layout";
import Router from "next/router";
import LoginForm from "../components/LoginForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  const [authenticated, setAuthenticated] = useState(false);
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
      {showLoginForm && <LoginForm onLogin={handleLogin} error={error} setError={setError} />}
      {authenticated && !showLoginForm && (
        <div>
          <Layout>
            <ToastContainer />
            <Component {...pageProps} />
          </Layout>
        </div>
      )}
      {!authenticated && !showLoginForm && <p>Loading...</p>}
    </div>
  );
}

export default MyApp;
