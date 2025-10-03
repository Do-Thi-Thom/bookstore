export const API_BASE_URL = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const headers = { 
    'Content-Type': 'application/json', 
    ...(options.headers || {})
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const text = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        body: text
      });
      
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error(`Authentication failed: ${response.status}`);
      }
      
      // Try to parse JSON response to get message
      let errorMessage = response.statusText;
      try {
        const errorData = JSON.parse(text);
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        // If JSON parsing fails, use the raw text
        errorMessage = text || response.statusText;
      }
      
      throw new Error(errorMessage);
    }

    let data = null;
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        const text = await response.text();
        console.error('Raw response:', text);
        throw new Error(`JSON parsing error: ${jsonError.message}`);
      }
    } else {
      data = await response.text();
    }

    return data;
  } catch (error) {
    console.error('Request failed:', {
      url: url,
      error: error.message,
      options: options
    });
    throw error;
  }
}

export const apiClient = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
  baseUrl: API_BASE_URL,
};


