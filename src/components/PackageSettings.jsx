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
import {
  getAllPackages,
  deletePackage,
  createPackage,
  updatePackage,
} from "../redox/apiSlice";
import "./css/Package.css";

const getEntityId = (value) =>
  value?.id ||
  value?._id ||
  value?.touristId ||
  value?.centreId ||
  value?.centerId ||
  value?.tourist?.id ||
  value?.tourist?._id ||
  value?.touristCentre?.id ||
  value?.touristCentre?._id;

const getStoredCentreId = () =>
  localStorage.getItem("latestTouristId") ||
  localStorage.getItem("centreId") ||
  localStorage.getItem("touristId");

const PackageLoadingState = () => (
  <div className="package-container package-container--loading" aria-busy="true">
    <div className="package-header">
      <div className="package-loading-title-area">
        <span className="package-skeleton package-skeleton-title" />
        <span className="package-skeleton package-skeleton-subtitle" />
      </div>
      <span className="package-skeleton package-skeleton-add-btn" />
    </div>

    <div className="package-filters package-filters--loading">
      <span className="package-skeleton package-skeleton-search" />
      <div className="package-loading-tabs">
        <span className="package-skeleton package-skeleton-filter active" />
        <span className="package-skeleton package-skeleton-filter" />
        <span className="package-skeleton package-skeleton-filter" />
        <span className="package-skeleton package-skeleton-count" />
      </div>
    </div>

    <div className="stats-grid package-loading-stats">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="stat-card package-loading-stat-card" key={index}>
          <span className="package-skeleton package-skeleton-stat-icon" />
          <div>
            <span className="package-skeleton package-skeleton-stat-number" />
            <span className="package-skeleton package-skeleton-stat-label" />
          </div>
        </div>
      ))}
    </div>

    <div className="package-list package-list--loading">
      <div className="package-loading-table-head">
        {Array.from({ length: 6 }).map((_, index) => (
          <span className="package-skeleton package-skeleton-th" key={index} />
        ))}
      </div>
      <div className="package-loading-table-body">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div className="package-loading-table-row" key={rowIndex}>
            <span className="package-skeleton package-skeleton-name-cell" />
            <span className="package-skeleton package-skeleton-price-cell" />
            <span className="package-skeleton package-skeleton-type-cell" />
            <span className="package-skeleton package-skeleton-status-cell" />
            <span className="package-skeleton package-skeleton-date-cell" />
            <span className="package-skeleton package-skeleton-actions-cell" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PackageSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal display control states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Form input management state
  const [formData, setFormData] = useState({
    id: "",
    packageName: "",
    packageType: "",
    numberOfPeople: "",
    amount: "",
    status: "active",
  });

  // Get packages and vendor centres from Redux state
  const {
    packages: packagesFromRedux,
    packagesLoading,
    packagesError,
  } = useSelector((state) => state.api);
  const { vendorCentres } = useSelector((state) => state.api);
  const { vendorDetails } = useSelector((state) => state.auth);

  // Get the centre/tourist ID used by package APIs.
  const centreId =
    getEntityId(vendorCentres?.[0]) || getStoredCentreId() || getEntityId(vendorDetails);

  // Fetch packages when centreId changes
  useEffect(() => {
    if (centreId) {
      fetchPackages(centreId);
    } else {
      setLoading(false);
    }
  }, [centreId]);

  // Update local packages when Redux packages change
  useEffect(() => {
    if (packagesFromRedux && packagesFromRedux.length > 0) {
      setPackages(packagesFromRedux);
    }
  }, [packagesFromRedux]);

  const fetchPackages = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await dispatch(getAllPackages(id)).unwrap();

      // The API returns: { message, count, data: packages[] }
      const packageList = result?.data || result?.packages || result || [];
      setPackages(packageList);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setError(error || "Failed to load packages");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (packageId) => {
    setDeleteTargetId(packageId);
  };

  // Execute delete confirm action
  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setLoading(true);
      await dispatch(deletePackage(deleteTargetId)).unwrap();
      setDeleteTargetId(null);
      setSuccessMessage("Package deleted successfully");
      setShowSuccessModal(true);
      // Refresh packages
      if (centreId) fetchPackages(centreId);
    } catch (error) {
      console.error("Failed to delete package:", error);
      setError(error || "Failed to delete package");
      setDeleteTargetId(null);
    } finally {
      setLoading(false);
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
      status: "active",
    });
    setShowAddModal(true);
  };

  // Open Edit popup and populate fields
  const handleEditClick = (pkg) => {
    setFormData({
      id: pkg.id || pkg._id,
      packageName: pkg.packageName || pkg.name || "",
      packageType: pkg.packageType || pkg.type || "",
      numberOfPeople: pkg.numberOfPeople || pkg.maxPeople || "",
      amount: pkg.amount || pkg.price || "",
      status: pkg.status || "active",
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add Form Submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.packageName) {
      setError("Package name is required");
      return;
    }

    if (!formData.amount) {
      setError("Amount is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare package data for API - matches the exact API spec
      const packageData = {
        packageName: formData.packageName,
        packageType: formData.packageType || "Standard",
        numberOfPeople: formData.numberOfPeople || "1",
        amount: parseFloat(formData.amount),
      };

      console.log("📦 Creating package with data:", packageData);
      console.log("📦 For touristId:", centreId);

      await dispatch(
        createPackage({
          touristId: centreId,
          packageData,
        }),
      ).unwrap();

      setShowAddModal(false);
      setSuccessMessage("Package added successfully");
      setShowSuccessModal(true);

      // Refresh packages
      if (centreId) fetchPackages(centreId);
    } catch (error) {
      console.error("❌ Failed to create package:", error);
      setError(error || "Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Form Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.packageName) {
      setError("Package name is required");
      return;
    }

    if (!formData.amount) {
      setError("Amount is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare package data for API
      const packageData = {
        packageName: formData.packageName,
        packageType: formData.packageType || "Standard",
        numberOfPeople: formData.numberOfPeople || "1",
        amount: parseFloat(formData.amount),
      };

      console.log("📦 Updating package:", { id: formData.id, ...packageData });

      await dispatch(
        updatePackage({
          id: formData.id,
          packageData,
        }),
      ).unwrap();

      setShowEditModal(false);
      setSuccessMessage("Package updated successfully");
      setShowSuccessModal(true);

      // Refresh packages
      if (centreId) fetchPackages(centreId);
    } catch (error) {
      console.error("❌ Failed to update package:", error);
      setError(error || "Failed to update package");
    } finally {
      setLoading(false);
    }
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
  const inactivePackages = packages.filter(
    (p) => p.status === "inactive",
  ).length;

  // Show loading state
  if (loading || packagesLoading) {
    return <PackageLoadingState />;
  }

  // Show error state
  if (error && packages.length === 0) {
    return (
      <div className="package-container">
        <div className="package-header">
          <div>
            <h2>Package Settings</h2>
            <p>Error loading packages</p>
          </div>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => centreId && fetchPackages(centreId)}>
            Retry
          </button>
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
          <p>
            Manage your tour packages — view, edit, and control availability
          </p>
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
          <span className="package-count">
            {filteredPackages.length} packages
          </span>
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
                const packageName =
                  pkg.packageName || pkg.name || "Unnamed Package";
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
                    <td className="package-price">
                      ₦{Number(price).toLocaleString()}
                    </td>
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
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-area">
                <h2>Add New Package</h2>
                <p>Create a new tour package</p>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setShowAddModal(false)}
              >
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
                  placeholder="e.g. Family Package"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Package Type</label>
                <input
                  type="text"
                  name="packageType"
                  className="form-input"
                  placeholder="e.g. Premium, Standard, Economy"
                  value={formData.packageType}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of people</label>
                <input
                  type="text"
                  name="numberOfPeople"
                  className="form-input"
                  placeholder="e.g. 5"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                />
                <small className="form-hint">
                  Maximum number of people per booking
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₦) *</label>
                <input
                  type="number"
                  name="amount"
                  className="form-input"
                  placeholder="e.g. 50000"
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
                <button
                  type="submit"
                  className="modal-btn-submit"
                  disabled={loading}
                >
                  <Check size={16} /> {loading ? "Adding..." : "Add Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PACKAGE MODAL --- */}
      {showEditModal && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-area">
                <h2>Edit Package</h2>
                <p>Edit tour package</p>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setShowEditModal(false)}
              >
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
                  placeholder="Package name"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Package Type</label>
                <input
                  type="text"
                  name="packageType"
                  className="form-input"
                  placeholder="Package type"
                  value={formData.packageType}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of people</label>
                <input
                  type="text"
                  name="numberOfPeople"
                  className="form-input"
                  placeholder="Max people"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₦) *</label>
                <input
                  type="number"
                  name="amount"
                  className="form-input"
                  placeholder="Amount"
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
                <button
                  type="submit"
                  className="modal-btn-submit"
                  disabled={loading}
                >
                  <Check size={16} /> {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SUCCESS STATUS MODAL --- */}
      {showSuccessModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="alert-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="success-icon">✓</div>
            <h2 className="alert-title">Success!</h2>
            <p className="alert-message">{successMessage}</p>
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
        <div className="modal-backdrop" onClick={() => setDeleteTargetId(null)}>
          <div
            className="alert-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="alert-title">Delete Package</h2>
            <p className="alert-message">
              Are you sure you want to delete this package? This action cannot
              be undone.
            </p>
            <div className="alert-actions-row">
              <button
                className="alert-btn-cancel"
                onClick={() => setDeleteTargetId(null)}
              >
                Cancel
              </button>
              <button
                className="alert-btn-delete"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageSettings;
