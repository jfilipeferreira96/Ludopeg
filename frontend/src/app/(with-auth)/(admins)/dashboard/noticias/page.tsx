"use client";
import React, { useState, useEffect } from "react";
import { Table, Pagination, Select, Group, Text, Badge, Tooltip, ActionIcon, Modal, Button, Card, Flex } from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { getAllNews, deleteNews } from "@/services/news.service";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { NewsData, NewsResponse } from "@/types/noticias";

const NewsTable = () => {
  const [news, setNews] = useState<NewsResponse[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteNewsId, setDeleteNewsId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    fetchNews();
  }, [activePage, elementsPerPage]);

  const fetchNews = async () => {
    try {
      const response = await getAllNews({ page: activePage, limit: elementsPerPage, orderBy: "id", order: "DESC" });
      if (response) {
        setNews(response.data);
        setTotalElements(response.pagination.total || 0);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleDelete = async () => {
    if (deleteNewsId) {
      await deleteNews(deleteNewsId);
      notifications.show({ message: "Notícia removida com sucesso", color: "red" });
      close();
      fetchNews();
    }
  };

  return (
    <>
      <h1>Notícias</h1>
      <Card withBorder shadow="md" p={30} mt={10} radius="md">
        <Group justify="space-between" align="center" mb="lg">
          <Flex align="center">
            <Text>A mostrar</Text>
            <Select data={["10", "20", "30", "50"]} value={elementsPerPage.toString()} onChange={(value) => setElementsPerPage(Number(value))} ml={4} mr={4} />
            <Text>entradas</Text>
          </Flex>
          <Button variant="light" color="green" rightSection={<IconPlus size={18} />}>Adicionar Notícia</Button>
        </Group>

        <Table.ScrollContainer minWidth={500}>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>#</Table.Th>
                <Table.Th>Título</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {news.map((article) => (
                <Table.Tr key={article.id}>
                  <Table.Td>{article.id}</Table.Td>
                  <Table.Td>{article.title}</Table.Td>
                  <Table.Td>{article.date}</Table.Td>
                  <Table.Td>
                    <Tooltip label="Apagar Notícias">
                      <ActionIcon color="red" onClick={() => { /* setDeleteNewsId(article.id); */ open(); }}>
                        <IconTrash size={20} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Flex justify="space-between" mt="lg">
          <Text>A mostrar {(activePage - 1) * elementsPerPage + 1} a {Math.min(activePage * elementsPerPage, totalElements)} de {totalElements} elementos</Text>
          <Pagination total={Math.ceil(totalElements / elementsPerPage)} onChange={setActivePage} />
        </Flex>
      </Card>

      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <h3>Tem a certeza que pretende eliminar?</h3>
        <Button fullWidth variant="filled" color="red" size="md" onClick={handleDelete}>Confirmo</Button>
      </Modal>
    </>
  );
};

export default NewsTable;
