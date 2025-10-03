import { getApiUrl } from '../config';
import type { RegisterRequest, LoginRequest, AuthResponse, LoginApiData } from '../types';

export async function registerAdmin(request: RegisterRequest): Promise<void> {
	const url = getApiUrl('/auth/register/admin');

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: request.username,
			password: request.password,
			fullName: request.fullName,
			email: request.email,
			phone: request.phone,
			address: request.address,
		}),
	});

	let payload: any = undefined;
	try {
		payload = await response.json();
	} catch {}

	if (!response.ok) {
		const apiMessage = payload?.message;

		throw new Error(apiMessage || 'Đăng ký thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Đăng ký thất bại');
		}
	}

	return;
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
	const url = getApiUrl('/auth/login');

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: request.username,
			password: request.password,
		}),
	});

	let payload: any = undefined;
	try {
		payload = await response.json();
	} catch {}

	if (!response.ok) {
		const apiMessage = payload?.message;

		throw new Error(apiMessage || 'Đăng nhập thất bại');
	}

	if (payload && typeof payload === 'object') {
		if (payload.success === false) {
			throw new Error(payload.message || 'Đăng nhập thất bại');
		}
	}

	const data: LoginApiData | undefined = payload?.data;
	if (!data || !data.token || !data.username || !data.role) {
		throw new Error('Dữ liệu phản hồi không hợp lệ');
	}

	const normalizedRole = (data.role || '').toLowerCase() === 'admin' ? 'admin' : 'customer';

	return {
		user: {
			id: data.username,
			username: data.username,
			role: normalizedRole,
		},
		token: data.token,
		profile: {
			fullName: payload?.data?.fullName,
			email: payload?.data?.email,
			username: data.username,
			role: data.role,
		},
	};
}
