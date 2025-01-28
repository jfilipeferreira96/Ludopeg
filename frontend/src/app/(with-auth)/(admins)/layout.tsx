"use client";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { useEffect } from "react";
import { routes } from "@/config/routes";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { AppShell, Burger } from "@mantine/core";
import { NavbarSimpleColored } from "@/components/dashboard/sidebar";
import 'dayjs/locale/pt';
import { DatesProvider } from '@mantine/dates';
import { AdminHeader } from "@/components/dashboard/header/admin-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [opened, { open, close, toggle }] = useDisclosure();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!isReady) return;

    if (!user?.user_id && isReady) {
      router.push(routes.entrada.url)
    }

    if (user && user.user_type !== "admin") {
      router.push(routes.inicio.url);
    }
  }, [user, isReady])

  if (!user?.user_id || user.user_type !== "admin") {
    return <></>;
  }

  return (
    <DatesProvider settings={{ locale: 'pt' }}> {/* Configura a localidade para PT-PT */}
      <AppShell header={{ height: 70, collapsed: isSmallScreen ? false : true }} navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }} padding="md">
        <AppShell.Header>
          <AdminHeader opened={opened} toggle={toggle} />
        </AppShell.Header>
        <AppShell.Navbar>
          <NavbarSimpleColored close={close} />
        </AppShell.Navbar>
        <AppShell.Main mb={40}>{children}</AppShell.Main>
      </AppShell>
    </DatesProvider>
  );
}
