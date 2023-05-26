import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Image = {
  imageId: string | null;
  mimetype: string | null;
  thumb: string | null;
  filename: string | null;
};

export type ImageStateType = {
  image: Image;
  thumbsNeedRefetch: boolean;
  modalThumbsNeedRefetch: boolean;
  checkedImages: string[];
};

const initialState: ImageStateType = {
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
    setThumbsNeedRefetch: (
      state: ImageStateType,
      action: PayloadAction<boolean>
    ) => {
      state.thumbsNeedRefetch = action.payload;
    },
    setModalThumbsNeedRefetch: (
      state: ImageStateType,
      action: PayloadAction<boolean>
    ) => {
      state.modalThumbsNeedRefetch = action.payload;
    },
    setImage: (state: ImageStateType, action) => {
      state.image = action.payload;
    },
    setCheckedImages: (state: ImageStateType, action) => {
      const { imageId, isChecked } = action.payload;

      if (isChecked) {
        state.checkedImages = [...state.checkedImages, imageId];
      } else {
        state.checkedImages = state.checkedImages.filter(
          (id) => id !== imageId
        );
      }
    },
    clearCheckedImages: (state: ImageStateType) => {
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
