// src/services/submoduleService.js
import api from "./api";

// Cache buster to force fresh data after mutations
let submoduleCacheVersion = Date.now();

export const invalidateSubmoduleCache = () => {
  submoduleCacheVersion = Date.now();
};

export const getSubmodulesByCategory = async (categoryId) => {
  // Add cache version to bypass stale browser cache
  const response = await api.get(`/api/submodules/category/${categoryId}?v=${submoduleCacheVersion}`);
  return response.data;
};

export const createSubmodule = async (submoduleData) => {
  const response = await api.post(`/api/submodules`, submoduleData);
  invalidateSubmoduleCache(); // Invalidate cache after creating
  return response.data;
};

export const updateSubmodule = async (submoduleId, submoduleData) => {
  const response = await api.put(`/api/submodules/${submoduleId}`, submoduleData);
  invalidateSubmoduleCache(); // Invalidate cache after updating
  return response.data;
};

export const deleteSubmodule = async (submoduleId) => {
  const response = await api.delete(`/api/submodules/${submoduleId}`);
  invalidateSubmoduleCache(); // Invalidate cache after deleting
  return response.data;
};
