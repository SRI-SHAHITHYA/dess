import { useState, useEffect } from "react";
import {
  getSubmodulesByCategory,
  createSubmodule,
  updateSubmodule,
  deleteSubmodule,
} from "../services/submoduleService";
import {
  getTopicsBySubmodule,
  getTopicsByModule,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../services/topicService";
import {
  getModulesByCategory,
  createModule,
  updateModule,
  deleteModule,
} from "../services/moduleService";

export default function ModuleHierarchy({ categoryId, categoryType }) {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [submodules, setSubmodules] = useState([]);
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const isStandalone = categoryType === "Standalone";

  // Add Module States (for Standalone)
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");

  // Edit Module States (for Standalone)
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editModuleName, setEditModuleName] = useState("");
  const [editModuleDesc, setEditModuleDesc] = useState("");

  // Add Submodule States (for Module-based)
  const [showAddSubmodule, setShowAddSubmodule] = useState(false);
  const [newSubmoduleName, setNewSubmoduleName] = useState("");
  const [newSubmoduleDesc, setNewSubmoduleDesc] = useState("");

  // Edit Submodule States (for Module-based)
  const [editingSubmoduleId, setEditingSubmoduleId] = useState(null);
  const [editSubmoduleName, setEditSubmoduleName] = useState("");
  const [editSubmoduleDesc, setEditSubmoduleDesc] = useState("");

  // Add Topic States
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");

  // Edit Topic States
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editTopicName, setEditTopicName] = useState("");
  const [editTopicContent, setEditTopicContent] = useState("");

  // Fetch modules for standalone categories
  const fetchModules = async () => {
    if (!categoryId || !isStandalone) return;
    setLoading(true);
    try {
      const data = await getModulesByCategory(categoryId);
      setModules(data);
    } catch (err) {
      console.error("Modules fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submodules for module-based categories
  const fetchSubmodules = async () => {
    if (!categoryId || isStandalone) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/submodules/category/${categoryId}`, {
        credentials: 'include'
      });
      const result = await response.json();

      // Handle both paginated and non-paginated responses
      if (result.data && result.pagination) {
        // Paginated response
        setSubmodules(result.data);
      } else if (Array.isArray(result)) {
        // Non-paginated response (backward compatibility)
        setSubmodules(result);
      } else if (result.error) {
        // Error response
        console.error("Submodules fetch error:", result.error);
        alert(result.error);
        setSubmodules([]);
      } else {
        setSubmodules([]);
      }
    } catch (err) {
      console.error("Submodules fetch error:", err);
      alert("Failed to fetch submodules");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch based on category type
  useEffect(() => {
    if (isStandalone) {
      fetchModules();
    } else {
      fetchSubmodules();
    }
  }, [categoryId, isStandalone]);

  // Fetch topics when a module is selected (for standalone)
  useEffect(() => {
    if (!selectedModule || !isStandalone) return;
    setLoading(true);
    getTopicsByModule(selectedModule.module_id)
      .then(setTopics)
      .catch((err) => console.error("Topics fetch error:", err))
      .finally(() => setLoading(false));
  }, [selectedModule]);

  // Fetch topics when a submodule is selected (for module-based)
  useEffect(() => {
    if (!selectedSubmodule || isStandalone) return;
    setLoading(true);
    getTopicsBySubmodule(selectedSubmodule.submodule_id)
      .then(setTopics)
      .catch((err) => console.error("Topics fetch error:", err))
      .finally(() => setLoading(false));
  }, [selectedSubmodule]);

  // MODULE HANDLERS (for Standalone categories)
  const handleAddModule = async () => {
    if (!newModuleName.trim()) {
      alert("Module name is required");
      return;
    }
    try {
      await createModule({
        categoryId: categoryId,
        name: newModuleName,
        description: newModuleDesc,
      });
      setNewModuleName("");
      setNewModuleDesc("");
      setShowAddModule(false);
      fetchModules();
    } catch (err) {
      console.error("Error creating module:", err);
      alert("Failed to create module");
    }
  };

  const startEditingModule = (module) => {
    setEditingModuleId(module.module_id);
    setEditModuleName(module.name);
    setEditModuleDesc(module.description || "");
  };

  const handleUpdateModule = async () => {
    if (!editModuleName.trim()) {
      alert("Module name is required");
      return;
    }
    try {
      await updateModule(editingModuleId, {
        name: editModuleName,
        description: editModuleDesc,
      });
      setEditingModuleId(null);
      setEditModuleName("");
      setEditModuleDesc("");
      fetchModules();
    } catch (err) {
      console.error("Error updating module:", err);
      alert("Failed to update module");
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await deleteModule(moduleId);
      fetchModules();
      setSelectedModule(null);
      setTopics([]);
    } catch (err) {
      console.error("Error deleting module:", err);
      alert("Failed to delete module");
    }
  };

  // SUBMODULE HANDLERS (for Module-based categories)
  const handleAddSubmodule = async () => {
    if (!newSubmoduleName.trim()) {
      alert("Submodule name is required");
      return;
    }
    try {
      await createSubmodule({
        category_id: categoryId,
        name: newSubmoduleName,
        description: newSubmoduleDesc,
      });
      setNewSubmoduleName("");
      setNewSubmoduleDesc("");
      setShowAddSubmodule(false);
      fetchSubmodules();
    } catch (err) {
      console.error("Error creating submodule:", err);
      alert("Failed to create submodule");
    }
  };

  const startEditingSubmodule = (submodule) => {
    setEditingSubmoduleId(submodule.submodule_id);
    setEditSubmoduleName(submodule.name);
    setEditSubmoduleDesc(submodule.description || "");
  };

  const handleUpdateSubmodule = async () => {
    if (!editSubmoduleName.trim()) {
      alert("Submodule name is required");
      return;
    }
    try {
      await updateSubmodule(editingSubmoduleId, {
        name: editSubmoduleName,
        description: editSubmoduleDesc,
      });
      setEditingSubmoduleId(null);
      setEditSubmoduleName("");
      setEditSubmoduleDesc("");
      fetchSubmodules();
    } catch (err) {
      console.error("Error updating submodule:", err);
      alert("Failed to update submodule");
    }
  };

  const handleDeleteSubmodule = async (submoduleId) => {
    if (!window.confirm("Delete this submodule?")) return;
    try {
      await deleteSubmodule(submoduleId);
      fetchSubmodules();
      setSelectedSubmodule(null);
      setTopics([]);
    } catch (err) {
      console.error("Error deleting submodule:", err);
      alert("Failed to delete submodule");
    }
  };

  // TOPIC HANDLERS
  const handleAddTopic = async () => {
    if (!newTopicName.trim()) {
      alert("Topic name is required");
      return;
    }
    try {
      const topicData = {
        name: newTopicName,
        content: newTopicContent,
      };

      // For standalone categories, use moduleId; for module-based, use submoduleId
      if (isStandalone) {
        topicData.moduleId = selectedModule.module_id;
      } else {
        topicData.submoduleId = selectedSubmodule.submodule_id;
      }

      await createTopic(topicData);
      setNewTopicName("");
      setNewTopicContent("");
      setShowAddTopic(false);

      // Refresh topics
      if (isStandalone) {
        const tps = await getTopicsByModule(selectedModule.module_id);
        setTopics(tps);
      } else {
        const tps = await getTopicsBySubmodule(selectedSubmodule.submodule_id);
        setTopics(tps);
      }
    } catch (err) {
      console.error("Error creating topic:", err);
      alert("Failed to create topic");
    }
  };

  const startEditingTopic = (topic) => {
    setEditingTopicId(topic.topic_id);
    setEditTopicName(topic.name);
    setEditTopicContent(topic.content || "");
  };

  const handleUpdateTopic = async () => {
    if (!editTopicName.trim()) {
      alert("Topic name is required");
      return;
    }
    try {
      await updateTopic(editingTopicId, {
        name: editTopicName,
        content: editTopicContent,
      });
      setEditingTopicId(null);
      setEditTopicName("");
      setEditTopicContent("");

      // Refresh topics based on category type
      if (isStandalone) {
        const tps = await getTopicsByModule(selectedModule.module_id);
        setTopics(tps);
      } else {
        const tps = await getTopicsBySubmodule(selectedSubmodule.submodule_id);
        setTopics(tps);
      }
    } catch (err) {
      console.error("Error updating topic:", err);
      alert("Failed to update topic");
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Delete this topic?")) return;
    try {
      await deleteTopic(topicId);

      // Refresh topics based on category type
      if (isStandalone) {
        const tps = await getTopicsByModule(selectedModule.module_id);
        setTopics(tps);
      } else {
        const tps = await getTopicsBySubmodule(selectedSubmodule.submodule_id);
        setTopics(tps);
      }
    } catch (err) {
      console.error("Error deleting topic:", err);
      alert("Failed to delete topic");
    }
  };

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <h3 style={{ borderBottom: "2px solid #007bff", paddingBottom: "5px" }}>
        Learning Hierarchy
      </h3>

      {loading && <p>Loading...</p>}

      {/* MODULES (for Standalone) or SUBMODULES (for Module-based) */}
      {isStandalone ? (
        // MODULES FOR STANDALONE CATEGORIES
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4>Modules</h4>
            <button
              onClick={() => setShowAddModule(!showAddModule)}
              style={{ padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              + Add Module
            </button>
          </div>

          {showAddModule && (
            <div style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#f8f9fa" }}>
              <input
                type="text"
                placeholder="Module Name (e.g., DSA, OOPS)"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
              <textarea
                placeholder="Module Description"
                value={newModuleDesc}
                onChange={(e) => setNewModuleDesc(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                rows="2"
              />
              <button
                onClick={handleAddModule}
                style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", marginRight: "5px", cursor: "pointer" }}
              >
                Save
              </button>
              <button
                onClick={() => setShowAddModule(false)}
                style={{ padding: "5px 10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          )}

          {modules.length === 0 ? (
            <p style={{ color: "#6c757d" }}>No modules found. Click "+ Add Module" to create one.</p>
          ) : (
            modules.map((m) => (
              <div key={m.module_id} style={{ marginBottom: "10px" }}>
                {editingModuleId === m.module_id ? (
                  <div style={{ padding: "10px", border: "1px solid #28a745", borderRadius: "4px", backgroundColor: "#e8f5e9" }}>
                    <input
                      type="text"
                      value={editModuleName}
                      onChange={(e) => setEditModuleName(e.target.value)}
                      style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <textarea
                      value={editModuleDesc}
                      onChange={(e) => setEditModuleDesc(e.target.value)}
                      style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                      rows="2"
                    />
                    <button
                      onClick={handleUpdateModule}
                      style={{ padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", marginRight: "5px", cursor: "pointer" }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingModuleId(null)}
                      style={{ padding: "5px 10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: selectedModule?.module_id === m.module_id ? "#e3f2fd" : "#f8f9fa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div
                        onClick={() => setSelectedModule(m)}
                        style={{ flex: 1, cursor: "pointer" }}
                      >
                        <h5 style={{ margin: "0 0 5px 0", color: "#007bff", fontSize: "16px" }}>{m.name}</h5>
                        {m.description && (
                          <p style={{ margin: "0", fontSize: "14px", color: "#6c757d" }}>{m.description}</p>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          onClick={() => startEditingModule(m)}
                          style={{ padding: "5px 8px", backgroundColor: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteModule(m.module_id)}
                          style={{ padding: "5px 8px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        // SUBMODULES FOR MODULE-BASED CATEGORIES
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4>Submodules</h4>
            <button
              onClick={() => setShowAddSubmodule(!showAddSubmodule)}
              style={{ padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              + Add Submodule
            </button>
          </div>

        {showAddSubmodule && (
          <div style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#f8f9fa" }}>
            <input
              type="text"
              placeholder="Submodule Name"
              value={newSubmoduleName}
              onChange={(e) => setNewSubmoduleName(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <textarea
              placeholder="Submodule Description"
              value={newSubmoduleDesc}
              onChange={(e) => setNewSubmoduleDesc(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
              rows="2"
            />
            <button
              onClick={handleAddSubmodule}
              style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", marginRight: "5px", cursor: "pointer" }}
            >
              Save
            </button>
            <button
              onClick={() => setShowAddSubmodule(false)}
              style={{ padding: "5px 10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        )}

        {submodules.length === 0 ? (
          <p style={{ color: "#6c757d" }}>No submodules found. Click "+ Add Submodule" to create one.</p>
        ) : (
          submodules.map((s) => (
            <div key={s.submodule_id} style={{ marginBottom: "10px" }}>
              {editingSubmoduleId === s.submodule_id ? (
                <div style={{ padding: "10px", border: "1px solid #28a745", borderRadius: "4px", backgroundColor: "#e8f5e9" }}>
                  <input
                    type="text"
                    value={editSubmoduleName}
                    onChange={(e) => setEditSubmoduleName(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                  <textarea
                    value={editSubmoduleDesc}
                    onChange={(e) => setEditSubmoduleDesc(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                    rows="2"
                  />
                  <button
                    onClick={handleUpdateSubmodule}
                    style={{ padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", marginRight: "5px", cursor: "pointer" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingSubmoduleId(null)}
                    style={{ padding: "5px 10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: selectedSubmodule?.submodule_id === s.submodule_id ? "#e3f2fd" : "#f8f9fa" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div
                      onClick={() => setSelectedSubmodule(s)}
                      style={{ flex: 1, cursor: "pointer" }}
                    >
                      <h5 style={{ margin: "0 0 5px 0", color: "#007bff", fontSize: "16px" }}>{s.name}</h5>
                      {s.description && (
                        <p style={{ margin: "0", fontSize: "14px", color: "#6c757d" }}>{s.description}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={() => startEditingSubmodule(s)}
                        style={{ padding: "5px 8px", backgroundColor: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubmodule(s.submodule_id)}
                        style={{ padding: "5px 8px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        </div>
      )}

      {/* TOPICS */}
      {(isStandalone ? selectedModule : selectedSubmodule) && (
        <div style={{ marginTop: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4>Topics in {isStandalone ? selectedModule.name : selectedSubmodule.name}</h4>
            <button
              onClick={() => setShowAddTopic(!showAddTopic)}
              style={{ padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              + Add Topic
            </button>
          </div>

          {showAddTopic && (
            <div style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#f8f9fa" }}>
              <input
                type="text"
                placeholder="Topic Name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
              <textarea
                placeholder="Topic Content"
                value={newTopicContent}
                onChange={(e) => setNewTopicContent(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                rows="3"
              />
              <button
                onClick={handleAddTopic}
                style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", marginRight: "5px", cursor: "pointer" }}
              >
                Save
              </button>
              <button
                onClick={() => setShowAddTopic(false)}
                style={{ padding: "5px 10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          )}

          {topics.length === 0 ? (
            <p style={{ color: "#6c757d" }}>No topics found. Click "+ Add Topic" to create one.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {topics.map((t) => (
                <li key={t.topic_id} style={{ marginBottom: "10px" }}>
                  {editingTopicId === t.topic_id ? (
                    <div style={{ padding: "10px", border: "1px solid #17a2b8", borderRadius: "4px", backgroundColor: "#e0f7fa" }}>
                      <input
                        type="text"
                        value={editTopicName}
                        onChange={(e) => setEditTopicName(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                      <textarea
                        value={editTopicContent}
                        onChange={(e) => setEditTopicContent(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                        rows="3"
                    />
                      <button
                        onClick={handleUpdateTopic}
                        style={{ padding: "5px 10px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px", marginRight: "5px", cursor: "pointer" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTopicId(null)}
                        style={{ padding: "5px 10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <h6 style={{ margin: "0 0 5px 0", fontSize: "15px" }}>{t.name}</h6>
                          {t.content && (
                            <p style={{ margin: "0", fontSize: "13px", color: "#6c757d" }}>{t.content}</p>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button
                            onClick={() => startEditingTopic(t)}
                            style={{ padding: "3px 8px", backgroundColor: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(t.topic_id)}
                            style={{ padding: "3px 8px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
