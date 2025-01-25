"use client";

import { Card, Image, Text, Group, Stack, Container, Title, Flex, Pagination } from "@mantine/core";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const elementsPerPage = 5;

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);

  const fetchNews = async () => {
    try {
      const fetchedNews: NewsItem[] = [
        { id: 1, title: "Título da Notícia 1", description: "Descrição 1", image: "https://via.placeholder.com/300" },
        { id: 2, title: "Título da Notícia 2", description: "Descrição 2", image: "https://via.placeholder.com/300" },
        { id: 3, title: "Título da Notícia 3", description: "Descrição 3", image: "https://via.placeholder.com/300" },
        { id: 4, title: "Título da Notícia 4", description: "Descrição 4", image: "https://via.placeholder.com/300" },
        { id: 5, title: "Título da Notícia 5", description: "Descrição 5", image: "https://via.placeholder.com/300" },
        { id: 6, title: "Título da Notícia 6", description: "Descrição 6", image: "https://via.placeholder.com/300" },
      ];

      setNews(fetchedNews);
      setTotalNews(fetchedNews.length);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const initialIndex = (activePage - 1) * elementsPerPage;
  const displayedNews = news.slice(initialIndex, initialIndex + elementsPerPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  return (
    <Container size="lg" py="xl">
      <Title ta="center" mb="lg" order={1}>
        Últimas Notícias
      </Title>

      <Stack>
        {displayedNews.map((newsItem, index) => (
          <motion.div key={newsItem.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group>
                <Image src={newsItem.image} alt={newsItem.title} width={150} height={100} radius="md" />

                <Stack>
                  <Text size="lg" w={500}>
                    {newsItem.title}
                  </Text>
                  <Text size="sm" color="dimmed">
                    {newsItem.description}
                  </Text>
                </Stack>
              </Group>
            </Card>
          </motion.div>
        ))}
      </Stack>

      {news.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: displayedNews.length * 0.2 }}>
          <Flex justify="space-between" mt="lg" align="center">
            <Text size="sm">
              A mostrar {initialIndex + 1} a {Math.min(initialIndex + elementsPerPage, totalNews)} de {totalNews} notícias
            </Text>
            <Pagination total={Math.ceil(totalNews / elementsPerPage)} onChange={handlePageChange} />
          </Flex>
        </motion.div>
      )}
    </Container>
  );
}
