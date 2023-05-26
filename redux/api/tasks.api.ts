import {BaseQueryApi, createApi, fetchBaseQuery, TagDescription} from "@reduxjs/toolkit/query/react";
import {AddTask, AuthState, Tasks} from "@/types";


const prepareHeaders = (headers: Headers, { getState }: Pick<BaseQueryApi, "getState" | "extra" | "endpoint" | "type" | "forced">) => {
  const token = (getState() as AuthState).auth.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  tagTypes: ["Tasks", "Task"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    prepareHeaders,
  }),

  endpoints: (build) => ({
    getTasks: build.query<Tasks, void>({
      query: () => "tasks",
      providesTags: (result: Tasks | undefined): (TagDescription<"Tasks"> | TagDescription<"Task">)[] =>
          result
              ? [
                ...result.map(({ _id }) => ({ type: "Task" as const, _id })),
                { type: "Tasks" as const, id: "LIST" },
              ]
              : [{ type: "Tasks" as const, id: "LIST" }],
    }),



    addTask: build.mutation<void, AddTask>({
      query: (body) => ({
        url: "tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
    pathTask: build.mutation<void, { id: string; body: AddTask }>({
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
