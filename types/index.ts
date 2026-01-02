// ====================================================================
// 🔥 TYPES TYPESCRIPT STRICTS (Adieu les 'any')
// ====================================================================

/**
 * Database Tables Types
 */
export type OrderStatus = 
  | 'pending' 
  | 'assigned' 
  | 'in_progress' 
  | 'ready' 
  | 'completed' 
  | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  partner_id: string | null;
  weight: number;
  total_price: number;
  status: OrderStatus;
  pickup_address: string;
  pickup_date: string;
  delivery_date: string;
  payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
  partner?: {
    company_name: string;
    city?: string;
  };
}

export interface Partner {
  id: string;
  user_id: string;
  company_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  siret: string | null;
  capacity_kg_per_day: number;
  is_active: boolean;
  average_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerWithStats extends Partner {
  totalOrders: number;
  totalRevenue: number;
  rating: number;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface SupportResponse {
  id: string;
  message_id: string;
  response: string;
  admin_email: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_login: string | null;
}

export interface ErrorLog {
  id: string;
  error_type: 'javascript' | 'react' | 'api' | 'payment';
  message: string;
  stack_trace: string | null;
  user_id: string | null;
  user_agent: string | null;
  url: string | null;
  severity: 'info' | 'warning' | 'error' | 'critical';
  metadata: Record<string, any> | null;
  resolved: boolean;
  created_at: string;
}

/**
 * Stats Types
 */
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activePartners: number;
  pending: number;
  newMessages: number;
  totalUsers: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

export interface CityData {
  name: string;
  value: number;
  orders: number;
}

export interface StatusData {
  name: string;
  value: number;
  color: string;
}

/**
 * API Response Types
 */
export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

export interface SupabaseError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

/**
 * Form Types
 */
export interface NewOrderForm {
  weight: number;
  pickup_address: string;
  pickup_date: string;
  delivery_date: string;
}

export interface PartnerRegistrationForm {
  company_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  siret?: string;
  capacity_kg_per_day: number;
}

/**
 * Component Props Types
 */
export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  suffix?: string;
  badge?: number;
}

/**
 * Utility Types
 */
export type TimeRange = '7d' | '30d' | '90d' | 'all';

export type DashboardTab = 
  | 'overview' 
  | 'messages' 
  | 'users' 
  | 'partners' 
  | 'cities' 
  | 'orders';

/**
 * Type Guards
 */
export const isOrder = (obj: any): obj is Order => {
  return obj && typeof obj.id === 'string' && typeof obj.total_price === 'number';
};

export const isPartner = (obj: any): obj is Partner => {
  return obj && typeof obj.id === 'string' && typeof obj.company_name === 'string';
};

export const isOrderStatus = (status: string): status is OrderStatus => {
  return ['pending', 'assigned', 'in_progress', 'ready', 'completed', 'cancelled'].includes(status);
};