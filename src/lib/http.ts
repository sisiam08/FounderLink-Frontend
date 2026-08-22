import api from "./api-client";

export const httpGet = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> => {
  const response = await api.get<T>(endpoint, {
    params,
  });

  return response.data;
};

export const httpPost = async <T>(
  endpoint: string,
  data?: any,
  params?: Record<string, any>
): Promise<T> => {
  const response = await api.post<T>(endpoint, data, {
    params,
  });

  return response.data;
};

export const httpPatch = async <T>(
  endpoint: string,
  data?: any,
  params?: Record<string, any>
): Promise<T> => {
  const response = await api.patch<T>(endpoint, data, {
    params,
  });

  return response.data;
};

export const httpDelete = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> => {
  const response = await api.delete<T>(endpoint, {
    params,
  });

  return response.data;
};
