// Income.js
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
const Income = () => {

  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const calculateTotalIncome = async () => {
      const querySnapshot = await getDocs(collection(db, "trips"));
      let total = 0;
      querySnapshot.forEach((doc) => {
        const incomeData = doc.data();
        const cost = incomeData.cost || 0;
        if (incomeData.tripCompleted) {
          total += cost;
        }
      });
      setTotalIncome(total);
    };

    calculateTotalIncome();
  }, []);

  return (
    <div
      className="rounded bg-white h-40 shadow-lg"
      style={{ backgroundColor: "#AFD3E2" }}
    >
      <div className="m-5">
        <p
          className="font-extrabold text-4xl mb-3 w-full total-income"
          style={{ color: "#146C94" }}
        >
          Total Income:
        </p>
        <p
          className="text-6xl text-green-500 total-income-amount"
          style={{ color: "#146C94" }}
        >
          <span className="text-black">₱</span>&nbsp;
          {totalIncome.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Income;
