import * as yup from "yup";

export const materialSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  description: yup.string().required("Description is required").min(5, "Description must be at least 5 characters"),
  amount: yup.number().required("Amount is required").min(0, "Amount must be at least 0"),
});

export type MaterialFormData = yup.InferType<typeof materialSchema>;
