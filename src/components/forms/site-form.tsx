"use client";

import { useState } from "react";
import { Site, SiteFormData } from "@/lib/types";
import { validateSite, ValidationError } from "@/lib/validations";

interface SiteFormProps {
  site?: Site;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SiteForm({ site, onClose, onSuccess }: SiteFormProps) {
  const isEdit = !!site;

  const [form, setForm] = useState<SiteFormData>({
    name: site?.name ?? "",
    url: site?.url ?? "",
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function getFieldError(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => prev.filter((err) => err.field !== name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateSite(form);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const payload = {
      name: form.name.trim(),
      url: form.url.trim(),
    };

    try {
      const url = isEdit ? `/api/sites/${site!.id}` : "/api/sites";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      onSuccess();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: 420 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {isEdit ? "Edit Site" : "Add Site"}
          </h2>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            style={{ padding: "4px 8px" }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Name */}
            <div>
              <label className="label">Name *</label>
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Devpost"
              />
              {getFieldError("name") && (
                <p className="error-text">{getFieldError("name")}</p>
              )}
            </div>

            {/* URL */}
            <div>
              <label className="label">URL *</label>
              <input
                className="input"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://devpost.com"
              />
              {getFieldError("url") && (
                <p className="error-text">{getFieldError("url")}</p>
              )}
            </div>

            {serverError && (
              <p
                className="error-text"
                style={{
                  padding: "8px 12px",
                  background: "rgba(239,68,68,0.08)",
                  borderRadius: "var(--radius)",
                }}
              >
                {serverError}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                paddingTop: 4,
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Site"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
