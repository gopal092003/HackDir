import { HackathonFormData, SiteFormData } from "./types";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateHackathon(data: HackathonFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title.trim()) {
    errors.push({ field: "title", message: "Title is required." });
  }

  if (!data.url.trim()) {
    errors.push({ field: "url", message: "URL is required." });
  } else if (!/^https?:\/\/.+/.test(data.url.trim())) {
    errors.push({ field: "url", message: "URL must start with http:// or https://." });
  }

  if (!data.start_time) {
    errors.push({ field: "start_time", message: "Start time is required." });
  }

  if (!data.end_time) {
    errors.push({ field: "end_time", message: "End time is required." });
  }

  if (data.start_time && data.end_time) {
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);
    if (end <= start) {
      errors.push({ field: "end_time", message: "End time must be after start time." });
    }
  }

  if (data.prize_amount && isNaN(Number(data.prize_amount))) {
    errors.push({ field: "prize_amount", message: "Prize amount must be a valid number." });
  }

  if (data.github_repo && data.github_repo.trim() && !/^https?:\/\/.+/.test(data.github_repo.trim())) {
    errors.push({ field: "github_repo", message: "GitHub URL must start with http:// or https://." });
  }

  return errors;
}

export function validateSite(data: SiteFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name.trim()) {
    errors.push({ field: "name", message: "Name is required." });
  }

  if (!data.url.trim()) {
    errors.push({ field: "url", message: "URL is required." });
  } else if (!/^https?:\/\/.+/.test(data.url.trim())) {
    errors.push({ field: "url", message: "URL must start with http:// or https://." });
  }

  return errors;
}
