import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin-dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem("adminEmail");
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/content`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setContent(data);
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({ title: item.title, description: item.description });
  };

  const handleSave = async () => {
    const formBody = new FormData();
    formBody.append("title", formData.title);
    formBody.append("description", formData.description);
    if (image) {
      formBody.append("image", image);
    }

    try {
      const response = await fetch(`${API_URL}/api/content/${editingId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formBody,
      });

      if (response.ok) {
        setEditingId(null);
        setImage(null);
        fetchContent();
      }
    } catch (err) {
      console.error("Error saving content:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      const response = await fetch(`${API_URL}/api/content/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchContent();
      }
    } catch (err) {
      console.error("Error deleting content:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Content Management Dashboard</h1>
        <div className="admin-header-right">
          <span>Logged in as: {adminEmail}</span>
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading content...</div>
      ) : (
        <div className="admin-content">
          <div className="content-list">
            {content.map((item) => (
              <div key={item._id} className="content-item">
                {editingId === item._id ? (
                  <div className="content-form">
                    <input
                      type="text"
                      placeholder="Title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    ></textarea>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <div className="form-actions">
                      <button onClick={handleSave} className="btn btn-primary">
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="content-preview">
                      {item.image && (
                        <img
                          src={`${API_URL}${item.image}`}
                          alt={item.title}
                          className="content-image"
                        />
                      )}
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="content-actions">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}