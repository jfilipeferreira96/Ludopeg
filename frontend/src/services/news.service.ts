import api from "@/config/api";
import { endpoints } from "@/config/routes";
import { NewsData, NewsResponse } from "@/types/noticias";
import { Pagination } from "@/types/pagination";

export const addNews = async (newsData: NewsData, files: File[]) => {
  try {
    const formData = new FormData();
    Object.keys(newsData).forEach((key) => {
      formData.append(key, newsData[key as keyof NewsData]);
    });
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post(endpoints.addNews, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllNews = async (pagination: Pagination) => {
  try {
    const response = await api.post(endpoints.getAllNews, pagination);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNews = async (id: string) => {
  try {
    const response = await api.get(`${endpoints.getNews}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNews = async (id: string, newsData: NewsData) => {
  try {
    const response = await api.put(`${endpoints.updateNews}/${id}`, newsData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNews = async (id: string) => {
  try {
    const response = await api.delete(`${endpoints.deleteNews}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
