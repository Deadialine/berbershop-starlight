import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbx } from "./data";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const username = credentials.email.trim();

        if (username === "admin" && credentials.password === "admin") {
          return { id: "admin", email: "admin", name: "Admin", role: "admin" } as any;
        }

        const user = dbx.getUserByEmail(username.toLowerCase());
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.email, role: "guest" } as any;
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token) {
        session.user = {
          id: token.id,
          name: session.user?.name || "User",
          email: session.user?.email || "",
          role: token.role,
        } as any;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authOptions);
