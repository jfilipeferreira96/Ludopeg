"use client";

import ThreeDButton from "@/components/3dbutton";
import SetAvatar from "@/components/avatar";
import { routes } from "@/config/routes";
import { useSession } from "@/providers/SessionProvider";
import { register, RegisterData } from "@/services/auth.service";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button, Input, Center, Radio, CheckboxGroup } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { z } from "zod";

const StyledPaper = styled(Paper)`
  width: 500px;
  @media (max-width: 600px) {
    width: 94vw;
  }
`;

// Esquema de validação atualizado
const schema = z.object({
  fullname: z.string().min(2, { message: "O nome completo deve ter pelo menos 2 letras" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(4, { message: "A palavra-passe deve ter pelo menos 4 caracteres" }),
  avatar: z.string().min(4, { message: "Por favor, selecione um avatar" }),
  phone: z.string().optional(),
  birthdate: z.string().optional(),
  is_subscribed_to_newsletter: z.boolean(),
  has_fees_paid: z.boolean(),
  fee_expiration_date: z.string().optional(),
});

export default function Register() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const { sessionLogin } = useSession();

  const form = useForm({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      avatar: "",
      phone: "",
      birthdate: "",
      user_type: "player",
      is_subscribed_to_newsletter: false,
      has_fees_paid: false,
      fee_expiration_date: "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (selectedAvatar) {
      form.setValues({
        avatar: selectedAvatar,
      });
    }
  }, [selectedAvatar]);

  const onSubmitHandler = useCallback(
    async (data: RegisterData) => {
      try {
        const response = await register(data);
        if (response.status) {
          notifications.show({
            title: "Sucesso",
            message: "Conta criada com sucesso!",
            color: "green",
          });

          sessionLogin(response.user, response.accessToken, response.refreshToken);
          router.push(routes.inicio.url);
        } else {
          notifications.show({
            title: "Erro",
            message: response.message,
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Erro",
          message: "Ocorreu um problema. Tente novamente.",
          color: "red",
        });
      }
    }, []);

  return (
    <Center>
      <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
        <title>Registar</title>
        <Title ta="center" mt={100}>
          Crie uma conta!
        </Title>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Já tem uma conta?
          <Anchor size="sm" component="a" ml={2} onClick={() => router.push(routes.entrada.url)}>
            Iniciar Sessão
          </Anchor>
        </Text>

        <StyledPaper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Nome Completo" placeholder="O seu nome completo" required {...form.getInputProps("fullname")} />
          <TextInput label="Email" placeholder="voce@gmail.com" required {...form.getInputProps("email")} />
          <PasswordInput label="Palavra-passe" placeholder="A sua palavra-passe" required {...form.getInputProps("password")} />
          <Input.Wrapper label="Avatar" withAsterisk description="Selecione um avatar" error={form.errors.avatar}>
            <SetAvatar selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
          </Input.Wrapper>
          <TextInput label="Telefone" placeholder="Número de telefone (opcional)" {...form.getInputProps("phone")} />
          <TextInput label="Data de Nascimento" placeholder="YYYY-MM-DD" {...form.getInputProps("birthdate")} />
          <Checkbox label="Subscrever newsletter" {...form.getInputProps("is_subscribed_to_newsletter", { type: "checkbox" })} />
          <Checkbox label="Taxas pagas" {...form.getInputProps("has_fees_paid", { type: "checkbox" })} />
          <TextInput label="Data de expiração da taxa" placeholder="YYYY-MM-DD (opcional)" {...form.getInputProps("fee_expiration_date")} />
          <ThreeDButton color="blue" mt="xl" type="submit" smaller>
            Registar
          </ThreeDButton>
        </StyledPaper>
      </form>
    </Center>
  );
}
