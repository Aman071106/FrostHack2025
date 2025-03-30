// pages/index.js
"use client";
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import TransactionCard from "../components/transactionCard";
import { use, useState } from "react";
import Sidebar from "@/components/sidebar";
import { Menu } from 'lucide-react';
export default function Home() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white flex">
      <Head>
        <title>BlockOps - Track, Save, and Grow Your Wealth with AI</title>
        <meta name="description" content="Take control of your finances with AI-powered tracking and smart expense suggestions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
            <Link href="/account" className="px-8 py-2 font-medium text-[#0a0c29] bg-gray-100">
              ACCOUNT
            </Link>
          </div>
          <div className="w-10"></div>
        </header>

      <main className="py-8 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl font-bold mb-5 text-[#0A0C29]">BlockOps</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">TRACK, SAVE, AND GROW YOUR WEALTH WITH AI.</h2>

              <p className="text-xl text-gray-500 mb-10">
                Take control of your finances with AI-powered tracking and smart expense suggestions. Effortlessly monitor your spending, optimize budgets, and achieve financial freedom with intelligent insights.
              </p>

              <div className="mb-6 inline-block">
                <Link href="/signup">
                  <button className="relative bg-green-900 text-white py-4 px-8 rounded-lg font-bold text-xl flex items-center cursor-grab active:cursor-grabbing scale-100">
                    SIGN UP/ SIGN IN
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </Link>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-6 items-center">
              {/* Top-left Image */}
              <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/landingimage1.jpg"
                  alt="Financial planning with calculator, money, and miniature house"
                  width={387}
                  height={272}
                  className="w-[387px] h-[272px] object-cover"
                />
              </div>

              {/* Top-right: Transaction Card */}
              <div className="relative flex justify-end">
                <TransactionCard />
              </div>

              {/* Bottom-left: Savings Card */}
              <div className="relative flex justify-start">
                <div className="bg-green-900 rounded-full p-6 text-white text-center ">
                  <div className="flex justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="h-3"></div>
                  <p className="text-sm font-semibold text-gray-200">Saved</p>
                  <p className="text-3xl font-bold">$2500</p>
                  <div className="mt-3">
                    <div className="w-12 h-12 bg-orange-200 rounded-full mx-auto overflow-hidden border-2 border-gray-300">
                      <Image
                        src="/avatar.jpg"
                        alt="User avatar"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom-right Image */}
              <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/landingimage2.jpg"
                  alt="Financial analysis with charts and laptop"
                  width={387}
                  height={272}
                  className="w-[387px] h-[272px] object-cover"
                />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
}

