// src/pages/Dashboard.jsx

import React from 'react';
import { Users, RefreshCw, FileText, CheckCircle, Search, ArrowRight, Upload } from 'lucide-react';

const Dashboard = () => {
    return (
        <main className="main-content" id="main-content">
            <div id="dashboard-screen" className="content-screen active">
                <div className="page-header">
                    <h1>Welcome back, Dr. Sharma</h1>
                    <p>Here's what's happening with your patients today</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card blue"><div className="stat-info"><h3>Total Patients</h3><p className="stat-number">1,247</p><span className="stat-change positive">+12%</span></div><div className="stat-icon"><Users /></div></div>
                    <div className="stat-card green"><div className="stat-info"><h3>Codes Translated</h3><p className="stat-number">856</p><span className="stat-change positive">+8%</span></div><div className="stat-icon"><RefreshCw /></div></div>
                    <div className="stat-card purple"><div className="stat-info"><h3>Active Records</h3><p className="stat-number">432</p><span className="stat-change positive">+15%</span></div><div className="stat-icon"><FileText /></div></div>
                    <div className="stat-card emerald"><div className="stat-info"><h3>Success Rate</h3><p className="stat-number">98.5%</p><span className="stat-change positive">+2%</span></div><div className="stat-icon"><CheckCircle /></div></div>
                </div>

                <div className="dashboard-content">
                    <div className="main-panel">
                        <div className="search-card">
                            <h3>Smart Search Assistant</h3>
                            <div className="search-input"><Search /><input type="text" placeholder="Search symptoms, diagnoses, or patient records..." /></div>
                        </div>
                        <div className="recent-translations">
                            <h3>Recent Translations</h3>
                            <div className="translation-list">
                                <div className="translation-item"><div className="translation-info"><h4>Jwara (Fever)</h4><p>MD90 - Fever, unspecified</p></div><div className="translation-meta"><span className="time">2 mins ago</span><CheckCircle className="success" /></div></div>
                                <div className="translation-item"><div className="translation-info"><h4>Kasa (Cough)</h4><p>MD12 - Cough</p></div><div className="translation-meta"><span className="time">15 mins ago</span><CheckCircle className="success" /></div></div>
                            </div>
                        </div>
                    </div>
                    <div className="side-panel">
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <button className="action-btn"><RefreshCw /><span>Translate Code</span><ArrowRight /></button>
                                <button className="action-btn"><Upload /><span>Upload Records</span><ArrowRight /></button>
                            </div>
                        </div>
                        <div className="system-status">
                            <h3>System Status</h3>
                            <div className="status-items">
                                <div className="status-item"><span>ABHA Integration</span><div className="status-badge active">Active</div></div>
                                <div className="status-item"><span>EMR Sync</span><div className="status-badge active">Active</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;