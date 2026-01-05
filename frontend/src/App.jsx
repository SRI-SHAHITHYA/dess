import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login.jsx';
import LoadingSpinner from './Components/LoadingSpinner.jsx';
import UnauthorizedPage from './Components/UnauthorizedPage.jsx';
import { getCurrentUser, logout, setSessionExpiredCallback } from './services/api.js';
import ErrorBoundary from './Components/ErrorBoundary.jsx';

// Import pages
import CategoryListPage from './pages/CategoryListPage.jsx';
import ModulesPage from './pages/ModulesPage.jsx';
import SubmodulesPage from './pages/SubmodulesPage.jsx';
import TopicsPage from './pages/TopicsPage.jsx';
import EditCategoryPage from './pages/EditCategoryPage.jsx';
import EditModulePage from './pages/EditModulePage.jsx';
import EditSubmodulePage from './pages/EditSubmodulePage.jsx';
import EditTopicPage from './pages/EditTopicPage.jsx';
import AddCategoryPage from './pages/AddCategoryPage.jsx';
import AddModulePage from './pages/AddModulePage.jsx';
import AddSubmodulePage from './pages/AddSubmodulePage.jsx';
import AddTopicPage from './pages/AddTopicPage.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up session expiration callback
    setSessionExpiredCallback(() => {
      setUser(null);
      console.log('Session expired. Please log in again.');
    });

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout on frontend even if backend call fails
      setUser(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  return (
    <ErrorBoundary>
      <Router>
        {!user ? (
          <Login onLogin={setUser} />
        ) : (
          <div>
            {/* Header */}
            <div style={{
              backgroundColor: '#343a40',
              color: '#fff',
              padding: '15px 30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
                Admin Panel - {user.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '14px', color: '#adb5bd' }}>
                  Role: {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  Logout
                </button>
              </div>
            </div>

            {user.role === 'admin' ? (
              <Routes>
                {/* Category routes */}
                <Route path="/categories" element={<CategoryListPage />} />
                <Route path="/category/add" element={<AddCategoryPage />} />
                <Route path="/category/:categoryId/edit" element={<EditCategoryPage />} />

                {/* Module routes (for Standalone categories) */}
                <Route path="/category/:categoryId/modules" element={<ModulesPage />} />
                <Route path="/category/:categoryId/module/add" element={<AddModulePage />} />
                <Route path="/module/:moduleId/edit" element={<EditModulePage />} />

                {/* Topic routes for Standalone (Module-based topics) */}
                <Route path="/module/:moduleId/topics" element={<TopicsPage />} />
                <Route path="/module/:moduleId/topic/add" element={<AddTopicPage />} />

                {/* Submodule routes (for Module-based categories) */}
                <Route path="/category/:categoryId/submodules" element={<SubmodulesPage />} />
                <Route path="/category/:categoryId/submodule/add" element={<AddSubmodulePage />} />
                <Route path="/submodule/:submoduleId/edit" element={<EditSubmodulePage />} />

                {/* Topic routes for Submodules */}
                <Route path="/submodule/:submoduleId/topics" element={<TopicsPage />} />
                <Route path="/submodule/:submoduleId/topic/add" element={<AddTopicPage />} />
                <Route path="/topic/:topicId/edit" element={<EditTopicPage />} />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/categories" replace />} />
                <Route path="*" element={<Navigate to="/categories" replace />} />
              </Routes>
            ) : (
              <UnauthorizedPage
                userName={user.name}
                userRole={user.role}
                onLogout={handleLogout}
              />
            )}
          </div>
        )}
      </Router>
    </ErrorBoundary>
  );
}
