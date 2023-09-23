import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  BaseQueryApi,
  TagDescription,
} from '@reduxjs/toolkit/dist/query/react';
import { Image } from '@/types';
import { getSession } from 'next-auth/react';

const prepareHeaders = async (
  headers: Headers,
  {
    getState,
  }: Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>,
) => {
  // const token = (getState() as AuthState).auth.token;
  const session = await getSession();
  // @ts-ignore
  const token = session?.user?.token;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};

export const imageApi = createApi({
  reducerPath: 'imageApi',
  tagTypes: ['Images', 'Image'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BASE_API_URL || process.env.NEXT_PUBLIC_BASE_API_URL,
    prepareHeaders,
  }),

  endpoints: (build) => ({
    getImage: build.query({
      query: (id: string) => ({ url: `image?id=${id}` }),
      providesTags: (result: Image | undefined, error, id: string) => [
        { type: 'Image', id },
      ],
    }),
    getThumbs: build.query({
      query: (id: string) => `image/${id}`,
      providesTags: (
        result: Image[] | undefined,
      ): (TagDescription<'Images'> | TagDescription<'Image'>)[] =>
        result
          ? [
              ...(result as Image[]).map(({ _id }: { _id: string }) => ({
                type: 'Image' as const,
                _id,
              })),
              { type: 'Image' as const, id: 'LIST' },
            ]
          : [{ type: 'Image' as const, id: 'LIST' }],
    }),
    addImage: build.mutation<void, Image[]>({
      query: (body) => ({
        url: 'image',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Image', id: 'LIST' }],
    }),

    deleteImage: build.mutation({
      query: (id) => ({
        url: `image/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Image', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetImageQuery,
  useLazyGetThumbsQuery,
  useGetThumbsQuery,
  useAddImageMutation,
  useDeleteImageMutation,
} = imageApi;
