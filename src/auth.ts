import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],secret: process.env.NEXTAUTH_SECRET!,
});




function PrismaAdapter(prisma: any): import("@auth/core/adapters").Adapter | undefined {
  throw new Error("Function not implemented.");
}
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
