import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface TryOnSession {
  id: string;
  user_id: string;
  glasses_id: string;
  screenshot_url: string;
  adjustments: {
    scale: number;
    offsetX: number;
    offsetY: number;
    rotation: number;
  };
  created_at: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  face_shape: string;
  preferred_styles: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Supabase service functions
export class SupabaseService {
  // User management
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }

  // Try-on sessions
  async saveTryOnSession(session: Omit<TryOnSession, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('try_on_sessions')
      .insert([session])
      .select()
      .single();
    return { data, error };
  }

  async getTryOnSessions(userId: string) {
    const { data, error } = await supabase
      .from('try_on_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async deleteTryOnSession(sessionId: string) {
    const { error } = await supabase
      .from('try_on_sessions')
      .delete()
      .eq('id', sessionId);
    return { error };
  }

  // User preferences
  async saveUserPreference(preference: Omit<UserPreference, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert([preference], { onConflict: 'user_id' })
      .select()
      .single();
    return { data, error };
  }

  async getUserPreference(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  }

  // Product reviews
  async saveProductReview(review: Omit<ProductReview, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('product_reviews')
      .insert([review])
      .select()
      .single();
    return { data, error };
  }

  async getProductReviews(productId: string) {
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        *,
        users:user_id (email)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  // File upload for screenshots
  async uploadScreenshot(file: File, userId: string) {
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('screenshots')
      .upload(fileName, file);
    return { data, error };
  }

  async getScreenshotUrl(filePath: string) {
    const { data } = supabase.storage
      .from('screenshots')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Real-time subscriptions
  subscribeToTryOnSessions(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('try_on_sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'try_on_sessions',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }

  // Analytics
  async trackEvent(eventName: string, properties: any) {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert([{
        event_name: eventName,
        properties,
        user_id: (await this.getCurrentUser()).user?.id,
        timestamp: new Date().toISOString(),
      }]);
    return { data, error };
  }
}

export default new SupabaseService(); 