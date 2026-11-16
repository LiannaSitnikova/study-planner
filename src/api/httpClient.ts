export class NormalizedApiError extends Error {
  status?: number;
  isAborted: boolean;

  constructor(message: string, status?: number, isAborted = false) {
    super(message);
    this.name = 'NormalizedApiError';
    this.status = status;
    this.isAborted = isAborted;
  }
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error instanceof NormalizedApiError) {
    return error;
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new NormalizedApiError('Запит було скасовано', undefined, true);
  }

  if (error instanceof TypeError) {
    return new NormalizedApiError('Помилка мережі. Перевірте підключення до інтернету.');
  }

  if (error instanceof Error) {
    return new NormalizedApiError(error.message);
  }

  return new NormalizedApiError('Виникла невідома помилка під час запиту до сервера.');
}

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://dummyjson.com').replace(/\/$/, '');

export async function httpClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let serverMessage = `HTTP помилка ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody?.message) {
          serverMessage = `${serverMessage}: ${errorBody.message}`;
        }
      } catch (parseError) {
        void parseError;
      }
      throw new NormalizedApiError(serverMessage, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    throw normalizeApiError(error);
  }
}