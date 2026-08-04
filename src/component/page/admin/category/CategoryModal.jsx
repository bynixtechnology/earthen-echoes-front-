import {
  FolderPlus,
  Loader2,
  X,
  Pencil,
} from "lucide-react";


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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingCategory
                ? "Edit Category"
                : "Add Category"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {editingCategory
                ? "Update category information"
                : "Create a new product category"}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              isSubmitting
            }
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X
              size={19}
            />
          </button>
        </div>

        <form
          onSubmit={
            onSubmit
          }
        >
          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
            <Field
              label="Category Name"
              required
            >
              <input
                type="text"
                value={
                  form.name
                }
                onChange={(
                  e
                ) =>
                  onChange(
                    "name",
                    e.target
                      .value
                  )
                }
                disabled={
                  isSubmitting
                }
                placeholder="Enter category name"
                className={
                  inputClass
                }
              />
            </Field>

            <Field
              label="Category Title"
              required
            >
              <input
                type="text"
                value={
                  form.title
                }
                onChange={(
                  e
                ) =>
                  onChange(
                    "title",
                    e.target
                      .value
                  )
                }
                disabled={
                  isSubmitting
                }
                placeholder="Enter category title"
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Description">
              <textarea
                rows={4}
                value={
                  form.description
                }
                onChange={(
                  e
                ) =>
                  onChange(
                    "description",
                    e.target
                      .value
                  )
                }
                disabled={
                  isSubmitting
                }
                placeholder="Enter category description"
                className={`${inputClass} resize-none`}
              />
            </Field>

            <Field label="Sort Order">
              <input
                type="number"
                min="0"
                value={
                  form.sortOrder
                }
                onChange={(
                  e
                ) =>
                  onChange(
                    "sortOrder",
                    e.target
                      .value
                  )
                }
                disabled={
                  isSubmitting
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field
              label="Category Image"
              required={
                !editingCategory
              }
            >
              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/*"
                disabled={
                  isSubmitting
                }
                onChange={
                  onImageChange
                }
                className="w-full rounded-lg border border-slate-300 p-2 text-sm"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Maximum image
                size: 5 MB.
                {editingCategory &&
                  " Leave empty to keep the existing image."}
              </p>

              {preview && (
                <div className="relative mt-3 overflow-hidden rounded-lg border border-slate-200">
                  <img
                    src={
                      preview
                    }
                    alt="Category preview"
                    className="h-40 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={
                      onRemoveImage
                    }
                    disabled={
                      isSubmitting
                    }
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
                  >
                    <X
                      size={16}
                    />
                  </button>
                </div>
              )}
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                isSubmitting
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="flex min-w-[145px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  {editingCategory
                    ? "Updating..."
                    : "Creating..."}
                </>
              ) : (
                <>
                  {editingCategory ? (
                    <Pencil
                      size={
                        16
                      }
                    />
                  ) : (
                    <FolderPlus
                      size={
                        16
                      }
                    />
                  )}

                  {editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="text-red-500">
            {" *"}
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200";