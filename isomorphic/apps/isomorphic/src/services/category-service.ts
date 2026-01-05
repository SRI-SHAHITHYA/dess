import { apiClient } from './api-client';

export interface Category {
  category_id: number;
  name: string;
  description: string;
  type: 'Standalone' | 'Module-based';
  status: 'active' | 'inactive' | 'draft';
  image_url?: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryInput {
  name: string;
  description: string;
  type: 'Standalone' | 'Module-based' | 'standalone' | 'module-based';
  status?: 'active' | 'inactive' | 'draft';
  image_url?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Transform category type from backend to frontend format
function transformCategory(category: Category) {
  return {
    id: String(category.category_id),
    name: category.name,
    description: category.description,
    type: (category.type === 'Standalone' ? 'standalone' : 'module-based') as 'standalone' | 'module-based',
    status: category.status || 'draft',
    image: category.image_url,
  };
}

// Transform frontend type to backend format
function transformTypeForBackend(type: string): 'Standalone' | 'Module-based' {
  return type === 'standalone' ? 'Standalone' : 'Module-based';
}

export const categoryService = {
  // Get all categories
  async getAll() {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
      const categories = response.data || response;
      return Array.isArray(categories) ? categories.map(transformCategory) : [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  // Get single category by ID
  async getById(id: number) {
    try {
      const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
      const category = response.data || response;
      return transformCategory(category as Category);
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error);
      throw error;
    }
  },

  // Create new category
  async create(data: CreateCategoryInput) {
    try {
      const payload = {
        ...data,
        type: transformTypeForBackend(data.type),
        status: data.status || 'draft',
      };
      const response = await apiClient.post<ApiResponse<Category>>('/categories', payload);
      const category = response.data || response;
      return transformCategory(category as Category);
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  },

  // Update existing category
  async update(id: number, data: UpdateCategoryInput) {
    try {
      const payload = {
        ...data,
        ...(data.type && { type: transformTypeForBackend(data.type) }),
      };
      const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, payload);
      const category = response.data || response;
      return transformCategory(category as Category);
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      throw error;
    }
  },

  // Delete category
  async delete(id: number) {
    try {
      await apiClient.delete(`/categories/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      throw error;
    }
  },

  // Update category status
  async updateStatus(id: number, status: 'active' | 'inactive' | 'draft') {
    return this.update(id, { status });
  },
};
