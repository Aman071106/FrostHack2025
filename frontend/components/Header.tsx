// components/Header.jsx
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, ChevronRight, LogOut } from "lucide-react";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const { data: session } = useSession();

  return (
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
      
      {/* Auth Button (Login or Logout) */}
      <div className="flex items-center">
        {session ? (
          <button 
            onClick={() => signOut()}
            className="hidden sm:flex items-center text-red-600 border border-red-600 py-2 px-4 rounded-lg font-medium text-sm hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            SIGN OUT
            <LogOut className="h-4 w-4 ml-1" />
          </button>
        ) : (
          <Link href="/auth">
            <button className="hidden sm:flex items-center text-green-900 border border-green-900 py-2 px-4 rounded-lg font-medium text-sm hover:bg-green-900 hover:text-white transition-all duration-200">
              SIGN IN
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}