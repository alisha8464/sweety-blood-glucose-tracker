import React from "react";
import "./Sidebar.css";


import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FaTint,
  FaHome,
  FaPlusCircle,
  FaHistory,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";


const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: <FaHome /> },
  { to: "/add-reading", label: "Add Reading", icon: <FaPlusCircle /> },
  { to: "/readings", label: "My Readings", icon: <FaHistory /> },
  { to: "/reports", label: "Reports", icon: <FaChartBar />, chevron: true },
];



const Sidebar = ({children}) => {
  const name=localStorage.getItem("name")
  const token=localStorage.getItem("token")
  const navigate=useNavigate()


  function handleLogout(){
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="app-shell">
      <div className="sidebar">
        <div className="sidebar-brand">
          <FaTint className="sidebar-brand-icon" />
          <div className="sidebar-brand-text">
            <p className="sidebar-brand-name">Sweety</p>
            <p className="sidebar-brand-tagline">Blood Glucose Tracker</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((each) => (
            <NavLink
              key={each.to}
              to={each.to}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <p className="nav-icon">{each.icon}</p>
              <p className="nav-label">{each.label}</p>
            </NavLink>
          ))}
          <button type="button" className="nav-item" onClick={handleLogout}>
            <span className="nav-icon">
              <FaSignOutAlt />
            </span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>
      </div>
      <div className="app-main">
        <header className="topbar">
          <div className="user-chip">
            <span className="user-avatar">
              {name ? name.charAt(0).toUpperCase() : <FaUser />}
            </span>
            <span>{name}</span>
            <FaChevronDown className="user-chevron" />
          </div>
        </header>

        <main className="app-content">{children}</main>
      </div>
     
    </div>

    
  );
};

export default Sidebar;
