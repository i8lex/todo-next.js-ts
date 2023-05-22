import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
      query: (id) => ({ url: `image?id=${id}` }),
      providesTags: (result, error, id) => [{ type: "Image", id }],
      responseType: "arraybuffer",
    }),
    // getImage: build.query({
    //   query: (id) => `image/${id}`,
    //   providesTags: (result) =>
    //     result
    //       ? [
    //           ...result.map(({ id }) => ({ type: "Image", id })),
    //           { type: "Image", id: "LIST" },
    //         ]
    //       : [{ type: "Image", id: "LIST" }],
    // }),
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
    addImage: build.mutation({
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
