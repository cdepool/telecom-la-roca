export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  category: string;
  images: string[];
  is_pod: boolean;
  is_active: boolean;
  stock: number;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  base_price: number;
  duration_minutes: number;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string | null;
  service_id: string;
  scheduled_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  device_info: string;
  notes: string;
  ghl_synced: boolean;
  created_at: string;
  service?: Service;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customDesign?: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  total_amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_intent_id: string;
  stripe_session_id: string;
  items: CartItem[];
  shipping_address: ShippingAddress;
  customer_email: string;
  created_at: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Design {
  id: string;
  user_id: string | null;
  name: string;
  canvas_data: object;
  preview_url: string;
  product_type: string;
  created_at: string;
}
