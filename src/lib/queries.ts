import "server-only";
import { createClient } from "./supabase/server";
import {
  HackathonView,
  Site,
  SortField,
  SortOrder,
  QueryResult,
  PAGE_SIZE,
} from "./types";

// ─── Hackathons ────────────────────────────────────────────────────────────────

export async function getActiveHackathons({
  page = 1,
  sortField = "end_time",
  sortOrder = "asc",
}: {
  page?: number;
  sortField?: SortField;
  sortOrder?: SortOrder;
}): Promise<QueryResult<HackathonView>> {
  const supabase = await createClient();
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("hackathons_view")
    .select("*", { count: "exact" })
    .in("status", ["Live", "Upcoming"])
    .order(sortField, { ascending: sortOrder === "asc" })
    .range(start, end);

  return {
    data: (data as HackathonView[]) ?? [],
    count: count ?? 0,
    error: error?.message ?? null,
  };
}

export async function getPastHackathons({
  page = 1,
  sortField = "end_time",
  sortOrder = "desc",
}: {
  page?: number;
  sortField?: SortField;
  sortOrder?: SortOrder;
}): Promise<QueryResult<HackathonView>> {
  const supabase = await createClient();
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("hackathons_view")
    .select("*", { count: "exact" })
    .eq("status", "Completed")
    .order(sortField, { ascending: sortOrder === "asc" })
    .range(start, end);

  return {
    data: (data as HackathonView[]) ?? [],
    count: count ?? 0,
    error: error?.message ?? null,
  };
}

export async function getHackathonById(id: string): Promise<HackathonView | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hackathons_view")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as HackathonView;
}

export async function createHackathon(payload: {
  title: string;
  url: string;
  prize_display?: string | null;
  prize_amount?: number | null;
  tags?: string[] | null;
  priority?: string | null;
  github_repo?: string | null;
  registration_deadline?: string | null;
  start_time: string;
  end_time: string;
  journal?: string | null;
  achievement?: string | null;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("hackathons").insert([payload]);
  return { error: error?.message ?? null };
}

export async function updateHackathon(
  id: string,
  payload: {
    title?: string;
    url?: string;
    prize_display?: string | null;
    prize_amount?: number | null;
    tags?: string[] | null;
    priority?: string | null;
    github_repo?: string | null;
    registration_deadline?: string | null;
    start_time?: string;
    end_time?: string;
    journal?: string | null;
    achievement?: string | null;
  }
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("hackathons")
    .update(payload)
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteHackathon(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("hackathons").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ─── Sites ─────────────────────────────────────────────────────────────────────

export async function getSites({
  page = 1,
}: {
  page?: number;
}): Promise<QueryResult<Site>> {
  const supabase = await createClient();
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("sites")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(start, end);

  return {
    data: (data as Site[]) ?? [],
    count: count ?? 0,
    error: error?.message ?? null,
  };
}

export async function getSiteById(id: string): Promise<Site | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Site;
}

export async function createSite(payload: {
  name: string;
  url: string;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("sites").insert([payload]);
  return { error: error?.message ?? null };
}

export async function updateSite(
  id: string,
  payload: { name?: string; url?: string }
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("sites").update(payload).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteSite(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("sites").delete().eq("id", id);
  return { error: error?.message ?? null };
}
