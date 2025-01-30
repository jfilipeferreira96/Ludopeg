"use client";
import React, { useEffect, useState } from "react";
import { Card, TextInput, Center, rem, Avatar, Text, Grid, ActionIcon, Divider } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconScan, IconArrowRight, IconAt, IconCheck, IconUser } from "@tabler/icons-react";
import { z } from "zod";
import { registerEntry } from "@/services/acessos.service";

// Definir schemas individuais
const emailSchema = z.string().email({ message: "Endereço de email inválido" });
const phoneSchema = z.string().regex(/^\d{9}$/, { message: "O número de telemóvel deve ter 9 dígitos" });
const usernameSchema = z.string().min(3, { message: "O username deve ter pelo menos 3 caracteres" }).regex(/^[a-zA-Z0-9]+$/, { message: "O username só pode conter letras e números" });

// Definir esquema de validação geral
const schema = z.object({
  contact: z.string().refine((value) =>
    emailSchema.safeParse(value).success ||
    phoneSchema.safeParse(value).success ||
    usernameSchema.safeParse(value).success,
    {
      message: "Insira um e-mail válido, um número de telemóvel com 9 dígitos ou um username válido.",
    }
  ),
});

interface FormValues
{
  contact: string;
}

interface Props
{
  biggerInputLength?: boolean;
  refreshTable?: () => Promise<void>;
}

function QrReader(props: Props)
{
  const { biggerInputLength, refreshTable } = props;
  const [contact, setContact] = useState<string>("");
  const [buffer, setBuffer] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const form = useForm<FormValues>({
    initialValues: {
      contact: "",
    },
    validate: zodResolver(schema),
  });

  const onSubmitHandler = async (values: FormValues) =>
  {
    if (isProcessing)
    {
      return;
    }

    setIsProcessing(true);
    values.contact = values.contact.trim();

    try
    {
      if (!values?.contact)
      {
        return;
      }

      let payload = {};
      if (emailSchema.safeParse(values.contact).success)
      {
        payload = { userEmail: values.contact };
      }
      else if (phoneSchema.safeParse(values.contact).success)
      {
        payload = { userPhone: values.contact };
      }
      else if (usernameSchema.safeParse(values.contact).success)
      {
        payload = { username: values.contact };
      }

      const response = await registerEntry({ ...payload });

      if (response.status)
      {
        setContact(values.contact);
        if (refreshTable)
        {
          refreshTable();
        }
      }
      else
      {
        notifications.show({
          message: response.message,
          color: "red",
        });
        setContact("");
      }
    }
    catch (error)
    {
      notifications.show({
        title: "Erro",
        message: "Algo correu mal",
        color: "red",
      });
    } finally
    {
      setTimeout(() =>
      {
        setIsProcessing(false);
        form.reset();
      }, 1000);
    }
  };

  useEffect(() =>
  {
    const handleKeyPress = (event: KeyboardEvent) =>
    {
      if (event.key === "Enter")
      {
        const sanitizedData = buffer.replace(/"/g, "@");

        try
        {
          schema.parse({ contact: sanitizedData });
          form.setFieldValue("contact", sanitizedData);
          onSubmitHandler(form.getValues());
        } catch (error) { }
        setBuffer("");
      } else
      {
        setBuffer((prevBuffer) => prevBuffer + event.key);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () =>
    {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [buffer]);

  return (
    <Card shadow="sm" padding="lg" radius="md" mt={20} withBorder p={20}>
      <>
        {contact && (
          <Center mb="md">
            <Avatar color="teal" radius="xl" variant="filled" mr={"sm"} size="sm">
              <IconCheck style={{ width: rem(20), height: rem(20) }} />
            </Avatar>
            <Text size="sm">Última entrada: {contact}</Text>
          </Center>
        )}

        <Center>
          <Avatar color="blue" radius="xl" variant="filled" mr={"sm"}>
            <IconScan style={{ width: rem(20), height: rem(20) }} />
          </Avatar>
          <Text size="lg">A aguardar leitura do código QR.</Text>
        </Center>

        <Divider my="xl" label={<Text size="sm">Ou digite o e-mail, username ou número de telemóvel.</Text>} labelPosition="center" />

        <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
          <Center>
            <Grid style={{ width: biggerInputLength ? "60%" : "40%" }}>
              <Grid.Col span={12}>
                <TextInput
                  radius="xl"
                  size="md"
                  placeholder="ok@mail.com, username ou 912345678"
                  rightSectionWidth={42}
                  leftSection={<IconUser style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
                  rightSection={
                    <ActionIcon size={32} radius="xl" variant="filled" type="submit">
                      <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                    </ActionIcon>
                  }
                  {...form.getInputProps("contact")}
                />
              </Grid.Col>
            </Grid>
          </Center>
        </form>
      </>
    </Card>
  );
}

export default QrReader;
