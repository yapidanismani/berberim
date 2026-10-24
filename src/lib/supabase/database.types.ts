export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string;
          booking_time: string;
          business_id: string;
          created_at: string;
          customer_name: string;
          customer_phone: string;
          id: string;
          note: string | null;
          service_id: string | null;
          staff_id: string | null;
          status: string;
        };
        Insert: {
          booking_date: string;
          booking_time: string;
          business_id: string;
          created_at?: string;
          customer_name: string;
          customer_phone: string;
          id?: string;
          note?: string | null;
          service_id?: string | null;
          staff_id?: string | null;
          status?: string;
        };
        Update: {
          booking_date?: string;
          booking_time?: string;
          business_id?: string;
          created_at?: string;
          customer_name?: string;
          customer_phone?: string;
          id?: string;
          note?: string | null;
          service_id?: string | null;
          staff_id?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      businesses: {
        Row: {
          about: string | null;
          address: string | null;
          city: string;
          cover_url: string | null;
          logo_url: string | null;
          created_at: string;
          district: string;
          featured: boolean;
          gallery: string[];
          id: string;
          name: string;
          owner_id: string | null;
          phone: string | null;
          price_level: number;
          rating: number;
          review_count: number;
          slug: string;
          tagline: string | null;
        };
        Insert: {
          about?: string | null;
          address?: string | null;
          city: string;
          cover_url?: string | null;
          logo_url?: string | null;
          created_at?: string;
          district: string;
          featured?: boolean;
          gallery?: string[];
          id?: string;
          name: string;
          owner_id?: string | null;
          phone?: string | null;
          price_level?: number;
          rating?: number;
          review_count?: number;
          slug: string;
          tagline?: string | null;
        };
        Update: {
          about?: string | null;
          address?: string | null;
          city?: string;
          cover_url?: string | null;
          logo_url?: string | null;
          created_at?: string;
          district?: string;
          featured?: boolean;
          gallery?: string[];
          id?: string;
          name?: string;
          owner_id?: string | null;
          phone?: string | null;
          price_level?: number;
          rating?: number;
          review_count?: number;
          slug?: string;
          tagline?: string | null;
        };
        Relationships: [];
      };
      services: {
        Row: {
          business_id: string;
          category: string;
          created_at: string;
          description: string | null;
          duration_min: number;
          id: string;
          name: string;
          price: number;
          sort_order: number;
        };
        Insert: {
          business_id: string;
          category: string;
          created_at?: string;
          description?: string | null;
          duration_min: number;
          id?: string;
          name: string;
          price: number;
          sort_order?: number;
        };
        Update: {
          business_id?: string;
          category?: string;
          created_at?: string;
          description?: string | null;
          duration_min?: number;
          id?: string;
          name?: string;
          price?: number;
          sort_order?: number;
        };
        Relationships: [];
      };
      staff: {
        Row: {
          business_id: string;
          created_at: string;
          id: string;
          initials: string | null;
          name: string;
          sort_order: number;
          title: string | null;
        };
        Insert: {
          business_id: string;
          created_at?: string;
          id?: string;
          initials?: string | null;
          name: string;
          sort_order?: number;
          title?: string | null;
        };
        Update: {
          business_id?: string;
          created_at?: string;
          id?: string;
          initials?: string | null;
          name?: string;
          sort_order?: number;
          title?: string | null;
        };
        Relationships: [];
      };
      working_hours: {
        Row: {
          business_id: string;
          close: string | null;
          day: number;
          id: string;
          open: string | null;
        };
        Insert: {
          business_id: string;
          close?: string | null;
          day: number;
          id?: string;
          open?: string | null;
        };
        Update: {
          business_id?: string;
          close?: string | null;
          day?: number;
          id?: string;
          open?: string | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      taken_slots: {
        Args: { p_business_id: string; p_date: string };
        Returns: {
          booking_time: string;
          staff_id: string | null;
          duration_min: number;
        }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
