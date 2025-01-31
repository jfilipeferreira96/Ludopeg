import React from "react";
import { Container, Group, Anchor, Text, ActionIcon, rem, Flex } from "@mantine/core";
import { IconBrandDiscord, IconBrandFacebook, IconBrandGithub, IconBrandInstagram } from "@tabler/icons-react";
import classes from "./footer.module.css";
import Link from "next/link";
import Image from "next/image"; 
import { routes } from "@/config/routes";

const links = [
  { label: "Contactos", link: routes.contactos.url },
  /* { label: "Newsletter", link: routes.newsletter.url }, */
];

const Footer = () => {
  const items = links.map((link) => (
    <Link key={link.label} href={link.link} passHref style={{ textDecoration: "none" }}>
      <Anchor c="dimmed" lh={1} size="sm" style={{ textDecoration: "none" }}>
        {link.label}
      </Anchor>
    </Link>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Flex align={"center"}>
          <Image src="/alpces.png" alt="Logo" width={75} height={75} />
        </Flex>
        {/* <Text size="sm" color="dimmed">
          © 2025 Ludonautas
        </Text> */}
        <Group className={classes.links}>{items}</Group>

        {/* <Group className={classes.links}>{items}</Group> */}
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Link href={"https://www.facebook.com/associacaoludonautas"} target="_blank">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandFacebook style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Link>
          <Link href={"https://www.instagram.com/ludopedagogica/"} target="_blank">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Link>
          <Link href={"https://discord.com/invite/pjbKRdmSMr"} target="_blank">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandDiscord style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Link>
        </Group>
      </Container>
    </div>
  );
};

export default Footer;
