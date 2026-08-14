import axios from 'axios';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30_000,
  headers: {
    Accept: 'application/json',
  },
});

export class ApiError extends Error {
  constructor(message, { status, data, cause } = {}) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function normalizeApiError(error) {
  if (!axios.isAxiosError(error)) {
    return new ApiError('An unexpected error occurred. Please try again.', {
      cause: error,
    });
  }
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiError('The request timed out. Please try again.', { cause: error });
  }
  if (!error.response) {
    return new ApiError(
      'Unable to reach the API. Check that the backend is running.',
      { cause: error },
    );
  }

  const detail = error.response.data?.detail || error.response.data?.error?.message;
  const message = getApiErrorDetail(detail);
  return new ApiError(message, {
    status: error.response.status,
    data: error.response.data,
    cause: error,
  });
}

function getApiErrorDetail(detail) {
  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail) && typeof detail[0]?.msg === 'string') {
    return detail[0].msg;
  }
  return 'The API could not complete the request. Please try again.';
}

async function request(config) {
  try {
    const response = await api.request(config);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export function uploadPhotoCollection({ images, onUploadProgress }) {
  const formData = new FormData();
  images.forEach((image) => formData.append('images', image.file || image));

  return request({
    method: 'post',
    url: '/persons',
    data: formData,
    onUploadProgress,
  });
}

export function searchPerson(file) {
  const formData = new FormData();
  formData.append('file', file);

  return request({
    method: 'post',
    url: '/search',
    data: formData,
  });
}

export function resetDatabase() {
  return request({ method: 'delete', url: '/reset' });
}

export function getPerson(personId) {
  return request({
    method: 'get',
    url: `/persons/${encodeURIComponent(personId)}`,
  });
}

export function getStorageUrl(imagePath) {
  if (!imagePath) {
    return '';
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return new URL(imagePath, `${apiBaseUrl}/`).toString();
}

export default api;
