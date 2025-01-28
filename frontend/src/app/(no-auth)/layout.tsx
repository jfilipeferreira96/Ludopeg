"use client";
import { usePathname, useRouter } from "next/navigation";
import { HeaderMenu } from "@/components/landing-page/sections/header";
import { Container } from "@mantine/core";
import { useSession } from "@/providers/SessionProvider";
import { routes } from "@/config/routes";
import { useEffect, useState } from "react";
import 'dayjs/locale/pt';
import { DatesProvider } from '@mantine/dates';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  //checking session
  const { user } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<"loading" | "success">("loading");

  useEffect(() => {
    if (user && (pathname === routes.registo.url || pathname === routes.entrada.url)) {
      router.push(routes.inicio.url);
      return;
    }
    if (!user || pathname === routes.inicio.url) {
      setState("success");
      return;
    }
  }, [user]);

  if (state === "loading") {
    return <></>;
  }

  return (
    <>
      <DatesProvider settings={{ locale: 'pt' }}>
        <HeaderMenu />
          {children}
      </DatesProvider>
    </>
  );
}
