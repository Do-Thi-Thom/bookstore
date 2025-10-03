import { getApiUrl } from '../config';
import type { Order } from './orders';

function getAuthHeaders(): HeadersInit {
	const token = localStorage.getItem('auth_token');
	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
	};
}

export type BookStats = {
	totalBooks: number;
	growthRate: number;
	increase: boolean;
};

export type OrderStats = {
	newOrders: number;
	growthRate: number;
	increase: boolean;
};

export type CustomerStats = {
	totalCustomers: number;
	growthRate: number;
	increase: boolean;
};

export type RevenueStats = {
	monthlyRevenue: number;
	growthRate: number;
	increase: boolean;
};

export type LowStockBook = {
	id: number;
	title: string;
	author: string;
	price: number;
	description: string;
	coverImage: string;
	stockQuantity: number;
	category: {
		id: number;
		name: string;
		description: string;
		createdAt: string;
		updatedAt: string;
		books: string[];
	};
	createdAt: string;
	updatedAt: string;
};

export type DashboardStats = {
	bookStats: BookStats;
	orderStats: OrderStats;
	customerStats: CustomerStats;
	revenueStats: RevenueStats;
	recentOrders: Order[];
	lowStockBooks: LowStockBook[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
	const url = getApiUrl('/admin/dashboard/stats');

	const response = await fetch(url, {
		method: 'GET',
		headers: getAuthHeaders(),
	});

	let payload: any = undefined;
	try {
		payload = await response.json();
	} catch {}

	if (!response.ok) {
		const apiMessage = payload?.message;
		throw new Error(apiMessage || 'Lấy thống kê dashboard thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Lấy thống kê dashboard thất bại');
		}
	}

	if (!payload?.data) {
		throw new Error('Dữ liệu phản hồi không hợp lệ');
	}

	const data = payload.data;

	// Map recent orders to Order type
	const recentOrders: Order[] = data.recentOrders.map((order: any) => ({
		id: order.id.toString(),
		orderNumber: order.orderNumber,
		customerName: order.recipientName,
		customerPhone: order.recipientPhone,
		customerAddress: order.recipientAddress,
		status: order.status.toLowerCase(),
		totalAmount: order.totalAmount,
		notes: order.notes,
		items: order.orderItems.map((item: any) => ({
			id: item.id.toString(),
			bookId: item.bookId.toString(),
			bookTitle: item.bookTitle,
			bookCoverImage: item.bookCoverImage,
			quantity: item.quantity,
			price: item.price,
			subtotal: item.price * item.quantity,
		})),
		createdAt: order.createdAt,
		updatedAt: order.updatedAt,
	}));

	return {
		bookStats: data.bookStats,
		orderStats: data.orderStats,
		customerStats: data.customerStats,
		revenueStats: data.revenueStats,
		recentOrders,
		lowStockBooks: data.lowStockBooks,
	};
}
