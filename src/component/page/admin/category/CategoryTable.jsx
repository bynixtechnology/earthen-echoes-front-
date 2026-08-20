import {
  Loader2,
  ImagePlus,
  Pencil,
  Trash2,
  Power,
  Star,
  Package,
} from "lucide-react";

export default function CategoryTable({
  categories = [],
  loading,
  actionLoading,
  onEdit,
  onDelete,
  onStatus,
  onFeaturedStatus,
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

  if (!categories.length) {
    return (
      <div className="flex h-52 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400">
        <ImagePlus size={32} />
        <p className="mt-2 text-sm font-medium">No categories found</p>
      </div>
    );
  }

  // Sort categories so that featured categories always appear at the top
  const sortedCategories = [...categories].sort((a, b) => {
    if (Boolean(a?.isFeatured) === Boolean(b?.isFeatured)) {
      return (a?.name || "").localeCompare(b?.name || "");
    }
    return a?.isFeatured ? -1 : 1;
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <TableHead>Image</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead center>Products</TableHead>
              <TableHead center>Featured</TableHead>
              <TableHead center>Status</TableHead>
              <TableHead right>Actions</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sortedCategories.map((category, index) => {
              const id = category?._id || category?.id;
              const isBusy = actionLoading === id;
              const isFeaturedBusy = actionLoading === `featured-${id}`;
              const totalProducts = category?.totalProducts ?? 0;
              const activeProducts = category?.activeProducts ?? totalProducts;

              return (
                <tr
                  key={id || index}
                  className={`transition hover:bg-slate-50/80 ${
                    category?.isFeatured ? "bg-amber-50/30" : ""
                  }`}
                >
                  {/* Image */}
                  <td className="px-5 py-3.5">
                    {category?.image ? (
                      <img
                        src={category.image}
                        alt={category?.name || "Category"}
                        className="h-12 w-12 rounded-lg border border-slate-200 object-cover shadow-xs"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-100 text-slate-400">
                        <ImagePlus size={18} />
                      </div>
                    )}
                  </td>

                  {/* Name & Slug */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">
                        {category?.name || "-"}
                      </p>
                      {category?.isFeatured && (
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                          <Star size={10} className="fill-amber-500 text-amber-500" />
                          TOP
                        </span>
                      )}
                    </div>
                    {category?.slug && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {category.slug}
                      </p>
                    )}
                  </td>

                  {/* Title */}
                  <td className="px-5 py-3.5 text-sm text-slate-600">
                    {category?.title || "-"}
                  </td>

                  {/* Description */}
                  <td className="max-w-xs px-5 py-3.5 text-sm text-slate-500">
                    <p className="line-clamp-2">
                      {category?.description || "-"}
                    </p>
                  </td>

                  {/* Products Count Badge */}
                  <td className="px-5 py-3.5 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        <Package size={13} className="text-slate-500" />
                        <span>{totalProducts}</span>
                      </span>
                      {totalProducts !== activeProducts && (
                        <span className="mt-0.5 text-[10px] text-slate-400">
                          ({activeProducts} active)
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Featured Status Toggle */}
                  <td className="px-5 py-3.5 text-center">
                    <button
                      type="button"
                      disabled={isFeaturedBusy || isBusy}
                      title={
                        category?.isFeatured
                          ? "Remove from featured"
                          : "Mark as featured"
                      }
                      onClick={() => onFeaturedStatus && onFeaturedStatus(category)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:opacity-40 ${
                        category?.isFeatured
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isFeaturedBusy ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Star
                          size={13}
                          className={
                            category?.isFeatured
                              ? "fill-amber-500 text-amber-500"
                              : "text-slate-400"
                          }
                        />
                      )}
                      <span>{category?.isFeatured ? "Featured" : "Standard"}</span>
                    </button>
                  </td>

                  {/* Active Status Badge */}
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        category?.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {category?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit */}
                      <button
                        type="button"
                        title="Edit Category"
                        disabled={isBusy || isFeaturedBusy}
                        onClick={() => onEdit(category)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40"
                      >
                        <Pencil size={15} />
                      </button>

                      {/* Status Toggle */}
                      <button
                        type="button"
                        disabled={isBusy || isFeaturedBusy}
                        title={
                          category?.isActive ? "Deactivate" : "Activate"
                        }
                        onClick={() => onStatus(category)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40"
                      >
                        {isBusy ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Power
                            size={15}
                            className={
                              category?.isActive
                                ? "text-green-600"
                                : "text-slate-400"
                            }
                          />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        title="Delete Category"
                        disabled={isBusy || isFeaturedBusy}
                        onClick={() => onDelete(category)}
                        className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableHead({ children, center = false, right = false }) {
  return (
    <th
      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
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