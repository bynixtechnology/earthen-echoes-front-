import { FolderPlus, Loader2, X, Pencil, Star, Package } from "lucide-react";

export default function CategoryModal({
  open,
  editingCategory,
  form,
  preview,
  fileInputRef,
  isSubmitting,
  onChange,
  onImageChange,
  onRemoveImage,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  const totalProducts = editingCategory?.totalProducts ?? 0;
  const activeProducts = editingCategory?.activeProducts ?? totalProducts;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {editingCategory
                ? "Update category information"
                : "Create a new product category"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
            {/* Products Stats Badge (Only shown in Edit mode) */}
            {editingCategory && (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Package size={17} className="text-slate-500" />
                  <span>Associated Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                    {totalProducts} Total
                  </span>
                  <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    {activeProducts} Active
                  </span>
                </div>
              </div>
            )}

            {/* Category Name */}
            <Field label="Category Name" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter category name"
                className={inputClass}
              />
            </Field>

            {/* Category Title */}
            <Field label="Category Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => onChange("title", e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter category title"
                className={inputClass}
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter category description"
                className={`${inputClass} resize-none`}
              />
            </Field>

            {/* Featured Checkbox Toggle */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={Boolean(form.isFeatured)}
                  onChange={(e) => onChange("isFeatured", e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                    <Star
                      size={14}
                      className={
                        form.isFeatured
                          ? "fill-amber-500 text-amber-500"
                          : "text-slate-400"
                      }
                    />
                    <span>Mark as Featured Category</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Featured categories are highlighted on the home screen and always listed at the top.
                  </p>
                </div>
              </label>
            </div>

            {/* Category Image */}
            <Field
              label="Category Image"
              required={!editingCategory}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                disabled={isSubmitting}
                onChange={onImageChange}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Maximum image size: 5 MB.
                {editingCategory && " Leave empty to keep the existing image."}
              </p>

              {preview && (
                <div className="relative mt-3 overflow-hidden rounded-lg border border-slate-200 shadow-xs">
                  <img
                    src={preview}
                    alt="Category preview"
                    className="h-40 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={onRemoveImage}
                    disabled={isSubmitting}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </Field>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-w-[145px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>
                    {editingCategory ? "Updating..." : "Creating..."}
                  </span>
                </>
              ) : (
                <>
                  {editingCategory ? (
                    <Pencil size={16} />
                  ) : (
                    <FolderPlus size={16} />
                  )}
                  <span>
                    {editingCategory ? "Update Category" : "Create Category"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900";