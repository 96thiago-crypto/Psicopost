/// <reference types="vite/client" />
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PostState } from "../types";

// Default credentials provided by the user
const RAW_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  "https://qsecpdggaqgqzwghabnt.supabase.co";

const RAW_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_3_S0TOo96Dm4oXjdFj0DiA_LPahR9s_";

// Sanitize URL if it contains /rest/v1/
function sanitizeSupabaseUrl(url: string): string {
  if (!url) return "";
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export const SUPABASE_URL = sanitizeSupabaseUrl(RAW_URL);
export const SUPABASE_ANON_KEY = RAW_ANON_KEY.trim();

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!clientInstance) {
    clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return clientInstance;
}

export const supabase = getSupabaseClient();

/**
 * Checks if Supabase is properly configured and reachable
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  try {
    const client = getSupabaseClient();
    // Test auth service status
    const { error } = await client.auth.getSession();
    if (error) {
      return { connected: false, message: error.message };
    }
    return { connected: true, message: "Supabase Conectado" };
  } catch (err: any) {
    return { connected: false, message: err.message || "Erro de conexão com Supabase" };
  }
}

export interface SupabaseSavedPost {
  id: string;
  user_id?: string;
  title: string;
  format: string;
  post_data: PostState;
  created_at?: string;
  updated_at?: string;
}

/**
 * Supabase Database operations for Posts & Carousels
 */
export const supabaseDb = {
  // Save or update a post in Supabase
  async savePost(
    postState: PostState,
    userId?: string
  ): Promise<{ data: any; error: any }> {
    try {
      const client = getSupabaseClient();
      const payload = {
        title: postState.themeTitle || "Sem título",
        format: postState.format,
        post_data: postState,
        user_id: userId || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from("posts")
        .insert([payload])
        .select();

      if (error) {
        console.warn("Supabase posts table insert warning:", error.message);
        return { data: null, error };
      }
      return { data, error: null };
    } catch (err: any) {
      console.warn("Supabase savePost error:", err);
      return { data: null, error: err };
    }
  },

  // Fetch all saved posts for a user
  async fetchPosts(userId?: string): Promise<{ data: SupabaseSavedPost[] | null; error: any }> {
    try {
      const client = getSupabaseClient();
      let query = client.from("posts").select("*").order("updated_at", { ascending: false });
      
      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Supabase fetchPosts warning:", error.message);
        return { data: null, error };
      }
      return { data: data as SupabaseSavedPost[], error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  // Delete post by id
  async deletePost(postId: string): Promise<{ error: any }> {
    try {
      const client = getSupabaseClient();
      const { error } = await client.from("posts").delete().eq("id", postId);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  // Save/Update user profile in Supabase
  async saveProfile(userId: string, profile: {
    name: string;
    username: string;
    crp?: string;
    instagram?: string;
    email?: string;
  }): Promise<{ data: any; error: any }> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.from("profiles").upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      });
      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  // Get user profile from Supabase
  async getProfile(userId: string): Promise<{ data: any; error: any }> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.from("profiles").select("*").eq("id", userId).single();
      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },
};
