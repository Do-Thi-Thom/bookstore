import { getApiUrl } from '../config';
import type { Book, PaginatedResponse } from '../types';

function getAuthHeaders(): HeadersInit {
	const token = localStorage.getItem('auth_token');
	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
	};
}

export type CreateBookRequest = {
	title: string;
	author: string;
	price: number;
	description?: string;
	coverImage?: File;
	stockQuantity: number;
	categoryId: string | number;
};

export type BookApiResponse = {
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

export type BooksApiData = {
	books: BookApiResponse[];
	pageIndex: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	lowStockBooks: number;
	totalInventoryValue: number;
};

export async function getBooks(pageIndex = 0, pageSize = 10): Promise<PaginatedResponse<Book> & { lowStockBooks: number; totalInventoryValue: number }> {
	const url = getApiUrl(`/admin/books?pageIndex=${encodeURIComponent(pageIndex)}&pageSize=${encodeURIComponent(pageSize)}`);

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
		throw new Error(apiMessage || 'Lấy danh sách sách thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Lấy danh sách sách thất bại');
		}
	}

	if (!payload?.data || !Array.isArray(payload?.data?.books)) {
		throw new Error('Dữ liệu phản hồi không hợp lệ');
	}

	const items: Book[] = payload.data.books.map((item: BookApiResponse) => ({
		id: item.id.toString(),
		title: item.title,
		author: item.author,
		price: item.price,
		description: item.description,
		coverImage: item.coverImage,
		stockQuantity: item.stockQuantity,
		categoryId: item.category?.id?.toString() || '',
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	}));

	return {
		items,
		pageIndex: Number(payload.data.pageIndex) ?? pageIndex,
		pageSize: Number(payload.data.pageSize) ?? pageSize,
		totalItems: Number(payload.data.totalItems) ?? items.length,
		totalPages: Number(payload.data.totalPages) ?? 1,
		lowStockBooks: Number(payload.data.lowStockBooks) ?? 0,
		totalInventoryValue: Number(payload.data.totalInventoryValue) ?? 0,
	};
}

export async function createBook(request: CreateBookRequest): Promise<void> {
	const url = getApiUrl('/admin/books');

	// Handle file upload with FormData
	const formData = new FormData();
	formData.append('title', request.title);
	formData.append('author', request.author);
	formData.append('price', request.price.toString());
	formData.append('stockQuantity', request.stockQuantity.toString());
	formData.append('categoryId', request.categoryId.toString());
	
	if (request.description) {
		formData.append('description', request.description);
	}
	
	if (request.coverImage) {
		formData.append('coverImage', request.coverImage);
	}

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			...(localStorage.getItem('auth_token') && { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }),
		},
		body: formData,
	});

	let payload: any = undefined;
	try {
		payload = await response.json();
	} catch {}

	if (!response.ok) {
		const apiMessage = payload?.message;
		throw new Error(apiMessage || 'Tạo sách thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Tạo sách thất bại');
		}
	}

	return;
}

export async function updateBook(id: string | number, request: CreateBookRequest): Promise<Book> {
	const url = getApiUrl(`/admin/books/${encodeURIComponent(id)}`);

	// Handle file upload with FormData
	const formData = new FormData();
	formData.append('title', request.title);
	formData.append('author', request.author);
	formData.append('price', request.price.toString());
	formData.append('stockQuantity', request.stockQuantity.toString());
	formData.append('categoryId', request.categoryId.toString());
	
	if (request.description) {
		formData.append('description', request.description);
	}
	
	if (request.coverImage) {
		formData.append('coverImage', request.coverImage);
	}

	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			...(localStorage.getItem('auth_token') && { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }),
		},
		body: formData,
	});

	let payload: any = undefined;
	try {
		payload = await response.json();
	} catch {}

	if (!response.ok) {
		const apiMessage = payload?.message;
		throw new Error(apiMessage || 'Cập nhật sách thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Cập nhật sách thất bại');
		}
	}

	if (!payload?.data) {
		throw new Error('Dữ liệu phản hồi không hợp lệ');
	}

	const item: BookApiResponse = payload.data as BookApiResponse;

	return {
		id: item.id.toString(),
		title: item.title,
		author: item.author,
		price: item.price,
		description: item.description,
		coverImage: item.coverImage,
		stockQuantity: item.stockQuantity,
		categoryId: item.category?.id?.toString() || '',
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	};
}

export async function deleteBook(id: string | number): Promise<void> {
	const url = getApiUrl(`/admin/books/${encodeURIComponent(id)}`);

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
		throw new Error(apiMessage || 'Xóa sách thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Xóa sách thất bại');
		}
	}

	return;
}
