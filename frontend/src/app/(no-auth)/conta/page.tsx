"use client";

import ThreeDButton from "@/components/3dbutton";
import SetAvatar from "@/components/avatar";
import { routes } from "@/config/routes";
import { useSession } from "@/providers/SessionProvider";
import { updateAccount } from "@/services/auth.service";
import { User } from "@/types/user";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Input, Center, Loader } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
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

const schema = z.object({
    fullname: z.string().min(2, { message: "O nome completo deve ter pelo menos 2 letras" }),
    username: z.string().min(2, { message: "O nome de utilizador deve ter pelo menos 2 letras" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(4, { message: "A palavra-passe deve ter pelo menos 4 caracteres" }).optional(),
    phone: z.string().regex(/^\d{9}$/, { message: "O número de telemóvel deve ter 9 dígitos" }),
    avatar: z.string().min(4, { message: "Por favor, selecione um avatar" }),
    birthdate: z.union([z.date(), z.undefined()]),
    is_subscribed_to_newsletter: z.boolean(),
});

export default function UpdateAccount() {
    const router = useRouter();
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const { user, sessionLogin, updateUser } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm({
        initialValues: {
            fullname: "",
            username: "",
            email: "",
            password: "",
            avatar: "",
            phone: "",
            birthdate: undefined,
            is_subscribed_to_newsletter: false,
        },
        validate: zodResolver(schema),
    });

    useEffect(() => {
        if (user)
        {
            setIsLoading(true);
            form.setValues({
                fullname: user.fullname || "",
                username: user.username || "",
                email: user.email || "",
                avatar: user.avatar || "",
                phone: user.phone || "",
                birthdate: user.birthdate || "",
                is_subscribed_to_newsletter: user.is_subscribed_to_newsletter || false,
            });
            setSelectedAvatar(user.avatar || "");
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (selectedAvatar)
        {
            form.setValues({
                avatar: selectedAvatar,
            });
        }
    }, [selectedAvatar]);

    const onSubmitHandler = useCallback(async (data: Partial<User>) => {
        try
        {
            const response = await updateAccount(user._id, data);
            if (response.status)
            {
                notifications.show({
                    title: "Sucesso",
                    message: "Perfil atualizado com sucesso!",
                    color: "green",
                });

                updateUser(response.user);
                sessionLogin(response.user, response.accessToken, response.refreshToken);
            } else
            {
                notifications.show({
                    title: "Erro",
                    message: response.message,
                    color: "red",
                });
            }
        } catch (error)
        {
            notifications.show({
                title: "Erro",
                message: "Ocorreu um problema. Tente novamente.",
                color: "red",
            });
        }
    }, [user, sessionLogin, updateUser]);

    if (isLoading)
    {
        return (
            <Center mt={100} mih={"50vh"}>
                <Loader color="blue" />
            </Center>
        );
    }

    return (
        <Center>
            <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
                <title>Configurações da Conta</title>
                <Title ta="center" mt={100}>
                    Atualize as suas informações
                </Title>

                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Pretende voltar?
                    <Anchor size="sm" component="a" ml={2} onClick={() => router.push(routes.inicio.url)}>
                        Página Inicial
                    </Anchor>
                </Text>

                <StyledPaper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput label="Nome Completo" placeholder="O seu nome completo" required {...form.getInputProps("fullname")} className="specialinput" />
                    <TextInput label="Nome de Utilizador" placeholder="Exemplo: ReiDistoTudo" required {...form.getInputProps("username")} className="specialinput" />
                    <TextInput label="Email" placeholder="you@gmail.com" required {...form.getInputProps("email")} className="specialinput" />
                    <TextInput label="Telemóvel" placeholder="999999999" required {...form.getInputProps("phone")} className="specialinput" />
                    <DatePickerInput label="Data de Nascimento" placeholder="Selecione a sua data de nascimento" {...form.getInputProps("birthdate")} valueFormat="DD-MM-YYYY" className="specialinput" />
                    <PasswordInput label="Palavra-passe" placeholder="Deixe em branco para manter" {...form.getInputProps("password")} className="specialinput" />
                    <Checkbox
                        mt={"sm"}
                        label="Subscrever newsletter"
                        {...form.getInputProps("is_subscribed_to_newsletter", { type: "checkbox" })}
                    />
                    <Input.Wrapper label="Avatar" withAsterisk description="Selecione um avatar" error={form.errors.avatar}>
                        <SetAvatar selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
                    </Input.Wrapper>
                    <ThreeDButton color="blue" mt="xl" type="submit" smaller>
                        Atualizar Conta
                    </ThreeDButton>
                </StyledPaper>
            </form>
        </Center>
    );
}
