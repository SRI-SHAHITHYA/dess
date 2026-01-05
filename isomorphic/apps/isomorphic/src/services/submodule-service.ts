import { apiClient } from './api-client';

export interface Submodule {
  submodule_id: number;
  category_id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSubmoduleInput {
  category_id: number;
  name: string;
  description?: string;
  image_url?: string;
}

export interface UpdateSubmoduleInput extends Partial<CreateSubmoduleInput> {}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Transform submodule from backend to frontend format
function transformSubmodule(submodule: Submodule) {
  return {
    id: String(submodule.submodule_id),
    categoryId: submodule.category_id,
    name: submodule.name,
    description: submodule.description || '',
    image: submodule.image_url,
    updatedAt: submodule.updated_at,
  };
}

export const submoduleService = {
  // Get all submodules (for dropdowns, etc.)
  async getAll() {
    try {
      const response = await apiClient.get<ApiResponse<Submodule[]>>('/submodules');
      const submodules = response.data || response;
      return Array.isArray(submodules) ? submodules.map(transformSubmodule) : [];
    } catch (error) {
      console.error('Failed to fetch all submodules:', error);
      throw error;
    }
  },

  // Get all submodules for a category
  async getByCategoryId(categoryId: number) {
    try {
      const response = await apiClient.get<ApiResponse<Submodule[]>>(`/submodules/category/${categoryId}`);
      const submodules = response.data || response;
      return Array.isArray(submodules) ? submodules.map(transformSubmodule) : [];
    } catch (error) {
      console.error(`Failed to fetch submodules for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Get single submodule by ID
  async getById(id: number) {
    try {
      const response = await apiClient.get<ApiResponse<Submodule>>(`/submodules/${id}`);
      const submodule = response.data || response;
      return transformSubmodule(submodule as Submodule);
    } catch (error) {
      console.error(`Failed to fetch submodule ${id}:`, error);
      throw error;
    }
  },

  // Create new submodule
  async create(data: CreateSubmoduleInput) {
    try {
      const response = await apiClient.post<ApiResponse<Submodule>>('/submodules', data);
      const submodule = response.data || response;
      return transformSubmodule(submodule as Submodule);
    } catch (error) {
      console.error('Failed to create submodule:', error);
      throw error;
    }
  },

  // Update existing submodule
  async update(id: number, data: UpdateSubmoduleInput) {
    try {
      const response = await apiClient.put<ApiResponse<Submodule>>(`/submodules/${id}`, data);
      const submodule = response.data || response;
      return transformSubmodule(submodule as Submodule);
    } catch (error) {
      console.error(`Failed to update submodule ${id}:`, error);
      throw error;
    }
  },

  // Delete submodule
  async delete(id: number) {
    try {
      await apiClient.delete(`/submodules/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete submodule ${id}:`, error);
      throw error;
    }
  },
};
