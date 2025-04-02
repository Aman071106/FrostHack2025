"use client";
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import TransactionCard from "../components/transactionCard";
import Sidebar from "@/components/sidebar";
import Chat from "@/components/Chat"; // Import the chat component
import { useSession, signOut } from "next-auth/react"; // Import NextAuth hooks
import { Menu, ChevronRight, TrendingUp, PieChart, DollarSign, Clock, Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession(); // Get session data and status
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  const featureRefs = [useRef(null), useRef(null), useRef(null)];
  const router = useRouter();
  
  // Animation on page load
  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout and redirect to home
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-green-700" />,
      title: "Smart Analytics",
      description: "AI-powered insights to track spending patterns and optimize your budget."
    },
    {
      icon: <PieChart className="h-8 w-8 text-green-700" />,
      title: "Budget Planning",
      description: "Create personalized budgets that adapt to your financial goals."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-700" />,
      title: "Secure Transactions",
      description: "Bank-level encryption keeps your financial data protected."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      <Head>
        <title>BlockOps - Track, Save, and Grow Your Wealth with AI</title>
        <meta name="description" content="Take control of your finances with AI-powered tracking and smart expense suggestions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col relative transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <header className="fixed top-0 w-full p-4 flex justify-between items-center bg-white/80 backdrop-blur-md z-5 shadow-sm transition-all duration-300">
          {/* Logo and Menu Button */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
            <div className="ml-4 font-bold text-xl text-[#0A0C29] hidden md:block">
              <span className="text-green-900">Block</span>Ops
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-full border border-gray-200 flex overflow-hidden shadow-sm transition-transform duration-300 hover:shadow-md">
            <Link href="/features" className="px-6 py-2 font-medium text-[#0a0c29] hover:bg-gray-100 transition-colors duration-200">
              FEATURES
            </Link>
            <Link href="/account" className="px-6 py-2 font-medium text-[#0a0c29] hover:bg-gray-100 transition-colors duration-200">
              ACCOUNT
            </Link>
          </div>
          
          {/* Conditional Login/Logout Button */}
          <div className="flex items-center">
            {status === 'authenticated' ? (
              <button 
                onClick={handleLogout}
                className="flex items-center text-white bg-red-500 border py-2 px-4 rounded-lg font-medium text-sm hover:bg-red-600 hover:text-white transition-all duration-200"
              >
                LOGOUT
                <LogOut className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <Link href="/signup">
                <button className="hidden sm:flex items-center text-green-900 border border-green-900 py-2 px-4 rounded-lg font-medium text-sm hover:bg-green-900 hover:text-white transition-all duration-200">
                  SIGN IN
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </Link>
            )}
          </div>
        </header>

        {/* Main content with proper spacing from fixed header */}
        <main className="py-32 px-6 md:px-16"> {/* Increased top padding from py-24 to py-32 */}
          {/* Hero Section */}
          <div 
            ref={heroRef}
            className={`max-w-6xl mx-auto transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Column: Text */}
              <div className="relative">
                {/* Floating Decorative Elements */}
                <div className={`absolute -left-12 -top-9 w-20 h-20 z-0 bg-green-900/10 rounded-full transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
                <div className={`absolute -right-15 bottom-20 w-12 h-12 bg-green-900/10 rounded-full transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
                
                {/* Title in a single line with full-width green underline */}
                <h1 className="text-5xl md:text-6xl font-bold mb-5 text-[#0A0C29] relative inline-block">
                  <span className={`inline-block transform transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Block</span>
                  <span className={`inline-block transform transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Ops</span>
                  <div className={`h-2 w-full bg-green-900 mt-2 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}></div>
                </h1>
                
                <h2 className={`text-xl md:text-2xl font-bold text-gray-900 mb-8 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  TRACK, SAVE, AND GROW YOUR WEALTH WITH AI.
                </h2>

                <p className={`text-lg md:text-xl text-gray-500 mb-10 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  Take control of your finances with AI-powered tracking and smart expense suggestions. Effortlessly monitor your spending, optimize budgets, and achieve financial freedom with intelligent insights.
                </p>

                <div className={`mb-6 inline-block transition-all duration-1000 delay-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {status === 'authenticated' ? (
                    <Link href="/expense-insights">
                      <button className="group relative bg-green-900 text-white py-4 px-8 rounded-lg font-bold text-xl flex items-center hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                        <span className="relative z-10">EXPENSE INSIGHTS</span>
                        <ChevronRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        <div className="absolute top-0 left-0 w-full h-full bg-green-800 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-bottom-right z-0"></div>
                      </button>
                    </Link>
                  ) : (
                    <Link href="/signup">
                      <button className="group relative bg-green-900 text-white py-4 px-8 rounded-lg font-bold text-xl flex items-center hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                        <span className="relative z-10">SIGN UP / SIGN IN</span>
                        <ChevronRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        <div className="absolute top-0 left-0 w-full h-full bg-green-800 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-bottom-right z-0"></div>
                      </button>
                    </Link>
                  )}
                </div>

                {/* Stats Section with fixed grid layout */}
                <div className={`ml-[-60px] mt-12 grid grid-cols-3 gap-4 transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <DollarSign className="h-8 w-8 text-green-700 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">100K+</p>
                    <p className="text-sm text-gray-500">Active Users</p>
                  </div>
                  <div className="flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <Clock className="h-8 w-8 text-green-700 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">24/7</p>
                    <p className="text-sm text-gray-500">Support</p>
                  </div>
                  <div className="flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <TrendingUp className="h-8 w-8 text-green-700 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">95%</p>
                    <p className="text-sm text-gray-500">Growth Rate</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Images & Cards */}
              <div className="grid grid-cols-2 gap-6 items-center">
                {/* Content remains the same as original */}
                {/* Top-left Image */}
                <div 
                  className={`bg-gray-100 rounded-3xl overflow-hidden shadow-lg transform transition-all duration-1000 delay-200 hover:scale-105 hover:shadow-xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                >
                  <div className="relative h-[272px] w-full overflow-hidden">
                    <Image
                      src="/landingimage1.jpg"
                      alt="Financial planning with calculator, money, and miniature house"
                      width={387}
                      height={272}
                      className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white text-sm font-medium">Smart Planning</p>
                    </div>
                  </div>
                </div>

                {/* Top-right: Transaction Card with Animation */}
                <div 
                  className={`relative flex justify-end transition-all duration-1000 delay-400 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                >
                  <div className="animate-float">
                    <TransactionCard />
                  </div>
                </div>

                {/* Bottom-left: Savings Card with Rotation Animation */}
                <div 
                  className={`relative flex justify-start transition-all duration-1000 delay-600 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                >
                  <div className="hover:rotate-3 transition-all duration-300 animate-float-reverse">
                    <div className="bg-green-900 rounded-full p-6 text-white text-center shadow-lg">
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
                      <p className="text-sm font-semibold text-gray-200">Users</p>
                      <div className="text-3xl font-bold relative">
                        <span className="absolute -left-3 -top-0 text-m"></span>
                        <span className="ml-2">100 K</span>
                      </div>
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
                </div>

                {/* Bottom-right Image */}
                <div 
                  className={`bg-gray-100 rounded-3xl overflow-hidden shadow-lg transform transition-all duration-1000 delay-800 hover:scale-105 hover:shadow-xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                >
                  <div className="relative h-[272px] w-full overflow-hidden">
                    <Image
                      src="/landingimage2.jpg"
                      alt="Financial analysis with charts and laptop"
                      width={387}
                      height={272}
                      className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white text-sm font-medium">Smart Analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section - Remains the same */}
          <div className="max-w-6xl mx-auto mt-32">
            <h2 className="text-3xl font-bold text-center text-[#0A0C29] mb-12 relative">
              <span>Why Choose BlockOps?</span>
              <div className="h-1 w-24 bg-green-900 mx-auto mt-4"></div>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  ref={featureRefs[index]}
                  className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative group`}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Floating Gradient Orbs (Decorative) */}
        <div className={`fixed top-1/4 -left-32 w-64 h-64 rounded-full bg-green-900/5 blur-3xl pointer-events-none transition-all duration-1000 ${isLoaded ? 'opacity-80' : 'opacity-0'}`}></div>
        <div className={`fixed bottom-1/4 -right-32 w-64 h-64 rounded-full bg-green-900/5 blur-3xl pointer-events-none transition-all duration-1000 ${isLoaded ? 'opacity-80' : 'opacity-0'}`}></div>
        
        {/* Floating Chat Bot */}
        <div className="fixed bottom-6 right-6 z-50">
          <Chat />
        </div>
      </div>
    </div>
  );
}