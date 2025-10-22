export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string | null;  // ← Ajoute "| null"
  role: 'client' | 'partner';
  created_at: string;
}


export interface Partner {
  id: string;
  user_id?: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone?: string;
  email?: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  partner_id: string;
  service_type: 'standard' | 'express' | 'ultra';
  weight: number;
  total_price: number;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  partner?: Partner;
}

export interface OrderPhoto {
  id: string;
  order_id: string;
  photo_url: string;
  photo_type: 'before' | 'after';
  created_at: string;
}