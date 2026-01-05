import api from './api';

/**
 * Create or Update SEO metadata for a page
 * @param {Object} seoData - SEO metadata object
 * @returns {Promise<Object>}
 */
export const upsertSeoMeta = async (seoData) => {
  const response = await api.post('/api/seo-aeo/seo', seoData);
  return response.data;
};

/**
 * Create or Update AEO optimization data for a page
 * @param {Object} aeoData - AEO optimization object
 * @returns {Promise<Object>}
 */
export const upsertAeoOptimization = async (aeoData) => {
  const response = await api.post('/api/seo-aeo/aeo', aeoData);
  return response.data;
};

/**
 * Get complete SEO/AEO data for a specific page
 * @param {string} pageId - Unique page identifier
 * @returns {Promise<Object>}
 */
export const getSeoAeoData = async (pageId) => {
  const response = await api.get(`/api/seo-aeo/${pageId}`);
  return response.data;
};

/**
 * Delete SEO/AEO data for a page
 * @param {string} pageId - Unique page identifier
 * @returns {Promise<Object>}
 */
export const deleteSeoAeoData = async (pageId) => {
  const response = await api.delete(`/api/seo-aeo/${pageId}`);
  return response.data;
};

/**
 * Get all SEO metadata (for admin dashboard)
 * @returns {Promise<Object>}
 */
export const getAllSeoMeta = async () => {
  const response = await api.get('/api/seo-aeo/all');
  return response.data;
};

/**
 * Combined function to save both SEO and AEO data
 * @param {string} pageId - Unique page identifier
 * @param {Object} seoData - SEO metadata
 * @param {Object} aeoData - AEO optimization data
 * @returns {Promise<Object>}
 */
export const saveSeoAeoData = async (pageId, seoData, aeoData) => {
  // Save SEO first (required)
  const seoResult = await upsertSeoMeta({ ...seoData, page_id: pageId });

  // Save AEO if provided
  let aeoResult = null;
  if (aeoData && Object.keys(aeoData).length > 0) {
    aeoResult = await upsertAeoOptimization({ ...aeoData, page_id: pageId });
  }

  return {
    seo: seoResult,
    aeo: aeoResult
  };
};
