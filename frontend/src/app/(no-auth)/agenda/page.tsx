"use client";
import { routes } from "@/config/routes";
import { useSession } from "@/providers/SessionProvider";
import { register, RegisterData, UserType } from "@/services/auth.service";
import {  Title,  Center,  } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { z } from 'zod';

export default function Register() {
  const router = useRouter();
  
  return (
    <Center>
      <title>Agenda</title>
      <Title ta="center" mt={100}>
        Agenda
      </Title>
    </Center>
  );
}
