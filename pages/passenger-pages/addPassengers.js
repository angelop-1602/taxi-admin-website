import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Link from "next/link";
import Drivers from "./Drivers";
import styled from "styled-components";
import { app, db  } from "../firebase/firebaseConfig";

const Container = styled.div`
  grid-column: 1;
  background: #afd3e2;
  color: #146c94;
  height: 100%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 16px;
`;

const SubmitButton = styled.button`
  background: #146C94;
  color: #f6f1f1;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-right: 8px;
  &:hover {
    background: #84b9d9;
  }
`;

const BackButton = styled.span`
  color: #146c94;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #84b9d9;
  }
`;

export default function AddPassengers() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [mobnumber, setMobnumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  async function handleAddPassengers() {
    const errors = {};

    if (!email) {
      errors.email = "Email is required.";
    }
    if (!username) {
      errors.username = "Username is required.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!mobnumber) {
      errors.mobnumber = "Mobile number is required.";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "passengers"), {
        heading: 0,
        email: email,
        mobile_number: mobnumber,
        username: username,
        password: password,
        userLongtitude: 0,
        userLatitude: 0,
        userType: "passenger",
      });

      setEmail("");
      setMobnumber("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setErrorMessages({});

      window.alert("Passenger added successfully!");
      router.push("/Passengers"); // Replace "/Drivers" with the correct path to the Drivers page
    } catch (error) {
      console.error("Error adding passenger: ", error);
      setErrorMessages({ general: error.message });
    }
  }

  return (
    <Container>
      <p className="text-gray-700 text-4xl m-8 font-bold">Add Passenger</p>
      <div className="p-4">
        {/* ----------------------------------------------------------------------------- */}
        <label
          htmlFor="username"
          className="block text-2xl font-bold text-gray-700 mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          placeholder="Enter Username"
          autoComplete="off"
          onChange={(e) => {
            const enteredUsername = e.target.value;
            const onlyLetters = /^[A-Za-z]+$/;
            if (onlyLetters.test(enteredUsername) || enteredUsername === "") {
              setUsername(enteredUsername);
            }
          }}
          className={`border ${
            errorMessages.username ? "border-red-500" : "border-gray-300"
          } rounded-sm shadow-sm block w-full sm:text-lg p-2 mb-4`}
        />
        {errorMessages.username && (
          <p className="text-red-500 mb-4">{errorMessages.username}</p>
        )}
        {/* ----------------------------------------------------------------------------- */}
        <label
          htmlFor="mobnumber"
          className="block text-2xl font-bold text-gray-700 mb-2"
        >
          Mobile Number:
        </label>
        <input
          type="number"
          id="mobnumber"
          placeholder="Enter Mobile Number"
          autoComplete="off"
          onChange={(e) => {
            const enteredMobnumber = e.target.value;
            const onlyNumbers = /^[0-9]+$/;
            if (!onlyNumbers.test(enteredMobnumber)) {
              setMobnumber("");
            } else {
              setMobnumber(enteredMobnumber);
            }
          }}
          className={`border ${
            errorMessages.mobnumber ? "border-red-500" : "border-gray-300"
          } rounded-sm shadow-sm block w-full sm:text-lg p-2 mb-4 no-spin`}
        />

        {errorMessages.mobnumber && (
          <p className="text-red-500 mb-4">{errorMessages.mobnumber}</p>
        )}

        {/* ----------------------------------------------------------------------------- */}
        <label
          htmlFor="email"
          className="block text-2xl font-bold text-gray-700 mb-2"
        >
          Email:
        </label>
        <input
          type="text"
          id="email"
          placeholder="Enter Email"
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => {
            const enteredEmail = e.target.value;
            if (!enteredEmail.endsWith("@gmail.com")) {
              setEmail("");
            }
          }}
          className={`border ${
            errorMessages.email ? "border-red-500" : "border-gray-300"
          } rounded-sm shadow-sm block w-full sm:text-lg p-2 mb-4`}
        />
        {errorMessages.email && (
          <p className="text-red-500 mb-4">{errorMessages.email}</p>
        )}
        {/* ----------------------------------------------------------------------------- */}

        <label
          htmlFor="password"
          className="block text-2xl font-bold text-gray-700 mb-2"
        >
          Password:
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="off"
            placeholder="Enter Password 8-16 characters"
            onChange={(e) => {
              const enteredPassword = e.target.value;
              if (enteredPassword.length >= 8 || enteredPassword === "") {
                setPassword(enteredPassword);
              }
            }}
            className={`border ${
              errorMessages.password ? "border-red-500" : "border-gray-300"
            } rounded-sm shadow-sm block w-full sm:text-lg p-2 mb-4`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute bottom-3 right-6 text-gray-500 focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errorMessages.password && (
          <p className="text-red-500 mb-4">{errorMessages.password}</p>
        )}
        {/* ----------------------------------------------------------------------------- */}
        <label
          htmlFor="confirm-password"
          className="block text-2xl font-bold text-gray-700 mb-2"
        >
          Confirm Password:
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            autoComplete="off"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`border ${
              errorMessages.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            } rounded-sm shadow-sm block w-full sm:text-lg p-2 mb-4`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute bottom-3 right-6 text-gray-500 focus:outline-none"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errorMessages.confirmPassword && (
          <p className="text-red-500 mb-4">{errorMessages.confirmPassword}</p>
        )}
        {/* ----------------------------------------------------------------------------- */}
        <SubmitButton onClick={handleAddPassengers}>Add Passenger</SubmitButton>

        <Link href="/Passengers" className="text-center mt-4">
          <BackButton>Back to Passenger</BackButton>
        </Link>
      </div>
    </Container>
  );
}
