"use client";
import { Menu, ArrowRight, TrendingUp, MessageSquareText, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";

export default function AiDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [activeCard, setActiveCard] = useState<null | 'ai' | 'expense'>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Trigger entrance animations after component mounts
    setAnimateIn(true);

    // Track mouse movement for parallax effect
    interface MousePosition {
      x: number;
      y: number;
    }

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

        {/* Main Content Section */}
        <main className="flex-1 flex flex-col p-4 items-center justify-center">
          <h1 
            className={`text-3xl font-bold text-[#0a0c29] mb-8 transition-all duration-700 ${
              animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            Powerful Finance Tools
          </h1>
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full"
          >
            {/* Expense Insights Card */}
            <div 
              className={`relative group transition-all duration-700 ${
                animateIn ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: '200ms' }}
              onMouseEnter={() => setActiveCard('expense')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[#1c3f3a]/20 to-[#0a0c29]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight/2) * 0.01}deg) rotateY(${-(mousePosition.x - window.innerWidth/2) * 0.01}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
              <div 
                className="border border-gray-200 rounded-3xl p-6 shadow-sm group-hover:shadow-lg flex flex-col items-center text-center transition-all duration-500 bg-white relative z-10"
                style={{
                  transform: activeCard === 'expense' ? 
                    `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight/2) * 0.01}deg) rotateY(${-(mousePosition.x - window.innerWidth/2) * 0.01}deg)` : 
                    'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                  transition: 'transform 0.1s ease-out, box-shadow 0.5s ease'
                }}
              >
                <div className="w-16 h-16 rounded-full bg-[#1c3f3a]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="h-8 w-8 text-[#1c3f3a]" />
                </div>
                <h2 className="text-xl font-semibold text-[#0a0c29] group-hover:scale-105 transition-transform duration-500">Expense Insights</h2>
                <p className="text-gray-600 mt-2 leading-relaxed text-center px-4 group-hover:text-gray-800 transition-colors duration-500">
                  Visualize your spending with interactive graphs! Track your weekly expenses through bar charts and get a clear breakdown of where your money goes with a detailed category-wise pie chart.
                </p>
                <Link 
                  href="/expense-insights" 
                  className="mt-6 px-6 py-3 bg-[#1c3f3a] text-white rounded-full flex items-center gap-2 hover:bg-[#0a0c29] transition-all duration-300 group-hover:translate-y-1 overflow-hidden relative"
                >
                  <span className="relative z-10">Explore Insights</span> 
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-[#0a0c29] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Link>
              </div>
            </div>

            {/* Ask Your AI Card */}
            <div 
              className={`relative group transition-all duration-700 ${
                animateIn ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: '400ms' }}
              onMouseEnter={() => setActiveCard('ai')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[#0a0c29]/20 to-[#1c3f3a]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight/2) * 0.01}deg) rotateY(${-(mousePosition.x - window.innerWidth/2) * 0.01}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
              <div 
                className="border border-gray-200 rounded-3xl p-6 shadow-sm group-hover:shadow-lg flex flex-col items-center text-center transition-all duration-500 bg-white relative z-10"
                style={{
                  transform: activeCard === 'ai' ? 
                    `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight/2) * 0.01}deg) rotateY(${-(mousePosition.x - window.innerWidth/2) * 0.01}deg)` : 
                    'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                  transition: 'transform 0.1s ease-out, box-shadow 0.5s ease'
                }}
              >
                <div className="w-16 h-16 rounded-full bg-[#0a0c29]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <MessageSquareText className="h-8 w-8 text-[#0a0c29]" />
                </div>
                <h2 className="text-xl font-semibold text-[#0a0c29] group-hover:scale-105 transition-transform duration-500">Ask Your AI</h2>
                <p className="text-gray-600 mt-2 leading-relaxed text-center px-4 group-hover:text-gray-800 transition-colors duration-500">
                  Your personal finance assistant at your fingertips! Get smart insights on your spending habits, ask whether you should make a purchase, and receive AI-driven suggestions to manage your expenses wisely.
                </p>
                <Link 
                  href="/aiAssistanceLanding" 
                  className="mt-6 px-6 py-3 bg-[#1c3f3a] text-white rounded-full flex items-center gap-2 hover:bg-[#0a0c29] transition-all duration-300 group-hover:translate-y-1 overflow-hidden relative"
                >
                  <span className="relative z-10">Start Chat</span> 
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-[#0a0c29] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Link>
              </div>
            </div>
          </div>
          
          <div 
            className={`mt-12 transition-all duration-700 ${
              animateIn ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <button className="px-6 py-3 border border-[#1c3f3a] text-[#1c3f3a] rounded-full hover:bg-[#1c3f3a] hover:text-white transition-all duration-300 flex items-center gap-2 group">
              <span>More Features Coming Soon</span>
              <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                <X className="h-3 w-3" />
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}