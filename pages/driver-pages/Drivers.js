import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { app, db } from "../firebase/firebaseConfig";
import * as styles from "./style.js"; // Import the styles object
import Avatar from "react-avatar"; // Import the Avatar component
import { toast } from "react-toastify";
import Modal from "react-modal";

export const statusCircleStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  display: "inline-block",
  marginRight: "5px", // Adjust the spacing as needed
};
export default function Drivers() {
  const router = useRouter();
  const [drivers, setDrivers] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [driverIdToDelete, setDriverIdToDelete] = useState(null);

  async function fetchDrivers() {
    const querySnapshot = await getDocs(collection(db, "drivers"));
    const drivers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })); 
    
    setDrivers(drivers);
  }

  async function startTrip(driverId) {
    try {
      const driverRef = doc(db, "drivers", driverId);
      await updateDoc(driverRef, { isOnTrip: true });
      console.log(`Driver with ID ${driverId} has started a trip.`);
    } catch (error) {
      console.error("Error starting trip: ", error);
    }
  }
  async function finishTrip(driverId) {
    try {
      const driverRef = doc(db, "drivers", driverId);
      await updateDoc(driverRef, { isOnTrip: false });
      console.log(`Driver with ID ${driverId} has finished the trip.`);
    } catch (error) {
      console.error("Error finishing trip: ", error);
    }
  }

  function viewDriver(driverId) {
    const targetUrl = `/driver-pages/ViewDriver?id=${driverId}`;
    console.log("Navigating to:", targetUrl);
    router.push(targetUrl);
  }
  

  function openConfirmModal(id) {
    setIsConfirmModalOpen(true);
    setDriverIdToDelete(id);
  }

  function closeConfirmModal() {
    setIsConfirmModalOpen(false);
  }
  async function deleteDriver(id) {
    const driver = drivers.find((driver) => driver.id === id);
    openConfirmModal(driver); // Pass the driver object to the confirmation modal
  }

  async function handleDelete(driver) {
    const { id } = driver; // Extract the id from the driver object
    closeConfirmModal();
    try {
      await deleteDoc(doc(db, "drivers", id));
      setDrivers(drivers.filter((d) => d.id !== id)); // Update the state correctly
      toast.success(
        `Driver "${driver.driverName}" has been successfully deleted.`
      );
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error(
        `An error occurred while deleting the driver "${driver.driverName}".`
      );
    }
  }

  useEffect(() => {
    fetchDrivers();
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
          <h1 style={styles.titleStyle}>Driver Management</h1>
          <Link href="addDrivers">
            <button style={styles.addButtonStyle}>Add Driver</button>
          </Link>
        </div>
        <div style={{ flexGrow: 1, overflowX: "auto" }}>
          <table style={styles.tableStyle}>
            <thead>
              <tr>
                <th style={styles.tableHeaderStyle}>Avatar</th>
                <th style={styles.tableHeaderStyle}>Name</th>
                <th style={styles.tableHeaderStyle}>Vehicle Number</th>
                <th style={styles.tableHeaderStyle}>Phone Number</th>
                <th style={styles.tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td style={styles.tableDataStyle}>
                    <Avatar
                      name={driver.driverName}
                      size="50"
                      round={true}
                      color="#007BFF"
                    />
                  </td>
                  <td style={styles.tableDataStyle}>{driver.driverName}</td>
  
                  <td style={styles.tableDataStyle}>{driver.vehicle_number}</td>
                  <td style={styles.tableDataStyle}>{driver.contact}</td>
                  <td style={styles.tableDataStyle}>
                    <div style={styles.actionButtonsStyle}>
                      <Link
                        href={`/driver-pages/updateDrivers?id=${driver.id}`}
                      >
                        <button style={styles.editButtonStyle}>
                          <FaEdit /> Edit
                        </button>
                      </Link>
                      <button
                        style={styles.viewButtonStyle} // Add a new style for the "View" button
                        onClick={() => viewDriver(driver.id)} // Add a function to handle viewing the driver
                      >
                        <FaEye /> View
                      </button>
                      <button
                        style={styles.deleteButtonStyle} // Add a style for the "Delete" button
                        onClick={() => deleteDriver(driver.id)} // Call the deleteDriver function
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

      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Confirm Deletion"
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          content: {
            position: "relative",
            backgroundColor: "#fff", // White background
            padding: "20px",
            borderRadius: "4px",
            maxWidth: "400px", // Adjust the maximum width as needed
            width: "100%",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", // Box shadow for the modal
            textAlign: "center",
          },
        }}
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this driver?</p>
        <button
          onClick={() => handleDelete(driverIdToDelete)}
          style={{
            backgroundColor: "#4caf50", // Green color
            color: "#fff", // White text color
            margin: "5px",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            borderRadius: "4px",
          }}
        >
          Confirm
        </button>
        <button
          onClick={closeConfirmModal}
          style={{
            backgroundColor: "#f44336", // Red color
            color: "#fff", // White text color
            margin: "5px",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            borderRadius: "4px",
          }}
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
}
