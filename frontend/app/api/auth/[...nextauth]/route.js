// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Check if credentials exist
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Email and password required");
        }
        
        try {
          // Verify credentials using your API
          const response = await fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || "Invalid credentials");
          }
          
          // If we got here, authentication succeeded
          return {
            id: data.user?.id || "user-id",
            email: credentials.username,
            name: data.user?.name || credentials.username.split('@')[0],
            token: data.token || "",
          };
        } catch (error) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user details to token when signing in
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user details from token to session
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };