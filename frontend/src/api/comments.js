import api from './axios';

export const getComments = (postId) => api.get(`/comments/${postId}`);
export const addComment = (postId, data) => api.post(`/comments/${postId}`, data);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);
export const updateComment = (commentId, data) => api.put(`/comments/${commentId}`, data);
