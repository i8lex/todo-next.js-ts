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

// const setCheckedImages: CaseReducer<
//   ImageStateType,
//   PayloadAction<{ imageId: string; isChecked: boolean }>
// > = (state, action) => {
//   const { imageId, isChecked } = action.payload;
//
//   if (isChecked) {
//     state.checkedImages = [...state.checkedImages, imageId];
//   } else {
//     state.checkedImages = state.checkedImages.filter((id) => id !== imageId);
//   }
// };

// const imageSlice = createSlice({
//   name: "image",
//   initialState,
//   reducers: {
//     setThumbsNeedRefetch: (state, action: PayloadAction<boolean>) => {
//       state.thumbsNeedRefetch = action.payload;
//     },
//     setModalThumbsNeedRefetch: (state, action: PayloadAction<boolean>) => {
//       state.modalThumbsNeedRefetch = action.payload;
//     },
//     setImage: (state, action: PayloadAction<Image>) => {
//       state.image = action.payload;
//     },
//     toggleImagesList: (
//       state: string[],
//       action: PayloadAction<{ itemId: string; isChecked: boolean }>
//     ) => {
//       const { itemId, isChecked } = action.payload;
//
//       if (isChecked) {
//         state.checkedImages.push(itemId);
//       } else {
//         const index = state.image.checkedImages.indexOf(itemId);
//         if (index !== -1) {
//           state.checkedImages.splice(index, 1);
//         }
//       }
//     },
//     clearImages: (state: string[]) => {
//       state.checkedImages = [];
//     },
//     // clearCheckedImages: (state) => {
//     //   state.checkedImages = [];
//     // },
//   },
// });

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
    toggleImagesList: (
      state,
      action: PayloadAction<{ imageId: string; isChecked: boolean }>
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
} = imageSlice.actions;
export default imageSlice.reducer;
