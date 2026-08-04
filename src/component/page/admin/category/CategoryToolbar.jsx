import { useRef } from "react";
import {
  Search,
  Upload,
  Download,
  Loader2,
} from "lucide-react";
import { showToast } from "../../../../config/toast";





export default function CategoryToolbar({
  search,
  onSearchChange,
  total,
  onImport,
  onExport,
  importLoading = false,
  exportLoading = false,
}) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    if (importLoading) return;

    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      showToast.error("Please select a valid Excel file.");
      e.target.value = "";
      return;
    }

    try {
      if (typeof onImport === "function") {
        await onImport(file);
      }
    } finally {
      // Same file dobara select kar sako
      e.target.value = "";
    }
  };

   const handleDownloadTemplate = () => {
  const link = document.createElement("a");

  link.href = "/templates/category-import-template-1-data.xlsx";
  link.download = "category-import-template-1-data.xlsx";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="mb-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Search */}
      <div className="relative w-full lg:max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search categories..."
          className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-600 focus:ring-2 focus:ring-slate-100"
        />
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Total */}
        <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold">
          Total :
          <span className="ml-2 text-slate-900">
            {total || 0}
          </span>
        </div>

        {/* Export */}
        <button
          type="button"
          disabled={exportLoading}
          onClick={() =>
            typeof onExport === "function" &&
            onExport()
          }
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {exportLoading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Download size={18} />
          )}

          {exportLoading
            ? "Exporting..."
            : "Export Excel"}
        </button>

        {/* Download Template */}
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600"
        >
          <Download size={18} />
          Template
        </button>

        {/* Import */}
        <button
          type="button"
          disabled={importLoading}
          onClick={handleImportClick}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {importLoading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Upload size={18} />
          )}

          {importLoading
            ? "Importing..."
            : "Import Excel"}
        </button>

      </div>
    </div>
  );
}