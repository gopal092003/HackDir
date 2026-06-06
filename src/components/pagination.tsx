"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
        padding: "0 4px",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
        {start}–{end} of {totalCount} results
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          className="btn btn-ghost"
          onClick={() => goToPage(1)}
          disabled={!hasPrev}
          title="First page"
        >
          «
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => goToPage(currentPage - 1)}
          disabled={!hasPrev}
          title="Previous page"
        >
          ‹
        </button>

        <span
          style={{
            padding: "6px 12px",
            fontSize: 12,
            color: "var(--text-secondary)",
            minWidth: 80,
            textAlign: "center",
          }}
        >
          {currentPage} / {totalPages}
        </span>

        <button
          className="btn btn-ghost"
          onClick={() => goToPage(currentPage + 1)}
          disabled={!hasNext}
          title="Next page"
        >
          ›
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => goToPage(totalPages)}
          disabled={!hasNext}
          title="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
}
