"use client";

import { useState, useEffect } from "react";

export default function TransactionCard() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="relative  bg-[#ebe9da] rounded-t-full rounded-b-full px-6 py-6 text-center shadow-md w-40">
      <div className="flex justify-center mb-2">
        <div className="bg-white rounded-full flex items-center justify-center w-10 h-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div className="h-3"></div>
      <p className="text-lg font-semibold text-[#0A0C29]">Successful</p>
      <p className="text-lg font-semibold text-[#0A0C29]">Transaction</p>
      <div className="h-3"></div>
      <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
    </div>
  );
}
