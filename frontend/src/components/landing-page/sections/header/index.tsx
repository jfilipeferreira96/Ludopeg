"use client";
import { Avatar, Group, Button, Box, Burger, useMantineTheme, Title, Flex, rem, ActionIcon, Menu, Text, UnstyledButton, useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./header.module.css";
import Link from "next/link"; // Aqui importa o Link do Next.js
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { IconChevronDown, IconLogout, IconMoon, IconSun } from "@tabler/icons-react";
import { ToogleColorTheme } from "@/components/toogle-color";
import { useState } from "react";
import { IconSettings } from "@tabler/icons-react";
import cx from "clsx";
import { IconBook, IconChartPie3, IconCode, IconCoin, IconFingerprint, IconNotification } from "@tabler/icons-react";
import { Anchor, Center, Collapse, Divider, Drawer, HoverCard, ScrollArea, SimpleGrid, ThemeIcon } from "@mantine/core";
import Image from "next/image";

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

export const HeaderMenu = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { user, logout } = useSession();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Flex align={"center"} className={classes.minWidth}>
            <Image src={"/alpces.png"} alt="Logo" width={34} height={40} className={classes.logo} onClick={() => router.push(routes.inicio.url)} />
          </Flex>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href={routes.inicio.url} className={classes.link}>
              Inicio
            </Link>
            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <Link href={routes.inicio.url} className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Features
                    </Box>
                    <IconChevronDown size={16} color={theme.colors.blue[6]} />
                  </Center>
                </Link>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Features</Text>
                  <Anchor href={routes.inicio.url} fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" c="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <Link href={routes.noticias.url} className={classes.link}>
              Notícias
            </Link>
            <Link href={routes.agenda.url} className={classes.link}>
              Agenda
            </Link>
          </Group>

          <Group visibleFrom="sm">
            <ToogleColorTheme />
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer opened={drawerOpened} onClose={closeDrawer} size="100%" padding="md" title="Navegação" hiddenFrom="sm" zIndex={1000000}>
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />

          <Link href={routes.inicio.url} className={classes.link}>
            Inicio
          </Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={theme.colors.blue[6]} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <Link href={routes.noticias.url} className={classes.link}>
            Notícias
          </Link>
          <Link href={routes.agenda.url} className={classes.link}>
            Agenda
          </Link>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};
