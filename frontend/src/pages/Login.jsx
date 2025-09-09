// src/pages/Login.jsx

import React, { useState } from 'react';
import { Heart, Info, Eye, EyeOff, Shield } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin();
    };

    return (
        <div id="login-screen" className="screen active">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="logo"><Heart /></div>
                        <h1>MediSync</h1>
                        <p>Healthcare Integration Platform</p>
                    </div>

                    <div className="demo-warning">
                        <Info />
                        <div className="warning-content">
                            <strong>Demo Mode</strong>
                            <p>Enter any ABHA ID and password to login and explore the platform</p>
                        </div>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="abha-id">ABHA ID</label>
                            <input type="text" id="abha-id" placeholder="Enter any ABHA ID (demo)" required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Enter any password (demo)"
                                    required
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="login-btn">Sign In Securely</button>
                        <div className="divider"><span>Or continue with</span></div>
                        <button type="button" className="oauth-btn">OAuth Login</button>
                    </form>

                    <div className="security-info">
                        <Shield />
                        <span>Secured with end-to-end encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;