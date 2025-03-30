"use client";

import { ArrowUp, Clock, Menu, PenSquare, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/components/sidebar"; // Ensure Sidebar exists and is correctly exported

export default function AiAssistantPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col relative transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <header className="w-full p-4 flex justify-between items-center bg-white">
          {/* Menu Button */}
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 border border-gray-200 rounded-md shadow-sm">
            <Menu className="h-5 w-5 text-gray-500" />
          </button>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-full border border-gray-200 flex overflow-hidden shadow-sm">
            <Link href="/features" className="px-8 py-2 font-medium text-[#0a0c29] bg-gray-100">
              FEATURES
            </Link>
            <Link href="/account" className="px-8 py-2 font-medium text-[#0a0c29] bg-gray-100">
              ACCOUNT
            </Link>
          </div>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 flex flex-col p-4">
          <div className="w-full max-w-4xl mx-auto flex-1 border border-gray-200 rounded-3xl p-6 flex flex-col">
            {/* Action buttons */}
            <div className="relative flex gap-2 mb-8">
              {/* History Button with Dropdown */}
              <div className="relative">
                <button
                  className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2"
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                >
                  <Clock className="h-5 w-5 text-gray-500" />
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                {isHistoryOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <ul className="py-2 text-gray-700">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Recent Chat 1</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Recent Chat 2</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Recent Chat 3</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <button className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <PenSquare className="h-5 w-5 text-gray-500" />
                <span className="sr-only">Edit</span>
              </button>
            </div>

            {/* AI content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
              <div className="mb-6">
                <Image
                  src="/bot.png?height=180&width=180"
                  width={619}
                  height={232}
                  alt="AI Assistant Robot"
                  priority
                />
              </div>
            </div>

            {/* Query input */}
            <div className="relative mt-auto">
              <input
                type="text"
                placeholder="Type your Query"
                className="w-full px-6 py-4 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#1c3f3a] focus:outline-none text-[#0A0C29]"
              />
              <button className="absolute right-2 bottom-2 p-3 bg-[#1c3f3a] text-white rounded-full hover:bg-[#1c3f3a]/90 transition-colors">
                <ArrowUp className="h-5 w-5" />
                <span className="sr-only">Submit</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
