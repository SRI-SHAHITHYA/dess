import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getModulesByCategory, deleteModule } from '../services/moduleService.js';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Utility function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export default function ModulesPage() {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [category] = useState(location.state?.category || null);

  const fetchModules = async () => {
    setIsLoading(true);
    try {
      const data = await getModulesByCategory(categoryId);
      setModules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      alert('Failed to fetch modules');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [categoryId]);

  const handleDelete = async (module) => {
    if (!window.confirm(`Are you sure you want to delete "${module.name}"?`)) {
      return;
    }

    try {
      await deleteModule(module.module_id);
      await fetchModules();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete topic');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Topics - {category?.name || 'Category'}</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                ☰ List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => navigate('/categories')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => navigate(`/category/${categoryId}/module/add`, {
                  state: { category }
                })}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                + Add Topic
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate('/categories')}
            >
              Categories
            </span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{category?.name || 'Topics'}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading topics...</p>
          </div>
        ) : modules.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">No topics found. Click "+ Add Topic" to create one.</p>
          </div>
        ) : viewMode === 'list' ? (
          /* LIST VIEW */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modules.map((module) => (
                  <tr key={module.module_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {module.image_url ? (
                        <img
                          src={module.image_url}
                          alt={module.name}
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-500 text-2xl">
                          📄
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {module.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {stripHtml(module.description) || 'No description'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(module.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/module/${module.module_id}/edit`, {
                            state: { module, category }
                          })}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <EditOutlined className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(module)}
                          className="text-gray-600 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <DeleteOutlined className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.module_id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {module.image_url ? (
                  <img
                    src={module.image_url}
                    alt={module.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-5xl">
                    📄
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b-2 border-blue-600 pb-2">
                  {module.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex-1 min-h-[40px]">
                  {stripHtml(module.description) || 'No description available'}
                </p>
                <div className="text-xs text-gray-500 pt-3 border-t border-gray-200 mb-4">
                  <strong>Updated:</strong> {formatDate(module.updated_at)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/module/${module.module_id}/edit`, {
                      state: { module, category }
                    })}
                    className="flex-1 px-3 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(module)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
