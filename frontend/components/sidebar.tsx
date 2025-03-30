"use client";
import { useState, useEffect } from "react";
import { Menu, ArrowRight, Home, BarChart, MessageCircle, LogIn, LogOut, X, UserCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeLink, setActiveLink] = useState<string>("/");
  const [hoverLink, setHoverLink] = useState<string | null>(null);
  
  // Detect current path for active link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActiveLink(window.location.pathname);
    }
  }, []);

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/expense-insights", label: "Expense Insights", icon: BarChart },
    { path: "/aiAssistanceLanding", label: "Ask Your AI", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-10"
            onClick={onClose}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
        className="fixed left-0 top-0 h-full bg-white shadow-xl z-20 w-80 flex flex-col rounded-r-2xl overflow-hidden"
      >
        {/* Glass effect top bar */}
        <motion.div 
          className="p-6 backdrop-blur-md bg-white/90 border-b border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="h-10 w-14"
                />
              </motion.div>
              <motion.span 
                className="text-xl font-bold text-[#0a0c29]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                BlockOps
              </motion.span>
            </motion.div>
            {/* <motion.button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-6 w-6 text-gray-500" />
            </motion.button> */}
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-4">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                onMouseEnter={() => setHoverLink(link.path)}
                onMouseLeave={() => setHoverLink(null)}
              >
                <Link href={link.path}>
                  <motion.div
                    className={`px-6 py-4 rounded-xl flex items-center gap-3 relative overflow-hidden ${
                      activeLink === link.path 
                        ? "text-white" 
                        : "text-[#0a0c29] hover:text-white"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background */}
                    <motion.div
                      className="absolute inset-0 bg-[#1c3f3a] rounded-xl z-0"
                      initial={{ 
                        opacity: activeLink === link.path ? 1 : 0,
                        scale: activeLink === link.path ? 1 : 0.8
                      }}
                      animate={{ 
                        opacity: activeLink === link.path || hoverLink === link.path ? 1 : 0,
                        scale: activeLink === link.path || hoverLink === link.path ? 1 : 0.8
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Icon with pulse effect */}
                    <div className="relative z-10">
                      <link.icon className="h-5 w-5" />
                      {activeLink === link.path && (
                        <motion.div
                          className="absolute inset-0 bg-white rounded-full"
                          initial={{ scale: 0.8, opacity: 0.3 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5, 
                            repeatType: "loop" 
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className="relative z-10 font-medium">{link.label}</span>
                    
                    {/* Arrow indicator */}
                    <motion.div 
                      className="ml-auto relative z-10"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: (activeLink === link.path || hoverLink === link.path) ? 1 : 0, 
                        x: (activeLink === link.path || hoverLink === link.path) ? 0 : -10 
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <motion.div 
          className="p-6 border-t border-gray-100 backdrop-blur-md bg-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/signup">
              <motion.div
                className="px-6 py-4 bg-[#1c3f3a] text-white rounded-xl flex items-center gap-3 overflow-hidden relative group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background animation on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#1c3f3a] to-[#1c3f3a] z-0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Login icon with animation */}
                <motion.div
                  className="relative z-10"
                  whileHover={{ rotate: 15 }}
                >
                  <LogIn className="h-5 w-5" />
                </motion.div>
                
                <span className="font-medium relative z-10">Sign In</span>
                
                <motion.div 
                  className="absolute right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -5 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </motion.div>
            </Link>
            
            {/* Help/Support button */}
            <motion.div
              className="mt-4 px-6 py-3 border border-gray-200 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="h-5 w-5 text-[#1c3f3a]" />
                <span className="text-[#0a0c29] font-medium">Support Center</span>
              </div>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Animated decorative element */}
          <motion.div 
            className="mt-6 h-1 rounded-full bg-gradient-to-r from-[#1c3f3a]/20 via-[#1c3f3a] to-[#1c3f3a]/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          />
        </motion.div>
      </motion.aside>
    </div>
  );
}