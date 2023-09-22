import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Image = {
  imageId?: string | null;
  mimetype?: string | null;
  thumb?: string | null;
  filename?: string | null;
  file?: string | null;
  thumbBuffer?: string | null;
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
    thumbBuffer: null,
    file: null,
  },
  thumbsNeedRefetch: false,
  modalThumbsNeedRefetch: false,
  checkedImages: [],
};

const imageSlice = createSlice({
  name: 'image',
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
    clearImage: (state) => {
      state.image = initialState.image;
    },
    toggleImagesList: (
      state,
      action: PayloadAction<{ imageId: string; isChecked: boolean }>,
    ) => {
      const { imageId, isChecked } = action.payload;

      if (isChecked) {
        state.checkedImages.push(imageId);
      } else {
        const index = state.checkedImages.indexOf(imageId);
        if (index !== -1) {
          state.checkedImages.splice(index, 1);
        }
      }
    },
    clearCheckedImages: (state) => {
      state.checkedImages = [];
    },
  },
});

export const {
  setThumbsNeedRefetch,
  setModalThumbsNeedRefetch,
  setImage,
  toggleImagesList,
  clearCheckedImages,
  clearImage,
} = imageSlice.actions;
export default imageSlice.reducer;
