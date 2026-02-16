import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  fetchProduction,
  setFilter,
  setPage,
} from "~/store/productionSlice";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function ProductionPage() {
  const dispatch = useAppDispatch();
  const { items, filter, page, pageSize, totalItems, totalPages, hasNext, hasPrevious, loading, error } =
    useAppSelector((state) => state.production);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(fetchProduction({ name: filter || undefined, page, pageSize }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [filter, page, dispatch]);

  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalItems);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Product Production</h1>

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

      {error && (
        <p className="mt-4 text-sm text-red-600">Error: {error}</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Product Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                Unit Value
              </th>
               <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                Producible Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                Total Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
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
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                      {product.unitValue.toFixed(2)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                      {product.producibleAmount}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                      {product.productionValue.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
