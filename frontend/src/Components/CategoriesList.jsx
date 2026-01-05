

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api.js";
import ModuleHierarchy from "./ModuleHierarchy.jsx"; // ✅ new component import

// --- STYLES ---
const styles = {
  container: {
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    padding: "30px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    display: "flex",
    gap: "40px",
  },
  listSection: {
    flex: 2,
    paddingRight: "30px",
    borderRight: "1px solid #e9ecef",
  },
  createSection: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  heading: {
    color: "#343a40",
    borderBottom: "2px solid #007bff",
    paddingBottom: "10px",
    marginBottom: "20px",
    fontSize: "1.8rem",
  },
  listItem: {
    listStyle: "none",
    marginBottom: "15px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
    transition: "background-color 0.2s",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ced4da",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ced4da",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ced4da",
    resize: "vertical",
    boxSizing: "border-box",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    marginLeft: "5px",
  },
  primaryButton: {
    backgroundColor: "#007bff",
    color: "white",
    marginRight: "10px",
  },
  dangerButton: {
    backgroundColor: "#dc3545",
    color: "white",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#343a40",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "white",
  },
};

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("Standalone");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const categoryTypes = ["Standalone", "Module-based"];

  const getErrorMessage = (error) => {
    const responseData = error.response?.data;
    if (responseData?.errors && Array.isArray(responseData.errors)) {
      return responseData.errors.join(", ");
    }
    return responseData?.error || error.message;
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      console.log("Fetched categories:", data); // Debug log
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      console.error("Error details:", error.response);
      alert(`Failed to fetch categories: ${getErrorMessage(error)}`);
      setCategories([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newCategoryName.trim() || !newCategoryDescription.trim()) {
      alert("Name and Description are required.");
      return;
    }
    setIsLoading(true);
    try {
      await createCategory({
        name: newCategoryName,
        type: newCategoryType,
        description: newCategoryDescription,
      });
      setNewCategoryName("");
      setNewCategoryType("Standalone");
      setNewCategoryDescription("");
      await fetchCategories();
    } catch (error) {
      console.error("Create Category Error:", error.response?.data || error.message);
      alert(`Error creating category: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (cat) => {
    setEditingCategory(cat);
    setEditingId(cat.category_id);
    setEditingName(cat.name);
    setEditingDescription(cat.description || "");
  };

  const handleUpdate = async () => {
    if (!editingName.trim() || !editingCategory) return;
    setIsLoading(true);
    const updatedFields = {
      name: editingName,
      description: editingDescription,
      type: editingCategory.type,
    };
    try {
      await updateCategory(editingId, updatedFields);
      setEditingId(null);
      setEditingName("");
      setEditingDescription("");
      setEditingCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error("Update Category Error:", error.response?.data || error.message);
      alert(`Error updating category: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setIsLoading(true);
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error("Delete Category Error:", error.response?.data || error.message);
      alert(`Error deleting category: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingCategory(null);
    setEditingName("");
    setEditingDescription("");
  };

  return (
    <div style={styles.container}>
      {/* LEFT SIDE — LIST */}
      <div style={styles.listSection}>
        <h2 style={styles.heading}>Category Management</h2>
        {isLoading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No categories found. Create one to get started!</p>
        ) : (
          <ul style={{ padding: 0 }}>
            {categories.map((cat) => (
              <li
                key={cat.category_id}
                style={{
                  ...styles.listItem,
                  cursor: "pointer",
                  backgroundColor:
                    editingId === cat.category_id ? "#f0f8ff" : "#fff",
                }}
                onClick={() => setEditingCategory(cat)}
              >
                {editingId === cat.category_id ? (
                  <div>
                    <label>Name:</label>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      style={styles.input}
                    />
                    <label>Description:</label>
                    <textarea
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      style={styles.textarea}
                    />
                    <button
                      onClick={handleUpdate}
                      style={{ ...styles.button, ...styles.primaryButton }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{ ...styles.button, ...styles.cancelButton }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3 style={{ margin: "0", fontSize: "1.2rem", color: "#007bff" }}>
                        {cat.name}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.9em",
                          fontWeight: "600",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor:
                            cat.type === "Standalone" ? "#e9f5ff" : "#fff3cd",
                          color: cat.type === "Standalone" ? "#007bff" : "#664d03",
                        }}
                      >
                        {cat.type}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.95em", color: "#495057", marginTop: "5px" }}>
                      {cat.description || "No description provided"}
                    </p>
                    <div style={{ marginTop: "10px" }}>
                      <button
                        onClick={() => startEditing(cat)}
                        style={{ ...styles.button, ...styles.editButton }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.category_id)}
                        style={{ ...styles.button, ...styles.dangerButton }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT SIDE — MODULE HIERARCHY */}
      <div style={{ flex: 1 }}>
        {editingCategory ? (
          <ModuleHierarchy
            categoryId={editingCategory.category_id}
            categoryType={editingCategory.type}
          />
        ) : (
          <p style={{ marginTop: "20px", color: "#6c757d" }}>
            Select a category to view its hierarchy.
          </p>
        )}
      </div>

      {/* CREATE NEW CATEGORY */}
      <div style={styles.createSection}>
        <h2 style={styles.heading}>Create New Category</h2>
        <label>Name:</label>
        <input
          type="text"
          placeholder="E.g., Web Development"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={styles.input}
          disabled={isLoading}
        />

        <label>Type:</label>
        <select
          value={newCategoryType}
          onChange={(e) => setNewCategoryType(e.target.value)}
          style={styles.select}
          disabled={isLoading}
        >
          {categoryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label>Description:</label>
        <textarea
          placeholder="Briefly describe the category content."
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
          rows="3"
          style={styles.textarea}
          disabled={isLoading}
        ></textarea>

        <button
          onClick={handleCreate}
          style={{
            ...styles.button,
            ...styles.primaryButton,
            display: "block",
            width: "100%",
            marginLeft: 0,
          }}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "✨ Add Category"}
        </button>
      </div>
    </div>
  );
}
