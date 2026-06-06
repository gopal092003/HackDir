"use client";

import { useState } from "react";
import { HackathonView, HackathonFormData } from "@/lib/types";
import { validateHackathon, ValidationError } from "@/lib/validations";

interface HackathonFormProps {
  hackathon?: HackathonView;
  onClose: () => void;
  onSuccess: () => void;
}

function toLocalDatetimeValue(iso: string | null | undefined): string {
  if (!iso) return "";
  // Convert ISO UTC to local datetime-local string
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function HackathonForm({
  hackathon,
  onClose,
  onSuccess,
}: HackathonFormProps) {
  const isEdit = !!hackathon;

  const [form, setForm] = useState<HackathonFormData>({
    title: hackathon?.title ?? "",
    url: hackathon?.url ?? "",
    prize_display: hackathon?.prize_display ?? "",
    prize_amount: hackathon?.prize_amount != null ? String(hackathon.prize_amount) : "",
    tags: hackathon?.tags?.join(", ") ?? "",
    priority: hackathon?.priority ?? "",
    github_repo: hackathon?.github_repo ?? "",
    registration_deadline: toLocalDatetimeValue(hackathon?.registration_deadline),
    start_time: toLocalDatetimeValue(hackathon?.start_time),
    end_time: toLocalDatetimeValue(hackathon?.end_time),
    journal: hackathon?.journal ?? "",
    achievement: hackathon?.achievement ?? "",
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function getFieldError(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => prev.filter((err) => err.field !== name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateHackathon(form);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const payload = {
      title: form.title.trim(),
      url: form.url.trim(),
      prize_display: form.prize_display.trim() || null,
      prize_amount: form.prize_amount ? Number(form.prize_amount) : null,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : null,
      priority: form.priority.trim() || null,
      github_repo: form.github_repo.trim() || null,
      registration_deadline: form.registration_deadline
        ? new Date(form.registration_deadline).toISOString()
        : null,
      start_time: new Date(form.start_time).toISOString(),
      end_time: new Date(form.end_time).toISOString(),
      journal: form.journal.trim() || null,
      achievement: form.achievement.trim() || null,
    };

    try {
      const url = isEdit
        ? `/api/hackathons/${hackathon!.id}`
        : "/api/hackathons";
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
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
            {isEdit ? "Edit Hackathon" : "Add Hackathon"}
          </h2>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: "4px 8px" }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Title */}
            <Field label="Title *" error={getFieldError("title")}>
              <input
                className="input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. ETHGlobal Bangkok"
              />
            </Field>

            {/* URL */}
            <Field label="URL *" error={getFieldError("url")}>
              <input
                className="input"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://ethglobal.com/events/bangkok"
              />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Prize Display */}
              <Field label="Prize Display" error={getFieldError("prize_display")}>
                <input
                  className="input"
                  name="prize_display"
                  value={form.prize_display}
                  onChange={handleChange}
                  placeholder="$100,000 in prizes"
                />
              </Field>

              {/* Prize Amount */}
              <Field label="Prize Amount (numeric)" error={getFieldError("prize_amount")}>
                <input
                  className="input"
                  name="prize_amount"
                  value={form.prize_amount}
                  onChange={handleChange}
                  placeholder="100000"
                  type="number"
                  min="0"
                />
              </Field>
            </div>

            {/* Tags */}
            <Field label="Tags (comma separated)" error={getFieldError("tags")}>
              <input
                className="input"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="web3, ai, open source"
              />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Priority */}
              <Field label="Priority" error={getFieldError("priority")}>
                <input
                  className="input"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  placeholder="High / Medium / Low"
                />
              </Field>

              {/* GitHub Repo */}
              <Field label="GitHub Repo" error={getFieldError("github_repo")}>
                <input
                  className="input"
                  name="github_repo"
                  value={form.github_repo}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
              </Field>
            </div>

            {/* Registration Deadline */}
            <Field label="Registration Deadline" error={getFieldError("registration_deadline")}>
              <input
                className="input"
                name="registration_deadline"
                type="datetime-local"
                value={form.registration_deadline}
                onChange={handleChange}
              />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Start Time */}
              <Field label="Start Time *" error={getFieldError("start_time")}>
                <input
                  className="input"
                  name="start_time"
                  type="datetime-local"
                  value={form.start_time}
                  onChange={handleChange}
                />
              </Field>

              {/* End Time */}
              <Field label="End Time *" error={getFieldError("end_time")}>
                <input
                  className="input"
                  name="end_time"
                  type="datetime-local"
                  value={form.end_time}
                  onChange={handleChange}
                />
              </Field>
            </div>

            {/* Journal */}
            <Field label="Journal Notes" error={getFieldError("journal")}>
              <textarea
                className="input"
                name="journal"
                value={form.journal}
                onChange={handleChange}
                placeholder="Notes about this hackathon..."
                rows={3}
                style={{ resize: "vertical" }}
              />
            </Field>

            {/* Achievement */}
            <Field label="Achievement" error={getFieldError("achievement")}>
              <input
                className="input"
                name="achievement"
                value={form.achievement}
                onChange={handleChange}
                placeholder="e.g. 2nd place, Best DeFi Hack"
              />
            </Field>

            {serverError && (
              <p className="error-text" style={{ padding: "8px 12px", background: "rgba(239,68,68,0.08)", borderRadius: "var(--radius)" }}>
                {serverError}
              </p>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Hackathon"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
