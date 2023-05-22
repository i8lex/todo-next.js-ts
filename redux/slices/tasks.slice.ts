import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TasksState = {
  tasks: string[];
};

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    toggleTask: (
      state,
      action: PayloadAction<{ itemId: string; isChecked: boolean }>
    ) => {
      const { itemId, isChecked } = action.payload;

      if (isChecked) {
        state.tasks.push(itemId);
      } else {
        const index = state.tasks.indexOf(itemId);
        if (index !== -1) {
          state.tasks.splice(index, 1);
        }
      }
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
});

export const { toggleTask, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
