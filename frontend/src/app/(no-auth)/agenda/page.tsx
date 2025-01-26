"use client";

import { Card, Text, Image, Group, Stack, Container, Title, Flex, Pagination, Anchor, Grid } from "@mantine/core";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type EventItem = {
  event_id: number;
  event_date: string;
  title: string;
  location_id: number;
  location_name: string;
};

const elementsPerPage = 100;

export default function AgendaPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const router = useRouter(); 

  const fetchEvents = async () => {
    try {
      const fetchedEvents: EventItem[] = [
        { event_id: 1, event_date: "2025-02-01", title: "Evento 1", location_id: 1, location_name: "Local 1" },
        { event_id: 2, event_date: "2025-02-02", title: "Evento 2", location_id: 2, location_name: "Local 2" },
        { event_id: 3, event_date: "2025-02-03", title: "Evento 3", location_id: 3, location_name: "Local 3" },
        { event_id: 4, event_date: "2025-02-04", title: "Evento 4", location_id: 4, location_name: "Local 4" },
        { event_id: 5, event_date: "2025-02-05", title: "Evento 5", location_id: 5, location_name: "Local 5" },
        { event_id: 6, event_date: "2025-02-06", title: "Evento 6", location_id: 6, location_name: "Local 6" },
      ];

      setEvents(fetchedEvents);
      setTotalEvents(fetchedEvents.length);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const initialIndex = (activePage - 1) * elementsPerPage;
  const displayedEvents = events.slice(initialIndex, initialIndex + elementsPerPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  return (
    <Container size="lg" py="xl">
      <Title ta="center" mb="lg" order={1}>
        Agenda de Eventos
      </Title>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
         
          <Stack>
            {displayedEvents.map((event, index) => (
              <motion.div key={event.event_id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                <Card shadow="sm" padding="xs" radius="md" withBorder>
                  <Group>
                    <Stack>
                      <Text size="md" w={500}>
                        {event.title}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {event.event_date} -
                        <Anchor size="sm" component="a" ml={2} onClick={() => router.push(`/location/${event.location_id}`)}>
                          {event.location_name}
                        </Anchor>
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 * 0.2 }}>
            <Flex align={"center"}>
              <Image src="/astronaut/5.png" alt="Astronaut Agenda" style={{ marginLeft: "auto", marginRight: "auto" }} /* className={classes.heroImage} */ />
            </Flex>
          </motion.div>
        </Grid.Col>
      </Grid>

      {/* {events.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: displayedEvents.length * 0.2 }}>
          <Flex justify="space-between" mt="lg" align="center">
            <Text size="sm">
              A mostrar {initialIndex + 1} a {Math.min(initialIndex + elementsPerPage, totalEvents)} de {totalEvents} eventos
            </Text>
            <Pagination total={Math.ceil(totalEvents / elementsPerPage)} onChange={handlePageChange} />
          </Flex>
        </motion.div>
      )} */}
    </Container>
  );
}
