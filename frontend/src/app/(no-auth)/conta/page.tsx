"use client";

import ThreeDButton from "@/components/3dbutton";
import SetAvatar from "@/components/avatar";
import { useSession } from "@/providers/SessionProvider";
import { getUser, updateAccount } from "@/services/user.service";
import { User } from "@/types/user";
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Input, Center, Loader, Group } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
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
    newPassword: z.string().min(4, { message: "A nova palavra-passe deve ter pelo menos 4 caracteres" }).optional(),
    password: z.string().optional(),
    phone: z.string().regex(/^\d{9}$/, { message: "O número de telemóvel deve ter 9 dígitos" }),
    avatar: z.string().min(4, { message: "Por favor, selecione um avatar" }),
    birthdate: z.union([z.date(), z.undefined(), z.string()]),
    is_subscribed_to_newsletter: z.boolean(),
}).refine((data) => !data.newPassword || data.newPassword === data.password, {
    message: "As palavras-passe não coincidem",
    path: ["password"],
});

export default function UpdateAccount()
{
    const router = useRouter();
    const { user, sessionLogin, updateUser } = useSession();
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm({
        initialValues: {
            fullname: "",
            username: "",
            email: "",
            newPassword: "",
            password: "",
            avatar: "",
            phone: "",
            birthdate: "",
            is_subscribed_to_newsletter: false,
        },
        validate: zodResolver(schema),
    });

    useEffect(() => {
        const fetchUser = async () =>
        {
            if (!user) return;
            
            try
            {
                setIsLoading(true);
                const userData = await getUser(user.user_id);
                const date = userData.birthdate ? new Date(userData.birthdate) : "";

                form.setValues({
                    fullname: userData.fullname || "",
                    username: userData.username || "",
                    email: userData.email || "",
                    avatar: userData.avatar || "",
                    phone: userData.phone || "",
                    birthdate: date as string,
                    is_subscribed_to_newsletter: userData.is_subscribed_to_newsletter || false,
                });
                setSelectedAvatar(userData.avatar || "");
            } catch (error)
            {
                notifications.show({
                    title: "Erro",
                    message: "Não foi possível carregar os dados do utilizador",
                    color: "red",
                });
            } finally
            {
                setIsLoading(false);
            }
        };

        fetchUser();
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
        if (!data.password) delete data.password;

        try
        {
            const response = await updateAccount(user.user_id, data);
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
                    message: response.message || "Erro ao atualizar os dados da conta",
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
                <Title ta="center" mt={30}>
                    Atualize as suas informações
                </Title>

                <StyledPaper withBorder shadow="md" p={30} mt={30} mb={50} radius="md">
                    <TextInput label="Nome Completo" placeholder="O seu nome completo" required {...form.getInputProps("fullname")} className="specialinput" />
                    <TextInput label="Nome de Utilizador" placeholder="Exemplo: ReiDistoTudo" required {...form.getInputProps("username")} className="specialinput" />
                    <TextInput label="Email" placeholder="you@gmail.com" required {...form.getInputProps("email")} className="specialinput" />
                    <TextInput label="Telemóvel" placeholder="999999999" required {...form.getInputProps("phone")} className="specialinput" />
                    <DatePickerInput label="Data de Nascimento" placeholder="Selecione a sua data de nascimento" {...form.getInputProps("birthdate")} valueFormat="DD-MM-YYYY" className="specialinput" />

                    {/* Campos para Senha */}
                    <PasswordInput label="Nova Palavra-passe" placeholder="Digite sua nova palavra-passe" {...form.getInputProps("newPassword")} className="specialinput" />
                    <PasswordInput
                        label="Confirmar Palavra-passe"
                        placeholder="Confirme sua nova palavra-passe"
                        {...form.getInputProps("password")}
                        className="specialinput"
                    />

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
