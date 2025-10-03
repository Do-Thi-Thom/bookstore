import { getApiUrl } from '../config';
import type { PaginatedResponse } from '../types';

function getAuthHeaders(): HeadersInit {
	const token = localStorage.getItem('auth_token');
	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
	};
}

export type OrderApiResponse = {
	id: number;
	orderNumber: string;
	recipientName: string;
	recipientPhone: string;
	recipientAddress: string;
	totalAmount: number;
	status: string;
	statusDisplayName: string;
	notes?: string;
	orderItems: Array<{
		id: number;
		bookId: number;
		bookTitle: string;
		bookAuthor: string;
		bookCoverImage: string;
		quantity: number;
		price: number;
		createdAt: string;
		updatedAt: string;
	}>;
	createdAt: string;
	updatedAt: string;
};

export type Order = {
	id: string;
	orderNumber: string;
	customerName: string;
	customerPhone: string;
	customerAddress: string;
	status: 'pending' | 'processing' | 'completed' | 'cancelled';
	totalAmount: number;
	notes?: string;
	items: Array<{
		id: string;
		bookId: string;
		bookTitle: string;
		bookCoverImage: string;
		quantity: number;
		price: number;
		subtotal: number;
	}>;
	createdAt: string;
	updatedAt: string;
};

export async function getOrders(pageIndex = 0, pageSize = 10): Promise<PaginatedResponse<Order>> {
	const url = getApiUrl(`/admin/orders?pageIndex=${encodeURIComponent(pageIndex)}&pageSize=${encodeURIComponent(pageSize)}`);

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
		throw new Error(apiMessage || 'Lấy danh sách đơn hàng thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Lấy danh sách đơn hàng thất bại');
		}
	}

	if (!payload?.data || !Array.isArray(payload?.data?.items)) {
		throw new Error('Dữ liệu phản hồi không hợp lệ');
	}

	const items: Order[] = payload.data.items.map((item: OrderApiResponse) => ({
		id: item.id.toString(),
		orderNumber: item.orderNumber,
		customerName: item.recipientName,
		customerPhone: item.recipientPhone,
		customerAddress: item.recipientAddress,
		status: item.status.toLowerCase() as Order['status'],
		totalAmount: item.totalAmount,
		notes: item.notes,
		items: item.orderItems.map(orderItem => ({
			id: orderItem.id.toString(),
			bookId: orderItem.bookId.toString(),
			bookTitle: orderItem.bookTitle,
			bookCoverImage: orderItem.bookCoverImage,
			quantity: orderItem.quantity,
			price: orderItem.price,
			subtotal: orderItem.price * orderItem.quantity,
		})),
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	}));

	return {
		items,
		pageIndex: Number(payload.data.pageIndex) ?? pageIndex,
		pageSize: Number(payload.data.pageSize) ?? pageSize,
		totalItems: Number(payload.data.totalItems) ?? items.length,
		totalPages: Number(payload.data.totalPages) ?? 1,
		pendingOrders: Number(payload.data.pendingOrders) ?? 0,
		processingOrders: Number(payload.data.processingOrders) ?? 0,
		totalRevenue: Number(payload.data.totalRevenue) ?? 0,
	};
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
	const url = getApiUrl(`/admin/orders/${encodeURIComponent(orderId)}/status?status=${encodeURIComponent(status.toUpperCase())}`);

	const response = await fetch(url, {
		method: 'PUT',
		headers: getAuthHeaders(),
	});

	let payload: any = undefined;
	try {
		payload = await response.json();
	} catch {}

	if (!response.ok) {
		const apiMessage = payload?.message;
		throw new Error(apiMessage || 'Cập nhật trạng thái đơn hàng thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Cập nhật trạng thái đơn hàng thất bại');
		}
	}

	return;
}
