"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

export default function AuthPage() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null);
  const [isSignup, setIsSignup] = useState(false);

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
  }, []);

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex flex-col md:flex-row w-full">
        {/* Left Side (Image Section) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="max-w-md">
            <Image
              src="/signupImage.jpg"
              width={400}
              height={400}
              alt="Authentication Illustration"
              className="w-full"
              priority
            />
          </div>
        </div>

        {/* Right Side (Form Section) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md border border-gray-100 rounded-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#0a0c29] mb-2">
                {isSignup ? "WELCOME TO BLOCKOPS" : "WELCOME BACK"}
              </h1>
              <p className="text-[#949494]">
                {isSignup ? "Create your account" : "Sign in to your account"}
              </p>
            </div>

            {/* Form Section */}
            <form className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[#0a0c29] font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  className="w-full px-4 py-3 rounded-md bg-[#f2f2f2] border-0 focus:ring-2 focus:ring-[#1c3f3a] text-[#0A0C29]"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-[#0a0c29] font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-md bg-[#f2f2f2] border-0 focus:ring-2 focus:ring-[#1c3f3a] text-[#0A0C29]"
                />
              </div>

              {/* Confirm Password (Only for Signup) */}
              {isSignup && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-[#0a0c29] font-medium">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-md bg-[#f2f2f2] border-0 focus:ring-2 focus:ring-[#1c3f3a] text-[#0A0C29]"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1c3f3a] text-white rounded-md hover:bg-[#1c3f3a]/90 transition-colors"
              >
                <span>{isSignup ? "Sign up" : "Sign in"}</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Separator */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-300 w-full"></div>
                <span className="bg-white px-4 text-[#949494] text-sm">or</span>
                <div className="border-t border-gray-300 w-full"></div>
              </div>

              {/* Google Sign-In Button - Updated to use providers */}
              {providers && 
                Object.values(providers).map((provider) => (
                  <button
                    key={provider.name}
                    type="button"
                    onClick={() => signIn(provider.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#f2f2f2] text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
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

              {/* Toggle Between Sign In & Sign Up */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-[#0a0c29] hover:underline"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Already a user? Sign in" : "New here? Create an account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}