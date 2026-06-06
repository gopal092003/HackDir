import { getPastHackathons } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import { HackathonTable } from "@/components/data-table";
import { SortField, SortOrder } from "@/lib/types";

interface PastPageProps {
  searchParams: Promise<{
    page?: string;
    sortField?: string;
    sortOrder?: string;
  }>;
}

export default async function PastPage({ searchParams }: PastPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const sortField = (params.sortField ?? "end_time") as SortField;
  const sortOrder = (params.sortOrder ?? "desc") as SortOrder;

  const [{ data, count, error }, admin] = await Promise.all([
    getPastHackathons({ page, sortField, sortOrder }),
    isAdmin(),
  ]);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginBottom: 4,
          }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Past Hackathons
          </h1>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {count} hackathon{count !== 1 ? "s" : ""}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Completed hackathons — sorted by most recent.
        </p>
        {error && (
          <p
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "var(--danger)",
              padding: "8px 12px",
              background: "rgba(239,68,68,0.08)",
              borderRadius: "var(--radius)",
            }}
          >
            Error: {error}
          </p>
        )}
      </div>

      <HackathonTable
        data={data}
        count={count}
        currentPage={page}
        sortField={sortField}
        sortOrder={sortOrder}
        isAdmin={admin}
      />
    </div>
  );
}
