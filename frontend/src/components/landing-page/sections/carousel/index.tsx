import { Title, Grid } from "@mantine/core";
import classes from "./carousel.module.css";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import Image from "next/image";

export function CarouselSection() {
  const slides = [1, 2, 3, 4, 5];

  return (
    <div className={classes.background}>
      <Title ta="center" className={classes.title}>
        Slide Show
      </Title>
      <Grid justify="center" mt={"lg"} mb={"lg"}>
        <Grid.Col span={{ md: 10, sm: 10, xs: 10, lg: 10 }}>
          <Carousel slideSize="100%" align="start" slideGap="md" controlSize={30} loop withControls={true} draggable>
            {slides.map((slideNumber) => (
              <Carousel.Slide key={slideNumber}>
                <div className={classes.divImage}>
                  <Image
                    src={`/slider/slide${slideNumber}.png`}
                    alt={`Slide ${slideNumber}`}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Carousel.Slide>
            ))}
          </Carousel>
        </Grid.Col>
      </Grid>
    </div>
  );
}
