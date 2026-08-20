import { FolderPlus } from "lucide-react";

export default function CategoryHeader({ onAdd }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Categories
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage product categories, featured status, and ordering
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 active:scale-95"
        >
          <FolderPlus size={18} className="stroke-[2.2]" />
          Add Category
        </button>
      </div>
    </div>
  );
}