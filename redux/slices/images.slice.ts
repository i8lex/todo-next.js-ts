import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

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

const setCheckedImages: CaseReducer<
  ImageStateType,
  PayloadAction<{ imageId: string; isChecked: boolean }>
> = (state, action) => {
  const { imageId, isChecked } = action.payload;

  if (isChecked) {
    state.checkedImages = [...state.checkedImages, imageId];
  } else {
    state.checkedImages = state.checkedImages.filter((id) => id !== imageId);
  }
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setThumbsNeedRefetch: (state, action: PayloadAction<boolean>) => {
      state.thumbsNeedRefetch = action.payload;
    },
    setModalThumbsNeedRefetch: (state, action: PayloadAction<boolean>) => {
      state.modalThumbsNeedRefetch = action.payload;
    },
    setImage: (state, action: PayloadAction<Image>) => {
      state.image = action.payload;
    },
    setCheckedImages,
    clearCheckedImages: (state) => {
      state.checkedImages = [];
    },
  },
});

export const {
  setThumbsNeedRefetch,
  setModalThumbsNeedRefetch,
  setImage,
  clearCheckedImages,
} = imageSlice.actions;
export default imageSlice.reducer;
