"use client";
import React, { useState, useEffect } from "react";
import { Card, Table, Checkbox, Pagination as MantinePagination, Center, Text, Select, Flex, Badge, SimpleGrid, Skeleton, Grid, Tooltip, ActionIcon, rem, Group, Button, Modal, TextInput } from "@mantine/core";
import { deleteUser, Filters, getAllUsers } from "@/services/user.service";
import { IconBrandZoom, IconCards, IconEye, IconGift, IconPencil, IconPlus, IconSearch, IconSticker, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import EditUserModal from "@/components/user-modal/edit";
import { notifications } from "@mantine/notifications";
import { usePathname } from "next/navigation";
import { User } from "@/types/user";

function getBadge(user_type: string){
  if (user_type === 'admin')
  {
    return { name: "Administrador", color: "blue" };
  } else
  {
    return { name: "Jogador", color: "orange" };
  }
}

function Users() {
  const pathname = usePathname();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [elementsPerPage, setElementsPerPage] = useState<number>(() => {
    const storedValue = localStorage.getItem(pathname);
    return storedValue ? parseInt(storedValue) : 10;
  });
  const [elementos, setElementos] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);

  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const pagination = {
        page: activePage,
        limit: elementsPerPage,
        orderBy: 'user_id',
        order: 'DESC'
      }

      const filters: Filters = {
        email: searchTerm ?? null,
        username: searchTerm ?? null,
        fullname: searchTerm ?? null,
        phone: searchTerm ?? null,
      };

      const response = await getAllUsers(pagination, filters);
      
      if (response)
      {
        setElementos(response.data);
        setTotalElements(response.pagination.total || 0);
        setActivePage(response.pagination.page || 1);
      }

      setLoading(false);
    } catch (error)
    {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activePage, elementsPerPage, searchTerm]);

  const handlePageChange = (page: number) =>
  {
    setActivePage(page);
  };

  const handleEditCleak = (userId: number) => {
    setEditUserId(userId);
    setIsModalOpenEdit(true);
  };

  
  const handleElementsPerPageChange = (value: string | null) => {

    if (value)
    {
      setElementsPerPage(parseInt(value));
      setActivePage(1); // Reset to first page whenever elements per page change
      localStorage.setItem(pathname, value);
    }
  };

  const initialIndex = (activePage - 1) * elementsPerPage;
  const finalIndex = initialIndex + elementsPerPage;

   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
     setSearchTerm(event.currentTarget.value);
   };

  const rows = elementos?.map((element) => (
    <Table.Tr key={Number(element.user_id)} bg={selectedRows.includes(Number(element.user_id)) ? "var(--mantine-color-blue-light)" : undefined}>
      <Table.Td>
        <Badge variant="filled" size="md" fw={700} color={getBadge(element.user_type).color} style={{ minWidth: "110px" }}>
          {getBadge(element.user_type).name}
        </Badge>
      </Table.Td>
      <Table.Td>{element.username}</Table.Td>
      <Table.Td>{element.fullname}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element?.phone ? element?.phone : "-"}</Table.Td>
      <Table.Td>{element.created_at && new Date(element.created_at).toLocaleString()}</Table.Td>
      <Table.Td>
        <Group gap={4} justify="center">
          <Tooltip label={"Apagar Utilizador"} withArrow position="top">
            <ActionIcon
              variant="filled"
              className="action-icon-size"
              color="red"
              onClick={() => {
                setDeleteUserId(Number(element.user_id));
                open();
              }}
            >
              <IconTrash style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={"Editar Perfil"} withArrow position="top">
            <ActionIcon variant="filled" className="action-icon-size" onClick={() => handleEditCleak(Number(element.user_id))}>
              <IconPencil size={20} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <h1>Utilizadores do Sistema</h1>

      <EditUserModal isModalOpen={isModalOpenEdit} setIsModalOpen={setIsModalOpenEdit} fetchData={fetchData} userId={editUserId} />

      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <Center>
          <h3>Tem a certeza que pretende eliminar?</h3>
        </Center>
        <Button
          fullWidth
          variant="filled"
          color="red"
          size="md"
          onClick={() => {
            if (deleteUserId) {
              deleteUser(deleteUserId)
                .then((res) => {
                  if (res.status === true) {
                    notifications.show({
                      message: res.message,
                      color: "red",
                    });
                  } else {
                    notifications.show({
                      title: "Erro",
                      message: "Algo correu mal",
                      color: "red",
                    });
                  }
                })
                .finally(() => {
                  close(), fetchData();
                });
            }
          }}
        >
          Confirmo
        </Button>
      </Modal>
      <Grid>
        <Grid.Col span={{ base: 0, sm: 0, md: 3, lg: 3 }}></Grid.Col>
        <Grid.Col span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
          <Card withBorder shadow="md" p={30} mt={10} radius="md" style={{ flex: 1 }}>
            <TextInput
              radius="xl"
              size="md"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Pesquisar por nome, email ou telemóvel"
              rightSectionWidth={42}
              leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
            />
          </Card>
        </Grid.Col>
      </Grid>
      <Card withBorder shadow="md" p={30} mt={10} radius="md" style={{ flex: 1 }}>
        <Group justify="space-between" align="center" mb={"lg"}>
          <Flex align={"center"}>
            <Text>A mostrar</Text>
            <Select
              data={["10", "20", "30", "50"]}
              value={elementsPerPage.toString()}
              allowDeselect={false}
              style={{ width: "80px", marginLeft: "8px" }}
              ml={4}
              mr={4}
              onChange={(value) => handleElementsPerPageChange(value)}
            />
            <Text>entradas</Text>
          </Flex>
        </Group>

        <Table.ScrollContainer minWidth={500}>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Tipo de Utilizador</Table.Th>
                <Table.Th>Utilizador</Table.Th>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Telemóvel</Table.Th>
                <Table.Th>Data de Criação</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {elementos.length > 0 && (
          <Flex justify={"space-between"} mt={"lg"}>
            <Text>
              A mostrar {initialIndex + 1} a {Math.min(finalIndex, totalElements)} de {totalElements} utilizadores
            </Text>
            <MantinePagination total={Math.ceil(totalElements / elementsPerPage)} onChange={handlePageChange} />
          </Flex>
        )}
      </Card>
    </>
  );
}

export default Users;
