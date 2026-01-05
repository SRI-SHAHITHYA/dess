// src/services/moduleService.js
import api from "./api";

// Cache buster to force fresh data after mutations
let moduleCacheVersion = Date.now();

export const invalidateModuleCache = () => {
  moduleCacheVersion = Date.now();
};

export const getModulesByCategory = async (categoryId) => {
  // Add cache version to bypass stale browser cache
  const response = await api.get(`/api/modules/${categoryId}?v=${moduleCacheVersion}`);
  return response.data;
};

export const createModule = async (moduleData) => {
  const response = await api.post(`/api/modules`, moduleData);
  invalidateModuleCache(); // Invalidate cache after creating
  return response.data;
};

export const updateModule = async (moduleId, moduleData) => {
  const response = await api.put(`/api/modules/${moduleId}`, moduleData);
  invalidateModuleCache(); // Invalidate cache after updating
  return response.data;
};

export const deleteModule = async (moduleId) => {
  const response = await api.delete(`/api/modules/${moduleId}`);
  invalidateModuleCache(); // Invalidate cache after deleting
  return response.data;
};
