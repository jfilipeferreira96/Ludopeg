import api from "@/config/api";
import { endpoints } from "@/config/routes";
import { Filters } from "./user.service";
import { Pagination } from "@/types/pagination";

export const getDashboardEntries = async (pagination: Pagination, filters: Filters) => {
  try {
    const response = await api.post(endpoints.dashboardEntriesRoute, { pagination: pagination, filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};
