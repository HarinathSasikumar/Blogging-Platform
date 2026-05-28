import api from './axios';

export const getUserProfile = (id) => api.get(`/users/${id}`);
export const getUserPosts = (id) => api.get(`/users/${id}/posts`);
export const uploadImage = (formData) =>
  api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getAllUsers = () => api.get('/users');
