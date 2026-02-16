export interface Material {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface ProductMaterial {
  id: number;
  requiredQuantity: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  code: string;
  active: boolean;
  price: string;
  materials: ProductMaterial[];
}
