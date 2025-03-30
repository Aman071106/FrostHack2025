"use client";
import { Menu, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/components/sidebar"; // Ensure the Sidebar component exists and is correctly exported

export default function AiDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col relative transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <header className="w-full p-4 flex justify-between items-center bg-white ">
          {/* Menu Button */}
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 border border-gray-200 rounded-md shadow-sm">
            <Menu className="h-5 w-5 text-gray-500" />
          </button>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-full border border-gray-200 flex overflow-hidden shadow-sm">
            <Link href="/features" className="px-8 py-2 font-medium text-[#0a0c29]">
              FEATURES
            </Link>
            <Link href="/account" className="px-8 py-2 font-medium text-[#0a0c29] bg-gray-100">
              ACCOUNT
            </Link>
          </div>
          <div className="w-10"></div>
        </header>

        {/* Main Content Section */}
        <main className="flex-1 flex flex-col p-4 items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
            {/* Expense Insights Card */}
            <div className="border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold text-[#0a0c29]">Expense Insights</h2>
              <p className="text-gray-600 mt-2 leading-relaxed text-center px-4">
                Visualize your spending with interactive graphs! Track your weekly expenses through bar charts and get a clear breakdown of where your money goes with a detailed category-wise pie chart.
              </p>
              <Link href="/expense-insights" className="mt-6 px-6 py-3 bg-[#1c3f3a] text-white rounded-full flex items-center gap-2 hover:bg-[#1c3f3a]/90 transition-colors">
                Explore Insights <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Ask Your AI Card */}
            <div className="border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold text-[#0a0c29]">Ask Your AI</h2>
              <p className="text-gray-600 mt-2 leading-relaxed text-center px-4">
                Your personal finance assistant at your fingertips! Get smart insights on your spending habits, ask whether you should make a purchase, and receive AI-driven suggestions to manage your expenses wisely.
              </p>
              <Link href="/aiAssistanceLanding" className="mt-6 px-6 py-3 bg-[#1c3f3a] text-white rounded-full flex items-center gap-2 hover:bg-[#1c3f3a]/90 transition-colors">
                Start Chat <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
