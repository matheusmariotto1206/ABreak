import axios, { AxiosError } from 'axios';
import { BreakDTO, RequestBreakDTO, PageableResponse } from '../types';

const BASE_URL = 'http://192.168.0.103:8080/api';



const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const breakService = {
  
  create: async (data: RequestBreakDTO): Promise<BreakDTO> => {
    const response = await api.post<BreakDTO>('/breaks', data);
    return response.data;
  },

  getById: async (id: number): Promise<BreakDTO> => {
    const response = await api.get<BreakDTO>(`/breaks/${id}`);
    return response.data;
  },

  getTodayBreaks: async (userId: number): Promise<BreakDTO[]> => {
    const response = await api.get<BreakDTO[]>(`/breaks/today/${userId}`);
    return response.data;
  },

  getUserBreaks: async (
    userId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PageableResponse<BreakDTO>> => {
    const response = await api.get<PageableResponse<BreakDTO>>(
      `/breaks/user/${userId}`,
      {
        params: { page, size, sort: 'dateTime,desc' },
      }
    );
    return response.data;
  },

  update: async (id: number, data: RequestBreakDTO): Promise<BreakDTO> => {
    const response = await api.put<BreakDTO>(`/breaks/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/breaks/${id}`);
  },
};

export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins === 0) return `${secs}seg`;
  if (secs === 0) return `${mins}min`;
  return `${mins}min ${secs}seg`;
};

export const translateBreakType = (type: string): string => {
  const translations: Record<string, string> = {
    ALONGAMENTO: '🧘 Alongamento',
    HIDRATACAO: '💧 Hidratação',
    DESCANSO_VISUAL: '👁️ Descanso Visual',
  };
  return translations[type] || type;
};

export default api;