import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginBody } from "./auth.api";
import {BaseQueryApi, TagDescription} from "@reduxjs/toolkit/dist/query/react";
import {AuthState, Images, Image} from "@/types";

const prepareHeaders = (headers: Headers, { getState }: Pick<BaseQueryApi, "getState" | "extra" | "endpoint" | "type" | "forced">) => {
  const token = (getState() as AuthState).auth.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const imageApi = createApi({
  reducerPath: "imageApi",
  tagTypes: ["Images","Image"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    prepareHeaders,
  }),

  endpoints: (build) => ({
    getImage: build.query({
      query: (id: string) => ({ url: `image?id=${id}` }),
      providesTags: (result: Images | undefined, error, id: string) => [
        { type: "Image", id },
      ],
    }),
    getThumbs: build.query({
      query: (id: string) => `image/${id}`,
      providesTags: (result: Images | undefined): (TagDescription<"Images"> | TagDescription<"Image">)[] =>
          result
              ? [
                ...(result as Images).map(({ _id }) => ({ type: "Image" as const, _id })),
                { type: "Image" as const, id: "LIST" },
              ]
              : [{ type: "Image" as const, id: "LIST" }],
    }),
    addImage: build.mutation<void, Images>({
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
