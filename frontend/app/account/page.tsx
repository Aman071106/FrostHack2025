"use client"

import { useState } from "react"
import { ArrowRight, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Sidebar from "@/components/sidebar";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("ACCOUNT")
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
            <Link href="/features" className="px-8 py-2 font-medium text-[#0a0c29] bg-gray-100">
              FEATURES
            </Link>
            <Link href="" className="px-8 py-2 font-medium text-[#0a0c29] ">
              ACCOUNT
            </Link>
          </div>
          <div className="w-10"></div>
        </header>

        {/* Main content area */}
        <div className="rounded-lg border border-[#949494] bg-white p-6 mx-auto w-200 mt-20">
          {/* Profile section */}
          <div className="mb-12 flex flex-col items-center md:flex-row md:items-start md:space-x-8">
            <div className="mb-4 h-40 w-40 overflow-hidden rounded-full md:mb-0">
              <Image
                src="/avatar.jpg?height=120&width=120"
                alt="Profile avatar"
                width={120}
                height={120}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold text-[#0a0c29]">Account Holder - Fedrick James</h2>
              <p className="text-xl text-[#0a0c29]">Account Number - 0989xxxxxx195</p>
              <p className="text-xl text-[#0a0c29]">Email - example@gmail.com</p>

              <div className="mt-4 pt-2">
                <button className="flex items-center rounded-md bg-[#1c3f3a] px-6 py-3 text-white">
                  LOG OUT <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Balance section */}
          <div className="mb-16 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-5 md:space-y-0">
            <h3 className="text-3xl font-bold text-[#0a0c29]">Account Balance:</h3>
            <div className="rounded-md bg-[#1c3f3a] px-6 py-3">
              <span className="text-2xl font-bold text-white">$2000</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-[#949494]">View Expense Insights</p>
              <Link
                href="/expense-insights"
                className="flex w-full items-center justify-center rounded-md bg-[#1c3f3a] px-6 py-3 text-white"
              >
                EXPENSE INSIGHTS <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <p className="text-[#949494]">Ask Your AI</p>
              <Link
                href="/aiAssistanceLanding"
                className="flex w-full items-center justify-center rounded-md bg-[#1c3f3a] px-6 py-3 text-white"
              >
                ASK YOUR AI <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}