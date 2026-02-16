import * as yup from "yup";

export const productSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  description: yup.string().required("Description is required").min(5, "Description must be at least 5 characters"),
  code: yup.string().required("Code is required").min(5, "Code must be at least 5 characters").max(50, "Code must be until 50 characters"),
  active: yup.boolean().required(),
  price: yup.number().required("Price is required").min(0, "Price must be at least 0"),
  materials: yup.array().of(
    yup.object({
      id: yup.number().required("Material is required"),
      requiredQuantity: yup.number().required("Quantity is required").min(1, "Quantity must be at least 1"),
    })
  ).min(1, "At least one material is required"),
});

export type ProductFormData = yup.InferType<typeof productSchema>;
