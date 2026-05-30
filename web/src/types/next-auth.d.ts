import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      visitorId: number;
      role: "admin" | "visitor";
    };
  }

  interface User {
    visitorId: number;
    role: "admin" | "visitor";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    visitorId?: number;
    role?: "admin" | "visitor";
  }
}
