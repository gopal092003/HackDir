"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HackathonView, Site, SortField, SortOrder } from "@/lib/types";
import Pagination from "./pagination";
import { PAGE_SIZE } from "@/lib/types";
import HackathonForm from "./forms/hackathon-form";
import SiteForm from "./forms/site-form";

// ─── Hackathon Table ────────────────────────────────────────────────────────

interface HackathonTableProps {
  data: HackathonView[];
  count: number;
  currentPage: number;
  sortField: SortField;
  sortOrder: SortOrder;
  isAdmin: boolean;
}

export function HackathonTable({
  data,
  count,
  currentPage,
  sortField,
  sortOrder,
  isAdmin,
}: HackathonTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [editItem, setEditItem] = useState<HackathonView | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HackathonView | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function setSort(field: SortField, order: SortOrder) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortField", field);
    params.set("sortOrder", order);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  function SortButton({
    field,
    order,
    label,
  }: {
    field: SortField;
    order: SortOrder;
    label: string;
  }) {
    const active = sortField === field && sortOrder === order;
    return (
      <button
        onClick={() => setSort(field, order)}
        className="btn btn-ghost"
        style={{
          fontSize: 11,
          padding: "4px 8px",
          color: active ? "var(--accent)" : "var(--text-secondary)",
          background: active ? "var(--accent-glow)" : "transparent",
          border: active ? "1px solid var(--accent)" : "1px solid transparent",
        }}
      >
        {label}
      </button>
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/hackathons/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Delete failed");
      setDeleteTarget(null);
      router.refresh();
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {/* Controls bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              alignSelf: "center",
              marginRight: 4,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Sort:
          </span>
          <SortButton field="end_time" order="asc" label="End ↑" />
          <SortButton field="end_time" order="desc" label="End ↓" />
          <SortButton field="prize_amount" order="asc" label="Prize ↑" />
          <SortButton field="prize_amount" order="desc" label="Prize ↓" />
        </div>

        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAdd(true)}
          >
            + Add Hackathon
          </button>
        )}
      </div>

      {/* Table */}
      {data.length === 0 ? (
        <EmptyState message="No hackathons found." />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Prize</th>
                <th>Start</th>
                <th>End</th>
                <th>Tags</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((h) => (
                <tr key={h.id}>
                  <td>
                    <a
                      href={h.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--accent)",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                      className="table-link"
                    >
                      {h.title}
                      <style>{`.table-link:hover { text-decoration: underline; }`}</style>
                    </a>
                  </td>
                  <td>
                    <StatusBadge status={h.status} />
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {h.prize_display ?? (h.prize_amount != null ? `$${h.prize_amount.toLocaleString()}` : "—")}
                  </td>
                  <td style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    {formatDate(h.start_time)}
                  </td>
                  <td style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    {formatDate(h.end_time)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {h.tags?.slice(0, 3).map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                      {(h.tags?.length ?? 0) > 3 && (
                        <span className="tag">+{(h.tags?.length ?? 0) - 3}</span>
                      )}
                    </div>
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="btn btn-ghost"
                          onClick={() => setEditItem(h)}
                          style={{ fontSize: 12 }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => setDeleteTarget(h)}
                          style={{ fontSize: 12 }}
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalCount={count}
        pageSize={PAGE_SIZE}
      />

      {/* Add Modal */}
      {showAdd && (
        <HackathonForm
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            router.refresh();
          }}
        />
      )}

      {/* Edit Modal */}
      {editItem && (
        <HackathonForm
          hackathon={editItem}
          onClose={() => setEditItem(null)}
          onSuccess={() => {
            setEditItem(null);
            router.refresh();
          }}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 12,
                color: "var(--text-primary)",
              }}
            >
              Delete Hackathon
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                {deleteTarget.title}
              </strong>
              ? This action cannot be undone.
            </p>
            {deleteError && (
              <p className="error-text" style={{ marginBottom: 12 }}>
                {deleteError}
              </p>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
                style={{ background: "var(--danger)", color: "#fff", borderColor: "var(--danger)" }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sites Table ────────────────────────────────────────────────────────────

interface SiteTableProps {
  data: Site[];
  count: number;
  currentPage: number;
  isAdmin: boolean;
}

export function SiteTable({
  data,
  count,
  currentPage,
  isAdmin,
}: SiteTableProps) {
  const router = useRouter();

  const [editItem, setEditItem] = useState<Site | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/sites/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Delete failed");
      setDeleteTarget(null);
      router.refresh();
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            + Add Site
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <EmptyState message="No sites available." />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Added</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent)" }}
                      className="table-link"
                    >
                      {s.url}
                    </a>
                  </td>
                  <td style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    {formatDate(s.created_at)}
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="btn btn-ghost"
                          onClick={() => setEditItem(s)}
                          style={{ fontSize: 12 }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => setDeleteTarget(s)}
                          style={{ fontSize: 12 }}
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalCount={count}
        pageSize={PAGE_SIZE}
      />

      {showAdd && (
        <SiteForm
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            router.refresh();
          }}
        />
      )}

      {editItem && (
        <SiteForm
          site={editItem}
          onClose={() => setEditItem(null)}
          onSuccess={() => {
            setEditItem(null);
            router.refresh();
          }}
        />
      )}

      {deleteTarget && (
        <div className="overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 12,
                color: "var(--text-primary)",
              }}
            >
              Delete Site
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                {deleteTarget.name}
              </strong>
              ? This action cannot be undone.
            </p>
            {deleteError && (
              <p className="error-text" style={{ marginBottom: 12 }}>
                {deleteError}
              </p>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
                style={{ background: "var(--danger)", color: "#fff", borderColor: "var(--danger)" }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Live"
      ? "badge badge-live"
      : status === "Upcoming"
      ? "badge badge-upcoming"
      : "badge badge-completed";
  return <span className={cls}>{status}</span>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "64px 24px",
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: 14,
        border: "1px dashed var(--border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {message}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
