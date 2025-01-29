// @/types/news.ts
export interface NewsData {
  title: string;
  content: string;
  imagePath: string;
  userId: number;
  date: string;
}

export interface NewsResponse {
  id?: number;
  title: string;
  content: string;
  imagePath: string;
  userId: number;
  date: string;
  createdAt: string;
  status: string;
  message?: string;
  data?: any;
}
