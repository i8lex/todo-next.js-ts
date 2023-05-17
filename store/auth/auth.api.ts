import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryFn } from "@reduxjs/toolkit/query";

import unfetch from "isomorphic-unfetch";

const baseQuery: BaseQueryFn<any, any> = async ({
  url,
  method,
  headers,
  body,
}) => {
  const response = await unfetch(url, {
    method,
    headers,
    body,
  });
  return response.json();
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: (builder) => ({
    // Определите свои эндпоинты здесь
  }),
});

export const { usePrefetch } = api;

export default api;
