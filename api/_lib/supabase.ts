import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type ProjectRow = {
  id: string;
  title: string;
  description: string;
  project_type: string;
  technologies: string[];
  preview_type: "chart" | "code" | "dashboard" | "graph";
  url: string;
  accent: "violet" | "cyan";
  published: boolean;
  created_at: string;
  updated_at: string;
}

type MessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface Database {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: Omit<ProjectRow, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<ProjectRow, "id" | "created_at">>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: Pick<MessageRow, "name" | "email" | "message">;
        Update: never;
        Relationships: [];
      };
      contact_rate_limits: {
        Row: { ip_hash: string; window_start: string; request_count: number };
        Insert: { ip_hash: string; window_start: string; request_count: number };
        Update: { request_count?: number };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      consume_contact_rate_limit: {
        Args: { p_ip_hash: string; p_window_start: string; p_limit: number };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

let serviceClient: SupabaseClient<Database, "public"> | undefined;

export function getServiceSupabase(): SupabaseClient<Database, "public"> {
  serviceClient ??= createClient<Database, "public">(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return serviceClient;
}

export function getAuthSupabase(): SupabaseClient<Database, "public"> {
  return createClient<Database, "public">(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_ANON_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
