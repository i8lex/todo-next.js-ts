import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
  TagDescription,
} from '@reduxjs/toolkit/query/react';
import { AddEvent, Event } from '@/types';
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

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  tagTypes: ['Events', 'Event'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BASE_API_URL || process.env.NEXT_PUBLIC_BASE_API_URL,
    prepareHeaders,
  }),

  endpoints: (build) => ({
    getEvents: build.query<Event[], void>({
      query: () => 'events',
      providesTags: (
        result: Event[] | undefined,
      ): (TagDescription<'Events'> | TagDescription<'Event'>)[] =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Event' as const, _id })),
              { type: 'Events' as const, id: 'LIST' },
            ]
          : [{ type: 'Events' as const, id: 'LIST' }],
    }),

    addEvent: build.mutation<void, AddEvent>({
      query: (body) => ({
        url: 'events',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }],
    }),
    pathEvent: build.mutation<void, { id: string; body: AddEvent }>({
      query: ({ id, body }) => ({
        url: `events/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }],
    }),
    deleteEvent: build.mutation<void, string | string[]>({
      query: (id) => ({
        url: `events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useAddEventMutation,
  useDeleteEventMutation,
  usePathEventMutation,
} = eventsApi;
