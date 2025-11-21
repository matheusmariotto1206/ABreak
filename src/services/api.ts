import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { BreakDTO, RequestBreakDTO, PageableResponse } from '../types';

const BASE_URL = 'http://192.168.0.102:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RetryConfig extends AxiosRequestConfig {
  _retry?: number;
  _maxRetries?: number;
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getErrorMessage = (error: AxiosError): string => {
  if (error.code === 'ECONNABORTED') {
    return 'Tempo de conexão esgotado. Verifique sua internet.';
  }
  
  if (error.code === 'ERR_NETWORK') {
    return 'Sem conexão com o servidor. Verifique sua rede.';
  }

  if (error.response) {
    const status = error.response.status;
    
    switch (status) {
      case 400:
        return 'Dados inválidos. Verifique as informações enviadas.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Conflito ao processar a requisição.';
      case 500:
        return 'Erro interno do servidor. Tente novamente em instantes.';
      case 503:
        return 'Serviço temporariamente indisponível.';
      default:
        return `Erro: ${status}. Tente novamente.`;
    }
  }

  return 'Erro de conexão. Verifique sua internet e tente novamente.';
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;
    
    if (!config) {
      return Promise.reject(error);
    }

    const shouldRetry = 
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      (error.response?.status && error.response.status >= 500);

    config._retry = config._retry || 0;
    config._maxRetries = config._maxRetries || MAX_RETRIES;

    if (shouldRetry && config._retry < config._maxRetries) {
      config._retry += 1;
      
      console.log(`Retry attempt ${config._retry}/${config._maxRetries} for ${config.url}`);
      
      await delay(RETRY_DELAY * config._retry);
      
      return api(config);
    }

    const errorMessage = getErrorMessage(error);
    console.error('API Error:', errorMessage, error.response?.data);
    
    const enhancedError: any = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.statusCode = error.response?.status;
    
    return Promise.reject(enhancedError);
  }
);

// Cache para timestamps simulados (mantém consistência)
const timestampCache: Record<number, string> = {};

export const breakService = {
  create: async (data: RequestBreakDTO): Promise<BreakDTO> => {
    try {
      const response = await api.post<BreakDTO>('/breaks', data);
      
      // Se a API não retornar dateTime, adiciona timestamp local
      if (!response.data.dateTime && !response.data.createdAt) {
        const timestamp = new Date().toISOString();
        response.data.dateTime = timestamp;
        // Salva no cache para consistência
        if (response.data.id) {
          timestampCache[response.data.id] = timestamp;
        }
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Não foi possível criar a pausa');
    }
  },

  getById: async (id: number): Promise<BreakDTO> => {
    try {
      const response = await api.get<BreakDTO>(`/breaks/${id}`);
      
      // Se não tem dateTime, tenta usar o cache primeiro
      if (!response.data.dateTime && !response.data.createdAt) {
        // Usa timestamp do cache se existir
        if (timestampCache[id]) {
          response.data.dateTime = timestampCache[id];
        } else {
          // Se não tem no cache, usa horário atual
          const timestamp = new Date().toISOString();
          response.data.dateTime = timestamp;
          timestampCache[id] = timestamp;
        }
      } else if (response.data.dateTime || response.data.createdAt) {
        // Se a API retornou, salva no cache
        const timestamp = response.data.dateTime || response.data.createdAt!;
        timestampCache[id] = timestamp;
      }
      
      return response.data;
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new Error('Pausa não encontrada');
      }
      throw new Error(error.message || 'Não foi possível carregar a pausa');
    }
  },

  getTodayBreaks: async (userId: number): Promise<BreakDTO[]> => {
    try {
      const response = await api.get<BreakDTO[]>(`/breaks/today/${userId}`);
      
      // Adiciona timestamps simulados se não existirem
      return response.data.map((item, index) => {
        if (!item.dateTime && !item.createdAt) {
          const now = new Date();
          now.setMinutes(now.getMinutes() - (response.data.length - index) * 30);
          item.dateTime = now.toISOString();
        }
        return item;
      });
    } catch (error: any) {
      throw new Error(error.message || 'Não foi possível carregar as pausas de hoje');
    }
  },

  getUserBreaks: async (
    userId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PageableResponse<BreakDTO>> => {
    try {
      const response = await api.get<PageableResponse<BreakDTO>>(
        `/breaks/user/${userId}`,
        {
          params: { page, size, sort: 'dateTime,desc' },
        }
      );
      
      // Adiciona timestamps do cache ou cria novos
      response.data.content = response.data.content.map((item) => {
        if (!item.dateTime && !item.createdAt) {
          // Tenta usar do cache
          if (timestampCache[item.id]) {
            item.dateTime = timestampCache[item.id];
          } else {
            // Cria novo timestamp e salva no cache
            const timestamp = new Date().toISOString();
            item.dateTime = timestamp;
            timestampCache[item.id] = timestamp;
          }
        } else if (item.dateTime || item.createdAt) {
          // Salva no cache o que a API retornou
          const timestamp = item.dateTime || item.createdAt!;
          timestampCache[item.id] = timestamp;
        }
        return item;
      });
      
      return response.data;
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new Error('Usuário não encontrado');
      }
      throw new Error(error.message || 'Não foi possível carregar as pausas');
    }
  },

  update: async (id: number, data: RequestBreakDTO): Promise<BreakDTO> => {
    try {
      const response = await api.put<BreakDTO>(`/breaks/${id}`, data);
      
      // Mantém o dateTime original se existir
      if (!response.data.dateTime && !response.data.createdAt) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - 10); // Simula que foi criada há 10 min
        response.data.dateTime = now.toISOString();
      }
      
      return response.data;
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new Error('Pausa não encontrada');
      }
      throw new Error(error.message || 'Não foi possível atualizar a pausa');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/breaks/${id}`);
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new Error('Pausa não encontrada');
      }
      throw new Error(error.message || 'Não foi possível excluir a pausa');
    }
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