import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../services/api.js';
import QuillEditor from '../components/QuillEditor';
import HorizontalFormBlockWrapper from '../components/HorizontalFormBlockWrapper';
import cn from '../utils/class-names';

export default function AddCategoryPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [type, setType] = useState('Standalone');
  const [status, setStatus] = useState('draft');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Name is required');
      return;
    }

    if (!description.trim()) {
      alert('Description is required');
      return;
    }

    setIsLoading(true);
    try {
      await createCategory({
        name: name.trim(),
        type,
        status,
        description: description.trim()
      });
      alert('Category created successfully');
      navigate('/categories');
    } catch (error) {
      console.error('Create error:', error);
      alert('Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Create A Category</h1>
            <button
              onClick={() => navigate('/categories')}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate('/categories')}
            >
              E-Commerce
            </span>
            <span className="mx-2">›</span>
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate('/categories')}
            >
              Categories
            </span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Create</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="@container flex flex-col flex-grow">
          <div className="flex-grow pb-10">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200">
                {/* Category Information Section */}
                <HorizontalFormBlockWrapper
                  title="Add new category:"
                  description="Edit your category information from here"
                  isModalView={true}
                  className="first:pt-0 pt-8"
                >
                  {/* Category Name */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="category name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      disabled={isLoading}
                    >
                      <option value="Standalone">Standalone</option>
                      <option value="Module-based">Module-based</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      disabled={isLoading}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Description with Rich Text Editor */}
                  <div className="col-span-2">
                    <QuillEditor
                      value={description}
                      onChange={setDescription}
                      label="Description"
                      placeholder="Enter category description..."
                      disabled={isLoading}
                    />
                  </div>
                </HorizontalFormBlockWrapper>
              </div>
            </div>
          </div>

          {/* Sticky Footer with Action Buttons */}
          <div className={cn(
            'sticky bottom-0 z-40 flex items-center justify-end gap-3',
            'bg-gray-50/90 backdrop-blur',
            '-mx-6 px-6 py-5',
            'lg:gap-4'
          )}>
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors w-full sm:w-auto"
              disabled={isLoading}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
