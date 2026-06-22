// Pages/Vendor/PackageSettings.jsx
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
import Swal from "sweetalert2";
import { getAllPackages, deletePackage } from "../redox/apiSlice"
import "./css/Package.css";

const PackageSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get packages from Redux state
  const { packages: packagesFromRedux, packagesLoading } = useSelector(
    (state) => state.api
  );
  const { vendorCentres } = useSelector((state) => state.api);
  const { vendorId } = useSelector((state) => state.auth);

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
      console.log("Fetched packages:", result);
      
      // Extract packages from response
      const packageList = result?.data || result?.packages || result || [];
      setPackages(packageList);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete package
  const handleDelete = async (packageId, packageName) => {
    const result = await Swal.fire({
      title: "Delete Package",
      text: `Are you sure you want to delete "${packageName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deletePackage(packageId)).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Package has been deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        // Refresh package list
        if (centreId) {
          fetchPackages(centreId);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: error.message || "Failed to delete package.",
        });
      }
    }
  };

  // Handle edit package
  const handleEdit = (packageId) => {
    navigate(`/vendor/edit-package/${packageId}`);
  };

  // Handle view package
  const handleView = (packageId) => {
    navigate(`/vendor/package/${packageId}`);
  };

  // Handle add package
  const handleAddPackage = () => {
    navigate("/vendor/add-package");
  };

  // Filter packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "All" ||
                         (filterStatus === "Active" && pkg.status !== "inactive") ||
                         (filterStatus === "Inactive" && pkg.status === "inactive");
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalPackages = packages.length;
  const activePackages = packages.filter(p => p.status !== "inactive").length;
  const inactivePackages = packages.filter(p => p.status === "inactive").length;

  // Loading state
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
          <p>
            Manage your tour packages — view, edit, and control availability
          </p>
        </div>

        <button className="add-package-btn" onClick={handleAddPackage}>
          <Plus size={18} />
          Add Package
        </button>
      </div>

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

      {/* Package List or Empty State */}
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
                const createdAt = pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString() : "N/A";

                return (
                  <tr key={pkg.id || pkg._id}>
                    <td>
                      <div className="package-name-cell">
                        <span className="package-name">{packageName}</span>
                        {pkg.description && (
                          <span className="package-desc">{pkg.description.slice(0, 50)}...</span>
                        )}
                      </div>
                    </td>
                    <td className="package-price">₦{price.toLocaleString()}</td>
                    <td>
                      <span className="package-type-badge">{packageType}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${status === "inactive" ? "inactive" : "active"}`}>
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
                          onClick={() => handleEdit(pkg.id || pkg._id)}
                          title="Edit Package"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(pkg.id || pkg._id, packageName)}
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
    </div>
  );
};

export default PackageSettings;