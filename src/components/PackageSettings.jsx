import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  Check,
  X,
  Inbox,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { getAllPackages, deletePackage } from "../redox/apiSlice";
import "./css/Package.css";

const PackageSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal display control states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Form input management state
  const [formData, setFormData] = useState({
    id: "",
    packageName: "",
    packageType: "",
    numberOfPeople: "",
    amount: "",
  });

  // Get packages from Redux state
  const { packages: packagesFromRedux, packagesLoading } = useSelector(
    (state) => state.api
  );
  const { vendorCentres } = useSelector((state) => state.api);

  // Get the first centre ID
  const centreId = vendorCentres?.[0]?.id || localStorage.getItem("centreId");

  // Fetch packages on mount
  useEffect(() => {
    if (centreId) {
      fetchPackages(centreId);
    } else {
      setLoading(false);
    }
  }, [centreId]);

  const fetchPackages = async (id) => {
    try {
      setLoading(true);
      const result = await dispatch(getAllPackages(id)).unwrap();
      const packageList = result?.data || result?.packages || result || [];
      setPackages(packageList);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // Intercept table row delete click
  const handleDeleteClick = (packageId) => {
    setDeleteTargetId(packageId);
  };

  // Execute custom modal delete confirm action
  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await dispatch(deletePackage(deleteTargetId)).unwrap();
      setDeleteTargetId(null);
      if (centreId) fetchPackages(centreId);
    } catch (error) {
      console.error("Failed to delete package:", error);
      setDeleteTargetId(null);
    }
  };

  // Open Add popup
  const handleAddPackageClick = () => {
    setFormData({
      id: "",
      packageName: "",
      packageType: "",
      numberOfPeople: "",
      amount: "",
    });
    setShowAddModal(true);
  };

  // Open Edit popup and populate fields
  const handleEditClick = (pkg) => {
    setFormData({
      id: pkg.id || pkg._id,
      packageName: pkg.packageName || pkg.name || "",
      packageType: pkg.packageType || pkg.type || "",
      numberOfPeople: pkg.numberOfPeople || "",
      amount: pkg.amount || pkg.price || "",
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add Form Submission
  const handleAddSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting New Package Data:", formData);
    // await dispatch(createPackage({ centreId, ...formData })).unwrap();
    
    setShowAddModal(false);
    setShowSuccessModal(true); // Triggers success verification message banner
    if (centreId) fetchPackages(centreId);
  };

  // Handle Edit Form Submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log("Updating Package Data:", formData);
    // await dispatch(updatePackage({ id: formData.id, ...formData })).unwrap();
    
    setShowEditModal(false);
    if (centreId) fetchPackages(centreId);
  };

  // Handle view package details
  const handleView = (packageId) => {
    navigate(`/vendor/package/${packageId}`);
  };

  // Filter package entries matching UI criteria
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Active" && pkg.status !== "inactive") ||
      (filterStatus === "Inactive" && pkg.status === "inactive");

    return matchesSearch && matchesStatus;
  });

  const totalPackages = packages.length;
  const activePackages = packages.filter((p) => p.status !== "inactive").length;
  const inactivePackages = packages.filter((p) => p.status === "inactive").length;

  if (loading || packagesLoading) {
    return (
      <div className="package-container">
        <div className="package-header">
          <div>
            <h2>Package Settings</h2>
            <p>Loading your packages...</p>
          </div>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="package-container">
      {/* Header element */}
      <div className="package-header">
        <div>
          <h2>Package Settings</h2>
          <p>Manage your tour packages — view, edit, and control availability</p>
        </div>

        <button className="add-package-btn" onClick={handleAddPackageClick}>
          <Plus size={18} />
          Add Package
        </button>
      </div>

      {/* Search Bar & Status Filters */}
      <div className="package-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter ${filterStatus === "All" ? "active" : ""}`}
            onClick={() => setFilterStatus("All")}
          >
            All
          </button>
          <button
            className={`filter ${filterStatus === "Active" ? "active" : ""}`}
            onClick={() => setFilterStatus("Active")}
          >
            Active
          </button>
          <button
            className={`filter ${filterStatus === "Inactive" ? "active" : ""}`}
            onClick={() => setFilterStatus("Inactive")}
          >
            Inactive
          </button>
          <span className="package-count">{filteredPackages.length} packages</span>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <Package size={18} />
          </div>
          <div>
            <h3>{totalPackages}</h3>
            <p>Total Packages</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <Check size={18} />
          </div>
          <div>
            <h3>{activePackages}</h3>
            <p>Active</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <X size={18} />
          </div>
          <div>
            <h3>{inactivePackages}</h3>
            <p>Inactive</p>
          </div>
        </div>
      </div>

      {/* Main Datatable Render */}
      {filteredPackages.length === 0 ? (
        <div className="empty-state">
          <Inbox size={35} strokeWidth={1.5} />
          <h3>No packages found</h3>
          <p>
            {searchTerm || filterStatus !== "All"
              ? "Try adjusting your search or filters"
              : "Add your first package to get started"}
          </p>
          {(searchTerm || filterStatus !== "All") && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("All");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="package-list">
          <table className="package-table">
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Price</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.map((pkg) => {
                const packageName = pkg.packageName || pkg.name || "Unnamed Package";
                const price = pkg.amount || pkg.price || 0;
                const packageType = pkg.packageType || pkg.type || "Standard";
                const status = pkg.status || "active";
                const createdAt = pkg.createdAt
                  ? new Date(pkg.createdAt).toLocaleDateString()
                  : "N/A";

                return (
                  <tr key={pkg.id || pkg._id}>
                    <td>
                      <div className="package-name-cell">
                        <span className="package-name">{packageName}</span>
                        {pkg.description && (
                          <span className="package-desc">
                            {pkg.description.slice(0, 50)}...
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="package-price">₦{price.toLocaleString()}</td>
                    <td>
                      <span className="package-type-badge">{packageType}</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          status === "inactive" ? "inactive" : "active"
                        }`}
                      >
                        {status === "inactive" ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="package-date">{createdAt}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => handleView(pkg.id || pkg._id)}
                          title="View Package"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => handleEditClick(pkg)}
                          title="Edit Package"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteClick(pkg.id || pkg._id)}
                          title="Delete Package"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ADD NEW PACKAGE MODAL --- */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title-area">
                <h2>Add New Package</h2>
                <p>Create a new tour package</p>
              </div>
              <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Package Name *</label>
                <input
                  type="text"
                  name="packageName"
                  className="form-input"
                  placeholder="e.g. Lekki Conservation Trail"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Package Type *</label>
                <input
                  type="text"
                  name="packageType"
                  className="form-input"
                  placeholder="e.g. recreational centre, art gallery"
                  value={formData.packageType}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of people *</label>
                <input
                  type="number"
                  name="numberOfPeople"
                  className="form-input"
                  placeholder=""
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₦) *</label>
                <input
                  type="text"
                  name="amount"
                  className="form-input short-input"
                  placeholder="e.g. 15000"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn-submit">
                  <Check size={16} /> Add Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PACKAGE MODAL --- */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title-area">
                <h2>Edit Package</h2>
                <p>Edit tour package</p>
              </div>
              <button className="close-modal-btn" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Package Name *</label>
                <input
                  type="text"
                  name="packageName"
                  className="form-input"
                  placeholder=""
                  value={formData.packageName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Package Type *</label>
                <input
                  type="text"
                  name="packageType"
                  className="form-input"
                  placeholder=""
                  value={formData.packageType}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of people *</label>
                <input
                  type="number"
                  name="numberOfPeople"
                  className="form-input"
                  placeholder=""
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₦) *</label>
                <input
                  type="text"
                  name="amount"
                  className="form-input short-input"
                  placeholder=""
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn-submit">
                  <Check size={16} /> Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SUCCESS STATUS MODAL --- */}
      {showSuccessModal && (
        <div className="modal-backdrop">
          <div className="alert-modal-card">
            <h2 className="alert-title">Package added successfully</h2>
            <p className="alert-message">Your package has been added.</p>
            <button
              className="alert-btn-continue"
              onClick={() => setShowSuccessModal(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {deleteTargetId && (
        <div className="modal-backdrop">
          <div className="alert-modal-card">
            <h2 className="alert-title">Delete Package</h2>
            <p className="alert-message">
              Are you sure you want to delete this package? This action cannot be undone.
            </p>
            <div className="alert-actions-row">
              <button
                className="alert-btn-cancel"
                onClick={() => setDeleteTargetId(null)}
              >
                Cancel
              </button>
              <button className="alert-btn-delete" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageSettings;