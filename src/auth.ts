import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client";
import { db } from "@/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],secret: process.env.NEXTAUTH_SECRET!,
});





// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
  
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
