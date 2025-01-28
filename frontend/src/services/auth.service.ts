import api from "@/config/api";
import { endpoints } from "@/config/routes";
import { User, UserType } from "@/types/user";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  fullname: string; 
  password: string; 
  avatar: string; 
  phone?: string; 
  birthdate?: string; 
  user_type: "admin" | "player" | string; 
  is_subscribed_to_newsletter?: boolean;
  has_fees_paid?: boolean; 
  fee_expiration_date?: string | null; 
}

export const login = async (data: LoginData) => {
  try {
    const response = await api.post(endpoints.loginRoute, data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (data: RegisterData) => {
  try {
    const response = await api.post(endpoints.registerRoute, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const resetPassword = async (data: ResetPasswordData) => {
  try {
    const response = await api.post(endpoints.resetPassword, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface ForgotPasswordData {
  email: string;
}

export const forgotPassword = async (data: ForgotPasswordData) => {
  try {
    const response = await api.post(endpoints.forgotPassword, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkToken = async (token: string) => {
  try {
    const response = await api.get(`${endpoints.checkToken}/${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAccount = async (userId: number, data: Partial<User>) => {
  try
  {
    const response = await api.put(`${endpoints.updateAccount}/${userId}`, data);
    return response.data;
  } catch (error)
  {
    throw error;
  }
};
