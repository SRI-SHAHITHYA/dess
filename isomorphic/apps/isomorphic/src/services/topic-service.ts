import { apiClient } from './api-client';

export interface Topic {
  topic_id: number;
  module_id?: number;
  submodule_id?: number;
  name: string;
  content?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTopicInput {
  categoryId?: number;  // NEW - for standalone categories
  moduleId?: number;
  submoduleId?: number;
  name: string;
  content?: string;
  image_url?: string;
}

export interface UpdateTopicInput extends Partial<CreateTopicInput> {}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Transform topic from backend to frontend format
function transformTopic(topic: Topic) {
  return {
    id: String(topic.topic_id),
    moduleId: topic.module_id,
    submoduleId: topic.submodule_id,
    name: topic.name,
    content: topic.content || '',
    image: topic.image_url,
    updatedAt: topic.updated_at,
  };
}

export const topicService = {
  // Get all topics (fetches from all modules and submodules)
  async getAll() {
    try {
      const allTopics: Topic[] = [];
      
      // Get all modules and their topics
      const { moduleService } = await import('./module-service');
      const modules = await moduleService.getAll();
      for (const module of modules) {
        try {
          const topics = await this.getByModuleId(Number(module.id));
          allTopics.push(...topics.map(t => ({
            topic_id: Number(t.id),
            module_id: t.moduleId,
            submodule_id: t.submoduleId,
            name: t.name,
            content: t.content,
            image_url: t.image,
          } as Topic)));
        } catch (error) {
          console.error(`Failed to fetch topics for module ${module.id}:`, error);
        }
      }
      
      // Get all submodules and their topics
      const { submoduleService } = await import('./submodule-service');
      const submodules = await submoduleService.getAll();
      for (const submodule of submodules) {
        try {
          const topics = await this.getBySubmoduleId(Number(submodule.id));
          allTopics.push(...topics.map(t => ({
            topic_id: Number(t.id),
            module_id: t.moduleId,
            submodule_id: t.submoduleId,
            name: t.name,
            content: t.content,
            image_url: t.image,
          } as Topic)));
        } catch (error) {
          console.error(`Failed to fetch topics for submodule ${submodule.id}:`, error);
        }
      }
      
      return allTopics.map(transformTopic);
    } catch (error) {
      console.error('Failed to fetch all topics:', error);
      throw error;
    }
  },

  // Get all topics for a category (NEW - for standalone categories, direct topics)
  async getByCategoryId(categoryId: number) {
    try {
      const response = await apiClient.get<ApiResponse<Topic[]>>(`/api/topics/category/${categoryId}`);
      const topics = response.data || response;
      return Array.isArray(topics) ? topics.map(transformTopic) : [];
    } catch (error) {
      console.error(`Failed to fetch topics for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Get all topics for a module
  async getByModuleId(moduleId: number) {
    try {
      const response = await apiClient.get<ApiResponse<Topic[]>>(`/api/topics/module/${moduleId}`);
      const topics = response.data || response;
      return Array.isArray(topics) ? topics.map(transformTopic) : [];
    } catch (error) {
      console.error(`Failed to fetch topics for module ${moduleId}:`, error);
      throw error;
    }
  },

  // Get all topics for a submodule
  async getBySubmoduleId(submoduleId: number) {
    try {
      const response = await apiClient.get<ApiResponse<Topic[]>>(`/api/topics/${submoduleId}`);
      const topics = response.data || response;
      return Array.isArray(topics) ? topics.map(transformTopic) : [];
    } catch (error) {
      console.error(`Failed to fetch topics for submodule ${submoduleId}:`, error);
      throw error;
    }
  },

  // Get single topic by ID
  async getById(id: number) {
    try {
      const response = await apiClient.get<ApiResponse<Topic>>(`/api/topics/${id}`);
      const topic = response.data || response;
      return transformTopic(topic as Topic);
    } catch (error) {
      console.error(`Failed to fetch topic ${id}:`, error);
      throw error;
    }
  },

  // Create new topic
  async create(data: CreateTopicInput) {
    try {
      // Backend expects categoryId/moduleId/submoduleId (camelCase)
      const payload = {
        categoryId: data.categoryId,  // NEW - for standalone categories
        moduleId: data.moduleId,
        submoduleId: data.submoduleId,
        name: data.name,
        content: data.content || '',
        image_url: data.image_url,
      };
      const response = await apiClient.post<ApiResponse<Topic>>('/api/topics', payload);
      const topic = response.data || response;
      return transformTopic(topic as Topic);
    } catch (error) {
      console.error('Failed to create topic:', error);
      throw error;
    }
  },

  // Update existing topic
  async update(id: number, data: UpdateTopicInput) {
    try {
      const response = await apiClient.put<ApiResponse<Topic>>(`/api/topics/${id}`, data);
      const topic = response.data || response;
      return transformTopic(topic as Topic);
    } catch (error) {
      console.error(`Failed to update topic ${id}:`, error);
      throw error;
    }
  },

  // Delete topic
  async delete(id: number) {
    try {
      await apiClient.delete(`/api/topics/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete topic ${id}:`, error);
      throw error;
    }
  },
};
