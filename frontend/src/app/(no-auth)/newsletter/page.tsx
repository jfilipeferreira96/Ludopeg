"use client";
import { TextInput, Paper, Title, Text, Container, Group, Button, Center } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useCallback } from "react";
import { notifications } from "@mantine/notifications";
import styled from "styled-components";
import { z } from "zod";
import ThreeDButton from "@/components/3dbutton";

const StyledPaper = styled(Paper)`
  width: 600px;
  @media (max-width: 600px) {
    width: 94vw;
  }
`;

const schema = z.object({
  email: z.string().email({ message: "Por favor, insira um endereço de email válido." }),
});

export default function Newsletter() {
  const onSubmitHandler = useCallback(async (data: {email: string}) => {
    try {
      // Simulação de envio de email para subscrição
      notifications.show({
        title: "Subscrição bem-sucedida!",
        message: "Obrigado por subscrever a nossa newsletter.",
        color: "green",
      });
      console.log(email)
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: "Ocorreu um problema ao processar a sua subscrição. Tente novamente mais tarde.",
        color: "red",
      });
    }
  }, []);

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: zodResolver(schema),
  });

  return (
    <Center>
      <title>Subscreva a Newsletter</title>

      <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
        <Title ta="center" mt={100}>
          Subscreva a nossa Newsletter
        </Title>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Receba as últimas notícias e atualizações diretamente na sua caixa de entrada.
        </Text>

        <StyledPaper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput className="specialinput" label="Email" placeholder="email@gmail.com" required {...form.getInputProps("email")} />

          <ThreeDButton color="blue" mt="xl" type="submit" smaller>
            Subscrever
          </ThreeDButton>
        </StyledPaper>
      </form>
    </Center>
  );
}
