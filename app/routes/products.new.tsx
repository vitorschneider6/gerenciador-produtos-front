import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "~/services/api";
import { productSchema } from "~/validation/productSchema";
import type { Material, ProductFormData } from "~/types/product";
import type { Product } from "~/store/productsSlice";
import Swal from "sweetalert2";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function ProductCreatePage() {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    description: "",
    active: true,
    price: "0.00",
    code: "",
    materials: [{ id: 0, requiredQuantity: 1 }],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialsRes = await api.get<{ items: Material[] }>("/materials?pageSize=0");
        setMaterials(materialsRes.data.items);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to load materials",
        });
      }
    };
    fetchMaterials();
  }, []);

  const validate = async () => {
    try {
      await productSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const validationErrors: Record<string, string> = {};
      err.inner?.forEach((error: any) => {
        if (error.path) {
          validationErrors[error.path] = error.message;
        }
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const onChangePrice = (value: string) => {
    const formattedValue = value.replace(",", ".");

      if (/^\d*\.?\d{0,2}$/.test(formattedValue)) {
        setForm({ ...form, price: formattedValue });
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(await validate())) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        code: form.code,
        active: form.active,
        price: parseFloat(form.price),
        materials: form.materials,
      };

      const response = await api.post<Product>("/products", payload);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message,
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "An error occurred",
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = () => {
    setForm({
      ...form,
      materials: [...form.materials, { id: 0, requiredQuantity: 1 }],
    });
  };

  const removeMaterial = (index: number) => {
    setForm({
      ...form,
      materials: form.materials.filter((_, i) => i !== index),
    });
  };

  const updateMaterial = (index: number, field: "id" | "requiredQuantity", value: number) => {
    const updated = [...form.materials];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, materials: updated });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">New Product</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus:ring-1 ${
              errors.name
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Code</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus:ring-1 ${
              errors.code
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus:ring-1 ${
              errors.description
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => onChangePrice(e.target.value)}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus:ring-1 ${
              errors.price
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Active</label>
          <button
            type="button"
            onClick={() => setForm({ ...form, active: !form.active })}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer ${
              form.active ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                form.active ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Raw Materials</label>
            <button
              type="button"
              onClick={addMaterial}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <PlusIcon className="h-4 w-4" />
              Add Material
            </button>
          </div>
          {errors.materials && <p className="mt-1 text-xs text-red-600">{errors.materials}</p>}

          <div className="mt-3 space-y-3">
            {form.materials.map((material, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-1">
                  <select
                    value={material.id}
                    onChange={(e) => updateMaterial(index, "id", Number(e.target.value))}
                    className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus:ring-1 ${
                      errors[`materials[${index}].id`]
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    }`}
                  >
                    <option value={0}>Select a material</option>
                    {materials.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.name}
                      </option>
                    ))}
                  </select>
                  {errors[`materials[${index}].id`] && (
                    <p className="mt-1 text-xs text-red-600">{errors[`materials[${index}].id`]}</p>
                  )}
                </div>

                <div className="w-32">
                  <input
                    type="number"
                    min="1"
                    value={material.requiredQuantity}
                    onChange={(e) => updateMaterial(index, "requiredQuantity", Number(e.target.value))}
                    placeholder="Quantity"
                    className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus:ring-1 ${
                      errors[`materials[${index}].requiredQuantity`]
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    }`}
                  />
                  {errors[`materials[${index}].requiredQuantity`] && (
                    <p className="mt-1 text-xs text-red-600">{errors[`materials[${index}].requiredQuantity`]}</p>
                  )}
                </div>

                {form.materials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMaterial(index)}
                    className="rounded p-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
