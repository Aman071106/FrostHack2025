"use client";
import { Menu, ArrowRight, Home, BarChart, MessageCircle, LogIn, LogOut, X, UserCircle2 } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-10"
          onClick={onClose}
        ></div>
      )}
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-20 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform w-80 p-6 flex flex-col gap-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/Logo.png"
              alt="Logo"
              className="h-8 w-12 "
            />
            <span className="text-lg font-semibold text-[#0a0c29]">BlockOps</span>
          </div>
          <button onClick={onClose} className="p-2">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-[#1c3f3a] text-white rounded-full flex items-center gap-2 hover:bg-[#1c3f3a]/90 transition-colors"
          >
            <Home className="h-5 w-5" /> Home
          </Link>
          <Link
            href="/expense-insights"
            className="px-6 py-3 bg-[#1c3f3a] text-white rounded-full flex items-center gap-2 hover:bg-[#1c3f3a]/90 transition-colors"
          >
            <BarChart className="h-5 w-5" /> Expense Insights
          </Link>
          <Link
            href="/aiAssistanceLanding"
            className="px-6 py-3 bg-[#1c3f3a] text-white rounded-full flex items-center gap-2 hover:bg-[#1c3f3a]/90 transition-colors"
          >
            <MessageCircle className="h-5 w-5" /> Ask Your AI
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-[#1c3f3a] text-white rounded-full flex items-center gap-2 hover:bg-[#1c3f3a]/90 transition-colors"
          >
            <LogIn className="h-5 w-5" /> Sign In
          </Link>
          
        </div>
      </aside>
    </div>
  );
}