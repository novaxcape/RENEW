// PackageSettings.jsx - FULLY EDITED WITH ALL FIXES
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
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  getAllPackages,
  deletePackage,
  createPackage,
  updatePackage,
  getVendorAllCentres,
} from "../redox/apiSlice";
import "./css/Package.css";

const PackageSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [centreId, setCentreId] = useState(null);
  const [hasCentre, setHasCentre] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    packageName: "",
    packageType: "",
    numberOfPeople: "",
    amount: "",
  });

  // Get data from Redux
  const { packagesLoading, vendorCentres } = useSelector((state) => state.api);

  // Load vendor centres and set centre ID
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // First check if we already have centres in Redux
        if (vendorCentres && vendorCentres.length > 0) {
          const centre = vendorCentres[0];
          const id = centre?.id || centre?._id;
          if (id) {
            console.log("✅ Found centre in Redux:", id);
            setCentreId(id);
            setHasCentre(true);
            await fetchPackages(id);
            setLoading(false);
            return;
          }
        }

        // Try to get centres from API
        console.log("📄 Fetching vendor centres...");
        const result = await dispatch(getVendorAllCentres()).unwrap();

        if (result?.data && result.data.length > 0) {
          const centre = result.data[0];
          const id = centre?.id || centre?._id;

          if (id) {
            console.log("✅ Found centre from API:", id);
            setCentreId(id);
            setHasCentre(true);
            localStorage.setItem("centreId", id);
            await fetchPackages(id);
          }
        } else {
          console.warn("⚠️ No centres found for this vendor");
          setHasCentre(false);
          setCentreId(null);
        }
      } catch (error) {
        console.error("❌ Error loading centres:", error);
        // Fallback to localStorage
        const storedId = localStorage.getItem("centreId");
        if (storedId) {
          console.log("📄 Using stored centre ID:", storedId);
          setCentreId(storedId);
          setHasCentre(true);
          await fetchPackages(storedId);
        } else {
          setHasCentre(false);
          setCentreId(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const fetchPackages = async (id) => {
    if (!id) {
      console.warn("⚠️ No centre ID to fetch packages");
      return;
    }

    try {
      console.log(`📦 Fetching packages for centre: ${id}`);
      const result = await dispatch(getAllPackages(id)).unwrap();
      const packageList = result?.data || result?.packages || result || [];
      setPackages(Array.isArray(packageList) ? packageList : []);
      console.log(`✅ Found ${packageList.length} packages`);
    } catch (error) {
      console.error("❌ Error fetching packages:", error);
      setPackages([]);
    }
  };

  // Handle Add Package
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!formData.packageName || !formData.packageType || !formData.amount) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    if (!centreId) {
      Swal.fire({
        icon: "error",
        title: "No Tourist Centre",
        text: "Please register a tourist centre first.",
        confirmButtonColor: "#ff6b35",
        confirmButtonText: "Register Centre",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/add-centre");
        }
      });
      return;
    }

    try {
      // FIX: amount sent as Number, numberOfPeople as String per API schema
      const packageData = {
        packageName: formData.packageName,
        packageType: formData.packageType,
        numberOfPeople: String(formData.numberOfPeople || "1"),
        amount: Number(formData.amount || 0),
      };

      console.log(`📦 Creating package for centre: ${centreId}`, packageData);
      await dispatch(createPackage({ touristId: centreId, packageData })).unwrap();

      setShowAddModal(false);
      setFormData({ id: "", packageName: "", packageType: "", numberOfPeople: "", amount: "" });

      Swal.fire({
        icon: "success",
        title: "Package Created!",
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchPackages(centreId);
    } catch (error) {
      console.error("❌ Error creating package:", error);
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: typeof error === "string" ? error : "Failed to create package.",
        confirmButtonColor: "#ff6b35",
      });
    }
  };

  // Handle Edit Package
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!formData.packageName || !formData.packageType || !formData.amount) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    if (!formData.id) {
      Swal.fire({
        icon: "error",
        title: "Missing Package ID",
        text: "Could not identify package to update.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    try {
      // FIX: amount sent as Number, numberOfPeople as String per API schema
      const packageData = {
        packageName: formData.packageName,
        packageType: formData.packageType,
        numberOfPeople: String(formData.numberOfPeople || "1"),
        amount: Number(formData.amount || 0),
      };

      console.log(`📦 Updating package ${formData.id}`, packageData);
      await dispatch(updatePackage({ id: formData.id, packageData })).unwrap();

      setShowEditModal(false);
      setFormData({ id: "", packageName: "", packageType: "", numberOfPeople: "", amount: "" });

      Swal.fire({
        icon: "success",
        title: "Package Updated!",
        timer: 1500,
        showConfirmButton: false,
      });

      // Refresh list so UI reflects latest data from server
      if (centreId) await fetchPackages(centreId);
    } catch (error) {
      console.error("❌ Error updating package:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: typeof error === "string" ? error : "Failed to update package.",
        confirmButtonColor: "#ff6b35",
      });
    }
  };

  // Handle Delete Package
  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await dispatch(deletePackage(deleteTargetId)).unwrap();
      setDeleteTargetId(null);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false,
      });

      if (centreId) await fetchPackages(centreId);
    } catch (error) {
      console.error("❌ Error deleting package:", error);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: typeof error === "string" ? error : "Failed to delete package.",
        confirmButtonColor: "#ff6b35",
      });
      setDeleteTargetId(null);
    }
  };

  // Filter packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = (pkg.packageName || pkg.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Active" && pkg.status !== "inactive") ||
      (filterStatus === "Inactive" && pkg.status === "inactive");
    return matchesSearch && matchesStatus;
  });

  // Stats
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
      {/* Header */}
      <div className="package-header">
        <div>
          <h2>Package Settings</h2>
          <p>Manage your tour packages</p>
        </div>
        <button
          className="add-package-btn"
          onClick={() => {
            if (!hasCentre) {
              Swal.fire({
                icon: "warning",
                title: "No Tourist Centre",
                text: "Please register a tourist centre first.",
                confirmButtonColor: "#ff6b35",
                confirmButtonText: "Register Centre",
              }).then((result) => {
                if (result.isConfirmed) navigate("/vendor/add-centre");
              });
              return;
            }
            setFormData({ id: "", packageName: "", packageType: "", numberOfPeople: "", amount: "" });
            setShowAddModal(true);
          }}
        >
          <Plus size={18} />
          Add Package
        </button>
      </div>

      {/* Warning Banner - No Centre */}
      {!hasCentre && (
        <div
          className="warning-banner"
          style={{
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <AlertCircle size={24} color="#856404" />
          <div>
            <strong style={{ color: "#856404" }}>No Tourist Centre Found</strong>
            <p style={{ margin: "4px 0 0 0", color: "#856404" }}>
              You need to register a tourist centre before creating packages.
            </p>
          </div>
          <button
            onClick={() => navigate("/vendor/add-centre")}
            style={{
              marginLeft: "auto",
              padding: "8px 20px",
              background: "#ffc107",
              border: "none",
              borderRadius: "4px",
              color: "#212529",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Register Centre
          </button>
        </div>
      )}

      {/* Search & Filters */}
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

      {/* Stats */}
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

      {/* Package Table */}
      {filteredPackages.length === 0 ? (
        <div className="empty-state">
          <Inbox size={35} strokeWidth={1.5} />
          <h3>{hasCentre ? "No packages found" : "No tourist centre registered"}</h3>
          <p>
            {hasCentre
              ? "Add your first package to get started"
              : "Register a tourist centre first to create packages"}
          </p>
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
                // FIX: always resolve id with fallback to _id
                const pkgId = pkg.id || pkg._id;
                const packageName = pkg.packageName || pkg.name || "Unnamed";
                const price = pkg.amount || pkg.price || 0;
                const packageType = pkg.packageType || pkg.type || "Standard";
                const status = pkg.status || "active";
                const createdAt = pkg.createdAt
                  ? new Date(pkg.createdAt).toLocaleDateString()
                  : "N/A";

                return (
                  <tr key={pkgId}>
                    <td>
                      <div className="package-name-cell">
                        <span className="package-name">{packageName}</span>
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
                          onClick={() =>
                            navigate(`/vendor/package/${pkgId}`)
                          }
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => {
                            setFormData({
                              id: pkgId,
                              packageName: pkg.packageName || pkg.name || "",
                              packageType: pkg.packageType || pkg.type || "",
                              numberOfPeople:
                                pkg.numberOfPeople || pkg.maxPeople || "",
                              // Keep as string in the input, convert to Number on submit
                              amount: String(pkg.amount || pkg.price || ""),
                            });
                            setShowEditModal(true);
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => setDeleteTargetId(pkgId)}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div>
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
                <label>Package Name *</label>
                <input
                  type="text"
                  name="packageName"
                  className="form-input"
                  placeholder="e.g. Lekki Conservation Trail"
                  value={formData.packageName}
                  onChange={(e) =>
                    setFormData({ ...formData, packageName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Package Type *</label>
                <input
                  type="text"
                  name="packageType"
                  className="form-input"
                  placeholder="e.g. recreational centre"
                  value={formData.packageType}
                  onChange={(e) =>
                    setFormData({ ...formData, packageType: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of People *</label>
                <input
                  type="text"
                  name="numberOfPeople"
                  className="form-input"
                  placeholder="e.g. 10"
                  value={formData.numberOfPeople}
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfPeople: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount (₦) *</label>
                <input
                  type="number"
                  name="amount"
                  className="form-input short-input"
                  placeholder="e.g. 15000"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Edit Package</h2>
                <p>Update package details</p>
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
                <label>Package Name *</label>
                <input
                  type="text"
                  name="packageName"
                  className="form-input"
                  value={formData.packageName}
                  onChange={(e) =>
                    setFormData({ ...formData, packageName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Package Type *</label>
                <input
                  type="text"
                  name="packageType"
                  className="form-input"
                  value={formData.packageType}
                  onChange={(e) =>
                    setFormData({ ...formData, packageType: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of People *</label>
                <input
                  type="text"
                  name="numberOfPeople"
                  className="form-input"
                  value={formData.numberOfPeople}
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfPeople: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount (₦) *</label>
                <input
                  type="number"
                  name="amount"
                  className="form-input short-input"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
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
                  <Check size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTargetId && (
        <div className="modal-backdrop">
          <div className="alert-modal-card">
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
              <button className="alert-btn-delete" onClick={handleDelete}>
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
