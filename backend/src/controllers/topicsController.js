import { supabase } from '../config/supabaseClient.js';
import AppError from '../utils/AppError.js';

export const getTopics = async (req, res, next) => {
  try {
    const { submoduleId } = req.params;
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('submodule_id', submoduleId)
      .is('deleted_at', null);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// Get topics by module (for standalone categories)
export const getTopicsByModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('module_id', moduleId)
      .is('deleted_at', null);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// Get topics by category (NEW - for standalone categories without modules)
export const getTopicsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('category_id', categoryId)
      .is('deleted_at', null);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

export const createTopic = async (req, res, next) => {
  try {
    const { submoduleId, moduleId, categoryId, name, content, image_url } = req.body;

    // Validate that exactly ONE of: submoduleId, moduleId, or categoryId is provided
    const provided = [submoduleId, moduleId, categoryId].filter(Boolean);
    if (provided.length !== 1) {
      return next(new AppError('Provide exactly one of: submoduleId, moduleId, or categoryId', 400));
    }

    const insertData = {
      name,
      content,
      image_url: image_url || null,
      ...(submoduleId && { submodule_id: submoduleId }),
      ...(moduleId && { module_id: moduleId }),
      ...(categoryId && { category_id: categoryId })
    };

    const { data, error } = await supabase
      .from('topics')
      .insert([insertData])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

export const updateTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, content, image_url } = req.body;

    const { data, error } = await supabase
      .from('topics')
      .update({ name, content, image_url: image_url || null, updated_at: new Date() })
      .eq('topic_id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

export const deleteTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('topics')
      .update({ deleted_at: new Date() })
      .eq('topic_id', id);

    if (error) throw error;
    res.json({ message: 'Topic deleted' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
