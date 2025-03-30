'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, DollarSign, TrendingUp, PieChart, ArrowRight } from 'lucide-react';
import Image from "next/image";

interface Message {
    text: string;
    sender: 'user' | 'Finova';
}

const systemPrompt = `Welcome to Finance Tracker by BlockOps, I am Finova, your smart finance companion.`;

const Chat = () => {
    const [messages, setMessages] = useState([{ text: systemPrompt, sender: 'Finova' }]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showGreeting, setShowGreeting] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Animation effects
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShowGreeting(true), 300);
        } else {
            setShowGreeting(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 300);
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Simulate typing delay for better UX
            setTimeout(async () => {
                try {
                    const response = await fetch('/api/gemini', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ input: `${systemPrompt}\nUser: ${input}` }),
                    });

                    const data = await response.json();
                    setIsTyping(false);

                    if (data && data.candidates && data.candidates.length > 0) {
                        const geminiResponse = {
                            text: data.candidates[0].content.parts[0].text,
                            sender: 'Finova'
                        };
                        setMessages((prevMessages) => [...prevMessages, geminiResponse]);
                    } else {
                        throw new Error('Invalid response structure');
                    }
                } catch (error) {
                    console.error('Error fetching Gemini response:', error);
                    setIsTyping(false);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: 'Sorry, I encountered an error.', sender: 'Finova' }
                    ]);
                }
            }, 800);
        } catch (error) {
            setIsTyping(false);
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Quick suggestion buttons
    const suggestions = [
        "How can I save money?",
        "Track my expenses",
        "Investment tips"
    ];

    interface SuggestionHandler {
        (text: string): void;
    }

    const handleSuggestion: SuggestionHandler = (text) => {
        setInput(text);
        sendMessage();
    };

    return (
        <div className="font-sans">
            {/* Floating Chat Button with Pulse Animation */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#0d542b] to-[#0d542b] rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 group z-50"
            >
                <div className="absolute w-full h-full rounded-full bg-teal-400 opacity-30 group-hover:animate-ping"></div>
                <div className="relative flex items-center justify-center">
                    {isOpen ? (
                        <X className="text-white w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                    ) : (
                        <div className="relative">
                            <Image
                                src="/bot3.png"
                                alt="Icon"
                                width={20}
                                height={20}
                                className="w-10 h-10 object-cover"
                            />
                        </div>
                    )}
                </div>
            </button>

            {/* Chat Box with Animation */}
            <div
                className={`fixed bottom-24 right-6 w-96 max-w-full rounded-2xl shadow-2xl bg-white overflow-hidden flex flex-col transition-all duration-300 transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'
                    }`}
                style={{ height: '550px', zIndex: 40 }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1C3F3A] to-[#1C7669] p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <TrendingUp className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Finova</h3>
                                <p className="text-white/80 text-xs">Finance AI Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div
                    ref={chatContainerRef}
                    className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
                >
                    {/* Welcome Message with Animation */}
                    <div className={`flex mb-6 items-end transition-all duration-500 ${showGreeting ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1C3F3A] to-[#1C7669] flex items-center justify-center mr-2 shadow-md overflow-hidden shrink-0">
                            <Image
                                src="/bot3.png"
                                alt="Icon"
                                width={20}
                                height={20}
                                className="w-5 h-5 object-cover"
                            />
                        </div>


                        <div className="bg-white rounded-2xl p-4 max-w-xs shadow-lg border border-gray-100">
                            <p className="text-gray-800">Welcome to Finance Tracker by BlockOps! How can I help with your finances today?</p>
                        </div>
                    </div>

                    {/* Message Bubbles */}
                    {messages.slice(1).map((message, index) => (
                        <div
                            key={index}
                            className={`flex mb-4 items-end ${message.sender === 'user' ? 'justify-end gap-3' : 'gap-3'}`}
                        >
                            {message.sender === 'Finova' && (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1C3F3A] to-[#1C7669] flex items-center justify-center mr-2 shadow-md overflow-hidden shrink-0">
                                <Image
                                    src="/bot3.png"
                                    alt="Icon"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 object-cover"
                                />
                            </div>
                            )}
                            <div
                                className={`p-3 rounded-2xl max-w-xs shadow-md ${message.sender === 'user'
                                    ? 'bg-gradient-to-r from-[#1C3F3A] to-[#1C7669] text-white rounded-bl-2xl rounded-tr-2xl rounded-tl-2xl'
                                    : 'bg-white rounded-tr-2xl rounded-bl-2xl rounded-br-2xl border border-gray-100'
                                    }`}
                            >
                                <p className={message.sender === 'user' ? 'text-white' : 'text-gray-800'}>
                                    {message.text}
                                </p>
                            </div>
                            {message.sender === 'user' && (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1C3F3A] to-[#1C7669] flex items-center justify-center mr-2 shadow-md overflow-hidden shrink-0">
                                <Image
                                    src="/smallAvatar.jpg"
                                    alt="Icon"
                                    width={20}
                                    height={20}
                                    className="w-10 h-10 object-cover"
                                />
                            </div>
                            )}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex mb-4 items-end">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1C3F3A] to-[#1C7669] flex items-center justify-center mr-2 shadow-md">
                                <PieChart className="text-white w-5 h-5" />
                            </div>
                            <div className="bg-white rounded-t-2xl rounded-br-2xl p-3 shadow-md border border-gray-100">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Suggestions */}
                {messages.length <= 2 && (
                    <div className="px-4 pb-3 pt-1">
                        <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestion(suggestion)}
                                    className="text-xs py-1 px-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center"
                                >
                                    {suggestion}
                                    <ArrowRight className="ml-1 w-3 h-3" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center bg-gray-100 rounded-full pr-1 pl-4 focus-within:ring-2 focus-within:ring-[#1C7669] focus-within:bg-white transition-all duration-200">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-grow py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            placeholder="Ask something about your finances..."
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim()}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ml-1 transition-all duration-200 ${input.trim()
                                ? 'bg-gradient-to-r from-[#1C3F3A] to-[#1C7669] text-white shadow-md hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400'
                                }`}
                        >
                            <Send size={18} className={input.trim() ? 'text-white' : 'text-gray-400'} />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-xs text-gray-400">Powered by BlockOps</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;