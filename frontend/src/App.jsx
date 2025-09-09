// src/App.jsx

import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    });

    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div id="main-app" className="screen active">
            <Sidebar
                onLogout={handleLogout}
                isCollapsed={isSidebarCollapsed}
                onToggle={toggleSidebar}
            />
            <Dashboard />
        </div>
    );
}

export default App;