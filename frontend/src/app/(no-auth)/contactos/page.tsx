"use client";

import { motion } from "framer-motion";
import { ActionIcon, Box, Container, Image, Grid, Group, Text, useMantineTheme } from "@mantine/core";
import { IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import NextImage from "next/image";
import classes from "./index.module.css";
import { JumboTitle } from "@/components/jumbo-title";

type Employee = {
  imageUrl: string;
  name: string;
  alt: string;
  title: string;
  social: {
    x?: string;
    linkedin?: string;
  };
};

const EMPLOYEES: Employee[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&format&fit=facearea&facepad=3&w=900&h=900&q=80",
    name: "Sarah Thompson",
    alt: "Sarah Thompson",
    title: "Engineering",
    social: {
      x: "#",
      linkedin: "#",
    },
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&format&fit=facearea&facepad=3&w=900&h=900&q=80&ixlib=rb-1.2.1",
    name: "Michael Rodriguez",
    title: "Product",
    alt: "Michael Rodriguez",
    social: {
      x: "#",
      linkedin: "#",
    },
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1542996966-2e31c00bae31?&format&fit=facearea&facepad=3&w=900&h=900&q=80&ixlib=rb-1.2.1",
    name: "Emily Nakamura",
    title: "Accounting",
    alt: "Emily Nakamura",
    social: {
      x: "#",
      linkedin: "#",
    },
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?&format&fit=facearea&facepad=3&w=900&h=900&q=80&ixlib=rb-1.2.1",
    name: "Priya Patel",
    title: "Design",
    alt: "Priya Patel",
    social: {
      x: "#",
      linkedin: "#",
    },
  },
  {
    imageUrl:
      "https://images.unsplash.com/flagged/photo-1595514191830-3e96a518989b?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?&format&fit=facearea&facepad=3&w=900&h=900&q=80&ixlib=rb-1.2.1",
    name: "Liam Novak",
    title: "Marketing",
    alt: "Liam Novak",
    social: {
      x: "#",
      linkedin: "#",
    },
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?&format&fit=facearea&facepad=3&w=900&h=900&q=80&ixlib=rb-1.2.1",
    name: "Olivia Torres",
    title: "Sales",
    alt: "Olivia Torres",
    social: {
      x: "#",
      linkedin: "#",
    },
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?&format&fit=facearea&facepad=3&w=900&h=900&q=80&ixlib=rb-1.2.1",
    name: "Marcus Johnson",
    title: "Engineering",
    alt: "Marcus Johnson",
    social: {
      x: "#",
      linkedin: "#",
    },
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1645857195444-2064b4ecabf3?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?&format&fit=facearea&facepad=3&w=900&h=900&q=80&ixlib=rb-1.2.1",
    name: "David Okafor",
    title: "Product",
    alt: "David Okafor",
    social: {
      x: "#",
      linkedin: "#",
    },
  },
];

const EmployeeCell = ({
  name,
  title,
  social,
  imageUrl,
  alt,
  index,
}: Employee & {
  index: number;
}) => {
  const theme = useMantineTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: 0.2 * index,
          ease: "easeOut",
          once: true,
        },
      }}
    >
      <Box w="100%" mb="xl">
        <motion.div whileHover={{ scale: 1.05, boxShadow: "var(--mantine-shadow-xl)" }} transition={{ type: "spring" }}>
          <Box pos="relative" w="100%" style={{ aspectRatio: "1/1", borderRadius: "var(--mantine-radius-lg)" }} mb="lg">
            <NextImage src={imageUrl} alt={alt} sizes={`(max-width: ${theme.breakpoints.xs}) 100vw, (max-width: ${theme.breakpoints.md}) 50vw, 25vw`} fill style={{ borderRadius: "10px" }} />
          </Box>
        </motion.div>
        <Text fz="xl" fw="bold">
          {name}
        </Text>
        <Text fz="lg">{title}</Text>
        <Group
          gap={0}
          mt={{
            base: "xs",
            xs: "md",
          }}
        >
          {social.x && (
            <ActionIcon className={classes["action-icon"]} variant="subtle" component="a" href="#" target="_blank" size="xl">
              <IconBrandX />
            </ActionIcon>
          )}
          {social.linkedin && (
            <ActionIcon className={classes["action-icon"]} variant="subtle" component="a" href="#" target="_blank" size="xl">
              <IconBrandLinkedin />
            </ActionIcon>
          )}
        </Group>
      </Box>
    </motion.div>
  );
};

export default function Contactos() {
  const theme = useMantineTheme();

  return (
    <Container
      bg="var(--mantine-color-body)"
      size="xl"
      px={0}
      py={{
        base: "calc(var(--mantine-spacing-lg) * 4)",
        xs: "calc(var(--mantine-spacing-lg) * 5)",
        lg: "calc(var(--mantine-spacing-lg) * 6)",
      }}
    >
      <Container
        size="lg"
        px={{
          base: "xl",
          lg: 0,
        }}
      >
        <Grid
          gutter={{
            base: 0,
            lg: "calc(var(--mantine-spacing-xl) * 2)",
          }}
          align="end"
        >
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <motion.div initial={{ opacity: 0.0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} viewport={{ once: true }}>
              <JumboTitle
                order={2}
                fz="md"
                style={{ textWrap: "balance" }}
                pr={{
                  base: 0,
                  xs: "calc(var(--mantine-spacing-xl) * 4)",
                }}
                mb={{
                  base: "xs",
                  lg: 0,
                }}
              >
                A equipa
              </JumboTitle>
            </motion.div>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <Text c="dimmed" fz="xl" component={motion.div} initial={{ opacity: 0.0, y: 40 }} transition={{ duration: 0.8, ease: "easeInOut" }} viewport={{ once: true }} whileInView={{ opacity: 1, y: 0 }}>
              A nossa fisolofia é servir o povo xpto xpto xpto as asd asdad ads asdasdasdasd asdasd as.
            </Text>
          </Grid.Col>
        </Grid>
        <Box
          mt={{
            base: "calc(var(--mantine-spacing-xl) * 3)",
            lg: "calc(var(--mantine-spacing-xl) * 5)",
          }}
        >
          <Grid gutter="xl">
            {EMPLOYEES.map((employee, index) => (
              <Grid.Col span={{ base: 12, xs: 6, md: 3 }} key={employee.name}>
                <EmployeeCell key={employee.name} {...employee} index={index} />
              </Grid.Col>
            ))}
          </Grid>
        </Box>

        <Box mt="lg" mb="lg">
          <motion.div initial={{ opacity: 0.0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} viewport={{ once: true }}>
            <JumboTitle
              order={4}
              fz="md"
              style={{ textWrap: "balance" }}
              pr={{
                base: 0,
                xs: "calc(var(--mantine-spacing-xl) * 4)",
              }}
              mb={"lg"}
            >
              Localização
            </JumboTitle>
          </motion.div>
          {/* Grid Container */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Text fz="xl" fw="bold" ta={"center"} className={classes.marginTop}>
                Antiga Escola de Beire
              </Text>
              <Text fz="lg" ta={"center"}>
                Rua da Gândara 164 <br />
                4520-606 São João de Ver <br />
                Portugal
              </Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <motion.div whileHover={{ scale: 1.05, boxShadow: "var(--mantine-shadow-xl)" }} transition={{ type: "spring" }}>
                <Box pos="relative" w="100%" style={{ aspectRatio: "1/1", borderRadius: "var(--mantine-radius-lg)" }} mb="lg">
                  <NextImage
                    src={"/map.png"}
                    alt={"Maps"}
                    sizes={`(max-width: ${theme.breakpoints.xs}) 100vw, (max-width: ${theme.breakpoints.md}) 50vw, 25vw`}
                    fill
                    style={{ borderRadius: "10px", cursor: "pointer" }}
                    onClick={() =>
                      window.open(
                        "https://www.google.com/maps/place/ALPCeS+-+Associa%C3%A7%C3%A3o+Ludopedag%C3%B3gica+Cultural+e+Social/@40.9488707,-8.5671607,16z/data=!4m6!3m5!1s0xd238163b7edd1ad:0x5cbce55b80672008!8m2!3d40.9475522!4d-8.5651619!16s%2Fg%2F11wjkn3vmg?entry=ttu&g_ep=EgoyMDI1MDEyMi4wIKXMDSoASAFQAw%3D%3D",
                        "_blank"
                      )
                    }
                  />
                </Box>
              </motion.div>
            </Grid.Col>
          </Grid>
        </Box>
      </Container>
    </Container>
  );
}
