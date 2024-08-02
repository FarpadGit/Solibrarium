import User from "@/models/user";
import RememberMe from "@/models/rememberMe";
import { connectToDB } from "@/utils/DatabaseConnect";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "SolibrariumProvider",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        let errorProgressMessage = "Failed to connect to database: ";
        try {
          await connectToDB();

          // check if user exists
          errorProgressMessage = "Error checking if user exists: ";
          const userInDB = await User.findOne({ email: credentials.email });
          if (!userInDB) return null;

          // check if password is correct
          errorProgressMessage = "Error comparing passwords: ";
          const correctPassword = await bcrypt.compare(
            credentials.password,
            userInDB.password
          );
          if (!correctPassword) return null;

          return { id: userInDB._id, email: userInDB.email };
        } catch (error) {
          console.error(errorProgressMessage, error.message);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "RememberMeProvider",
      credentials: {
        tokenKey: { type: "text" },
        tokenValue: { type: "text" },
      },
      async authorize(credentials) {
        let errorProgressMessage = "Failed to connect to database: ";
        try {
          await connectToDB();

          // check if token exists
          errorProgressMessage = "Error checking if token exists: ";
          const tokenInDB = await RememberMe.findOne({
            tokenKey: credentials.tokenKey,
          });
          if (!tokenInDB) return null;

          // check if token values match
          errorProgressMessage = "Error checking token validity: ";
          const correctToken = await bcrypt.compare(
            credentials.tokenValue,
            tokenInDB.tokenValue
          );
          if (!correctToken) return null;

          // get user for token
          errorProgressMessage = "Error retrieving user: ";
          const userInDB = await User.findById(tokenInDB.userRef);
          if (!userInDB) return null;

          return { id: userInDB._id, email: userInDB.email };
        } catch (error) {
          console.error(errorProgressMessage, error.message);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      const sessionUser = await User.findById(token.id);
      session.user.id = sessionUser._id.toString();
      session.user.loyaltyPoints = sessionUser.loyaltyPoints;

      return session;
    },

    async signIn({ user, account, profile, credentials }) {
      return !!user.email;
    },

    async jwt({ token, account, profile, user }) {
      if (user) {
        if(account && account.provider === "google") {
          await connectToDB();
          let dbUser = await User.findOne({ email: profile.email });
          if(!dbUser) {
            await User.create({ email: profile.email, password: "#GOOGLE" });
            dbUser = await User.findOne({ email: profile.email });
            token.id = dbUser.id;
          } else {
            token.id = dbUser.id;
          }
        }
        else {
          token.id = user.id;
        }
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
