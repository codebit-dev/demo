// src/components/Sidebar.jsx

import React from 'react';
import { Heart, Menu, BarChart3, RefreshCw, Upload, Activity, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ onLogout, isCollapsed, onToggle }) => {
    return (
        <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <div className="brand-icon"><Heart /></div>
                    <span className="brand-text">MediSync</span>
                </div>
                <button className="sidebar-toggle" id="sidebar-toggle" onClick={onToggle}>
                    <Menu />
                </button>
            </div>

            <div className="nav-menu">
                <button className="nav-item active"><BarChart3 /><span>Dashboard</span></button>
                <button className="nav-item"><RefreshCw /><span>Code Translator</span></button>
                <button className="nav-item"><Upload /><span>Patient Records</span></button>
                <button className="nav-item"><Activity /><span>Analytics</span></button>
                <button className="nav-item"><Settings /><span>Settings</span></button>
            </div>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogout}>
                    <LogOut /><span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;