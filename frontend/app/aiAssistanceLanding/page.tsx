"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ArrowUp, Clock, Menu, PenSquare, ChevronDown, Sparkles, RotateCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  sender: "user" | "bot";
  text: string;
  id: string;
};

export default function AiAssistantPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingEffect, setTypingEffect] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatContainerRef = useRef<null | HTMLDivElement>(null);
  
  // Typing animation effect for bot responses
  useEffect(() => {
    if (isTyping && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "bot") {
        let i = 0;
        const text = lastMessage.text;
        setTypingEffect("");
        
        const typingInterval = setInterval(() => {
          if (i < text.length) {
            setTypingEffect((prev) => prev + text.charAt(i));
            i++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
          }
        }, 15);
        
        return () => clearInterval(typingInterval);
      }
    }
  }, [isTyping, messages]);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingEffect]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input, id: Date.now().toString() };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post<{ reply: string }>("/api/gemini", { message: input });
      const botMessage: Message = { sender: "bot", text: response.data.reply, id: (Date.now() + 1).toString() };
      setMessages([...newMessages, botMessage]);
      setIsTyping(true);
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "Error fetching response.", id: (Date.now() + 1).toString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Particle effect for the background
  const Particles = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }
    }, []);
  
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#1c3f3a] opacity-20"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
            }}
            animate={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    );
  };
  

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      {/* Particle background */}
      <Particles />
      
      {/* Sidebar with animation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-20"
          >
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with smooth transition */}
      <motion.div 
        className="flex-1 flex flex-col relative"
        animate={{ 
          marginLeft: isSidebarOpen ? "16rem" : "0rem"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <header className="w-full p-4 flex justify-between items-center bg-white backdrop-blur-sm bg-opacity-80 z-10 sticky top-0">
          {/* Menu Button with hover effect */}
          <motion.button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </motion.button>

          {/* Navigation Tabs with animation */}
          <motion.div 
            className="bg-white rounded-full border border-gray-200 flex overflow-hidden shadow-sm"
            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          >
            <Link href="/features" className="relative px-8 py-2 font-medium text-[#0a0c29] overflow-hidden group">
              <span className="relative z-10">FEATURES</span>
              <motion.div 
                className="absolute inset-0 bg-gray-100"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{ type: "tween", duration: 0.3 }}
              />
            </Link>
            <Link href="/account" className="relative px-8 py-2 font-medium text-[#0a0c29] overflow-hidden group">
              <span className="relative z-10">ACCOUNT</span>
              <motion.div 
                className="absolute inset-0 bg-gray-100"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{ type: "tween", duration: 0.3 }}
              />
            </Link>
          </motion.div>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 flex flex-col p-4">
          <motion.div 
            className="w-full max-w-4xl mx-auto flex-1 border border-gray-200 rounded-3xl p-6 flex flex-col bg-white relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
          >
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl opacity-70"></div>
            
            {/* Action buttons */}
            <div className="relative flex gap-2 mb-8 z-10">
              {/* History Button with Dropdown */}
              <div className="relative">
                <motion.button
                  className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2"
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Clock className="h-5 w-5 text-gray-500" />
                  <motion.div
                    animate={{ rotate: isHistoryOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {isHistoryOpen && (
                    <motion.div 
                      className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="py-2 text-gray-700">
                        {['Recent Chat 1', 'Recent Chat 2', 'Recent Chat 3'].map((chat, index) => (
                          <motion.li 
                            key={index} 
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            {chat}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Edit Button */}
              <motion.button 
                className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PenSquare className="h-5 w-5 text-gray-500" />
                <span className="sr-only">Edit</span>
              </motion.button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-4 z-10">
              {messages.length === 0 ? (
                <motion.div 
                  className="mb-6"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="relative">
                    <Image
                      src="/bot.png?height=180&width=180"
                      width={180}
                      height={180}
                      alt="AI Assistant Robot"
                      priority
                      className="relative z-10"
                    />
                    <motion.div
                      className="absolute -inset-4 bg-gradient-to-r from-[#1c3f3a]/10 to-[#1c3f3a]/5 rounded-full blur-xl"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.7, 0.5]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                  
                  <motion.h2 
                    className="text-2xl font-semibold mt-4 text-[#0a0c29]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Your AI Finance Assistant
                  </motion.h2>
                  
                  <motion.p 
                    className="mt-2 text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Ask me anything about your finances, investments, or market trends.
                  </motion.p>
                </motion.div>
              ) : (
                <div 
                  ref={chatContainerRef} 
                  className="w-full max-h-[400px] overflow-y-auto space-y-4 p-4 border border-gray-200 rounded-xl custom-scrollbar relative bg-white/80 backdrop-blur-sm"
                >
                  <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`p-3 rounded-lg max-w-[80%] shadow-sm ${
                            msg.sender === "user" 
                              ? "bg-blue-500 text-white" 
                              : "bg-gray-100 text-gray-900 border border-gray-200"
                          } ${
                            msg.sender === "user" 
                              ? "rounded-tr-none" 
                              : "rounded-tl-none"
                          }`}
                        >
                          {msg.sender === "bot" && index === messages.length - 1 && isTyping
                            ? typingEffect
                            : msg.text}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {loading && (
                    <motion.div 
                      className="flex items-center space-x-2 text-gray-500 text-sm ml-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      >
                        <RotateCw className="h-4 w-4" />
                      </motion.div>
                      <span>Thinking...</span>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Query input with animation */}
            <motion.div 
              className="relative mt-6 z-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                whileHover={{ boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                className="relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your finance query..."
                  className="w-full px-6 py-4 pl-12 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#1c3f3a] focus:outline-none text-[#0A0C29] transition-all duration-300"
                />
                <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                
                <motion.button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 bottom-2 p-3 bg-[#1c3f3a] text-white rounded-full hover:bg-[#1c3f3a]/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowUp className="h-5 w-5" />
                  <span className="sr-only">Submit</span>
                  
                  {/* Submit button pulse effect */}
                  {input.trim() && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#1c3f3a]"
                      animate={{ 
                        scale: [1, 1.15, 1],
                        opacity: [1, 0, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </motion.button>
              </motion.div>
              
              {/* Suggestion chips */}
              <motion.div 
                className="flex flex-wrap gap-2 mt-3 justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {["Investment tips", "Market analysis", "Financial planning", "Retirement advice"].map((suggestion, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200"
                    whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Floating status indicator */}
            <motion.div 
              className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              AI Online
            </motion.div>
          </motion.div>
        </main>
      </motion.div>
      
      {/* Global styles for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
      `}</style>
    </div>
  );
}