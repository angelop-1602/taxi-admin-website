import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import * as styles from "./style.js";
import { db } from "../firebase/firebaseConfig.js";
import Avatar from "react-avatar";

export default function ViewDriver() {
  const router = useRouter();
  const { id } = router.query; // Get the driver ID from the query parameter

  const [driver, setDriver] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchRecentTrips(driverId) {
    try {
      const tripsQuery = query(
        collection(db, "trips"), // Replace with your actual trips collection name
        where("driverId", "==", driverId)
      );
      const tripsSnapshot = await getDocs(tripsQuery); // Use getDocs to fetch a list of documents

      const tripsData = tripsSnapshot.docs.map((doc) => doc.data());

      setRecentTrips(tripsData);
    } catch (error) {
      console.error("Error fetching recent trips: ", error);
    }
  }

  async function fetchDriverDetails(driverId) {
    try {
      const driverDocRef = doc(db, "drivers", driverId);
      const driverDoc = await getDoc(driverDocRef);

      if (driverDoc.exists()) {
        const driverData = driverDoc.data();
        setDriver(driverData);
      } else {
        console.error("Driver not found.");
        // Set an error state here if needed
      }
    } catch (error) {
      console.error("Error fetching driver details: ", error);
      // Set an error state here if needed
    } finally {
      setLoading(false); // Set loading to false when data fetch is complete
    }
  }

  useEffect(() => {
    if (id) {
      console.log("Fetching driver details and recent trips for ID:", id);
      fetchDriverDetails(id);
      fetchRecentTrips(id);
    }
  }, [id]);

  if (loading) {
    // Display a loading indicator while fetching data
    return (
      <div className="text-center mt-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (

    <div className="container mx-auto">
      <button className="pt-2 pb-1 px-5 mb-4 mr-2 font-bold text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
        <Link
          href="../driver-pages/Drivers"
          className="
           rounded inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mr-2"
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
      <h1 style={styles.titleStyle}>Driver Profile</h1>
      <div className="md:flex no-wrap md:-mx-2 ">
        <div className="w-full md:w-3/12 md:mx-2">
          <div className="bg-white p-3 pt-10 rounded-t-2xl">
            <div className="flex flex-col items-center">
              <Avatar
                name={driver.driverName} // Assuming driverName is the driver's name
                round={true}
                size={100}
                className="h-auto"
              />
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {driver.driverName}
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full md:w-9/12 mx-2 h-64">
          <div className="bg-white p-3 shadow-sm rounded-sm">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
              <span className="text-black-500">
                <svg
                  className="w-10"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span className="tracking-wide text-4xl ">About</span>
            </div>
            <div className="text-gray-700">
              <div className="grid md:grid-cols-2 text-sm">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold text-2xl">Name:</div>
                  <div className="px-4 py-2 text-xl">
                    <div>{driver.driverName}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold text-2xl">
                    Gender:
                  </div>
                  <div className="px-4 py-2 text-xl">{driver.gender}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold text-2xl">
                    Contact Number:
                  </div>
                  <div className="px-4 py-2 text-xl">{driver.contact}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold text-2xl">
                    Address:
                  </div>
                  <div className="px-4 py-2 text-xl">{driver.email}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold text-2xl">
                    Vehicle Number:
                  </div>
                  <div className="px-4 py-2 text-xl">
                    {driver.vehicle_number}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold text-2xl">
                    Birthday:
                  </div>
                  <div className="px-4 py-2 text-xl">{driver.birthday}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4"></div>
          <div className="bg-white p-3 shadow-sm rounded-sm">
            <h2 className="text-xl font-semibold mb-2">Recent Trips</h2>

            {recentTrips.map((trip, index) => (
              <div className="container mt-4" key={index}>
                <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Pick up
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Drop off
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Passenger Name
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Distance
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Cost
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">{trip.pickupAddress}</td>
      <td className="px-6 py-4 whitespace-nowrap">{trip.destinationAddress}</td>
      <td className="px-6 py-4 whitespace-nowrap">{trip.passengerName}</td>
      <td className="px-6 py-4 whitespace-nowrap">{Number(trip.distance).toFixed(2)}</td>
      <td className="px-6 py-4 whitespace-nowrap">{Number(trip.cost).toFixed(2)}</td>
    </tr>
  </tbody>
</table>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
