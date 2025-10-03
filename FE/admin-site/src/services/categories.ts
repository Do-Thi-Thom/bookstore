import { getApiUrl } from '../config';
import type { Category, PaginatedResponse } from '../types';

function getAuthHeaders(): HeadersInit {
	const token = localStorage.getItem('auth_token');
	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
	};
}

export type CreateCategoryRequest = {
	name: string;
	description?: string;
};

export type CategoryApiResponse = {
	id: number;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	bookTotal?: number;
	books?: any[];
};

export async function getCategories(pageIndex = 0, pageSize = 10): Promise<PaginatedResponse<Category>> {
	const url = getApiUrl(`/admin/categories?pageIndex=${encodeURIComponent(pageIndex)}&pageSize=${encodeURIComponent(pageSize)}`);

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

		throw new Error(apiMessage || 'Lấy danh sách danh mục thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Lấy danh sách danh mục thất bại');
		}
	}

	if (!payload?.data || !Array.isArray(payload?.data?.items)) {
		throw new Error('Dữ liệu phản hồi không hợp lệ');
	}

	const items: Category[] = payload.data.items.map((item: CategoryApiResponse) => ({
		id: item.id.toString(),
		name: item.name,
		description: item.description,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
		bookTotal: typeof item.bookTotal === 'number' ? item.bookTotal : (Array.isArray(item.books) ? item.books.length : 0),
		bookCount: Array.isArray(item.books) ? item.books.length : undefined,
	}));

	return {
		items,
		pageIndex: Number(payload.data.pageIndex) ?? pageIndex,
		pageSize: Number(payload.data.pageSize) ?? pageSize,
		totalItems: Number(payload.data.totalItems) ?? items.length,
		totalPages: Number(payload.data.totalPages) ?? 1,
		emptyCategory: typeof payload.data.emptyCategory === 'number' ? Number(payload.data.emptyCategory) : undefined,
		notEmptyCategory: typeof payload.data.notEmptyCategory === 'number' ? Number(payload.data.notEmptyCategory) : undefined,
	};
}

export async function createCategory(request: CreateCategoryRequest): Promise<void> {
	const url = getApiUrl('/admin/categories');

	const response = await fetch(url, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(request),
	});

	let payload: any = undefined;
	try {
		payload = await response.json();
	} catch {}

	if (!response.ok) {
		const apiMessage = payload?.message;

		throw new Error(apiMessage || 'Tạo danh mục thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Tạo danh mục thất bại');
		}
	}

	return;
}

export async function updateCategory(id: string | number, request: CreateCategoryRequest): Promise<Category> {
	const url = getApiUrl(`/admin/categories/${encodeURIComponent(id)}`);

	const response = await fetch(url, {
		method: 'PUT',
		headers: getAuthHeaders(),
		body: JSON.stringify(request),
	});

	let payload: any = undefined;
	try {
		payload = await response.json();
	} catch {}

	if (!response.ok) {
		const apiMessage = payload?.message;

		throw new Error(apiMessage || 'Cập nhật danh mục thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Cập nhật danh mục thất bại');
		}
	}

	if (!payload?.data) {
		throw new Error('Dữ liệu phản hồi không hợp lệ');
	}

	const item: CategoryApiResponse = payload.data as CategoryApiResponse;

	return {
		id: item.id.toString(),
		name: item.name,
		description: item.description,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
		bookTotal: typeof item.bookTotal === 'number' ? item.bookTotal : (Array.isArray(item.books) ? item.books.length : 0),
		bookCount: Array.isArray(item.books) ? item.books.length : undefined,
	};
}

export async function deleteCategory(id: string | number): Promise<void> {
	const url = getApiUrl(`/admin/categories/${encodeURIComponent(id)}`);

	const response = await fetch(url, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});

	let payload: any = undefined;
	try {
		payload = await response.json();
	} catch {}

	if (!response.ok) {
		const apiMessage = payload?.message;

		throw new Error(apiMessage || 'Xóa danh mục thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Xóa danh mục thất bại');
		}
	}

	return;
}

export async function getAllCategories(): Promise<Category[]> {
	const url = getApiUrl('/admin/categories?pageIndex=0&pageSize=1000'); // Get all categories

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
		throw new Error(apiMessage || 'Lấy danh sách danh mục thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Lấy danh sách danh mục thất bại');
		}
	}

	if (!payload?.data || !Array.isArray(payload?.data?.items)) {
		throw new Error('Dữ liệu phản hồi không hợp lệ');
	}

	return payload.data.items.map((item: CategoryApiResponse) => ({
		id: item.id.toString(),
		name: item.name,
		description: item.description,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
		bookTotal: typeof item.bookTotal === 'number' ? item.bookTotal : (Array.isArray(item.books) ? item.books.length : 0),
		bookCount: Array.isArray(item.books) ? item.books.length : undefined,
	}));
}
