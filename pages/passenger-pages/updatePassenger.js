import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import { db } from "../firebase/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  background: #146c94;
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

const AlertContainer = styled.div`
  color: red;
  font-size: 20px;
  margin-bottom: 16px;
`;

export default function updatePassenger() {
  const router = useRouter();
  const { id } = router.query;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentDriver, setCurrentDriver] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function fetchDrivers() {
    const docRef = doc(db, "passengers", id);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const driverData = docSnapshot.data();
      setCurrentDriver(driverData);
      setEmail(driverData.email);
      setMobileNumber(driverData.mobileNumber);
      setUsername(driverData.username);
      setPassword(driverData.password);
    } else {
      console.error("Driver not found.");
    }
  }

  async function handleUpdateDriver() {
    if (!email || !username || !mobileNumber || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Invalid email address.");
      return;
    }

    const docRef = doc(db, "drivers", id);

    try {
      await setDoc(docRef, {
        email: email,
        username: username,
        // mobileNumber: mobileNumber,
        password: password,
      });

      setErrorMessage("Passenger updated successfully!");

      toast.success("Passenger updated successfully!");
    } catch (error) {
      console.error("Error updating passenger:", error);
      setErrorMessage("Failed to update driver.");
    }
  }

  function validateEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <Container>
      <p className="text-gray-700 text-4xl m-8 font-bold">Update Passenger</p>
      <div className="p-4">
        <label htmlFor="username" className="block text-2xl font-bold text-gray-700 mb-2">
          Username:
        </label>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="border border-gray-300 rounded-sm shadow-sm block w-full sm:text-lg p-2 mb-4"
        />

        <label htmlFor="email" className="block text-2xl font-bold text-gray-700 mb-2">
          Email:
        </label>
        <input
          type="text"
          id="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => {
            if (email && !validateEmail(email)) {
              setErrorMessage("Invalid email address.");
            } else {
              setErrorMessage("");
            }
          }}
          className={`border ${
            errorMessage && !validateEmail(email) ? "border-red-500" : "border-gray-300"
          } rounded-sm shadow-sm block w-full sm:text-lg p-2 mb-4`}
        />
        {errorMessage && !validateEmail(email) && (
          <AlertContainer>{errorMessage}</AlertContainer>
        )}

        {/* <label htmlFor="mobileNumber" className="block text-2xl font-bold text-gray-700 mb-2">
          Mobile Number:
        </label>
        <input
          type="text"
          id="mobileNumber"
          autoComplete="off"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="border border-gray-300 rounded-sm shadow-sm block w-full sm:text-lg p-2 mb-4"
        /> */}

        <label htmlFor="password" className="block text-2xl font-bold text-gray-700 mb-2">
          Password:
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-sm shadow-sm block w-full sm:text-lg p-2 mb-4"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-6 text-gray-500 focus:outline-none"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`border ${
              password !== confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-sm shadow-sm block w-full sm:text-lg p-2 mb-4`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-6 text-gray-500 focus:outline-none"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {password !== confirmPassword && (
          <AlertContainer>Passwords do not match.</AlertContainer>
        )}

        <SubmitButton onClick={handleUpdateDriver}>Update</SubmitButton>
        <Link href="/passenger-pages/Passengers">
          <BackButton>Back to Passenger</BackButton>
        </Link>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />
    </Container>
  );
}
