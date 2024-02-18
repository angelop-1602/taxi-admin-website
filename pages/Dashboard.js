import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";


const Dashboard = () => {

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showHiddenDetails, setShowHiddenDetails] = useState(false);
  const transactionsPerPage = 10;

  useEffect(() => {

    const fetchRecentTransactions = async () => {
      const querySnapshot = await getDocs(collection(db, "trips"));
      const transactions = [];
      querySnapshot.forEach((doc) => {
        const transactionData = doc.data();
        const {
          id,
          distance,
          destinationAddress,
          driverName,
          passengerName,
          tripCompleted,
          cost,
        } = transactionData;

        const formattedDistance =
          distance !== undefined ? distance.toFixed(2) : "";

        const transactionCard = (
          <div
            key={id}
            className={`rounded bg-white h-full shadow-lg p-6 card ${
              tripCompleted ? "completed" : "not-completed"
            }`}
            style={{
              backgroundColor: tripCompleted ? "#defaf0" : "#F6F1F1",
              color: "#146C94",
            }}
          >
            <div className="accent" />
            <div className="content hover-details">
              <div className="mb-4">
                <p className="text-2xl font-extrabold text-146C94">ID: {id}</p>
                <div className="hidden-details">
                  <p className="text-lg hidden-info text-146C94">
                    Distance: {formattedDistance} km
                  </p>
                  <p className="text-lg hidden-info text-146C94">
                    Driver Name: {driverName}
                  </p>
                  <p className="text-lg hidden-info text-146C94">
                    Passenger Name: {passengerName}
                  </p>
                </div>
              </div>
              <div className="cost-section">
                {tripCompleted ? (
                  cost !== undefined ? (
                    <p className="cost-number">{cost.toFixed(2)}</p>
                  ) : null
                ) : (
                  <p className="text-lg font-bold text-red-500">Canceled</p>
                )}
              </div>
            </div>
          </div>
        );

        transactions.push(transactionCard);
      });

      // Sort transactions in ascending order based on ID
      const sortedTransactions = transactions.sort((a, b) => {
        const idA = parseInt(a.key);
        const idB = parseInt(b.key);
        return idA - idB;
      });

      setRecentTransactions(sortedTransactions);
    };

    const fetchData = async () => {
      await Promise.all([fetchRecentTransactions()]);
    };

    fetchData();

    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleHiddenDetails = () => {
    setShowHiddenDetails((prev) => !prev);
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = recentTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const previousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <>
      <p
        className="text-gray-700 text-5xl mb-10 font-bold"
        style={{ color: "#146C94" }}
      >
        Dashboard
      </p>

      <div
        className="recent-transactions"
        style={{ backgroundColor: "#AFD3E2" }}
      >
        <p
          className="text-4xl font-extrabold mb-8"
          style={{ color: "#146C94" }}
        >
          Recent Transactions
        </p>
        <div className="transaction-list flex flex-col items-center">
          {currentTransactions.length > 0 ? (
            currentTransactions
          ) : (
            <p>No recent transactions found.</p>
          )}
        </div>
        <div className="pagination flex justify-center mt-4">
          <button
            className={`pagination-button ${
              currentPage === 1 ? "disabled" : ""
            }`}
            onClick={previousPage}
            disabled={currentPage === 1}
            style={{
              backgroundColor: "#146C94",
              color: "#FFFFFF",
              padding: "8px 16px",
              margin: "0 8px",
              borderRadius: "0.375rem",
            }}
          >
            Previous
          </button>
          <button
            className={`pagination-button ${
              currentTransactions.length < transactionsPerPage ? "disabled" : ""
            }`}
            onClick={nextPage}
            disabled={currentTransactions.length < transactionsPerPage}
            style={{
              backgroundColor: "#146C94",
              color: "#FFFFFF",
              padding: "8px 16px",
              margin: "0 8px",
              borderRadius: "0.375rem",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
