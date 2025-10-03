import { getApiUrl } from '../config';
import type { PaginatedResponse } from '../types';

function getAuthHeaders(): HeadersInit {
	const token = localStorage.getItem('auth_token');
	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
	};
}

export type UserApiResponse = {
	id: number;
	username: string;
	email: string;
	fullName: string;
	role: string;
	enabled: boolean;
	createdAt: string;
	updatedAt: string;
};

export type User = {
	id: string;
	username: string;
	email: string;
	fullName: string;
	role: string;
	enabled: boolean;
	createdAt: string;
	updatedAt: string;
};

export async function getUsers(pageIndex = 0, pageSize = 10): Promise<PaginatedResponse<User>> {
	const url = getApiUrl(`/admin/users?pageIndex=${encodeURIComponent(pageIndex)}&pageSize=${encodeURIComponent(pageSize)}`);

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
		throw new Error(apiMessage || 'Lấy danh sách người dùng thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Lấy danh sách người dùng thất bại');
		}
	}

	if (!payload?.data || !Array.isArray(payload?.data?.items)) {
		throw new Error('Dữ liệu phản hồi không hợp lệ');
	}

	const items: User[] = payload.data.items.map((item: UserApiResponse) => ({
		id: item.id.toString(),
		username: item.username,
		email: item.email,
		fullName: item.fullName,
		role: item.role,
		enabled: item.enabled,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	}));

	return {
		items,
		pageIndex: Number(payload.data.pageIndex) ?? pageIndex,
		pageSize: Number(payload.data.pageSize) ?? pageSize,
		totalItems: Number(payload.data.totalItems) ?? items.length,
		totalPages: Number(payload.data.totalPages) ?? 1,
		activeAccounts: Number(payload.data.activeAccounts) ?? 0,
		adminCount: Number(payload.data.adminCount) ?? 0,
		customerCount: Number(payload.data.customerCount) ?? 0,
	};
}

export async function toggleUserStatus(userId: string): Promise<User> {
	const url = getApiUrl(`/admin/users/${encodeURIComponent(userId)}/toggle-status`);

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
		throw new Error(apiMessage || 'Cập nhật trạng thái người dùng thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Cập nhật trạng thái người dùng thất bại');
		}
	}

	if (!payload?.data) {
		throw new Error('Dữ liệu phản hồi không hợp lệ');
	}

	const userData: UserApiResponse = payload.data;
	return {
		id: userData.id.toString(),
		username: userData.username,
		email: userData.email,
		fullName: userData.fullName,
		role: userData.role,
		enabled: userData.enabled,
		createdAt: userData.createdAt,
		updatedAt: userData.updatedAt,
	};
}
