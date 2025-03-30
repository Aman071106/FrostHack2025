"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Menu, DollarSign, BarChart4, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import { motion, AnimatePresence } from "framer-motion"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("ACCOUNT")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showBalance, setShowBalance] = useState(false)
  const [balanceAmount, setBalanceAmount] = useState(0)
  
  // Animation control states
  const [hoverExpense, setHoverExpense] = useState(false)
  const [hoverAI, setHoverAI] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
    
    // Animated counter for balance
    setTimeout(() => {
      setShowBalance(true)
      let startValue = 0
      const endValue = 2000
      const duration = 2000 // ms
      const increment = endValue / (duration / 20)
      
      const timer = setInterval(() => {
        startValue += increment
        if (startValue >= endValue) {
          clearInterval(timer)
          setBalanceAmount(endValue)
        } else {
          setBalanceAmount(Math.floor(startValue))
        }
      }, 20)
      
      return () => clearInterval(timer)
    }, 800)
  }, [])

  // Card glow effect on hover
  const cardVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 0 15px rgba(28, 63, 58, 0.5)",
      transition: { duration: 0.3 }
    }
  }
  
  // Button animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2, yoyo: Infinity, repeatDelay: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed z-50"
          >
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative transition-all duration-300">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full p-4 flex justify-between items-center bg-white backdrop-blur-sm bg-opacity-80 sticky top-0 z-10 shadow-sm"
        >
          {/* Menu Button */}
          <motion.button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 border border-gray-200 rounded-md hover:border-[#1c3f3a] transition-colors duration-300"
            whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-5 w-5 text-gray-500 hover:text-[#1c3f3a]" />
          </motion.button>

          {/* Navigation Tabs */}
          <motion.div 
            className="bg-white rounded-full border border-gray-200 flex overflow-hidden shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/features">
              <motion.div 
                className={`px-8 py-2 font-medium text-[#0a0c29] ${activeTab === "FEATURES" ? "bg-gray-100" : ""} cursor-pointer`}
                onClick={() => setActiveTab("FEATURES")}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
              >
                FEATURES
              </motion.div>
            </Link>
            <Link href="">
              <motion.div 
                className={`px-8 py-2 font-medium text-[#0a0c29] ${activeTab === "ACCOUNT" ? "bg-gray-100" : ""} cursor-pointer`}
                onClick={() => setActiveTab("ACCOUNT")}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
              >
                ACCOUNT
              </motion.div>
            </Link>
          </motion.div>
          <div className="w-10"></div>
        </motion.header>

        {/* Main content area */}
        <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-xl border border-[#949494] bg-white p-8 shadow-lg backdrop-blur-sm relative overflow-hidden"
          >
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#1c3f3a] opacity-5"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />

            <motion.div 
              className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#1c3f3a] opacity-5"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            />

            {/* Profile section */}
            <div className="mb-12 flex flex-col items-center md:flex-row md:items-start md:space-x-8">
              <motion.div 
                className="mb-4 h-40 w-40 overflow-hidden rounded-full md:mb-0 relative border-4 border-[#1c3f3a]"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 }}
                whileHover={{ scale: 1.05, borderColor: "#0a0c29" }}
              >
                <Image
                  src="/avatar.jpg?height=120&width=120"
                  alt="Profile avatar"
                  width={120}
                  height={120}
                  className="h-full w-full object-cover"
                />
                
                {/* Rotating circle around avatar */}
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-[#1c3f3a] border-dashed"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>

              <motion.div 
                className="flex flex-col space-y-2 text-center md:text-left"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.h2 
                  className="text-3xl font-bold text-[#0a0c29]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  Account Holder - Fedrick James
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-[#0a0c29]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Account Number - 0989••••••195
                </motion.p>
                
                <motion.p 
                  className="text-xl text-[#0a0c29]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  Email - example@gmail.com
                </motion.p>

                <motion.div 
                  className="mt-6 pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <motion.button 
                    className="flex items-center rounded-md bg-[#1c3f3a] px-6 py-3 text-white shadow-md"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 5px 15px rgba(28, 63, 58, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    LOG OUT <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            {/* Balance section */}
            <motion.div 
              className="mb-16 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              whileHover={{ boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-5 md:space-y-0">
                <motion.h3 
                  className="text-3xl font-bold text-[#0a0c29] flex items-center"
                  animate={{ 
                    scale: [1, 1.03, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  <DollarSign className="mr-2 text-[#1c3f3a]" /> Account Balance:
                </motion.h3>
                
                <AnimatePresence>
                  {showBalance ? (
                    <motion.div 
                      className="rounded-md bg-[#1c3f3a] px-8 py-4 relative overflow-hidden"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      {/* Animated background effect */}
                      <motion.div 
                        className="absolute inset-0 bg-[#0a0c29] opacity-30"
                        animate={{ 
                          x: ["-100%", "100%"],
                          opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      
                      <span className="text-3xl font-bold text-white relative z-10">
                        ${balanceAmount.toLocaleString()}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="rounded-md bg-[#1c3f3a] px-8 py-4"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <span className="text-3xl font-bold text-white opacity-50">••••••</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div 
              className="grid grid-cols-1 gap-8 md:grid-cols-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
            >
              <motion.div 
                className="flex flex-col space-y-3"
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoverExpense(true)}
                onHoverEnd={() => setHoverExpense(false)}
              >
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                  <p className="text-[#949494] text-lg mb-4 flex items-center">
                    <BarChart4 className="mr-2 h-5 w-5" /> View Expense Insights
                  </p>
                  
                  <Link href="/expense-insights">
                    <motion.button
                      className="flex w-full items-center justify-center rounded-md bg-[#1c3f3a] px-6 py-4 text-white shadow-md"
                      variants={buttonVariants}
                      initial="initial"
                      animate={hoverExpense ? "hover" : "initial"}
                    >
                      EXPENSE INSIGHTS 
                      <motion.div
                        animate={hoverExpense ? { x: [0, 5, 0] } : {}}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      >
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.div>
                    </motion.button>
                  </Link>
                  
                  {/* Visual graph indicator */}
                  <motion.div 
                    className="mt-4 h-12 flex items-end space-x-1 opacity-70"
                    animate={{ opacity: hoverExpense ? 0.9 : 0.7 }}
                  >
                    {[0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.9, 0.5, 0.6, 0.4].map((height, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-[#1c3f3a] rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${height * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                      />
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col space-y-3"
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoverAI(true)}
                onHoverEnd={() => setHoverAI(false)}
              >
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                  <p className="text-[#949494] text-lg mb-4 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" /> Ask Your AI
                  </p>
                  
                  <Link href="/aiAssistanceLanding">
                    <motion.button
                      className="flex w-full items-center justify-center rounded-md bg-[#1c3f3a] px-6 py-4 text-white shadow-md"
                      variants={buttonVariants}
                      initial="initial"
                      animate={hoverAI ? "hover" : "initial"}
                    >
                      ASK YOUR AI
                      <motion.div
                        animate={hoverAI ? { x: [0, 5, 0] } : {}}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      >
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.div>
                    </motion.button>
                  </Link>
                  
                  {/* AI pulse indicator */}
                  <motion.div className="mt-4 flex justify-center">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-[#1c3f3a] opacity-30 flex items-center justify-center"
                      animate={{ 
                        scale: hoverAI ? [1, 1.5, 1] : [1, 1.2, 1],
                        opacity: hoverAI ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-[#1c3f3a] opacity-60"
                        animate={{ 
                          scale: hoverAI ? [1, 1.2, 1] : [1, 1.1, 1],
                          opacity: hoverAI ? [0.6, 0.8, 0.6] : [0.4, 0.6, 0.4]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      >
                        <motion.div 
                          className="w-4 h-4 rounded-full bg-[#1c3f3a] mx-auto mt-2"
                          animate={{ 
                            scale: hoverAI ? [1, 1.3, 1] : [1, 1.1, 1]
                          }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}