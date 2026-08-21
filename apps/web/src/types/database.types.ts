export type UserRole = 'customer' | 'provider' | 'admin';
export type BookingStatus = 'pending' | 'assigned' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';
export type TransactionStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string; // UUID from auth.users
          name: string;
          phone: string | null;
          role: string;
          location: string | null;
          is_verified: boolean;
          created_at: string;
        };
      };
      providers: {
        Row: {
          id: string; // UUID from users
          is_verified: boolean;
          bio: string | null;
          rating: number;
          total_jobs: number;
          is_active: boolean;
          created_at: string;
        };
      };
      service_categories: {
        Row: {
          id: string;
          name: string;
          icon: string | null;
          promise_bullets: string[] | null;
          created_at: string;
        };
      };
      services: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          price: number;
          duration_mins: number;
          rating: number;
          review_count_text: string | null;
          bullets: string[] | null;
          before_image_url: string | null;
          after_image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          provider_id: string | null;
          service_id: string;
          status: BookingStatus;
          address: string;
          scheduled_for: string | null;
          actual_start_time: string | null;
          actual_end_time: string | null;
          estimated_arrival_window: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          booking_id: string;
          amount: number;
          platform_fee: number;
          provider_payout: number;
          status: TransactionStatus;
          payment_method: string | null;
          created_at: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          provider_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
      };
    };
  };
}
