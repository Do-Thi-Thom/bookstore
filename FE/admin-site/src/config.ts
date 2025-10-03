export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

export function getApiUrl(path: string): string {
	if (!path) {
		
		return API_BASE_URL;
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	
	return `${API_BASE_URL}${normalizedPath}`;
}
