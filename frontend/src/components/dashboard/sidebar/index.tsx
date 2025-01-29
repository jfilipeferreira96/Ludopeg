import { useEffect, useState } from "react";
import { Group, Code, Text, Select, Modal, Button, Flex, Burger } from "@mantine/core";
import { IconFingerprint, IconLicense, IconShoppingCart, IconUser, IconSettings, IconSwitchHorizontal, IconLogout, IconHome, IconBrandProducthunt, IconCards, IconNews, IconGift } from "@tabler/icons-react";
import classes from "./NavbarSimpleColored.module.css";
import { useSession } from "@/providers/SessionProvider";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import Image from "next/image";

const data = [
  { label: "Validações de Entradas", icon: IconFingerprint, url: routes.dashboard.validacoes },
  { label: "Registo de Entradas", icon: IconLicense, url: routes.dashboard.entradas },
  { label: "Noticias", icon: IconNews, url: routes.dashboard.noticias },
  { label: "Utilizadores do Sistema", icon: IconUser, url: routes.dashboard.utilizadores },
];

interface Props {
  close: () => void;
  toggle: () => void;
}

export function NavbarSimpleColored(props: Props) {
  const { close: closeNavbar, toggle } = props;
  const { logout } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
 
  const links = data.map((item, index) => (
    <div
      className={classes.link}
      data-active={index === active || undefined}
      key={item.label}
      onClick={() => {
        if (isMobile) {
          closeNavbar(); 
        }
        setActive(index);
        router.push(item.url);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </div>
  ));



  useEffect(() => {
    const activeIndex = data.findIndex((item) => {
      if (item.url) {
        return pathname.includes(item.url);
      }
      return false;
    });

    if (activeIndex !== -1) {
      setActive(activeIndex);
    }
  }, [pathname]);

  return (
    <>
      <nav className={classes.navbar}>
        <div className={classes.header}>
          <Group justify="space-between">
         
            {/* <Code fw={700} className={classes.version}>
              Dashboard
            </Code> */}
            <Text c={"white"} w={700}>Dashboard</Text>
            {/*  <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />*/}
          </Group>
        </div>

        <div className={classes.navbarMain}>{links}</div>

        <div className={classes.footer}>
          <div className={classes.link} onClick={() => router.push(routes.inicio.url)}>
            <IconHome className={classes.linkIcon} stroke={1.5} />
            <span>Sair do Dashboard</span>
          </div>

          <div className={classes.link} onClick={logout}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Terminar sessão</span>
          </div>
        </div>
      </nav>
    </>
  );
}
