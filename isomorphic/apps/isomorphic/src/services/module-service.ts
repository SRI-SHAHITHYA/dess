import { apiClient } from './api-client';

export interface Module {
  module_id: number;
  category_id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateModuleInput {
  categoryId: number;
  name: string;
  description?: string;
  image_url?: string;
}

export interface UpdateModuleInput extends Partial<CreateModuleInput> {}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Transform module from backend to frontend format
function transformModule(module: Module) {
  return {
    id: String(module.module_id),
    categoryId: module.category_id,
    name: module.name,
    description: module.description || '',
    image: module.image_url,
    updatedAt: module.updated_at,
  };
}

export const moduleService = {
  // Get all modules (fetches from all standalone categories)
  async getAll() {
    try {
      // First get all standalone categories
      const { categoryService } = await import('./category-service');
      const categories = await categoryService.getAll();
      const standaloneCategories = categories.filter(cat => cat.type === 'standalone');
      
      // Fetch modules for each standalone category
      const allModules: Module[] = [];
      for (const category of standaloneCategories) {
        try {
          const modules = await this.getByCategoryId(Number(category.id));
          allModules.push(...modules.map(m => ({
            module_id: Number(m.id),
            category_id: m.categoryId,
            name: m.name,
            description: m.description,
            image_url: m.image,
          } as Module)));
        } catch (error) {
          console.error(`Failed to fetch modules for category ${category.id}:`, error);
        }
      }
      return allModules.map(transformModule);
    } catch (error) {
      console.error('Failed to fetch all modules:', error);
      throw error;
    }
  },

  // Get all modules for a category
  async getByCategoryId(categoryId: number) {
    try {
      const response = await apiClient.get<ApiResponse<Module[]>>(`/api/modules/${categoryId}`);
      const modules = response.data || response;
      return Array.isArray(modules) ? modules.map(transformModule) : [];
    } catch (error) {
      console.error(`Failed to fetch modules for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Get single module by ID
  async getById(id: number) {
    try {
      const response = await apiClient.get<ApiResponse<Module>>(`/api/modules/${id}`);
      const module = response.data || response;
      return transformModule(module as Module);
    } catch (error) {
      console.error(`Failed to fetch module ${id}:`, error);
      throw error;
    }
  },

  // Create new module
  async create(data: CreateModuleInput) {
    try {
      // Backend expects categoryId (camelCase)
      const payload = {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        image_url: data.image_url,
      };
      const response = await apiClient.post<ApiResponse<Module>>('/api/modules', payload);
      const module = response.data || response;
      return transformModule(module as Module);
    } catch (error) {
      console.error('Failed to create module:', error);
      throw error;
    }
  },

  // Update existing module
  async update(id: number, data: UpdateModuleInput) {
    try {
      const response = await apiClient.put<ApiResponse<Module>>(`/api/modules/${id}`, data);
      const module = response.data || response;
      return transformModule(module as Module);
    } catch (error) {
      console.error(`Failed to update module ${id}:`, error);
      throw error;
    }
  },

  // Delete module
  async delete(id: number) {
    try {
      await apiClient.delete(`/api/modules/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete module ${id}:`, error);
      throw error;
    }
  },
};
