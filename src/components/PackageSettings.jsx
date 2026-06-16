import React from "react";
import "./css/Package.css";
import {
  Search,
  Package,
  Check,
  X,
  Inbox,
  Plus,
} from "lucide-react";

const PackageSettings = () => {
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

        <button className="add-package-btn">
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
          />
        </div>

        <div className="filter-buttons">
          <button className="filter active">All</button>
          <button className="filter">Active</button>
          <button className="filter">Inactive</button>
          <span className="package-count">0 packages</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <Package size={18} />
          </div>
          <div>
            <h3>0</h3>
            <p>Total Packages</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <Check size={18} />
          </div>
          <div>
            <h3>0</h3>
            <p>Active</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <X size={18} />
          </div>
          <div>
            <h3>0</h3>
            <p>Inactive</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="empty-state">
        <Inbox size={35} strokeWidth={1.5} />
        <h3>No packages found</h3>
        <p>Add your first package to get started</p>
      </div>
    </div>
  );
};

export default PackageSettings;