import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TasksStateType = {
  tasks: string[];
};

const initialState: TasksStateType = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    toggleTask: (
      state: TasksStateType,
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
    clearTasks: (state: TasksStateType) => {
      state.tasks = [];
    },
  },
});

export const { toggleTask, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
