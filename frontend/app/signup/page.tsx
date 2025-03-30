"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const setUpProviders = async () => {
      try {
        const response = await getProviders();
        setProviders(response);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    setUpProviders();

    // Animation timing
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleFormSwitch = () => {
    // Add animation when switching forms
    if (formRef.current) {
      formRef.current.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        setIsSignup(!isSignup);
        if (formRef.current) {
          formRef.current.classList.remove('scale-95', 'opacity-0');
        }
      }, 300);
    } else {
      setIsSignup(!isSignup);
    }
    // Clear message when switching forms
    setMessage("");
  };

  // Merged authentication handling from databaseFile.tsx
  interface AuthResponse {
    message: string;
  }

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage("");
    
    const url = !isSignup ? "http://localhost:5000/api/users/login" : "http://localhost:5000/api/users/register";
    
    // For signup, check if passwords match
    if (isSignup && password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data: AuthResponse = await response.json();

      if (response.ok) {
        if (!isSignup) {
          setMessage("Login successful! Redirecting...");
          setTimeout(() => router.push("/"), 2000);
        } else {
          setMessage("Signup successful! You can now log in.");
          setIsSignup(false);
        }
      } else {
        setMessage(data.message || "Authentication failed. Try again.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden relative">
      {/* Animated background elements */}
      <div className={`fixed top-1/4 -left-32 w-64 h-64 rounded-full bg-[#1c3f3a]/5 blur-3xl pointer-events-none transition-all duration-1000 ${isLoaded ? 'opacity-80' : 'opacity-0'}`}></div>
      <div className={`fixed bottom-1/4 -right-32 w-64 h-64 rounded-full bg-[#1c3f3a]/5 blur-3xl pointer-events-none transition-all duration-1000 ${isLoaded ? 'opacity-80' : 'opacity-0'}`}></div>
      <div className={`absolute -top-10 -right-10 w-20 h-20 bg-[#1c3f3a]/10 rounded-full transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
      <div className={`absolute -bottom-12 left-20 w-24 h-24 bg-[#1c3f3a]/10 rounded-full transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>

      <div className="flex flex-col md:flex-row w-full">
        {/* Left Side (Image Section) with animation */}
        <div className={`w-full md:w-1/2 flex items-center justify-center p-6 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
          <div className="max-w-md relative">
            {/* Decorative elements around image */}
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-[#1c3f3a]/20 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-[#1c3f3a]/20 animate-pulse delay-700"></div>

            {/* Main image with card-style border and hover effect */}
            <div className="rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-100">
              <Image
                src="/signupImage.jpg"
                width={500}
                height={500}
                alt="Authentication Illustration"
                className="w-full object-cover transition-transform duration-10000 hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c3f3a]/30 to-transparent pointer-events-none"></div>
            </div>

            {/* Animated floating card */}
            <div className="absolute -bottom-4 -right-10 bg-white p-4 rounded-lg shadow-lg animate-float">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#1c3f3a] rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#0a0c29]">Secure Login</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Form Section) with animation */}
        <div className={`w-full md:w-1/2 flex items-center justify-center p-6 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
          <div
            ref={formRef}
            className="w-full max-w-md border border-gray-100 rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl relative bg-white/80 backdrop-blur-md"
          >
            {/* Animated header underline similar to main page */}
            <div className="text-center mb-8 relative">
              <h1 className="text-3xl font-bold text-[#0a0c29] mb-2 inline-block">
                {isSignup ? "WELCOME TO BLOCKOPS" : "WELCOME BACK"}
                <div className={`h-1 w-full bg-[#1c3f3a] mt-1 transition-all duration-500 ${isLoaded ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}></div>
              </h1>
              <p className="text-[#949494] transition-all duration-500 delay-200">
                {isSignup ? "Create your account" : "Sign in to your account"}
              </p>
            </div>

            {/* Display authentication message */}
            {message && (
              <div className={`text-center py-2 px-4 rounded-md mb-4 ${message.includes("successful") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message}
              </div>
            )}

            {/* Form Section */}
            <form className="space-y-6" onSubmit={handleAuth}>
              {/* Email Field with icon and animation */}
              <div className={`space-y-2 transition-all duration-500 delay-300 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <label htmlFor="email" className="block text-[#0a0c29] font-medium">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 px-4 py-3 rounded-md bg-[#f2f2f2] border-0 focus:ring-2 focus:ring-[#1c3f3a] text-[#0A0C29] transition-all duration-200"
                  />
                  {email && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </span>
                  )}
                </div>
              </div>

              {/* Password Field with icon and toggle visibility */}
              <div>
                {/* Password Field */}
                <div className={`space-y-2 transition-all duration-500 delay-400 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <label htmlFor="password" className="block text-[#0a0c29] font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 px-4 py-3 rounded-md bg-[#f2f2f2] border-0 focus:ring-2 focus:ring-[#1c3f3a] text-[#0A0C29] transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (Only for Signup) */}
                {isSignup && (
                  <div className={`space-y-2 transition-all duration-500 delay-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <label htmlFor="confirmPassword" className="block text-[#0a0c29] font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 px-4 py-3 rounded-md bg-[#f2f2f2] border-0 focus:ring-2 focus:ring-[#1c3f3a] text-[#0A0C29] transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button with animation */}
              <button
                type="submit"
                className={`w-full group relative flex items-center justify-center gap-2 px-4 py-3 bg-[#1c3f3a] text-white rounded-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <span className="relative z-10">{isSignup ? "Sign up" : "Sign in"}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                <div className="absolute top-0 left-0 w-full h-full bg-[#0a0c29] transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-bottom-right z-0 rounded-md"></div>
              </button>

              {/* Separator */}
              <div className={`relative flex items-center justify-center transition-all duration-500 delay-700 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="border-t border-gray-300 w-full"></div>
                <span className="bg-white px-4 text-[#949494] text-sm">or</span>
                <div className="border-t border-gray-300 w-full"></div>
              </div>

              {/* Google Sign-In Button - Updated to use providers */}
              {providers &&
                Object.values(providers).map((provider, index) => (
                  <button
                    key={provider.name}
                    type="button"
                    onClick={() => signIn(provider.id)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#f2f2f2] text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${800 + (index * 100)}ms` }}
                  >
                    {provider.name === "Google" && (
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                    )}
                    <span>Continue with {provider.name}</span>
                  </button>
                ))
              }

              {/* Toggle Between Sign In & Sign Up with animated underline effect */}
              <div className={`text-center transition-all duration-500 delay-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <button
                  type="button"
                  className="text-[#0a0c29] relative group"
                  onClick={handleFormSwitch}
                >
                  <span>{isSignup ? "Already a user? Sign in" : "New here? Create an account"}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1c3f3a] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </form>

            {/* Small decorative element */}
            <div className={`absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-[#1c3f3a] transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}