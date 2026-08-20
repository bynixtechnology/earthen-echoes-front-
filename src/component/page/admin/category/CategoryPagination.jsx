import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  loading = false,
}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeTotalPages = Math.max(Number(totalPages) || 1, 1);
  const safeTotal = Number(total) || 0;
  const safeLimit = Number(limit) || 10;

  const startItem = safeTotal === 0 ? 0 : (safePage - 1) * safeLimit + 1;
  const endItem = Math.min(safePage * safeLimit, safeTotal);

  const getVisiblePages = () => {
    const pages = [];

    for (let current = 1; current <= safeTotalPages; current++) {
      if (
        current === 1 ||
        current === safeTotalPages ||
        Math.abs(current - safePage) <= 1
      ) {
        pages.push(current);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (loading || safeTotal === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Summary & Per-Page Limit */}
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">{startItem}</span> to{" "}
          <span className="font-semibold text-slate-800">{endItem}</span> of{" "}
          <span className="font-semibold text-slate-800">{safeTotal}</span>{" "}
          categories
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Show
          </span>

          <select
            value={safeLimit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-xs outline-none transition hover:border-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Right: Page Navigation */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        {visiblePages.map((pageNumber, index) => {
          const previous = visiblePages[index - 1];

          return (
            <div key={pageNumber} className="flex items-center gap-1.5">
              {previous && pageNumber - previous > 1 && (
                <span className="px-1 text-slate-400 select-none">...</span>
              )}

              <button
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                  safePage === pageNumber
                    ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                    : "border-slate-300 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {pageNumber}
              </button>
            </div>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          disabled={safePage >= safeTotalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}