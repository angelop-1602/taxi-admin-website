
import styles from "../components/LoginForm.module.css";
import React, { useState } from "react";
import Image from "next/image";

const LoginForm = ({ onLogin, error, setError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className={styles.parent}>
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Image src="/cvkatco-logo.png" alt="Login" width={250} height={250} />
      </div>
      <h2 className={styles.loginHeading}>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
    </div>
  );
};

export default LoginForm;
