import * as yup from "yup";

export const form = {
  projectsValidationSchema: yup.object().shape({
    title: yup.string().label("Title").min(6).max(20).required(),
  }),
};
