import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Tasks = {
  Task: Task[];
};

export type Task = {
  _id: string;
  user: string;
  title: string;
  description: string;
  done: boolean;
  created: string;
  __v: number;
  deadline?: string;
  images: string[];
};

export type AddTask = {
  title: string;
  description?: string;
  deadline?: string;
};

const prepareHeaders = (headers, { getState }) => {
  const token = getState().auth.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  tagTypes: ["Tasks"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    prepareHeaders,
  }),

  endpoints: (build) => ({
    getTasks: build.query<Tasks, null>({
      query: () => "tasks",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks", id })),
              { type: "Tasks", id: "LIST" },
            ]
          : [{ type: "Tasks", id: "LIST" }],
    }),
    addTask: build.mutation<void, AddTask>({
      query: (body) => ({
        url: "tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
    pathTask: build.mutation<void, AddTask>({
      query: ({ id, body }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
    deleteTask: build.mutation<void, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  usePathTaskMutation,
} = tasksApi;
