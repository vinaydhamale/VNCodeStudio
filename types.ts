
export interface Template {
  id: string;
  name: string;
  price: number;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  description: string;
  templateCode: string;
  tags: string[]; // Added tags for automatic categorization
}

export interface CartItem extends Template {
  quantity: number;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: Template[];
  total: number;
}

export type AuthMode = 'login' | 'signup';
export type ViewMode = 'home' | 'orders';
