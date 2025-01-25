import { Grid, GridCol, Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, Flex } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import classes from "./hero.module.css";
import Link from "next/link";
import { routes } from "@/config/routes";
import ThreeDButton from "@/components/3dbutton";

export function Hero() {
  return (
    <div className={classes.background}>
      <div className={classes.inner}>
        <Grid justify="center">
          <Grid.Col span={{ md: 6, sm: 12, xs: 12, lg: 6 }}>
            <div className={classes.content}>
              <h1 className={classes.title}>
                Level Up {""}
                <Text component="span" variant="gradient" gradient={{ from: "blue", to: "cyan" }} inherit>
                  Learning Experience
                </Text>{" "}
                with Engaging Challenges
              </h1>
              <Text c="dimmed" mt="md">
                {"Enhance your students' educational journey by crafting interactive quizzes and offering special prizes. Foster friendly competition among peers to inspire excellence in higher education."}
              </Text>

              <List
                mt={30}
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon size={20} radius="xl">
                    <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <b>Competition</b> {"- Compete with your peers and see who's the top performer."}
                </List.Item>
                <List.Item>
                  <b>Motivation</b> {"- Stay engaged and motivated to excel in your higher education journey."}
                </List.Item>
              </List>

              <Group mt={30}>
                <Link href={routes.signin.url} className={classes.control}>
                  <ThreeDButton rounded color="blue">
                    Get started
                  </ThreeDButton>
                </Link>
                <Link href={"https://github.com/jfilipeferreira96/ProjectThesis"} target="_blank" className={classes.control}>
                  <ThreeDButton rounded color="gray">
                    Source code
                  </ThreeDButton>
                </Link>
              </Group>
            </div>
          </Grid.Col>
          <Grid.Col span={{ md: 6, sm: 12, xs: 12, lg: 4 }}>
            <Flex align={"center"}>
              <Image src="/astronaut/2.png" alt="Wait" style={{ marginLeft: "auto", marginRight: "auto" }} className={classes.heroImage} />
            </Flex>
          </Grid.Col>
        </Grid>
      </div>
      <div>
        <svg className={classes.SvgWavesDown} preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z"></path>
        </svg>
      </div>
    </div>
  );
}
