import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TasksStateType = {
  events: string[];
};

const initialState: TasksStateType = {
  events: [],
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    toggleEvent: (
      state: TasksStateType,
      action: PayloadAction<{ itemId: string; isChecked: boolean }>,
    ) => {
      const { itemId, isChecked } = action.payload;

      if (isChecked) {
        state.events.push(itemId);
      } else {
        const index = state.events.indexOf(itemId);
        if (index !== -1) {
          state.events.splice(index, 1);
        }
      }
    },
    clearEvents: (state: TasksStateType) => {
      state.events = [];
    },
  },
});

export const { toggleEvent, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
