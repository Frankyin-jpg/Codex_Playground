import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      workspaceId: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    workspaceId: string;
  }
}
