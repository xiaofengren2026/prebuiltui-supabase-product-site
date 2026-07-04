export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          price: number;
          category: string[] | null;
          materials: string[] | null;
          customer_name: string;
          email: string;
          phone: string;
          address: string;
          note: string | null;
          payment_status: string;
          shipping_status: string;
          payment_method: string;
          payment_id: string | null;
          tracking_company: string | null;
          tracking_number: string | null;
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          price: number;
          category?: string[] | null;
          materials?: string[] | null;
          customer_name: string;
          email: string;
          phone: string;
          address: string;
          note?: string | null;
          payment_status?: string;
          shipping_status?: string;
          payment_method?: string;
          payment_id?: string | null;
          tracking_company?: string | null;
          tracking_number?: string | null;
          admin_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          price?: number;
          category?: string[] | null;
          materials?: string[] | null;
          customer_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          note?: string | null;
          payment_status?: string;
          shipping_status?: string;
          payment_method?: string;
          payment_id?: string | null;
          tracking_company?: string | null;
          tracking_number?: string | null;
          admin_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      page_views: {
        Row: {
          id: string;
          path: string;
          page_type: string;
          product_id: string | null;
          product_name: string | null;
          visitor_id: string;
          user_agent: string | null;
          referrer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          path: string;
          page_type: string;
          product_id?: string | null;
          product_name?: string | null;
          visitor_id: string;
          user_agent?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          path?: string;
          page_type?: string;
          product_id?: string | null;
          product_name?: string | null;
          visitor_id?: string;
          user_agent?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          price: number;
          category: string[] | null;
          materials: string[] | null;
          short_description: string | null;
          description: string | null;
          material: string | null;
          size: string | null;
          color: string | null;
          tags: string[] | null;
          images: Json | null;
          is_active: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          price: number;
          category?: string[] | null;
          materials?: string[] | null;
          short_description?: string | null;
          description?: string | null;
          material?: string | null;
          size?: string | null;
          color?: string | null;
          tags?: string[] | null;
          images?: string[] | null;
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          price?: number;
          category?: string[] | null;
          materials?: string[] | null;
          short_description?: string | null;
          description?: string | null;
          material?: string | null;
          size?: string | null;
          color?: string | null;
          tags?: string[] | null;
          images?: string[] | null;
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          brand_name: string | null;
          hero_title: string | null;
          hero_subtitle: string | null;
          hero_image: string | null;
          hero_primary_button_text: string | null;
          hero_secondary_button_text: string | null;
          brand_intro_title: string | null;
          brand_intro_text: string | null;
          feature_1_title: string | null;
          feature_1_text: string | null;
          feature_2_title: string | null;
          feature_2_text: string | null;
          feature_3_title: string | null;
          feature_3_text: string | null;
          contact_email: string | null;
          instagram_url: string | null;
          kakao_url: string | null;
          whatsapp_url: string | null;
          footer_text: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_name?: string | null;
          hero_title?: string | null;
          hero_subtitle?: string | null;
          hero_image?: string | null;
          hero_primary_button_text?: string | null;
          hero_secondary_button_text?: string | null;
          brand_intro_title?: string | null;
          brand_intro_text?: string | null;
          feature_1_title?: string | null;
          feature_1_text?: string | null;
          feature_2_title?: string | null;
          feature_2_text?: string | null;
          feature_3_title?: string | null;
          feature_3_text?: string | null;
          contact_email?: string | null;
          instagram_url?: string | null;
          kakao_url?: string | null;
          whatsapp_url?: string | null;
          footer_text?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_name?: string | null;
          hero_title?: string | null;
          hero_subtitle?: string | null;
          hero_image?: string | null;
          hero_primary_button_text?: string | null;
          hero_secondary_button_text?: string | null;
          brand_intro_title?: string | null;
          brand_intro_text?: string | null;
          feature_1_title?: string | null;
          feature_1_text?: string | null;
          feature_2_title?: string | null;
          feature_2_text?: string | null;
          feature_3_title?: string | null;
          feature_3_text?: string | null;
          contact_email?: string | null;
          instagram_url?: string | null;
          kakao_url?: string | null;
          whatsapp_url?: string | null;
          footer_text?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
