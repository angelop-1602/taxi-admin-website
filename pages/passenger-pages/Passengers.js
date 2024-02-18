import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { app, db } from "../firebase/firebaseConfig";
import * as styles from "./style.js";
import Avatar from "react-avatar";

export const statusCircleStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  display: "inline-block",
  marginRight: "5px",
};

export default function Passengers() {
  const router = useRouter();
  const [passengers, setPassengers] = useState([]);
  const [selectedPassengers, setSelectedPassengers] = useState([]);

  async function fetchPassengers() {
    const querySnapshot = await getDocs(collection(db, "passengers"));
    const passengers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPassengers(passengers);
  }

  function viewPassenger(passengerId) {
    router.push(`/passenger-pages/viewPassenger?id=${passengerId}`);
  }

  async function deletePassengers(ids) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected passenger?"
    );
    if (confirmDelete) {
      try {
        const deletePromises = ids.map((id) =>
          deleteDoc(doc(db, "passengers", id))
        );
        await Promise.all(deletePromises);
        setPassengers(passengers.filter((passenger) => !ids.includes(passenger.id)));
        setSelectedPassengers([]);
        window.alert("Passenger deleted successfully.");
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  }

  useEffect(() => {
    fetchPassengers();
  }, []);

  return (
    <div style={styles.containerStyle}>
      <div style={styles.gridStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={styles.titleStyle}>Passenger Management</h1>
          {/* <Link href="addPassengers">
            <button style={styles.addButtonStyle}>Add Passenger</button>
          </Link> */}
        </div>
        <div style={{ flexGrow: 1, overflowX: "auto" }}>
          <table style={styles.tableStyle}>
            <thead>
              <tr>
                <th style={styles.tableHeaderStyle}>Avatar</th>
                <th style={styles.tableHeaderStyle}>Name</th>
                <th style={styles.tableHeaderStyle}>Email</th>
                <th style={styles.tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger) => (
                <tr key={passenger.id}>
                  <td style={styles.tableDataStyle}>
                    <Avatar
                      name={passenger.passengerName}
                      size="50"
                      round={true}
                      color="#007BFF"
                    />
                  </td>
                  <td style={styles.tableDataStyle}>{passenger.passengerName}</td>
                  <td style={styles.tableDataStyle}>{passenger.email}</td>
                  <td style={styles.tableDataStyle}>
                    <div style={styles.actionButtonsStyle}>
                      {/* <Link href={`/passenger-pages/updatePassengers?id=${passenger.id}`}>
                        <button style={styles.editButtonStyle}>
                          <FaEdit /> Edit
                        </button>
                      </Link> */}
                      <button
                        style={styles.viewButtonStyle}
                        onClick={() => viewPassenger(passenger.id)}
                      >
                        <FaEye /> View
                      </button>
                      <button
                        style={styles.deleteButtonStyle}
                        onClick={() => deletePassengers(passenger.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
