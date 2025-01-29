import { HoverCard, Group, Button, UnstyledButton, Text, SimpleGrid, ThemeIcon, Anchor, Divider, Center, Box, Burger, Drawer, Collapse, ScrollArea, rem, useMantineTheme, Flex, Avatar, Menu, useComputedColorScheme } from "@mantine/core";
import classes from "./HeaderAdmin.module.css";
import Image from "next/image";

interface Props {
  opened: boolean;
  toggle: () => void;
}

export function AdminHeader(props: Props) {
  const { opened, toggle } = props;
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  const theme = useMantineTheme();

  return (
    <Box pb={4} pt={10}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" className={classes.groupfix}>
          <Flex align={"center"}>
            <Image
              src={"/alpces.png"}
              alt="Logo"
              width={45}
              height={45}
              className={classes.logo}
            />
          </Flex>

          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
        </Group>
      </header>
    </Box>
  );
}
