export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  coverImage: string;
  stockQuantity: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Prefer bookTotal from API; keep bookCount for backward compatibility
  bookTotal?: number;
  bookCount?: number;
};

export type OrderItem = {
  id: string;
  bookId: string;
  bookTitle: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type User = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  role: 'admin' | 'customer';
  createdAt: string;
  updatedAt: string;
};

export type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: MenuItem[];
};

export type AuthUser = {
  id: string;
  username: string;
  role: 'admin' | 'customer';
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
  profile?: {
    fullName?: string;
    email?: string;
    username?: string;
    role?: string;
  };
};

export type LoginApiData = {
  token: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
};

// Common pagination response
export type PaginatedResponse<TItem> = {
	items: TItem[];
	pageIndex: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	// Optional aggregate fields that some endpoints (e.g., categories) may provide
	emptyCategory?: number;
	notEmptyCategory?: number;
	// Optional aggregate fields for orders
	pendingOrders?: number;
	processingOrders?: number;
	totalRevenue?: number;
	// Optional aggregate fields for users
	activeAccounts?: number;
	adminCount?: number;
	customerCount?: number;
};
