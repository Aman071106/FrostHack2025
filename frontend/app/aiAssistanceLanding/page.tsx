"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ArrowUp, X, Minimize2, Maximize2, ChevronDown, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

type Message = {
  sender: "user" | "bot";
  text: string;
  id: string;
};

export default function EnhancedChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const url = "user129"; // Hardcoded URL since we simplified

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    console.log("Adding user message:", userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log("Sending request to /api/rag with:", { url, query: input });
      const response = await axios.post("/api/rag", {
        url,
        user_query: [input.trim()],
      });

      console.log("Raw response from API:", response.data);

      let botResponse = "No response received";
      if (response.data?.text) {
        botResponse = response.data.text;
        console.log("Parsed bot response:", botResponse);
      } else if (response.data?.error) {
        botResponse = `Error: ${response.data.error}`;
        console.error("API returned error:", response.data.error);
      }

      const botMessage: Message = {
        sender: "bot",
        text: botResponse,
        id: (Date.now() + 1).toString(),
      };

      console.log("Adding bot message:", botMessage);
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
      console.log("Request completed, setting loading to false");
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chat Button */}
      {!isChatOpen && (
        <motion.button
          onClick={toggleChat}
          className="bg-green-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MessageSquare className="h-6 w-6" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="fixed bottom-6 right-6 w-full max-w-md flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            style={{ maxHeight: isMinimized ? "80px" : "70vh" }}
            initial={{ opacity: 0, y: 50, height: 0 }}
            animate={{ opacity: 1, y: 0, height: isMinimized ? "80px" : "500px" }}
            exit={{ opacity: 0, y: 50, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat Header */}
            <div 
              className="flex items-center justify-between p-4 bg-green-900 text-white cursor-pointer"
              onClick={isMinimized ? toggleMinimize : undefined}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-semibold">BlockOps Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
                <button
                  onClick={toggleChat}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area - Hidden when minimized */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 p-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-green-900" />
                    </div>
                    <p className="text-center">
                      Hello! I'm BlockOps Assistant. Ask me anything about your finances.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${
                          msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                            msg.sender === "user"
                              ? "bg-green-900 text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <div className="markdown-content">
                            <ReactMarkdown
                              components={{
                                table: ({ node, ...props }) => (
                                  <div className="overflow-x-auto my-4">
                                    <table className="min-w-full border border-gray-200 rounded-md" {...props} />
                                  </div>
                                ),
                                thead: ({ node, ...props }) => (
                                  <thead className="bg-gray-100" {...props} />
                                ),
                                th: ({ node, ...props }) => (
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b" {...props} />
                                ),
                                td: ({ node, ...props }) => (
                                  <td className="px-4 py-2 text-sm border-b border-gray-100" {...props} />
                                ),
                                pre: ({ node, ...props }) => (
                                  <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto my-4" {...props} />
                                ),
                                code: ({ node, inline, ...props }) => 
                                  inline ? (
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500" {...props} />
                                  ) : (
                                    <code {...props} />
                                  )
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl shadow-sm rounded-bl-none">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-green-900 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-900 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-green-900 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Area - Hidden when minimized */}
            {!isMinimized && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about your finances..."
                    className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-900 bg-gray-50"
                  />
                  <motion.button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="p-3 bg-green-900 text-white rounded-full disabled:bg-gray-300 shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}