import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import * as styles from "./style.js";
import { db } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateDrivers() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    driverName: "",
    gender: "",
    contact: "",
    email: "",
    vehicle_number: "",
    birthday: "",
    password: "",
    confirm_password: "",
  });

  const [contactError, setContactError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmpasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    // Fetch driver data and populate the form
    async function fetchDrivers() {
      try {
        const docRef = doc(db, "drivers", id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const driverData = docSnapshot.data();
          // Update the form state with the fetched data
          setFormData(driverData);
        }
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    }

    if (id) {
      fetchDrivers();
    }
  }, [id]);

  // Add an event listener for the form submission

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const docRef = doc(db, "drivers", id);
      await setDoc(docRef, formData, { merge: true }); // Merge the new data with existing data

      // Show a success message
      toast.success("Driver data updated successfully!");

      // You can also redirect the user to another page or perform other actions here if needed.
    } catch (error) {
      console.error("Error updating driver data:", error);
      // Show an error message
      toast.error("Error updating driver data. Please try again.");
    }
  };
  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Capitalize every word in the input value
    const capitalizeEveryWord = (input) => {
      return input
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

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
    if (name === "driverName") {
      // Prevent entering numbers in the "Full Name" field
      if (/\d/.test(value)) {
        setContactError("Full Name cannot contain numbers");
      } else {
        setContactError("");
        // Capitalize every word in the input value
        const capitalizedValue = capitalizeEveryWord(value);
        setFormData({ ...formData, [name]: capitalizedValue });
      }
    } else if (name === "contact") {
      // Use regular expression to check if the input contains only numbers
      if (/[^0-9]/.test(value)) {
        setContactError("Contact number should contain only numbers");
      } else {
        setContactError(""); // Clear the error message if it's numeric
        setFormData({ ...formData, [name]: value }); // Update the state with the value
      }
    } else if (name === "password") {
      // Allow typing in the password field
      setFormData({ ...formData, [name]: value });
      // Check for password length
      if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
      } else {
        setPasswordError("");
      }
    } else if (name === "confirm_password") {
      // Check if the confirm password matches the password
      if (value !== formData.password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
      setFormData({ ...formData, [name]: value });
    } else {
      // For other fields, update the state as usual
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="w-full mx-2 h-64">
      <button className="pt-2 pb-1 px-5 mb-4 mr-2 font-bold text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
        <Link
          href="../driver-pages/Drivers"
          className="rounded inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back
        </Link>
      </button>
      <p></p>
      <h1 style={styles.titleStyle}>Update Driver</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="bg-white p-3 shadow-sm rounded-sm">
          <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8"></div>
          <div className="text-gray-700">
            <div className="grid md:grid-cols-2 text-sm">
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold">Full Name</div>
                <div className="px-4 py-2">
                  <input
                    type="text"
                    name="driverName"
                    id="driverName"
                    className="border rounded px-2 py-1 w-full"
                    value={formData.driverName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold">Gender</div>
                <div className="px-4 py-2">
                  <label htmlFor="male">
                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                    />{" "}
                    Male
                  </label>
                  <label htmlFor="female">
                    <input
                      type="radio"
                      name="gender"
                      id="female"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                    />{" "}
                    Female
                  </label>
                </div>
              </div>
              <hr></hr> <hr></hr>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold">Vehicle Number</div>
                <div className="px-4 py-2">
                  <input
                    type="text"
                    name="vehicle_number"
                    id="vehicle_number"
                    className="border rounded px-2 py-1 w-full"
                    value={formData.vehicle_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold">Birthday</div>
                <div className="px-4 py-2">
                  <input
                    type="date"
                    name="birthday"
                    id="birthday"
                    className="border rounded px-2 py-1 w-full"
                    value={formData.birthday}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <hr></hr> <hr></hr>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold">Contact Number</div>
                <div className="px-4 py-2">
                  <input
                    type="tel"
                    name="contact"
                    id="contact"
                    className="border rounded px-2 py-1 w-full"
                    value={formData.contact}
                    onChange={handleChange}
                  />
                  {contactError && (
                    <div className="px-4 py-2 text-red-600 text-xs">
                      {contactError}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-2 font-semibold">Email Address</div>
                <div className="px-4 py-2">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="border rounded px-2 py-1 w-full"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {emailError && (
                    <div className="px-4 py-2 text-red-600 text-xs">
                      {emailError}
                    </div>
                  )}
                </div>
              </div>
              <hr></hr> <hr></hr>
            </div>

            <div className="text-gray-700">
              <div className="grid md:grid-cols-2 text-sm">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Password</div>
                  <div className="px-4 py-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="border rounded px-2 py-1 w-full"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {passwordError && (
                      <div className="px-4 py-2 text-red-600 text-xs">
                        {passwordError}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">
                    Confirm Password
                  </div>
                  <div className="px-4 py-2">
                    <input
                      type="password"
                      name="confirm_password"
                      id="confirm_password"
                      className="border rounded px-2 py-1 w-full"
                      value={formData.confirm_password}
                      onChange={handleChange}
                    />
                    {confirmpasswordError && (
                      <div className="px-4 py-2 text-red-600 text-xs">
                        {confirmpasswordError}
                      </div>
                    )}
                  </div>
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
            Update Submit
          </button>
        </div>
      </form>
    </div>
  );
}
