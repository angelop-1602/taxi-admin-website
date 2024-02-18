import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";
import * as styles from "./style.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddDriver() {
  const router = useRouter();
  const [usernameError, setUsernameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmpasswordError, setConfirmPasswordError] = useState("");
  const [driverData, setDriverData] = useState({
    driverId: '',
    username: "",
    gender: "Male",
    contact: "",
    email: "",
    vehicle_number: "",
    birthday: "",
    userType: "driver",
  });


  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const authResult = await createUserWithEmailAndPassword(
        auth,
        driverData.email,
        driverData.password
      );
  
      await sendEmailVerification(authResult.user);
  
      const driversCollection = collection(db, "drivers");
      const newDocRef = await addDoc(driversCollection, {
        ...driverData,
        userId: authResult.user.uid,
      });
  
      const driverId = newDocRef.id;
      setDriverData({ ...driverData, driverId });
  
      toast.success("Driver added successfully!");
      router.push(`/driver-pages/Drivers`);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email address is already in use. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password must be at least 8 characters long");
      } else {
        console.error("Error adding driver data:", error);
        toast.error("Error adding driver data. Please try again.");
      }
    }
  };
  
  
  

  const capitalizeEveryWord = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const validateEmail = (email) => {
      // Regular expression for email validation
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailPattern.test(email);
    };
    if (name === "email") {
      // Validate email input
      if (!validateEmail(value)) {
        setEmailError("Invalid email address");
      } else {
        setEmailError("");
      }
    }
    if (name === "username") {
      // Prevent entering numbers in the "Full Name" field
      if (/\d/.test(value)) {
        setUsernameError("Full Name cannot contain numbers");
      } else {
        setUsernameError("");
        // Capitalize every word in the input value
        const capitalizedValue = capitalizeEveryWord(value);
        setDriverData({ ...driverData, [name]: capitalizedValue });
      }
    } else if (name === "contact") {
      // Use regular expression to check if the input contains only numbers
      if (/[^0-9]/.test(value)) {
        setContactError("Contact number should contain only numbers");
      } else {
        setContactError(""); // Clear the error message if it's numeric
        setDriverData({ ...driverData, [name]: value }); // Update the state with the value
      }
    } else if (name === "password") {
      // Allow typing in the password field
      setDriverData({ ...driverData, [name]: value });
      // Check for password length
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
      } else {
        setPasswordError("");
      }
    } else if (name === "confirm_password") {
      // Check if the confirm password matches the password
      if (value !== driverData.password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
      setDriverData({ ...driverData, [name]: value });
    } else {
      // For other fields, update the state as usual
      setDriverData({ ...driverData, [name]: value });
    }
  };

  return (
    <div className="w-full mx-2 h-64">
      <button className="pt-2 pb-1 px-5 mb-4 mr-2 font-bold text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
        <Link
          href="../driver-pages/Drivers"
          className="
           rounded inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back
        </Link>
      </button>
      <p></p>
      <h1 style={styles.titleStyle}>Add Driver</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="bg-white p-3 shadow-sm rounded-sm">
          <h1 className="px-4 py-2 font-bold text-4xl">Fill up</h1>
          <div className="text-gray-700"></div>
          <div className="text-gray-700">
            <div className="grid md:grid-cols-2 text-sm">
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold text-xl">
                  Full Name
                  {usernameError && (
                    <div className="px-4 py-2 text-red-600 text-xs">
                      {usernameError}
                    </div>
                  )}
                </div>

                <div className="px-4 py-2">
                  <input
                    type="text"
                    name="username"
                    autoComplete="off"
                    value={driverData.username}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold text-xl">Gender</div>
                <div className="px-4 py-2">
                  <label htmlFor="male" autoComplete="off">
                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      value="Male"
                      checked={driverData.gender === "Male"}
                      onChange={handleChange}
                    />{" "}
                    Male
                  </label>
                  <label htmlFor="female" autoComplete="off">
                    <input
                      type="radio"
                      name="gender"
                      id="female"
                      value="Female"
                      checked={driverData.gender === "Female"}
                      onChange={handleChange}
                    />{" "}
                    Female
                  </label>
                </div>
              </div>
              <hr></hr> <hr></hr>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold text-xl">
                  Vehicle Number
                </div>
                <div className="px-4 py-2">
                  <input
                    type="text"
                    name="vehicle_number"
                    autoComplete="off"
                    value={driverData.vehicle_number}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold text-xl">Birthday</div>
                <div className="px-4 py-2">
                  <input
                    type="date"
                    name="birthday"
                    autoComplete="off"
                    value={driverData.birthday}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
              <hr></hr> <hr></hr>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold text-xl">
                  Contact Number
                  {contactError && (
                    <div className="px-4 py-2 text-red-600 text-xs">
                      {contactError}
                    </div>
                  )}
                </div>
                <div className="px-4 py-2">
                  <input
                    type="tel"
                    name="contact"
                    autoComplete="off"
                    value={driverData.contact}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold text-xl">
                  Email Address
                  {emailError && (
                    <div className="px-4 py-2 text-red-600 text-xs">
                      {emailError}
                    </div>
                  )}
                </div>
                <div className="px-4 py-2">
                  <input
                    type="text"
                    name="email"
                    autoComplete="off"
                    value={driverData.email}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
              <hr></hr> <hr></hr>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold text-xl">
                  Password
                  {passwordError && (
                    <div className="px-4 py-2 text-red-600 text-xs">
                      {passwordError}
                    </div>
                  )}
                </div>
                <div className="px-4 py-2">
                  <input
                    type="password"
                    name="password"
                    autoComplete="off"
                    value={driverData.password}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold text-xl">
                  Confirm Password
                  {confirmpasswordError && (
                    <div className="px-4 py-2 text-red-600 text-xs">
                      {confirmpasswordError}
                    </div>
                  )}
                </div>
                <div className="px-4 py-2">
                  <input
                    type="password"
                    name="confirm_password"
                    autoComplete="off"
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Driver
          </button>
        </div>
      </form>
    </div>
  );
}
