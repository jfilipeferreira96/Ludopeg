import api from "@/config/api";
import { endpoints } from "@/config/routes";
import { Pagination } from "@/types/pagination";
import { User } from "@/types/user";

export const getUserPunchCard = async (id: string) => {
  try {
    const response = await api.get(endpoints.cardsRoute + id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface Filters {
  email: string | null;
  fullname: string | null;
  username: string | null;
  phone: string | null;
}

export const getAllUsers = async (pagination: Pagination, filters: Filters) => {
  try
  {
    const response = await api.post(endpoints.getAllUsers, { pagination: pagination, filters });
    return response.data;
  } catch (error)
  {
    throw error;
  }
};

export const getUser = async (userId: number) => {
  try {
    const response = await api.get(`${endpoints.getSingleUser}/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId: number, data: Partial<User>)  => {
  try {

    const response = await api.put(`${endpoints.updateUser}/${userId}`, data);
     return response.data;
   } catch (error) {
     throw error;
   }
};

export const updateAccount = async (userId: number, data: Partial<User>) => {
  try {
    const response = await api.put(`${endpoints.updateAccount}/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await api.delete(`${endpoints.deleteUser}/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};