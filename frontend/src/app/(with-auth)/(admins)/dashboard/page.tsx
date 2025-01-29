"use client";
import { routes } from "@/config/routes";
import { useSession } from "@/providers/SessionProvider";
import { Affix, Button, Group, useMantineColorScheme } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isReady } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.user_type === "admin") {
        router.push(routes.dashboard.entradas);
        return;
      }

      router.push(routes.inicio.url);
    } else {
      router.push(routes.entrada.url);
    }
  }, [user]);

  return (
    <>
      <title>Dashboard</title>
    </>
  );
}
