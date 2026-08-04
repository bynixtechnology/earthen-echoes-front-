import {
  Loader2,
  ImagePlus,
  Pencil,
  Trash2,
  Power,
} from "lucide-react";

export default function CategoryTable({
  categories = [],
  loading,
  actionLoading,
  onEdit,
  onDelete,
  onStatus,
}) {
  if (loading) {
    return (
      <div className="flex h-52 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <Loader2
          size={26}
          className="animate-spin text-slate-700"
        />
      </div>
    );
  }

  if (
    !categories.length
  ) {
    return (
      <div className="flex h-52 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400">
        <ImagePlus
          size={32}
        />

        <p className="mt-2 text-sm">
          No categories found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full max-w-7xl">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <TableHead>
                Image
              </TableHead>

              <TableHead>
                Category
              </TableHead>

              <TableHead>
                Title
              </TableHead>

              <TableHead>
                Description
              </TableHead>

              <TableHead
                center
              >
                Order
              </TableHead>

              <TableHead
                center
              >
                Status
              </TableHead>

              <TableHead
                right
              >
                Actions
              </TableHead>
            </tr>
          </thead>

          <tbody>
            {categories.map(
              (
                category,
                index
              ) => {
                const id =
                  category?._id ||
                  category?.id;

                const busy =
                  actionLoading ===
                  id;

                return (
                  <tr
                    key={
                      id ||
                      index
                    }
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      {category?.image ? (
                        <img
                          src={
                            category.image
                          }
                          alt={
                            category?.name ||
                            "Category"
                          }
                          className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <ImagePlus
                            size={
                              18
                            }
                          />
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {category?.name ||
                          "-"}
                      </p>

                      {category?.slug && (
                        <p className="mt-1 text-xs text-slate-400">
                          {
                            category.slug
                          }
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-3 text-sm text-slate-600">
                      {category?.title ||
                        "-"}
                    </td>

                    <td className="max-w-xs px-5 py-3 text-sm text-slate-500">
                      <p className="line-clamp-2">
                        {category?.description ||
                          "-"}
                      </p>
                    </td>

                    <td className="px-5 py-3 text-center text-sm font-medium text-slate-600">
                      {category?.sortOrder ??
                        0}
                    </td>

                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          category?.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {category?.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          title="Edit"
                          disabled={
                            busy
                          }
                          onClick={() =>
                            onEdit(
                              category
                            )
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
                        >
                          <Pencil
                            size={
                              16
                            }
                          />
                        </button>

                        <button
                          type="button"
                          disabled={
                            busy
                          }
                          title={
                            category?.isActive
                              ? "Deactivate"
                              : "Activate"
                          }
                          onClick={() =>
                            onStatus(
                              category
                            )
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
                        >
                          {busy ? (
                            <Loader2
                              size={
                                16
                              }
                              className="animate-spin"
                            />
                          ) : (
                            <Power
                              size={
                                16
                              }
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          disabled={
                            busy
                          }
                          onClick={() =>
                            onDelete(
                              category
                            )
                          }
                          className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                        >
                          <Trash2
                            size={
                              16
                            }
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableHead({
  children,
  center = false,
  right = false,
}) {
  return (
    <th
      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
        center
          ? "text-center"
          : right
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}