import { useEffect } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  fetchProducts,
  deleteProduct,
  setFilter,
  setPage,
  type Product,
} from "~/store/productsSlice";
import Swal from "sweetalert2";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, filter, page, pageSize, totalItems, totalPages, hasNext, hasPrevious, loading, error } =
    useAppSelector((state) => state.products);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(fetchProducts({ name: filter || undefined, page, pageSize }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [filter, page, dispatch]);

  function handleDelete(product: Product) {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${product.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(product.id)).then(() => {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Product successfully removed.",
            timer: 1500,
            showConfirmButton: false,
          });
          dispatch(fetchProducts({ name: filter || undefined, page, pageSize }));
        });
      }
    });
  }

  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalItems);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          New Product
        </Link>
      </div>

      {/* Filter */}
      <div className="mt-6 relative max-w-md">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Filter by name..."
          value={filter}
          onChange={(e) => dispatch(setFilter(e.target.value))}
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm text-red-600">Error: {error}</p>
      )}

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Name
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Description
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              items.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {product.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-500">
                    {product.description}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        product.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <div className="inline-flex gap-2">
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="rounded p-1.5 text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product)}
                        className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{startItem}</span>–
            <span className="font-medium">{endItem}</span>{" "}
            of <span className="font-medium">{totalItems}</span>
          </p>

          <nav className="inline-flex items-center gap-1">
            <button
              disabled={!hasPrevious}
              onClick={() => dispatch(setPage(page - 1))}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => dispatch(setPage(i))}
                className={`min-w-[2.25rem] rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  i === page
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={!hasNext}
              onClick={() => dispatch(setPage(page + 1))}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
