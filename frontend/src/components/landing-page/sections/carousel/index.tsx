import { Title, Grid } from "@mantine/core";
import classes from "./carousel.module.css";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import Image from "next/image";
import { motion } from "framer-motion";

export function CarouselSection() {
  const slides = [1, 2, 3, 4, 5];

  return (
    <div className={classes.background}>
      
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <Title ta="center" className={classes.title}>
          Slide Show
        </Title>
      </motion.div>

      <Grid justify="center" mt={"lg"} mb={"lg"}>
        <Grid.Col span={{ md: 10, sm: 10, xs: 10, lg: 10 }}>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
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
          </motion.div>
        </Grid.Col>
      </Grid>
    </div>
  );
}
