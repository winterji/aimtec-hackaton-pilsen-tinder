import { useEffect, useState } from "react";

interface AuthUser {
  userId: number;
  username: string;
}

function decodeToken(token: string): AuthUser | null {
  // Decodes the JWT payload for display purposes only (username, userId).
  // All authorization decisions are enforced server-side via the Authorization header.
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return { userId: decoded.userId, username: decoded.username };
  } catch {
    return null;
  }
}

export function useAuth(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setUser(decodeToken(token));
    }
  }, []);

  return user;
}
