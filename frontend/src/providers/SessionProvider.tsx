"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { notifications } from "@mantine/notifications";
import { User } from "@/types/user";

interface DecodedToken extends JwtPayload, User{
  exp: number;
}

type sessionProps = (userData: User, accessToken: string, redirect?: boolean | undefined) => void;

interface SessionContextProps {
  user: User | null | any;
  sessionLogin: sessionProps;
  logout: () => void;
  isReady: boolean;
  updateUser: (newUserData: Partial<User>) => void;
  config: { torneios: string; ligas: string; isReady: boolean };
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [config, setConfig] = useState({ torneios: "", ligas: "", isReady: false });
  const pathname = usePathname();

  const sessionLogin: sessionProps = (userData, accessToken, redirect = true) => {
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);

    if (redirect) {
      router.push(routes.inicio.url);
    }
  };

  const logout = (redirect = true) => {
    setUser(null);
    localStorage.removeItem("accessToken");

    if (redirect) {
      router.push(routes.entrada.url);
    }
  };

  const getSession = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken") ?? "";
      const currentDate = new Date();
      
      if (accessToken) {
        const decodedToken = jwt.decode(accessToken) as DecodedToken;

        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          notifications.show({
            title: "Erro",
            message: "Sessão expirou",
            color: "red",
          });

          logout(true);
          return;
        }
        
        const userData = {
          ...decodedToken,
        };
        
        sessionLogin(userData, accessToken, false);
      } else {
        logout(false);
        return;
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return null;
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  const updateUser = (newUserData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
  };

  return <SessionContext.Provider value={{ isReady, user, sessionLogin, logout, updateUser, config }}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
