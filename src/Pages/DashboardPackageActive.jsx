 import React, { useState } from 'react';
import '../Styles/DashboardPackageActive.css';

// Mock Data representing the tour packages
const INITIAL_PACKAGES = [
  {
    id: 1,
    title: 'Lekki conservation family',
    category: 'Nature & Wildlife',
    description: 'Guided walk through the conservation centre with canopy walkway experience.',
    status: 'active',
  },
];

export default function PackageSettings() {
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive'

  // Counters
  const totalPackages = packages.length;
  const activePackages = packages.filter(p => p.status === 'active').length;
  const inactivePackages = packages.filter(p => p.status === 'inactive').length;

  // Filtered List
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && pkg.status === statusFilter.toLowerCase();
  });

  return (
    <div className="admin-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="logo-section">
          <h2 className="logo-text">nova<span>xcape</span></h2>
          <p className="sub-logo">Admin Portal</p>
        </div>
        
        <nav className="nav-menu">
          <button className="nav-item"><i className="icon-dashboard"></i> Dashboard</button>
          <button className="nav-item"><i className="icon-bookings"></i> Bookings</button>
          <button className="nav-item"><i className="icon-revenue"></i> Revenue Trend</button>
          <button className="nav-item active"><i className="icon-packages"></i> Packages</button>
          <button className="nav-item"><i className="icon-settings"></i> Settings</button>
          <button className="nav-item"><i className="icon-support"></i> Support</button>
        </nav>

        <div className="sidebar-footer">
          <p className="footer-label">Accounts</p>
          <button className="exit-btn">
            <span className="exit-icon">➔</span> Exit Partner Portal
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        {/* TOP BAR */}
        <header className="top-bar">
          <div className="top-bar-left">
            <span className="analytics-link">Analytics</span>
            <div className="ticket-search-wrapper">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search by ticket id..." className="ticket-search" />
            </div>
          </div>
          
          <div className="top-bar-right">
            <div className="notification-bell">
              <span className="bell-icon">🔔</span>
              <span className="bell-dot"></span>
            </div>
            <div className="user-profile">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="Admin Profile" 
                className="avatar" 
              />
              <div className="user-info">
                <span className="username">Lekki CC <small>▼</small></span>
                <span className="role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <main className="workspace">
          <div className="page-header">
            <div className="header-titles">
              <h1>Package Settings</h1>
              <p>Manage your tour packages — view, edit, and control availability</p>
            </div>
            <button className="add-package-btn">+ Add Package</button>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="filter-bar">
            <div className="search-box-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search packages..." 
                className="package-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
                onClick={() => setStatusFilter('All')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'Active' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Active')}
              >
                Active
              </button>
              <button 
                className={`filter-btn ${statusFilter === 'Inactive' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Inactive')}
              >
                Inactive
              </button>
              <span className="package-count">{filteredPackages.length} package(s)</span>
            </div>
          </div>

          {/* METRIC CARDS */}
          <section className="metrics-grid">
            <div className="metric-card total-card">
              <div className="metric-icon-box blue-box">📦</div>
              <div className="metric-info">
                <h3>{totalPackages}</h3>
                <p>Total Packages</p>
              </div>
            </div>
            <div className="metric-card active-card">
              <div className="metric-icon-box green-box">✓</div>
              <div className="metric-info">
                <h3>{activePackages}</h3>
                <p>Active</p>
              </div>
            </div>
            <div className="metric-card inactive-card">
              <div className="metric-icon-box orange-box">✕</div>
              <div className="metric-info">
                <h3>{inactivePackages}</h3>
                <p>Inactive</p>
              </div>
            </div>
          </section>

          {/* PACKAGE LIST CARD */}
          <section className="packages-list">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="package-item-card">
                <div className="card-indicator"></div>
                <div className="card-body">
                  <div className="card-header-row">
                    <h2 className="package-title">{pkg.title}</h2>
                    <div className="card-actions">
                      <button className="action-btn edit-btn-icon" title="Edit">✏️</button>
                      <button className="action-btn delete-btn-icon" title="Delete">🗑️</button>
                    </div>
                  </div>
                  <span className="category-badge">{pkg.category}</span>
                  <p className="package-description">{pkg.description}</p>
                </div>
              </div>
            ))}
            {filteredPackages.length === 0 && (
              <p className="no-data">No packages found matching your criteria.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}