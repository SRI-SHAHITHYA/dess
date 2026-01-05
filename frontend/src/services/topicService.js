// src/services/topicService.js
import api from "./api";

// Cache buster to force fresh data after mutations
let topicCacheVersion = Date.now();

export const invalidateTopicCache = () => {
  topicCacheVersion = Date.now();
};

export const getTopicsBySubmodule = async (submoduleId) => {
  // Add cache version to bypass stale browser cache
  const response = await api.get(`/api/topics/${submoduleId}?v=${topicCacheVersion}`);
  return response.data;
};

export const getTopicsByModule = async (moduleId) => {
  // Add cache version to bypass stale browser cache
  const response = await api.get(`/api/topics/module/${moduleId}?v=${topicCacheVersion}`);
  return response.data;
};

export const createTopic = async (topicData) => {
  const response = await api.post(`/api/topics`, topicData);
  invalidateTopicCache(); // Invalidate cache after creating
  return response.data;
};

export const updateTopic = async (topicId, topicData) => {
  const response = await api.put(`/api/topics/${topicId}`, topicData);
  invalidateTopicCache(); // Invalidate cache after updating
  return response.data;
};

export const deleteTopic = async (topicId) => {
  const response = await api.delete(`/api/topics/${topicId}`);
  invalidateTopicCache(); // Invalidate cache after deleting
  return response.data;
};
