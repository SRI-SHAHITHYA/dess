import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getTopicsBySubmodule, getTopicsByModule, deleteTopic } from '../services/topicService.js';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Utility function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export default function TopicsPage() {
  const { submoduleId, moduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submodule] = useState(location.state?.submodule || null);
  const [module] = useState(location.state?.module || null);
  const [category] = useState(location.state?.category || null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Determine if we're viewing module topics or submodule topics
  const isModuleBased = !!moduleId;
  const parentName = isModuleBased ? (module?.name || 'Module') : (submodule?.name || 'Submodule');

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const data = isModuleBased
        ? await getTopicsByModule(moduleId)
        : await getTopicsBySubmodule(submoduleId);
      setTopics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      alert('Failed to fetch topics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [submoduleId, moduleId]);

  const handleDelete = async (topic) => {
    if (!window.confirm(`Are you sure you want to delete "${topic.name}"?`)) {
      return;
    }

    try {
      await deleteTopic(topic.topic_id);
      await fetchTopics();
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

  const goBack = () => {
    if (isModuleBased) {
      if (category) {
        navigate(`/category/${category.category_id}/modules`, {
          state: { category }
        });
      } else {
        navigate('/categories');
      }
    } else {
      if (category) {
        navigate(`/category/${category.category_id}/submodules`, {
          state: { category }
        });
      } else {
        navigate('/categories');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Topics - {parentName}</h1>
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
                onClick={goBack}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (isModuleBased) {
                    navigate(`/module/${moduleId}/topic/add`, {
                      state: { module, category }
                    });
                  } else {
                    navigate(`/submodule/${submoduleId}/topic/add`, {
                      state: { submodule, category }
                    });
                  }
                }}
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
            {category && (
              <>
                <span className="mx-2">›</span>
                <span
                  className="cursor-pointer hover:text-blue-600"
                  onClick={goBack}
                >
                  {category.name}
                </span>
              </>
            )}
            <span className="mx-2">›</span>
            <span className="text-gray-900">{parentName}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading topics...</p>
          </div>
        ) : topics.length === 0 ? (
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
                {topics.map((topic) => (
                  <tr key={topic.topic_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {topic.image_url ? (
                        <img
                          src={topic.image_url}
                          alt={topic.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl">
                          📄
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {topic.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                      {topic.content
                        ? (() => {
                            const stripped = stripHtml(topic.content);
                            return stripped.length > 100
                              ? stripped.substring(0, 100) + '...'
                              : stripped;
                          })()
                        : 'No content'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(topic.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/topic/${topic.topic_id}/edit`, {
                            state: { topic, submodule, module, category }
                          })}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <EditOutlined className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(topic)}
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
            {topics.map((topic) => (
              <div
                key={topic.topic_id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {topic.image_url ? (
                  <img
                    src={topic.image_url}
                    alt={topic.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-5xl">
                    📄
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b-2 border-blue-600 pb-2">
                  {topic.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {topic.content
                    ? (() => {
                        const stripped = stripHtml(topic.content);
                        return stripped.length > 120
                          ? stripped.substring(0, 120) + '...'
                          : stripped;
                      })()
                    : 'No content available'}
                </p>
                <div className="text-xs text-gray-500 pt-3 border-t border-gray-200 mb-4">
                  <strong>Updated:</strong> {formatDate(topic.updated_at)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/topic/${topic.topic_id}/edit`, {
                      state: { topic, submodule, module, category }
                    })}
                    className="flex-1 px-3 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(topic)}
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
