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

export default function ViewPassenger() {
  const router = useRouter();
  const { id } = router.query; // Get the passenger ID from the query parameter

  const [passenger, setPassenger] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchRecentTrips(passengerId) {
    try {
      const tripsQuery = query(
        collection(db, "trips"), // Replace with your actual trips collection name
        where("passengerId", "==", passengerId)
      );
      const tripsSnapshot = await getDocs(tripsQuery);

      const tripsData = tripsSnapshot.docs.map((doc) => doc.data());

      setRecentTrips(tripsData);
    } catch (error) {
      console.error("Error fetching recent trips: ", error);
    }
  }

  async function fetchPassengerDetails(passengerId) {
    try {
      const passengerDocRef = doc(db, "passengers", passengerId);
      const passengerDoc = await getDoc(passengerDocRef);

      if (passengerDoc.exists()) {
        const passengerData = passengerDoc.data();
        setPassenger(passengerData);
      } else {
        console.error("Passenger not found.");
      }
    } catch (error) {
      console.error("Error fetching passenger details: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      console.log("Fetching passenger details and recent trips for ID:", id);
      fetchPassengerDetails(id);
      fetchRecentTrips(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex">
      <div className="w-1/4 pr-4">
        <button className="pt-2 pb-1 px-5 mb-4 mr-2 font-bold text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
          <Link href="/passenger-pages/Passengers">
            <span className="rounded inline-flex items-center">
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
            </span>
          </Link>
        </button>

        <div className="bg-white p-3 pt-10 rounded-t-2xl">
          <div className="flex flex-col items-center">
            <Avatar
              name={passenger.passengerName} // Assuming passengerName is the passenger's name
              round={true}
              size={100}
              className="h-auto"
            />
            <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
              {passenger.passengerName}
            </h1>
          </div>
        </div>
      </div>

      <div className="w-3/4">
        <div className="bg-white p-3 shadow-sm rounded-sm mt-16">
          <h2 className="text-xl font-semibold mb-2">Recent Trips</h2>
       
            {recentTrips.map((trip, index) => (
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
           
            ))}
     
        </div>
      </div>
    </div>
  );
}
