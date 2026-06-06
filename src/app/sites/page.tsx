import { getSites } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import { SiteTable } from "@/components/data-table";

interface SitesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function SitesPage({ searchParams }: SitesPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const [{ data, count, error }, admin] = await Promise.all([
    getSites({ page }),
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
            Hackathon Sites
          </h1>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {count} site{count !== 1 ? "s" : ""}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Useful platforms, communities, and resources for hackathon participants.
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

      <SiteTable
        data={data}
        count={count}
        currentPage={page}
        isAdmin={admin}
      />
    </div>
  );
}
