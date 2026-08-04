import { FolderPlus } from "lucide-react";

export default function CategoryHeader({
  onAdd,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Categories
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage product categories
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <FolderPlus size={17} />
          Add Category
        </button>
      </div>
    </div>
  );
}