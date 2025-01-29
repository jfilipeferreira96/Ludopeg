"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { Modal, TextInput, Radio, MultiSelect, Input, Button, Group, CheckIcon, Checkbox } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { z } from "zod";
import { getUser, updateUser } from "@/services/user.service";
import { useLocation } from "@/providers/LocationProvider";
import ReactInputMask from "react-input-mask";
import { User, UserType } from "@/types/user";
import SetAvatar from "@/components/avatar";
import ThreeDButton from "@/components/3dbutton";

const schema = z
  .object({
    fullname: z.string().min(2, { message: "O nome completo deve ter pelo menos 2 letras" }),
    username: z.string().min(2, { message: "O nome de utilizador deve ter pelo menos 2 letras" }),
    email: z.string().email({ message: "Endereço de email inválido" }),
    phone: z.string().regex(/^\d{9}$/, { message: "O número de telemóvel deve ter 9 dígitos" }),
    avatar: z.string().min(4, { message: "Por favor, selecione um avatar" }),
    birthdate: z.union([z.date(), z.undefined(), z.string()]),
    user_type: z.enum(["admin", "player"], {
      required_error: "O tipo de utilizador é obrigatório",
      invalid_type_error: "Tipo de utilizador inválido",
    }),
    is_subscribed_to_newsletter: z.boolean(),
  });

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number | null;
  fetchData: () => Promise<void>;
}

export default function EditUserModal({ isModalOpen, setIsModalOpen, userId, fetchData }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const { location, setLocation, availableLocations } = useLocation();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[] | undefined>([]);
  const [locs, setLocs] = useState<Location[] | any>([]);

  useEffect(() => {
    if (isModalOpen && userId) {
      fetchUserData(userId);
      open();
    } else {
      setSelectedLocations([]);
      setLocs([]);
      close();
    }
  }, [isModalOpen, open, close, userId]);

  useEffect(() => {
    if (!opened) {
      setIsModalOpen(false);
      setSelectedLocations([]);
      setLocs([]);
      form.reset();
    }
  }, [opened, setIsModalOpen]);

  const form = useForm({
    initialValues: {
      fullname: "",
      username: "",
      email: "",
      phone: "",
      birthdate: undefined,
      user_type: UserType.ADMIN,
      is_subscribed_to_newsletter: false,
      avatar: "",
    },
    validate: zodResolver(schema),
  });

  const fetchUserData = async (userId: number) => {
    if (!userId) return;

    try {
      const userData: User = await getUser(userId);
      const date = userData.birthdate ? new Date(userData.birthdate) : "";

      form.setValues({
        fullname: userData.fullname || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        birthdate: date as any,
        user_type: userData.user_type || UserType.PLAYER,
        is_subscribed_to_newsletter: userData.is_subscribed_to_newsletter || false,
      });
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: "Não foi possível carregar os dados do utilizador",
        color: "red",
      });
    }
  };

  const handleLocationChange = (values: string[] | null) => {
    if (values === null) {
      return;
    }
    setSelectedLocations(values);
    const selectedLocationObjects = values.map((value) => availableLocations.find((loc) => loc.label === value));
    setLocs(selectedLocationObjects);
  };

  const onSubmitHandler = useCallback(
    async (data: Partial<User>) => {
      try {
        if (!userId) return;
        const sendData = { ...data, locations: locs, avatar: selectedAvatar };

        const response = await updateUser(userId, sendData);

        if (response.status) {
          notifications.show({
            title: "Sucesso",
            message: "Utilizador atualizado com sucesso!",
            color: "green",
          });

          fetchData().finally(() => close());
        } else {
          notifications.show({
            title: "Erro",
            message: response.message || "Erro ao atualizar os dados",
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Erro",
          message: "Algo correu mal",
          color: "red",
        });
      }
    },
    [userId, selectedAvatar, locs]
  );

  return (
    <Modal opened={opened} onClose={close} title="Editar Utilizador" size="lg">
      <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
        <TextInput className="specialinput" label="Nome Completo" placeholder="Insira o seu nome completo" required {...form.getInputProps("fullname")} mb={"sm"} />
        <TextInput className="specialinput" label="Nome de Utilizador" placeholder="Insira o seu nome de utilizador" required {...form.getInputProps("username")} mb={"sm"} />
        <TextInput className="specialinput" label="Email" placeholder="exemplo@gmail.com" required {...form.getInputProps("email")} mb={"sm"} />
        <Input.Wrapper label="Telemóvel" required>
          <Input component={ReactInputMask} mask="999999999" placeholder="Insira o seu telemóvel" {...form.getInputProps("phone")} />
        </Input.Wrapper>
        <DatePickerInput label="Data de Nascimento" placeholder="Selecione a sua data de nascimento" {...form.getInputProps("birthdate")} valueFormat="DD-MM-YYYY" className="specialinput" mb={"sm"} />
        <Radio.Group name="user_type" label="Tipo de Utilizador" withAsterisk {...form.getInputProps("user_type")} required mb={"sm"}>
          <Group mt="xs" defaultValue={UserType.ADMIN}>
            <Radio value={UserType.ADMIN} label={UserType.ADMIN} icon={CheckIcon} style={{ textTransform: "capitalize" }} />
            <Radio value={UserType.PLAYER} label={UserType.PLAYER} icon={CheckIcon} style={{ textTransform: "capitalize" }} />
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
