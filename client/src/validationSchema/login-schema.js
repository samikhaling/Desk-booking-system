import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().required("You must enter the email"),
});
