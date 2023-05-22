import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginBody } from "./auth.api";

const prepareHeaders = (headers, { getState }) => {
  const token = getState().auth.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

export const imageApi = createApi({
  reducerPath: "imageApi",
  tagTypes: ["Image"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    prepareHeaders,
  }),

  endpoints: (build) => ({
    getImage: build.query({
      query: (id: string) => ({ url: `image?id=${id}` }),
      providesTags: (result: void, error, id: string) => [
        { type: "Image", id },
      ],
      responseType: "arraybuffer",
    }),
    getThumbs: build.query({
      query: (id) => `image/${id}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Image", id })),
              { type: "Image", id: "LIST" },
            ]
          : [{ type: "Image", id: "LIST" }],
    }),
    addImage: build.mutation<void, any>({
      query: (body) => ({
        url: "image",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Image", id: "LIST" }],
    }),

    deleteImage: build.mutation({
      query: (id) => ({
        url: `image/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Image", id: "LIST" }],
    }),
  }),
});

export const {
  useGetImageQuery,
  useGetThumbsQuery,
  useAddImageMutation,
  useDeleteImageMutation,
} = imageApi;
