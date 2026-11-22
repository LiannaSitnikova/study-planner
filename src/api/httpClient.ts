import { authStorage } from '../utils/authStorage';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

export interface NormalizedApiError {
  message: string;
  status?: number;
  isAborted?: boolean;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return { message: 'Запит скасовано', isAborted: true };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Невідома помилка мережі' };
}

export async function httpClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

 if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP помилка ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}