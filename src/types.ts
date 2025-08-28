export interface Property {
  id: string;
  title: string;
  type: 'terrain' | 'maison' | 'chambre' | 'studio' | 'appartement' | 'lot';
  price: number;
  location: string;
  area: number;
  description: string;
  images: string[];
  video?: string;
  features: string[];
  status: 'disponible' | 'vendu' | 'réservé';
  coordinates: {
    lat: number;
    lng: number;
  };
  agent: {
    name: string;
    phone: string;
    whatsapp: string;
  };
  lots?: Lot[];
  created_at: string;
  updated_at: string;
}

export interface Lot {
  id: string;
  property_id: string;
  lot_number: string;
  price: number;
  area: number;
  status: 'disponible' | 'vendu' | 'réservé';
  coordinates: {
    lat: number;
    lng: number;
  };
  polygon_coordinates: Array<{lat: number; lng: number}>;
  reserved_until?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  favorites: string[];
  role: 'client' | 'agent' | 'admin';
  created_at: string;
  payment_history: Payment[];
  installment_plans: InstallmentPlan[];
}

export interface Payment {
  id: string;
  property_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'full' | 'installments';
  created_at: string;
  installment_plan?: InstallmentPlan;
}

export interface InstallmentPlan {
  id: string;
  property_id: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  monthly_payment: number;
  next_payment_date: string;
  completion_percentage: number;
}

export interface FilterOptions {
  type: string;
  minPrice: number;
  maxPrice: number;
  location: string;
  status: string;
  minArea: number;
  maxArea: number;
  sortBy: 'price_asc' | 'price_desc' | 'date_desc' | 'area_asc' | 'area_desc';
}