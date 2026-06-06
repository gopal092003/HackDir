export type HackathonStatus = "Live" | "Upcoming" | "Completed";

export const PAGE_SIZE = 25;

export type SortField = "end_time" | "prize_amount";
export type SortOrder = "asc" | "desc";

export interface Hackathon {
  id: string;
  title: string;
  url: string;
  prize_display: string | null;
  prize_amount: number | null;
  tags: string[] | null;
  priority: string | null;
  github_repo: string | null;
  registration_deadline: string | null;
  start_time: string;
  end_time: string;
  journal: string | null;
  achievement: string | null;
  created_at: string;
  updated_at: string;
}

export interface HackathonView extends Hackathon {
  status: HackathonStatus;
}

export interface Site {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export interface HackathonFormData {
  title: string;
  url: string;
  prize_display: string;
  prize_amount: string;
  tags: string;
  priority: string;
  github_repo: string;
  registration_deadline: string;
  start_time: string;
  end_time: string;
  journal: string;
  achievement: string;
}

export interface SiteFormData {
  name: string;
  url: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: SortField;
  order: SortOrder;
}

export interface QueryResult<T> {
  data: T[];
  count: number;
  error: string | null;
}
