import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/utils/database"; // Adjust this path
import User from "@/models/user"; // Adjust this path

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      session.user.id = sessionUser._id.toString();
      // console.log("i am session user id: ", session.user.id);
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // if a user already exists
        const userExists = await User.findOne({
          email: profile.email,
        });
        // if not, create a new user
        if (!userExists) {
          await User.create({
            email: profile.email,
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };