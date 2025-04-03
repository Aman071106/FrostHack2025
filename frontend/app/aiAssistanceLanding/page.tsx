"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ArrowUp,
  Menu,
  Bot,
  User,
  ArrowRight,
  MessageSquareText,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { useSession } from "next-auth/react"; // Import NextAuth useSession hook

type Message = {
  sender: "user" | "bot";
  text: string;
  id: string;
};

export default function EnhancedChatWithSidebar() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Get user session data
  const { data: session, status } = useSession();
  
  // Extract username from email or use a default
  const getUsernameFromEmail = () => {
    if (status === 'authenticated' && session?.user?.email) {
      // Extract the part before @ in the email
      return session.user.email.split('@')[0];
    }
    return " "; // Fallback to default if no user is logged in
  };
  
  const url = getUsernameFromEmail();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Trigger entrance animations after component mounts
    setAnimateIn(true);

    // Track mouse movement for parallax effect
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate parallax movement values based on mouse position
  const getParallaxValues = (depth = 10) => {
    if (typeof window === "undefined") return { moveX: 0, moveY: 0 };
  
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (mousePosition.x - centerX) / depth;
    const moveY = (mousePosition.y - centerY) / depth;
    return { moveX, moveY };
  };

  const parallax = getParallaxValues();

  // Auto resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const sendMessage = async () => {
    if (!input.trim()) {
      console.log("Empty input, skipping request");
      return;
    }

    const userMessage: Message = {
      sender: "user",
      text: input,
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const response = await axios.post("/api/rag", {
        url,
        user_query: [input.trim()],
      });

      let botResponse = "No response received";
      if (response.data?.text) {
        botResponse = response.data.text;
      } else if (response.data?.error) {
        botResponse = `Error: ${response.data.error}`;
      }

      const botMessage: Message = {
        sender: "bot",
        text: botResponse,
        id: (Date.now() + 1).toString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Request failed:", error);
      const errorMessage =
        error instanceof Error
          ? `Connection error: ${error.message}`
          : "An unknown error occurred";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: errorMessage,
          id: (Date.now() + 1).toString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col relative transition-all duration-500 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Floating geometric shapes for background interest */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#1c3f3a]/5"
            style={{
              transform: `translate(${parallax.moveX * 1.5}px, ${parallax.moveY * 1.5}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <div 
            className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-[#0a0c29]/5"
            style={{
              transform: `translate(${-parallax.moveX * 2}px, ${-parallax.moveY * 2}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        </div>

        {/* Header */}
        <header 
          className={`w-full p-4 flex justify-between items-center bg-white z-10 transition-all duration-700 ${
            animateIn ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
        >
          {/* Menu Button with hover effect */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#1c3f3a]/10 scale-0 group-hover:scale-100 rounded-md transition-transform duration-300"></div>
            <Menu className="h-5 w-5 text-gray-500 group-hover:text-[#1c3f3a] transition-colors duration-300" />
          </button>

          {/* Navigation Tabs with hover effects */}
          <div className="bg-white rounded-full border border-gray-200 flex overflow-hidden shadow-sm relative">
            <div 
              className="absolute inset-y-0 w-1/2 bg-gray-100 transition-all duration-300"
              style={{ left: window.location.pathname === '/account' ? '50%' : '0%' }}
            />
            <Link 
              href="/features" 
              className="px-8 py-2 font-medium text-[#0a0c29] relative z-10 transition-all duration-300 hover:text-[#1c3f3a]"
            >
              FEATURES
            </Link>
            <Link 
              href="/account" 
              className="px-8 py-2 font-medium text-[#0a0c29] relative z-10 transition-all duration-300 hover:text-[#1c3f3a]"
            >
              ACCOUNT
            </Link>
          </div>
          <div className="w-10"></div>
        </header>

        {/* Chat Content Area */}
        <div className="flex-1 flex flex-col p-6">
          {/* Chat Container */}
          <motion.div 
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Chat Header */}
            <div className="mb-6 flex items-center">
              <div className="mr-4 w-16 h-16 bg-[#1c3f3a]/10 rounded-full flex items-center justify-center">
                <MessageSquareText className="h-8 w-8 text-[#1c3f3a]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#0a0c29]">ASK YOUR AI</h1>
                <p className="text-gray-600">
                  {status === 'authenticated' ? `Smart answers for ${session?.user?.name || url}` : 'Smart answers for smarter spending.'}
                </p>
              </div>
            </div>

            {/* Messages Container */}
            <div className="w-full p-6 rounded-3xl border border-gray-200 shadow-lg bg-white min-h-[60vh] mb-6 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-6 mb-6">
                {messages.length === 0 ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-gray-500 max-w-md">
                      <p className="mb-4">
                        Your personal finance assistant is ready to help! Ask about your spending habits,
                        budgeting advice, or if a purchase makes sense for your financial goals.
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="p-3 rounded-xl bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors">
                          How much did I spend on groceries last month?
                        </div>
                        <div className="p-3 rounded-xl bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors">
                          Should I save more or pay down my debt first?
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className={`flex ${
                          msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.sender === "bot" && (
                          <div className="w-8 h-8 bg-[#1c3f3a]/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <Bot className="h-4 w-4 text-[#1c3f3a]" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] p-4 rounded-xl shadow-sm ${
                            msg.sender === "user"
                              ? "bg-[#1c3f3a] text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                          }`}
                          style={{
                            borderRadius: msg.sender === "user" 
                              ? "20px 20px 5px 20px" 
                              : "20px 20px 20px 5px"
                          }}
                        >
                          <div className={`markdown-content ${msg.sender === "user" ? "text-white" : "text-gray-800"}`}>
                            <ReactMarkdown>
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        </div>
                        
                        {msg.sender === "user" && (
                          <div className="w-8 h-8 bg-[#1c3f3a] rounded-full flex items-center justify-center ml-3 mt-1 flex-shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 bg-[#1c3f3a]/10 rounded-full flex items-center justify-center mr-3 mt-1">
                      <Bot className="h-4 w-4 text-[#1c3f3a]" />
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex space-x-2">
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5,
                            times: [0, 0.2, 1] 
                          }}
                          className="w-3 h-3 bg-[#1c3f3a] rounded-full"
                        />
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5,
                            delay: 0.2,
                            times: [0, 0.2, 1] 
                          }}
                          className="w-3 h-3 bg-[#1c3f3a] rounded-full"
                        />
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5,
                            delay: 0.4,
                            times: [0, 0.2, 1] 
                          }}
                          className="w-3 h-3 bg-[#1c3f3a] rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="relative">
                <div className="relative rounded-full overflow-hidden shadow-lg border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#1c3f3a] focus-within:border-transparent">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your financial question..."
                    className="w-full p-4 pl-6 pr-12 border-none bg-transparent resize-none focus:outline-none min-h-[48px] max-h-[120px] text-[#0A0C29]"
                    rows={1}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className={`absolute bottom-2 right-2 p-3 bg-[#1c3f3a] text-white rounded-full disabled:bg-gray-300 shadow-md hover:bg-[#0a0c29] transition-all duration-300 overflow-hidden ${!input.trim() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="absolute inset-0 bg-[#0a0c29] transform scale-x-0 hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <ArrowUp className="h-5 w-5 relative z-10" />
                  </button>
                </div>
              </div>
            </div>

            {/* Feature reminders */}
            <motion.div 
              className={`transition-all duration-700 ${
                animateIn ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="flex justify-center items-center mt-4">
                <Link 
                  href="/expense-insights" 
                  className="px-6 py-3 bg-[#1c3f3a] text-white rounded-full flex items-center gap-2 hover:bg-[#0a0c29] transition-all duration-300 group relative overflow-hidden mr-4"
                >
                  <span className="relative z-10">Explore Insights</span> 
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-[#0a0c29] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Link>
                {/* <button className="px-6 py-3 border border-[#1c3f3a] text-[#1c3f3a] rounded-full hover:bg-[#1c3f3a] hover:text-white transition-all duration-300 flex items-center gap-2 group">
                  <span>Return to Dashboard</span>
                  <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                    <X className="h-3 w-3" />
                  </div>
                </button> */}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}