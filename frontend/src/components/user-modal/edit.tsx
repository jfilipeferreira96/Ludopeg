"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { Modal, TextInput, Radio, Input, Button, Group, CheckIcon, Checkbox } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { z } from "zod";
import { getUser, updateUser } from "@/services/user.service";
import ReactInputMask from "react-input-mask";
import { User, UserType } from "@/types/user";
import ThreeDButton from "@/components/3dbutton";

const schema = z.object({
  fullname: z.string().min(2, { message: "O nome completo deve ter pelo menos 2 letras" }),
  username: z.string().min(2, { message: "O nome de utilizador deve ter pelo menos 2 letras" }),
  email: z.string().email({ message: "Endereço de email inválido" }),
  phone: z.string().regex(/^\d{9}$/, { message: "O número de telemóvel deve ter 9 dígitos" }),
  avatar: z.string().min(4, { message: "Por favor, selecione um avatar" }),
  birthdate: z.union([z.date(), z.undefined(), z.string()]),
  is_subscribed_to_newsletter: z.boolean(),
});

interface Props
{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number | null;
  fetchData: () => Promise<void>;
}

export default function EditUserModal({ isModalOpen, setIsModalOpen, userId, fetchData }: Props)
{
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType>(UserType.JOGADOR);
  
  useEffect(() =>
  {
    if (isModalOpen && userId)
    {
      fetchUserData(userId);
      open();
    } else
    {
      close();
    }
  }, [isModalOpen, userId]);

  useEffect(() =>
  {
    if (!opened)
    {
      setIsModalOpen(false);
      form.reset();
    }
  }, [opened]);

  const form = useForm({
    initialValues: {
      fullname: "",
      username: "",
      email: "",
      phone: "",
      birthdate: undefined,
      is_subscribed_to_newsletter: false,
      avatar: "",
    },
    validate: zodResolver(schema),
  });

  const fetchUserData = async (userId: number) =>
  {
    if (!userId) return;

    try
    {
      const userData: User = await getUser(userId);
      const date = userData.birthdate ? new Date(userData.birthdate) : "";

      form.setValues({
        fullname: userData.fullname || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        birthdate: date as any,
        is_subscribed_to_newsletter: userData.is_subscribed_to_newsletter || false,
      });

      setSelectedUserType(userData.user_type.toLowerCase() as UserType);
    } catch (error)
    {
      notifications.show({
        title: "Erro",
        message: "Não foi possível carregar os dados do utilizador",
        color: "red",
      });
    }
  };

  const onSubmitHandler = useCallback(
    async (data: Partial<User>) =>
    {
      try
      {
        if (!userId) return;
        const sendData = { ...data, user_type: selectedUserType };

        const response = await updateUser(userId, sendData);

        if (response.status)
        {
          notifications.show({
            title: "Sucesso",
            message: "Utilizador atualizado com sucesso!",
            color: "green",
          });

          fetchData().finally(() => close());
        } else
        {
          notifications.show({
            title: "Erro",
            message: response.message || "Erro ao atualizar os dados",
            color: "red",
          });
        }
      } catch (error)
      {
        notifications.show({
          title: "Erro",
          message: "Algo correu mal",
          color: "red",
        });
      }
    },
    [userId, selectedUserType]
  );

  return (
    <Modal opened={opened} onClose={close} title="Editar Utilizador" size="lg">
      <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
        <TextInput label="Nome Completo" placeholder="Insira o seu nome completo" required {...form.getInputProps("fullname")} mb={"sm"} />
        <TextInput label="Nome de Utilizador" placeholder="Insira o seu nome de utilizador" required {...form.getInputProps("username")} mb={"sm"} />
        <TextInput label="Email" placeholder="exemplo@gmail.com" required {...form.getInputProps("email")} mb={"sm"} />
        <Input.Wrapper label="Telemóvel" required>
          <Input component={ReactInputMask} mask="999999999" placeholder="Insira o seu telemóvel" {...form.getInputProps("phone")} />
        </Input.Wrapper>
        <DatePickerInput label="Data de Nascimento" placeholder="Selecione a sua data de nascimento" {...form.getInputProps("birthdate")} valueFormat="DD-MM-YYYY" mb={"sm"} />

        <Radio.Group
          name="user_type"
          label="Tipo de Utilizador"
          withAsterisk
          value={selectedUserType.toLowerCase()} // 🔹 Força o valor para minúsculas
          onChange={(value) => setSelectedUserType(value.toLowerCase() as UserType)} // 🔹 Converte para minúsculas ao mudar
          required
          mb={"sm"}
        >
          <Group mt="xs">
            <Radio value={UserType.ADMIN.toLowerCase()} label="Admin" icon={CheckIcon} />
            <Radio value={UserType.JOGADOR.toLowerCase()} label="Jogador" icon={CheckIcon} />
          </Group>
        </Radio.Group>

        <Checkbox mt={"md"} label="Subscrever newsletter" {...form.getInputProps("is_subscribed_to_newsletter", { type: "checkbox" })} />

        <ThreeDButton color="blue" mt="xl" type="submit" smaller>
          Atualizar Utilizador
        </ThreeDButton>
      </form>
    </Modal>
  );
}
