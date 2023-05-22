import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  image: {
    imageId: null,
    mimetype: null,
    thumb: null,
    filename: null,
  },
  thumbsNeedRefetch: false,
  modalThumbsNeedRefetch: false,
  checkedImages: [],
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setThumbsNeedRefetch: (state, action) => {
      state.thumbsNeedRefetch = action.payload;
    },
    setModalThumbsNeedRefetch: (state, action) => {
      state.modalThumbsNeedRefetch = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setCheckedImages: (state, action) => {
      const { imageId, isChecked } = action.payload;

      if (isChecked) {
        state.checkedImages = [...state.checkedImages, imageId];
      } else {
        state.checkedImages = state.checkedImages.filter(
          (id) => id !== imageId
        );
      }
    },
    clearCheckedImages: (state) => {
      return {
        ...state,
        checkedImages: [],
      };
    },
  },
});

export const {
  setThumbsNeedRefetch,
  setModalThumbsNeedRefetch,
  setImage,
  setCheckedImages,
  clearCheckedImages,
} = imageSlice.actions;
export default imageSlice.reducer;
