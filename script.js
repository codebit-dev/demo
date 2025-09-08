class MediSyncApp {
    constructor() {
        this.currentScreen = 'login';
        this.sidebarCollapsed = false;
        this.isMobile = window.innerWidth < 1024;
        this.sidebarOpen = false;
        
        this.init();
    }

    init() {
        // Ensure login screen is shown first
        this.showScreen('login');
        this.setupEventListeners();
        this.initializeIcons();
        this.handleResponsive();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Password toggle
        const passwordToggle = document.querySelector('.password-toggle');
        const passwordInput = document.getElementById('password');
        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', () => {
                this.togglePassword(passwordInput, passwordToggle);
            });
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        // Quick action buttons
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // File upload
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => {
                fileInput.click();
            });

            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--primary-blue)';
                uploadZone.style.backgroundColor = '#fafbff';
            });

            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
                
                const files = Array.from(e.dataTransfer.files);
                this.handleFileUpload(files);
            });

            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                this.handleFileUpload(files);
            });
        }

        // Toggle switches
        const toggleSwitches = document.querySelectorAll('.toggle-switch');
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        });

        // Translation functionality
        const translateBtn = document.querySelector('.translate-btn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => {
                this.handleTranslation();
            });
        }

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResponsive();
        });

        // Click outside sidebar on mobile
        document.addEventListener('click', (e) => {
            if (this.isMobile && this.sidebarOpen) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebar-toggle');
                
                if (sidebar && !sidebar.contains(e.target) && 
                    sidebarToggle && !sidebarToggle.contains(e.target)) {
                    this.closeMobileSidebar();
                }
            }
        });
    }

    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    handleResponsive() {
        this.isMobile = window.innerWidth < 1024;
        const sidebar = document.getElementById('sidebar');
        
        if (this.isMobile) {
            if (sidebar) {
                sidebar.classList.remove('collapsed');
                if (!this.sidebarOpen) {
                    sidebar.style.left = '-256px';
                }
            }
        } else {
            if (sidebar) {
                sidebar.style.left = '0';
                if (this.sidebarCollapsed) {
                    sidebar.classList.add('collapsed');
                }
            }
            this.sidebarOpen = false;
        }
    }

    showScreen(screenName) {
        console.log('Switching to screen:', screenName); // Debug log
        
        // Hide ALL screens first
        const allScreens = document.querySelectorAll('.screen');
        const allContentScreens = document.querySelectorAll('.content-screen');
        
        allScreens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        allContentScreens.forEach(screen => {
            screen.classList.remove('active');
        });

        if (screenName === 'login') {
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) {
                loginScreen.classList.add('active');
                console.log('Login screen activated'); // Debug log
            }
        } else {
            const mainApp = document.getElementById('main-app');
            const contentScreen = document.getElementById(`${screenName}-screen`);
            
            if (mainApp) {
                mainApp.classList.add('active');
                console.log('Main app activated'); // Debug log
            }
            if (contentScreen) {
                contentScreen.classList.add('active');
                contentScreen.classList.add('fade-in');
                console.log('Content screen activated:', screenName); // Debug log
            }
        }

        this.currentScreen = screenName;
        
        // Reinitialize icons after screen change
        setTimeout(() => {
            this.initializeIcons();
        }, 100);
    }

    navigateToScreen(screenName) {
        this.showScreen(screenName);
        this.updateActiveNavItem(screenName);
        
        if (this.isMobile) {
            this.closeMobileSidebar();
        }
    }

    updateActiveNavItem(screenName) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === screenName) {
                item.classList.add('active');
            }
        });
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.toggleMobileSidebar();
        } else {
            this.toggleDesktopSidebar();
        }
    }

    toggleDesktopSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        if (sidebar) {
            sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
        }
        
        if (sidebarToggle) {
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', this.sidebarCollapsed ? 'menu' : 'x');
                this.initializeIcons();
            }
        }
    }

    toggleMobileSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const sidebar = document.getElementById('sidebar');
        
        if (sidebar) {
            if (this.sidebarOpen) {
                sidebar.classList.add('open');
                sidebar.style.left = '0';
            } else {
                sidebar.classList.remove('open');
                sidebar.style.left = '-256px';
            }
        }
    }

    closeMobileSidebar() {
        if (this.isMobile && this.sidebarOpen) {
            this.sidebarOpen = false;
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
                sidebar.style.left = '-256px';
            }
        }
    }

    togglePassword(input, toggle) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            this.initializeIcons();
        }
    }

    handleLogin() {
        const abhaId = document.getElementById('abha-id').value;
        const password = document.getElementById('password').value;
        
        // For demo purposes, accept any input
        if (!abhaId.trim() || !password.trim()) {
            this.showNotification('Please enter any ABHA ID and password to continue', 'warning');
            return;
        }

        // Simulate login process
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Signing In...';
            loginBtn.disabled = true;
        }

        setTimeout(() => {
            this.showNotification('Login successful! Welcome to MediSync', 'success');
            this.showScreen('dashboard'); // This should hide login and show dashboard
            this.updateActiveNavItem('dashboard');
            
            if (loginBtn) {
                loginBtn.textContent = 'Sign In Securely';
                loginBtn.disabled = false;
            }
        }, 1500);
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showScreen('login');
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.querySelector('.login-form');
        if (form) {
            form.reset();
        }
    }

    handleFileUpload(files) {
        if (files.length === 0) return;

        files.forEach(file => {
            if (this.validateFile(file)) {
                this.uploadFile(file);
            } else {
                this.showNotification(`Invalid file type: ${file.name}`, 'error');
            }
        });
    }

    validateFile(file) {
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        return allowedTypes.includes(file.type);
    }

    uploadFile(file) {
        // Simulate file upload
        this.showNotification(`Uploading ${file.name}...`, 'info');
        
        setTimeout(() => {
            this.showNotification(`Successfully uploaded ${file.name}`, 'success');
            this.addToUploadHistory(file);
        }, 2000);
    }

    addToUploadHistory(file) {
        // Add file to upload history (simplified)
        console.log('File uploaded:', file.name, file.size);
    }

    handleTranslation() {
        const textarea = document.querySelector('.translator-input textarea');
        if (!textarea || !textarea.value.trim()) {
            this.showNotification('Please enter text to translate', 'error');
            return;
        }

        const translateBtn = document.querySelector('.translate-btn');
        if (translateBtn) {
            translateBtn.textContent = 'Translating...';
            translateBtn.disabled = true;
        }

        // Simulate translation process
        setTimeout(() => {
            this.showNotification('Translation completed successfully', 'success');
            
            if (translateBtn) {
                translateBtn.textContent = 'Translate';
                translateBtn.disabled = false;
            }
        }, 2000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            maxWidth: '300px',
            wordWrap: 'break-word',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility methods
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MediSyncApp();
    
    // Make app globally available for debugging
    window.MediSync = app;
});

// Handle any uncaught errors gracefully
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
});
/* Screen Management - FIXED */
.screen {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
}

.screen.active {
    display: block;
}

.content-screen {
    display: none;
    padding: 2rem;
}

.content-screen.active {
    display: block;
}

/* Ensure login screen covers everything */
#login-screen {
    background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
    z-index: 2000;
}

#main-app {
    position: relative;
    z-index: 1000;
    display: flex;
    height: 100vh;
}

/* Demo Warning Styles */
.demo-warning {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border: 1px solid #f59e0b;
    border-radius: var(--border-radius);
    padding: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    animation: pulse-warning 2s infinite;
}

.demo-warning i {
    color: #d97706;
    width: 20px;
    height: 20px;
    margin-top: 0.125rem;
    flex-shrink: 0;
}

.warning-content {
    flex: 1;
}

.warning-content strong {
    color: #92400e;
    font-weight: 600;
    display: block;
    margin-bottom: 0.25rem;
}

.warning-content p {
    color: #a16207;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.4;
}

@keyframes pulse-warning {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
    }
    50% {
        box-shadow: 0 0 0 8px rgba(245, 158, 11, 0);
    }
}

/* Login Screen */
.login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.login-card {
    background: var(--white);
    border-radius: 16px;
    box-shadow: var(--shadow-lg);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.logo {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
}

.logo i {
    color: var(--white);
    width: 32px;
    height: 32px;
}

.login-header h1 {
    font-size: 2rem;
    font-weight: bold;
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
}

.login-header p {
    color: var(--gray-600);
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-group label {
    font-weight: 500;
    color: var(--gray-700);
}

.input-group input {
    padding: 0.75rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: var(--transition);
}

.input-group input:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-group input::placeholder {
    color: #9ca3af;
    font-style: italic;
}

.password-input {
    position: relative;
}

.password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray-600);
    padding: 0.25rem;
    border-radius: 4px;
    transition: var(--transition);
}

.password-toggle:hover {
    background-color: var(--gray-100);
}

.login-btn {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
    color: var(--white);
    border: none;
    padding: 0.75rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.login-btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
}

.divider {
    position: relative;
    text-align: center;
    margin: 1rem 0;
}

.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: var(--gray-300);
}

.divider span {
    background-color: var(--white);
    padding: 0 1rem;
    color: var(--gray-600);
    font-size: 0.875rem;
}

.oauth-btn {
    background: var(--white);
    border: 1px solid var(--gray-300);
    padding: 0.75rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.oauth-btn:hover {
    background-color: var(--gray-50);
}

.security-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
    color: var(--gray-600);
    font-size: 0.875rem;
}

.security-info i {
    width: 16px;
    height: 16px;
}

/* Sidebar */
.sidebar {
    width: 256px;
    background: var(--white);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    transition: var(--transition);
    z-index: 1000;
}

.sidebar.collapsed {
    width: 64px;
}

.sidebar-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--gray-200);
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.brand-icon {
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
    width: 40px;
    height: 40px;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
}

.brand-icon i {
    color: var(--white);
    width: 24px;
    height: 24px;
}

.brand-text {
    font-weight: bold;
    font-size: 1.25rem;
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-green));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.sidebar.collapsed .brand-text {
    display: none;
}

.sidebar-toggle {
    background: none;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: var(--transition);
}

.sidebar-toggle:hover {
    background-color: var(--gray-100);
}

.nav-menu {
    flex: 1;
    padding: 1rem 0;
}

.nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: var(--transition);
    color: var(--gray-700);
}

.nav-item:hover {
    background-color: #eff6ff;
}

.nav-item.active {
    background-color: #eff6ff;
    color: var(--primary-blue);
    border-right: 2px solid var(--primary-blue);
}

.nav-item i {
    width: 20px;
    height: 20px;
}

.sidebar.collapsed .nav-item span {
    display: none;
}

.sidebar-footer {
    padding: 1rem;
    border-top: 1px solid var(--gray-200);
}

.logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: var(--transition);
    color: var(--gray-700);
    border-radius: var(--border-radius);
}

.logout-btn:hover {
    background-color: #fef2f2;
    color: var(--danger);
}

.sidebar.collapsed .logout-btn span {
    display: none;
}

/* Main Content */
.main-content {
    flex: 1;
    overflow-y: auto;
    transition: var(--transition);
}

.page-header {
    margin-bottom: 2rem;
}

.page-header h1 {
    font-size: 2rem;
    font-weight: bold;
    color: var(--gray-800);
    margin-bottom: 0.5rem;
}

.page-header p {
    color: var(--gray-600);
}

/* Dashboard */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: var(--white);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
}

.stat-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
}

.stat-card.blue::before { background-color: var(--primary-blue); }
.stat-card.green::before { background-color: var(--primary-green); }
.stat-card.purple::before { background-color: var(--primary-purple); }
.stat-card.emerald::before { background-color: var(--primary-emerald); }

.stat-info h3 {
    color: var(--gray-600);
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: var(--gray-800);
    margin-bottom: 0.25rem;
}

.stat-change {
    font-size: 0.875rem;
    font-weight: 500;
}

.stat-change.positive {
    color: var(--success);
}

.stat-icon {
    padding: 0.75rem;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-card.blue .stat-icon {
    background-color: #dbeafe;
    color: var(--primary-blue);
}

.stat-card.green .stat-icon {
    background-color: #dcfce7;
    color: var(--primary-green);
}

.stat-card.purple .stat-icon {
    background-color: #f3e8ff;
    color: var(--primary-purple);
}

.stat-card.emerald .stat-icon {
    background-color: #d1fae5;
    color: var(--primary-emerald);
}

.stat-icon i {
    width: 24px;
    height: 24px;
}

.dashboard-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}

.main-panel,
.side-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.search-card,
.recent-translations,
.quick-actions,
.system-status {
    background: var(--white);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: var(--shadow);
}

.search-card h3,
.recent-translations h3,
.quick-actions h3,
.system-status h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: 1rem;
}

.search-input {
    position: relative;
}

.search-input i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-600);
    width: 20px;
    height: 20px;
}

.search-input input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 1px solid var(--gray-200);
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: var(--transition);
}

.search-input input:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.translation-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.translation-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: var(--gray-50);
    border-radius: var(--border-radius);
}

.translation-info h4 {
    font-weight: 500;
    color: var(--gray-800);
    margin-bottom: 0.25rem;
}

.translation-info p {
    font-size: 0.875rem;
    color: var(--gray-600);
}

.translation-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
}

.time {
    font-size: 0.875rem;
    color: var(--gray-600);
}

.success {
    color: var(--success);
    width: 20px;
    height: 20px;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: none;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
    text-align: left;
    color: var(--gray-700);
}

.action-btn:hover {
    background-color: #eff6ff;
    color: var(--primary-blue);
}

.action-btn i:first-child {
    width: 20px;
    height: 20px;
}

.action-btn i:last-child {
    width: 16px;
    height: 16px;
    margin-left: auto;
    color: var(--gray-600);
}

.status-items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.status-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.status-badge.active {
    background-color: #dcfce7;
    color: var(--success);
}

/* Code Translator */
.translator-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.translator-input,
.translator-output {
    background: var(--white);
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
}

.translator-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.status-dot.orange {
    background-color: var(--warning);
}

.status-dot.green {
    background-color: var(--success);
}

.translator-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--gray-800);
}

.translator-input textarea {
    flex: 1;
    min-height: 256px;
    padding: 1rem;
    border: 1px solid var(--gray-200);
    border-radius: var(--border-radius);
    resize: none;
    font-family: inherit;
    font-size: 1rem;
    transition: var(--transition);
}

.translator-input textarea:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.output-content {
    flex: 1;
    min-height: 256px;
    padding: 1rem;
    background-color: var(--gray-50);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.code-match {
    background: var(--white);
    padding: 0.75rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
}

.code-match h4 {
    font-weight: 500;
    color: var(--gray-800);
    margin-bottom: 0.25rem;
}

.code-match p {
    font-size: 0.875rem;
    color: var(--gray-600);
}

.translator-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
}

.confidence {
    font-size: 0.875rem;
    color: var(--gray-600);
}

.status-complete {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: var(--success);
}

.status-complete i {
    width: 16px;
    height: 16px;
}

.translate-btn,
.save-btn {
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.translate-btn {
    background-color: var(--primary-blue);
    color: var(--white);
}

.translate-btn:hover {
    background-color: #2563eb;
}

.save-btn {
    background-color: var(--success);
    color: var(--white);
}

.save-btn:hover {
    background-color: #059669;
}

/* Upload Screen */
.upload-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.upload-area {
    background: var(--white);
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 2rem;
}

.upload-zone {
    border: 2px dashed var(--gray-300);
    border-radius: 12px;
    padding: 3rem;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
}

.upload-zone:hover {
    border-color: var(--primary-blue);
    background-color: #fafbff;
}

.upload-zone i {
    width: 64px;
    height: 64px;
    color: var(--gray-600);
    margin-bottom: 1rem;
}

.upload-zone h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: 0.5rem;
}

.upload-zone > p {
    color: var(--gray-600);
    margin-bottom: 1.5rem;
}

.upload-btn {
    background-color: var(--primary-blue);
    color: var(--white);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.upload-btn:hover {
    background-color: #2563eb;
}

.file-info {
    font-size: 0.875rem;
    color: var(--gray-600);
    margin-top: 1rem;
}

.upload-history {
    background: var(--white);
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 1.5rem;
}

.upload-history h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: 1rem;
}

.upload-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid var(--gray-200);
    border-radius: var(--border-radius);
}

.file-info-section {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.file-info-section i {
    width: 32px;
    height: 32px;
    color: var(--primary-blue);
}

.file-details h4 {
    font-weight: 500;
    color: var(--gray-800);
    margin-bottom: 0.25rem;
}

.file-details p {
    font-size: 0.875rem;
    color: var(--gray-600);
}

.upload-status {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.upload-time {
    font-size: 0.875rem;
    color: var(--gray-600);
}

/* Analytics */
.analytics-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.chart-card,
.success-rate-card {
    background: var(--white);
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 1.5rem;
}

.chart-card h3,
.success-rate-card h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: 1rem;
}

.chart-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.chart-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.chart-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
}

.chart-label span:first-child {
    font-weight: 500;
    color: var(--gray-800);
}

.chart-label span:last-child {
    color: var(--gray-600);
}

.progress-bar {
    height: 8px;
    background-color: var(--gray-200);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-green));
    border-radius: 4px;
    transition: width 0.5s ease;
}

.circular-progress {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
}

.progress-ring {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    background-color: var(--gray-200);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.progress-ring::before {
    content: '';
    position: absolute;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background-color: var(--success);
}

.progress-text {
    position: relative;
    z-index: 1;
    color: var(--white);
    font-size: 1.25rem;
    font-weight: bold;
}

.success-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    text-align: center;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.number {
    font-size: 1.5rem;
    font-weight: bold;
}

.number.success {
    color: var(--success);
}

.number.failed {
    color: var(--danger);
}

.label {
    font-size: 0.875rem;
    color: var(--gray-600);
}

/* Settings */
.settings-layout {
    display        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        // Quick action buttons
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // File upload
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => {
                fileInput.click();
            });

            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--primary-blue)';
                uploadZone.style.backgroundColor = '#fafbff';
            });

            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
                
                const files = Array.from(e.dataTransfer.files);
                this.handleFileUpload(files);
            });

            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                this.handleFileUpload(files);
            });
        }

        // Toggle switches
        const toggleSwitches = document.querySelectorAll('.toggle-switch');
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        });

        // Translation functionality
        const translateBtn = document.querySelector('.translate-btn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => {
                this.handleTranslation();
            });
        }

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResponsive();
        });

        // Click outside sidebar on mobile
        document.addEventListener('click', (e) => {
            if (this.isMobile && this.sidebarOpen) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebar-toggle');
                
                if (sidebar && !sidebar.contains(e.target) && 
                    sidebarToggle && !sidebarToggle.contains(e.target)) {
                    this.closeMobileSidebar();
                }
            }
        });
    }

    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    handleResponsive() {
        this.isMobile = window.innerWidth < 1024;
        const sidebar = document.getElementById('sidebar');
        
        if (this.isMobile) {
            if (sidebar) {
                sidebar.classList.remove('collapsed');
                if (!this.sidebarOpen) {
                    sidebar.style.left = '-256px';
                }
            }
        } else {
            if (sidebar) {
                sidebar.style.left = '0';
                if (this.sidebarCollapsed) {
                    sidebar.classList.add('collapsed');
                }
            }
            this.sidebarOpen = false;
        }
    }

    showScreen(screenName) {
        // Hide all screens
        const allScreens = document.querySelectorAll('.screen');
        const allContentScreens = document.querySelectorAll('.content-screen');
        
        allScreens.forEach(screen => screen.classList.remove('active'));
        allContentScreens.forEach(screen => screen.classList.remove('active'));

        if (screenName === 'login') {
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) {
                loginScreen.classList.add('active');
            }
        } else {
            const mainApp = document.getElementById('main-app');
            const contentScreen = document.getElementById(`${screenName}-screen`);
            
            if (mainApp) {
                mainApp.classList.add('active');
            }
            if (contentScreen) {
                contentScreen.classList.add('active');
                contentScreen.classList.add('fade-in');
            }
        }

        this.currentScreen = screenName;
        
        // Reinitialize icons after screen change
        setTimeout(() => {
            this.initializeIcons();
        }, 100);
    }

    navigateToScreen(screenName) {
        this.showScreen(screenName);
        this.updateActiveNavItem(screenName);
        
        if (this.isMobile) {
            this.closeMobileSidebar();
        }
    }

    updateActiveNavItem(screenName) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === screenName) {
                item.classList.add('active');
            }
        });
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.toggleMobileSidebar();
        } else {
            this.toggleDesktopSidebar();
        }
    }

    toggleDesktopSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        if (sidebar) {
            sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
        }
        
        if (sidebarToggle) {
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', this.sidebarCollapsed ? 'menu' : 'x');
                this.initializeIcons();
            }
        }
    }

    toggleMobileSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const sidebar = document.getElementById('sidebar');
        
        if (sidebar) {
            if (this.sidebarOpen) {
                sidebar.classList.add('open');
                sidebar.style.left = '0';
            } else {
                sidebar.classList.remove('open');
                sidebar.style.left = '-256px';
            }
        }
    }

    closeMobileSidebar() {
        if (this.isMobile && this.sidebarOpen) {
            this.sidebarOpen = false;
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
                sidebar.style.left = '-256px';
            }
        }
    }

    togglePassword(input, toggle) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            this.initializeIcons();
        }
    }

    handleLogin() {
        const abhaId = document.getElementById('abha-id').value;
        const password = document.getElementById('password').value;
        
        if (!abhaId || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate login process
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Signing In...';
            loginBtn.disabled = true;
        }

        setTimeout(() => {
            this.showScreen('dashboard');
            this.updateActiveNavItem('dashboard');
            
            if (loginBtn) {
                loginBtn.textContent = 'Sign In Securely';
                loginBtn.disabled = false;
            }
        }, 1500);
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showScreen('login');
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.querySelector('.login-form');
        if (form) {
            form.reset();
        }
    }

    handleFileUpload(files) {
        if (files.length === 0) return;

        files.forEach(file => {
            if (this.validateFile(file)) {
                this.uploadFile(file);
            } else {
                this.showNotification(`Invalid file type: ${file.name}`, 'error');
            }
        });
    }

    validateFile(file) {
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        return allowedTypes.includes(file.type);
    }

    uploadFile(file) {
        // Simulate file upload
        this.showNotification(`Uploading ${file.name}...`, 'info');
        
        setTimeout(() => {
            this.showNotification(`Successfully uploaded ${file.name}`, 'success');
            this.addToUploadHistory(file);
        }, 2000);
    }

    addToUploadHistory(file) {
        // Add file to upload history (simplified)
        console.log('File uploaded:', file.name, file.size);
    }

    handleTranslation() {
        const textarea = document.querySelector('.translator-input textarea');
        if (!textarea || !textarea.value.trim()) {
            this.showNotification('Please enter text to translate', 'error');
            return;
        }

        const translateBtn = document.querySelector('.translate-btn');
        if (translateBtn) {
            translateBtn.textContent = 'Translating...';
            translateBtn.disabled = true;
        }

        // Simulate translation process
        setTimeout(() => {
            this.showNotification('Translation completed successfully', 'success');
            
            if (translateBtn) {
                translateBtn.textContent = 'Translate';
                translateBtn.disabled = false;
            }
        }, 2000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            maxWidth: '300px',
            wordWrap: 'break-word',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility methods
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MediSyncApp();
    
    // Make app globally available for debugging
    window.MediSync = app;
});

// Handle any uncaught errors gracefully
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
});
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        window.addEventListener('resize', () => {
            this.handleResponsive();
        });
    }

    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    handleResponsive() {
        this.isMobile = window.innerWidth < 1024;
        const sidebar = document.getElementById('sidebar');
        
        if (this.isMobile) {
            if (sidebar) {
                sidebar.classList.remove('collapsed');
                if (!this.sidebarOpen) {
                    sidebar.style.left = '-256px';
                }
            }
        } else {
            if (sidebar) {
                sidebar.style.left = '0';
                if (this.sidebarCollapsed) {
                    sidebar.classList.add('collapsed');
                }
            }
            this.sidebarOpen = false;
        }
    }

    showScreen(screenName) {
        const allScreens = document.querySelectorAll('.screen');
        const allContentScreens = document.querySelectorAll('.content-screen');
        
        allScreens.forEach(screen => screen.classList.remove('active'));
        allContentScreens.forEach(screen => screen.classList.remove('active'));

        if (screenName === 'login') {
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) loginScreen.classList.add('active');
        } else {
            const mainApp = document.getElementById('main-app');
            const contentScreen = document.getElementById(`${screenName}-screen`);
            if (mainApp) mainApp.classList.add('active');
            if (contentScreen) contentScreen.classList.add('active');
        }

        this.currentScreen = screenName;
        setTimeout(() => this.initializeIcons(), 100);
    }

    navigateToScreen(screenName) {
        this.showScreen(screenName);
        this.updateActiveNavItem(screenName);
        if (this.isMobile) this.closeMobileSidebar();
    }

    updateActiveNavItem(screenName) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === screenName) {
                item.classList.add('active');
            }
        });
    }

    handleLogin() {
        const abhaId = document.getElementById('abha-id').value;
        const password = document.getElementById('password').value;
        
        if (!abhaId || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Signing In...';
            loginBtn.disabled = true;
        }

        setTimeout(() => {
            // ✅ Ensure login hides and dashboard shows
            this.showScreen('dashboard');
            this.updateActiveNavItem('dashboard');

            if (loginBtn) {
                loginBtn.textContent = 'Sign In Securely';
                loginBtn.disabled = false;
            }
        }, 1200);
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showScreen('login');
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.querySelector('.login-form');
        if (form) form.reset();
    }

    togglePassword(input, toggle) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            this.initializeIcons();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            maxWidth: '300px',
            wordWrap: 'break-word',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => { notification.remove(); }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.MediSync = new MediSyncApp();
});            oauthBtn.addEventListener('click', () => this.handleOAuthLogin());
        }

        // Sidebar navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Quick action buttons
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Translator
        const translateBtn = document.querySelector('.translate-btn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => this.performTranslation());
        }

        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveTranslation());
        }

        // Settings toggles
        const toggleSwitches = document.querySelectorAll('.toggle-switch');
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleSetting(toggle));
        });

        // Settings form
        const updateBtn = document.querySelector('.update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.updateProfile());
        }

        // Danger zone buttons
        const exportBtn = document.querySelector('.danger-btn.secondary');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        const deleteBtn = document.querySelector('.danger-btn.primary');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteAccount());
        }

        // Search functionality
        const searchInput = document.querySelector('.search-input input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Responsive sidebar for mobile
        if (window.innerWidth <= 1024) {
            this.setupMobileSidebar();
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1024) {
                this.setupMobileSidebar();
            }
        });
    }

    initializeLogin() {
        this.showScreen('login');
    }

    initializeSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 1024) {
            sidebar.classList.add('collapsed');
            this.sidebarCollapsed = true;
        }
    }

    setupMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        // Add overlay for mobile
        if (!document.querySelector('.sidebar-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                display: none;
            `;
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                this.closeMobileSidebar();
            });
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        
        if (window.innerWidth <= 1024) {
            // Mobile behavior
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebar.classList.contains('open')) {
                this.closeMobileSidebar();
            } else {
                sidebar.classList.add('open');
                overlay.style.display = 'block';
            }
        } else {
            // Desktop behavior
            sidebar.classList.toggle('collapsed');
            this.sidebarCollapsed = !this.sidebarCollapsed;
        }
    }

    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.remove('open');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const abhaId = document.getElementById('abha-id').value;
        const password = document.getElementById('password').value;
        
        if (!abhaId || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Show loading state
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Signing In...';
        loginBtn.disabled = true;

        // Simulate login process
        setTimeout(() => {
            this.showScreen('main-app');
            this.showContentScreen('dashboard');
            this.showNotification('Welcome back, Dr. Sharma!', 'success');
            
            // Reset button
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }, 1500);
    }

    handleOAuthLogin() {
        this.showNotification('OAuth login would redirect to authentication provider', 'info');
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('.password-toggle i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.setAttribute('data-lucide', 'eye-off');
        } else {
            passwordInput.type = 'password';
            toggleIcon.setAttribute('data-lucide', 'eye');
        }
        
        // Reinitialize lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    handleNavigation(e) {
        const target = e.currentTarget;
        const screen = target.getAttribute('data-screen');
        
        if (screen) {
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            if (target.classList.contains('nav-item')) {
                target.classList.add('active');
            } else {
                // For action buttons, find corresponding nav item
                const navItem = document.querySelector(`.nav-item[data-screen="${screen}"]`);
                if (navItem) {
                    navItem.classList.add('active');
                }
            }
            
            this.showContentScreen(screen);
            
            // Close mobile sidebar if open
            if (window.innerWidth <= 1024) {
                this.closeMobileSidebar();
            }
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showScreen('login');
            this.showNotification('You have been logged out successfully', 'info');
            
            // Clear form fields
            document.getElementById('abha-id').value = '';
            document.getElementById('password').value = '';
        }
    }

    showScreen(screenId) {
        // Hide all screens first
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.style.display = 'block';
            targetScreen.classList.add('active');
        }
        
        this.currentScreen = screenId;
    }

    showContentScreen(screenId) {
        document.querySelectorAll('.content-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(`${screenId}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.classList.add('fade-in');
        }
        
        this.currentContentScreen = screenId;
    }

    initializeUpload() {
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        const uploadBtn = document.querySelector('.upload-btn');
        
        if (uploadZone && fileInput) {
            // Drag and drop
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--primary-blue)';
                uploadZone.style.backgroundColor = '#fafbff';
            });
            
            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
                
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });
            
            // Click to upload
            uploadZone.addEventListener('click', () => {
                fileInput.click();
            });
            
            if (uploadBtn) {
                uploadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    fileInput.click();
                });
            }
            
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    handleFileUpload(files) {
        if (files.length === 0) return;
        
        Array.from(files).forEach(file => {
            // Validate file type
            const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (!validTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(csv|xlsx?|hl7|fhir)$/)) {
                this.showNotification(`File type not supported: ${file.name}`, 'error');
                return;
            }
            
            // Simulate upload
            this.simulateFileUpload(file);
        });
    }

    simulateFileUpload(file) {
        const uploadHistory = document.querySelector('.upload-history');
        
        // Create upload item
        const uploadItem = document.createElement('div');
        uploadItem.className = 'upload-item';
        uploadItem.innerHTML = `
            <div class="file-info-section">
                <i data-lucide="file-text"></i>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${this.formatFileSize(file.size)} • Processing...</p>
                </div>
            </div>
            <div class="upload-status">
                <div class="status-badge" style="background-color: #fef3c7; color: #d97706;">Processing</div>
                <span class="upload-time">Just now</span>
            </div>
        `;
        
        // Add to history
        const existingItem = uploadHistory.querySelector('.upload-item');
        if (existingItem) {
            uploadHistory.insertBefore(uploadItem, existingItem);
        } else {
            uploadHistory.appendChild(uploadItem);
        }
        
        // Simulate processing
        setTimeout(() => {
            const statusBadge = uploadItem.querySelector('.status-badge');
            const fileDetails = uploadItem.querySelector('.file-details p');
            
            statusBadge.className = 'status-badge active';
            statusBadge.textContent = 'Synced';
            
            const recordCount = Math.floor(Math.random() * 1000) + 100;
            fileDetails.innerHTML = `${this.formatFileSize(file.size)} • ${recordCount} records`;
            
            this.showNotification(`File uploaded successfully: ${recordCount} records processed`, 'success');
        }, 2000);
        
        // Reinitialize lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    initializeTranslator() {
        const translatorInput = document.querySelector('.translator-input textarea');
        const translatorOutput = document.querySelector('.output-content');
        
        if (translatorInput) {
            translatorInput.addEventListener('input', () => {
                this.updateConfidence();
            });
        }
        
        // Sample translations
        this.translations = {
            'jwara': { code: 'MD90', description: 'Fever, unspecified' },
            'fever': { code: 'MD90', description: 'Fever, unspecified' },
            'kasa': { code: 'MD12', description: 'Cough' },
            'cough': { code: 'MD12', description: 'Cough' },
            'shwasa': { code: 'MD20', description: 'Dyspnea' },
            'breathlessness': { code: 'MD20', description: 'Dyspnea' },
            'arsha': { code: '9B71', description: 'Hemorrhoids' },
            'piles': { code: '9B71', description: 'Hemorrhoids' }
        };
    }

    updateConfidence() {
        const input = document.querySelector('.translator-input textarea').value.toLowerCase();
        const confidence = document.querySelector('.confidence');
        
        let matchCount = 0;
        Object.keys(this.translations).forEach(term => {
            if (input.includes(term)) {
                matchCount++;
            }
        });
        
        let level = 'Low';
        if (matchCount >= 2) level = 'High';
        else if (matchCount >= 1) level = 'Medium';
        
        confidence.textContent = `Confidence: ${level}`;
    }

    performTranslation() {
        const input = document.querySelector('.translator-input textarea').value.toLowerCase();
        const outputContent = document.querySelector('.output-content');
        const statusDot = document.querySelector('.translator-output .status-dot');
        
        if (!input.trim()) {
            this.showNotification('Please enter text to translate', 'error');
            return;
        }
        
        // Show translating state
        outputContent.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--gray-600);">Translating...</div>';
        statusDot.className = 'status-dot orange';
        
        setTimeout(() => {
            let matches = [];
            
            Object.keys(this.translations).forEach(term => {
                if (input.includes(term)) {
                    matches.push({
                        term: term.charAt(0).toUpperCase() + term.slice(1),
                        ...this.translations[term]
                    });
                }
            });
            
            if (matches.length === 0) {
                outputContent.innerHTML = `
                    <div class="code-match">
                        <h4>No exact matches found</h4>
                        <p>Try entering common NAMASTE terminology like "Jwara", "Kasa", or "Shwasa"</p>
                    </div>
                `;
            } else {
                outputContent.innerHTML = matches.map(match => `
                    <div class="code-match">
                        <h4>${match.code} - ${match.description}</h4>
                        <p>Primary match for "${match.term}"</p>
                    </div>
                `).join('');
            }
            
            statusDot.className = 'status-dot green';
            this.showNotification('Translation completed successfully', 'success');
        }, 1000);
    }

    saveTranslation() {
        const input = document.querySelector('.translator-input textarea').value;
        const output = document.querySelector('.output-content').innerHTML;
        
        if (!input.trim() || output.includes('Translating...')) {
            this.showNotification('No translation to save', 'error');
            return;
        }
        
        // Add to recent translations
        this.addRecentTranslation(input);
        this.showNotification('Translation saved successfully', 'success');
    }

    addRecentTranslation(input) {
        const recentList = document.querySelector('.translation-list');
        if (!recentList) return;
        
        const firstTerm = input.split(/[(),\s]+/)[0];
        const translation = this.translations[firstTerm.toLowerCase()];
        
        if (translation) {
            const newItem = document.createElement('div');
            newItem.className = 'translation-item';
            newItem.innerHTML = `
                <div class="translation-info">
                    <h4>${firstTerm.charAt(0).toUpperCase() + firstTerm.slice(1)}</h4>
                    <p>${translation.code} - ${translation.description}</p>
                </div>
                <div class="translation-meta">
                    <span class="time">Just now</span>
                    <i data-lucide="check-circle" class="success"></i>
                </div>
            `;
            
            recentList.insertBefore(newItem, recentList.firstChild);
            
            // Keep only latest 5 items
            const items = recentList.querySelectorAll('.translation-item');
            if (items.length > 5) {
                items[items.length - 1].remove();
            }
            
            // Reinitialize lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    initializeSettings() {
        // Initialize form with default values
        const displayName = document.getElementById('display-name');
        const hospital = document.getElementById('hospital');
        const specialization = doc        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        // Quick action buttons
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // File upload
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => {
                fileInput.click();
            });

            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--primary-blue)';
                uploadZone.style.backgroundColor = '#fafbff';
            });

            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
                
                const files = Array.from(e.dataTransfer.files);
                this.handleFileUpload(files);
            });

            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                this.handleFileUpload(files);
            });
        }

        // Toggle switches
        const toggleSwitches = document.querySelectorAll('.toggle-switch');
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        });

        // Translation functionality
        const translateBtn = document.querySelector('.translate-btn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => {
                this.handleTranslation();
            });
        }

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResponsive();
        });

        // Click outside sidebar on mobile
        document.addEventListener('click', (e) => {
            if (this.isMobile && this.sidebarOpen) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebar-toggle');
                
                if (sidebar && !sidebar.contains(e.target) && 
                    sidebarToggle && !sidebarToggle.contains(e.target)) {
                    this.closeMobileSidebar();
                }
            }
        });
    }

    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    handleResponsive() {
        this.isMobile = window.innerWidth < 1024;
        const sidebar = document.getElementById('sidebar');
        
        if (this.isMobile) {
            if (sidebar) {
                sidebar.classList.remove('collapsed');
                if (!this.sidebarOpen) {
                    sidebar.style.left = '-256px';
                }
            }
        } else {
            if (sidebar) {
                sidebar.style.left = '0';
                if (this.sidebarCollapsed) {
                    sidebar.classList.add('collapsed');
                }
            }
            this.sidebarOpen = false;
        }
    }

    showScreen(screenName) {
        // Hide all screens
        const allScreens = document.querySelectorAll('.screen');
        const allContentScreens = document.querySelectorAll('.content-screen');
        
        allScreens.forEach(screen => screen.classList.remove('active'));
        allContentScreens.forEach(screen => screen.classList.remove('active'));

        if (screenName === 'login') {
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) {
                loginScreen.classList.add('active');
            }
        } else {
            const mainApp = document.getElementById('main-app');
            const contentScreen = document.getElementById(`${screenName}-screen`);
            
            if (mainApp) {
                mainApp.classList.add('active');
            }
            if (contentScreen) {
                contentScreen.classList.add('active');
                contentScreen.classList.add('fade-in');
            }
        }

        this.currentScreen = screenName;
        
        // Reinitialize icons after screen change
        setTimeout(() => {
            this.initializeIcons();
        }, 100);
    }

    navigateToScreen(screenName) {
        this.showScreen(screenName);
        this.updateActiveNavItem(screenName);
        
        if (this.isMobile) {
            this.closeMobileSidebar();
        }
    }

    updateActiveNavItem(screenName) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === screenName) {
                item.classList.add('active');
            }
        });
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.toggleMobileSidebar();
        } else {
            this.toggleDesktopSidebar();
        }
    }

    toggleDesktopSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        if (sidebar) {
            sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
        }
        
        if (sidebarToggle) {
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', this.sidebarCollapsed ? 'menu' : 'x');
                this.initializeIcons();
            }
        }
    }

    toggleMobileSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const sidebar = document.getElementById('sidebar');
        
        if (sidebar) {
            if (this.sidebarOpen) {
                sidebar.classList.add('open');
                sidebar.style.left = '0';
            } else {
                sidebar.classList.remove('open');
                sidebar.style.left = '-256px';
            }
        }
    }

    closeMobileSidebar() {
        if (this.isMobile && this.sidebarOpen) {
            this.sidebarOpen = false;
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
                sidebar.style.left = '-256px';
            }
        }
    }

    togglePassword(input, toggle) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            this.initializeIcons();
        }
    }

    handleLogin() {
        const abhaId = document.getElementById('abha-id').value;
        const password = document.getElementById('password').value;
        
        if (!abhaId || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate login process
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Signing In...';
            loginBtn.disabled = true;
        }

        setTimeout(() => {
            this.showScreen('dashboard');
            this.updateActiveNavItem('dashboard');
            
            if (loginBtn) {
                loginBtn.textContent = 'Sign In Securely';
                loginBtn.disabled = false;
            }
        }, 1500);
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showScreen('login');
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.querySelector('.login-form');
        if (form) {
            form.reset();
        }
    }

    handleFileUpload(files) {
        if (files.length === 0) return;

        files.forEach(file => {
            if (this.validateFile(file)) {
                this.uploadFile(file);
            } else {
                this.showNotification(`Invalid file type: ${file.name}`, 'error');
            }
        });
    }

    validateFile(file) {
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        return allowedTypes.includes(file.type);
    }

    uploadFile(file) {
        // Simulate file upload
        this.showNotification(`Uploading ${file.name}...`, 'info');
        
        setTimeout(() => {
            this.showNotification(`Successfully uploaded ${file.name}`, 'success');
            this.addToUploadHistory(file);
        }, 2000);
    }

    addToUploadHistory(file) {
        // Add file to upload history (simplified)
        console.log('File uploaded:', file.name, file.size);
    }

    handleTranslation() {
        const textarea = document.querySelector('.translator-input textarea');
        if (!textarea || !textarea.value.trim()) {
            this.showNotification('Please enter text to translate', 'error');
            return;
        }

        const translateBtn = document.querySelector('.translate-btn');
        if (translateBtn) {
            translateBtn.textContent = 'Translating...';
            translateBtn.disabled = true;
        }

        // Simulate translation process
        setTimeout(() => {
            this.showNotification('Translation completed successfully', 'success');
            
            if (translateBtn) {
                translateBtn.textContent = 'Translate';
                translateBtn.disabled = false;
            }
        }, 2000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            maxWidth: '300px',
            wordWrap: 'break-word',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility methods
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MediSyncApp();
    
    // Make app globally available for debugging
    window.MediSync = app;
});

// Handle any uncaught errors gracefully
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
});           uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--primary-blue)';
                uploadZone.style.backgroundColor = '#fafbff';
            });
            
            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
                
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });
            
            // Click to upload
            uploadZone.addEventListener('click', () => {
                fileInput.click();
            });
            
            if (uploadBtn) {
                uploadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    fileInput.click();
                });
            }
            
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    handleFileUpload(files) {
        if (files.length === 0) return;
        
        Array.from(files).forEach(file => {
            // Validate file type
            const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (!validTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(csv|xlsx?|hl7|fhir)$/)) {
                this.showNotification(`File type not supported: ${file.name}`, 'error');
                return;
            }
            
            // Simulate upload
            this.simulateFileUpload(file);
        });
    }

    simulateFileUpload(file) {
        const uploadHistory = document.querySelector('.upload-history');
        
        // Create upload item
        const uploadItem = document.createElement('div');
        uploadItem.className = 'upload-item';
        uploadItem.innerHTML = `
            <div class="file-info-section">
                <i data-lucide="file-text"></i>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${this.formatFileSize(file.size)} • Processing...</p>
                </div>
            </div>
            <div class="upload-status">
                <div class="status-badge" style="background-color: #fef3c7; color: #d97706;">Processing</div>
                <span class="upload-time">Just now</span>
            </div>
        `;
        
        // Add to history
        const existingItem = uploadHistory.querySelector('.upload-item');
        if (existingItem) {
            uploadHistory.insertBefore(uploadItem, existingItem);
        } else {
            uploadHistory.appendChild(uploadItem);
        }
        
        // Simulate processing
        setTimeout(() => {
            const statusBadge = uploadItem.querySelector('.status-badge');
            const fileDetails = uploadItem.querySelector('.file-details p');
            
            statusBadge.className = 'status-badge active';
            statusBadge.textContent = 'Synced';
            
            const recordCount = Math.floor(Math.random() * 1000) + 100;
            fileDetails.innerHTML = `${this.formatFileSize(file.size)} • ${recordCount} records`;
            
            this.showNotification(`File uploaded successfully: ${recordCount} records processed`, 'success');
        }, 2000);
        
        // Reinitialize lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    initializeTranslator() {
        const translatorInput = document.querySelector('.translator-input textarea');
        const translatorOutput = document.querySelector('.output-content');
        
        if (translatorInput) {
            translatorInput.addEventListener('input', () => {
                this.updateConfidence();
            });
        }
        
        // Sample translations
        this.translations = {
            'jwara': { code: 'MD90', description: 'Fever, unspecified' },
            'fever': { code: 'MD90', description: 'Fever, unspecified' },
            'kasa': { code: 'MD12', description: 'Cough' },
            'cough': { code: 'MD12', description: 'Cough' },
            'shwasa': { code: 'MD20', description: 'Dyspnea' },
            'breathlessness': { code: 'MD20', description: 'Dyspnea' },
            'arsha': { code: '9B71', description: 'Hemorrhoids' },
            'piles': { code: '9B71', description: 'Hemorrhoids' }
        };
    }

    updateConfidence() {
        const input = document.querySelector('.translator-input textarea').value.toLowerCase();
        const confidence = document.querySelector('.confidence');
        
        let matchCount = 0;
        Object.keys(this.translations).forEach(term => {
            if (input.includes(term)) {
                matchCount++;
            }
        });
        
        let level = 'Low';
        if (matchCount >= 2) level = 'High';
        else if (matchCount >= 1) level = 'Medium';
        
        confidence.textContent = `Confidence: ${level}`;
    }

    performTranslation() {
        const input = document.querySelector('.translator-input textarea').value.toLowerCase();
        const outputContent = document.querySelector('.output-content');
        const statusDot = document.querySelector('.translator-output .status-dot');
        
        if (!input.trim()) {
            this.showNotification('Please enter text to translate', 'error');
            return;
        }
        
        // Show translating state
        outputContent.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--gray-600);">Translating...</div>';
        statusDot.className = 'status-dot orange';
        
        setTimeout(() => {
            let matches = [];
            
            Object.keys(this.translations).forEach(term => {
                if (input.includes(term)) {
                    matches.push({
                        term: term.charAt(0).toUpperCase() + term.slice(1),
                        ...this.translations[term]
                    });
                }
            });
            
            if (matches.length === 0) {
                outputContent.innerHTML = `
                    <div class="code-match">
                        <h4>No exact matches found</h4>
                        <p>Try entering common NAMASTE terminology like "Jwara", "Kasa", or "Shwasa"</p>
                    </div>
                `;
            } else {
                outputContent.innerHTML = matches.map(match => `
                    <div class="code-match">
                        <h4>${match.code} - ${match.description}</h4>
                        <p>Primary match for "${match.term}"</p>
                    </div>
                `).join('');
            }
            
            statusDot.className = 'status-dot green';
            this.showNotification('Translation completed successfully', 'success');
        }, 1000);
    }

    saveTranslation() {
        const input = document.querySelector('.translator-input textarea').value;
        const output = document.querySelector('.output-content').innerHTML;
        
        if (!input.trim() || output.includes('Translating...')) {
            this.showNotification('No translation to save', 'error');
            return;
        }
        
        // Add to recent translations
        this.addRecentTranslation(input);
        this.showNotification('Translation saved successfully', 'success');
    }

    addRecentTranslation(input) {
        const recentList = document.querySelector('.translation-list');
        if (!recentList) return;
        
        const firstTerm = input.split(/[(),\s]+/)[0];
        const translation = this.translations[firstTerm.toLowerCase()];
        
        if (translation) {
            const newItem = document.createElement('div');
            newItem.className = 'translation-item';
            newItem.innerHTML = `
                <div class="translation-info">
                    <h4>${firstTerm.charAt(0).toUpperCase() + firstTerm.slice(1)}</h4>
                    <p>${translation.code} - ${translation.description}</p>
                </div>
                <div class="translation-meta">
                    <span class="time">Just now</span>
                    <i data-lucide="check-circle" class="success"></i>
                </div>
            `;
            
            recentList.insertBefore(newItem, recentList.firstChild);
            
            // Keep only latest 5 items
            const items = recentList.querySelectorAll('.translation-item');
            if (items.length > 5) {
                items[items.length - 1].remove();
            }
            
            // Reinitialize lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    initializeSettings() {
        // Initialize form with default values
        const displayName = document.getElementById('display-name');
        const hospital = document.getElementById('hospital');
        const specialization = document.getElementById('specialization');
        
        if (displayName) displayName.value = 'Dr. Rajesh Sharma';
        if (    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }

    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const screen = item.dataset.screen;
        if (screen) {
          this.navigateToScreen(screen);
        }
      });
    });

    // Quick action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const screen = btn.dataset.screen;
        if (screen) {
          this.navigateToScreen(screen);
        }
      });
    });

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.handleLogout();
      });
    }

    // File upload
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    if (uploadZone && fileInput) {
      uploadZone.addEventListener('click', () => {
        fileInput.click();
      });

      uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary-blue)';
        uploadZone.style.backgroundColor = '#fafbff';
      });

      uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--gray-300)';
        uploadZone.style.backgroundColor = 'transparent';
      });

      uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--gray-300)';
        uploadZone.style.backgroundColor = 'transparent';
        const files = Array.from(e.dataTransfer.files);
        this.handleFileUpload(files);
      });

      fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        this.handleFileUpload(files);
      });
    }

    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch');
    toggleSwitches.forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
      });
    });

    // Translation functionality
    const translateBtn = document.querySelector('.translate-btn');
    if (translateBtn) {
      translateBtn.addEventListener('click', () => {
        this.handleTranslation();
      });
    }

    // Window resize
    window.addEventListener('resize', () => {
      this.handleResponsive();
    });

    // Click outside sidebar on mobile
    document.addEventListener('click', (e) => {
      if (this.isMobile && this.sidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebar && !sidebar.contains(e.target) && sidebarToggle && !sidebarToggle.contains(e.target)) {
          this.closeMobileSidebar();
        }
      }
    });
  }

  initializeIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  handleResponsive() {
    this.isMobile = window.innerWidth < 1024;
    const sidebar = document.getElementById('sidebar');
    if (this.isMobile) {
      if (sidebar) {
        sidebar.classList.remove('collapsed');
        if (!this.sidebarOpen) {
          sidebar.style.left = '-256px';
        } else {
          sidebar.style.left = '0';
        }
      }
      this.sidebarOpen = false;
    } else {
      if (sidebar) {
        sidebar.style.left = '0';
        if (this.sidebarCollapsed) {
          sidebar.classList.add('collapsed');
        }
      }
      this.sidebarOpen = false;
    }
  }

  showScreen(screenName) {
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(screen => {
      if (screen.id === `${screenName}-screen`) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    });
    this.currentScreen = screenName;
    setTimeout(() => {
      this.initializeIcons();
    }, 100);
  }

  navigateToScreen(screenName) {
    this.showScreen(screenName);
    this.updateActiveNavItem(screenName);
    if (this.isMobile) {
      this.closeMobileSidebar();
    }
  }

  updateActiveNavItem(screenName) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.screen === screenName) {
        item.classList.add('active');
      }
    });
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.toggleMobileSidebar();
    } else {
      this.toggleDesktopSidebar();
    }
  }

  toggleDesktopSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebar) {
      sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
    }
    if (sidebarToggle) {
      const icon = sidebarToggle.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', this.sidebarCollapsed ? 'menu' : 'x');
      }
      this.initializeIcons();
    }
  }

  toggleMobileSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (this.sidebarOpen) {
        sidebar.classList.add('open');
        sidebar.style.left = '0';
      } else {
        sidebar.classList.remove('open');
        sidebar.style.left = '-256px';
      }
    }
  }

  closeMobileSidebar() {
    if (this.isMobile && this.sidebarOpen) {
      this.sidebarOpen = false;
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.remove('open');
        sidebar.style.left = '-256px';
      }
    }
  }

  togglePassword(input, toggle) {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
    }
    this.initializeIcons();
  }

  handleLogin() {
    const abhaId = document.getElementById('abha-id').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!abhaId || !password) {
      this.showNotification('Please fill in all fields', 'error');
      return;
    }
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
      loginBtn.textContent = 'Signing In...';
      loginBtn.disabled = true;
    }
    setTimeout(() => {
      this.showScreen('dashboard');
      this.updateActiveNavItem('dashboard');
      if (loginBtn) {
        loginBtn.textContent = 'Sign In Securely';
        loginBtn.disabled = false;
      }
    }, 1500);
  }

  handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.showScreen('login');
      this.resetForm();
    }
  }

  resetForm() {
    const form = document.querySelector('.login-form');
    if (form) {
      form.reset();
    }
  }

  handleFileUpload(files) {
    if (files.length === 0) return;
    files.forEach(file => {
      if (this.validateFile(file)) {
        this.uploadFile(file);
      } else {
        this.showNotification(`Invalid file type: ${file.name}`, 'error');
      }
    });
  }

  validateFile(file) {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    return allowedTypes.includes(file.type);
  }

  uploadFile(file) {
    this.showNotification(`Uploading ${file.name}...`, 'info');
    setTimeout(() => {
      this.showNotification(`Successfully uploaded ${file.name}`, 'success');
      this.addToUploadHistory(file);
    }, 2000);
  }

  addToUploadHistory(file) {
    console.log('File uploaded:', file.name, file.size);
  }

  handleTranslation() {
    const textarea = document.querySelector('.translator-input textarea');
    if (!textarea || !textarea.value.trim()) {
      this.showNotification('Please enter text to translate', 'error');
      return;
    }
    const translateBtn = document.querySelector('.translate-btn');
    if (translateBtn) {
      translateBtn.textContent = 'Translating...';
      translateBtn.disabled = true;
    }
    setTimeout(() => {
      this.showNotification('Translation completed successfully', 'success');
      if (translateBtn) {
        translateBtn.textContent = 'Translate';
        translateBtn.disabled = false;
      }
    }, 2000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '9999',
      maxWidth: '300px',
      wordWrap: 'break-word',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });

    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };

    notification.style.backgroundColor = colors[type] || colors.info;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new MediSyncApp();
  window.MediSync = app;
});

// Graceful error handling
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
});
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        // Quick action buttons
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // File upload
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => {
                fileInput.click();
            });

            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--primary-blue)';
                uploadZone.style.backgroundColor = '#fafbff';
            });

            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--gray-300)';
                uploadZone.style.backgroundColor = 'transparent';
                
                const files = Array.from(e.dataTransfer.files);
                this.handleFileUpload(files);
            });

            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                this.handleFileUpload(files);
            });
        }

        // Toggle switches
        const toggleSwitches = document.querySelectorAll('.toggle-switch');
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        });

        // Translation functionality
        const translateBtn = document.querySelector('.translate-btn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => {
                this.handleTranslation();
            });
        }

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResponsive();
        });

        // Click outside sidebar on mobile
        document.addEventListener('click', (e) => {
            if (this.isMobile && this.sidebarOpen) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebar-toggle');
                
                if (sidebar && !sidebar.contains(e.target) && 
                    sidebarToggle && !sidebarToggle.contains(e.target)) {
                    this.closeMobileSidebar();
                }
            }
        });
    }

    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    handleResponsive() {
        this.isMobile = window.innerWidth < 1024;
        const sidebar = document.getElementById('sidebar');
        
        if (this.isMobile) {
            if (sidebar) {
                sidebar.classList.remove('collapsed');
                if (!this.sidebarOpen) {
                    sidebar.style.left = '-256px';
                }
            }
        } else {
            if (sidebar) {
                sidebar.style.left = '0';
                if (this.sidebarCollapsed) {
                    sidebar.classList.add('collapsed');
                }
            }
            this.sidebarOpen = false;
        }
    }

    showScreen(screenName) {
        // Hide all screens
        const allScreens = document.querySelectorAll('.screen');
        const allContentScreens = document.querySelectorAll('.content-screen');
        
        allScreens.forEach(screen => screen.classList.remove('active'));
        allContentScreens.forEach(screen => screen.classList.remove('active'));

        if (screenName === 'login') {
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) {
                loginScreen.classList.add('active');
            }
        } else {
            const mainApp = document.getElementById('main-app');
            const contentScreen = document.getElementById(`${screenName}-screen`);
            
            if (mainApp) {
                mainApp.classList.add('active');
            }
            if (contentScreen) {
                contentScreen.classList.add('active');
                contentScreen.classList.add('fade-in');
            }
        }

        this.currentScreen = screenName;
        
        // Reinitialize icons after screen change
        setTimeout(() => {
            this.initializeIcons();
        }, 100);
    }

    navigateToScreen(screenName) {
        this.showScreen(screenName);
        this.updateActiveNavItem(screenName);
        
        if (this.isMobile) {
            this.closeMobileSidebar();
        }
    }

    updateActiveNavItem(screenName) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === screenName) {
                item.classList.add('active');
            }
        });
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.toggleMobileSidebar();
        } else {
            this.toggleDesktopSidebar();
        }
    }

    toggleDesktopSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        if (sidebar) {
            sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
        }
        
        if (sidebarToggle) {
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', this.sidebarCollapsed ? 'menu' : 'x');
                this.initializeIcons();
            }
        }
    }

    toggleMobileSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const sidebar = document.getElementById('sidebar');
        
        if (sidebar) {
            if (this.sidebarOpen) {
                sidebar.classList.add('open');
                sidebar.style.left = '0';
            } else {
                sidebar.classList.remove('open');
                sidebar.style.left = '-256px';
            }
        }
    }

    closeMobileSidebar() {
        if (this.isMobile && this.sidebarOpen) {
            this.sidebarOpen = false;
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
                sidebar.style.left = '-256px';
            }
        }
    }

    togglePassword(input, toggle) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            this.initializeIcons();
        }
    }

    handleLogin() {
        const abhaId = document.getElementById('abha-id').value;
        const password = document.getElementById('password').value;
        
        if (!abhaId || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate login process
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Signing In...';
            loginBtn.disabled = true;
        }

        setTimeout(() => {
            this.showScreen('dashboard');
            this.updateActiveNavItem('dashboard');
            
            if (loginBtn) {
                loginBtn.textContent = 'Sign In Securely';
                loginBtn.disabled = false;
            }
        }, 1500);
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showScreen('login');
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.querySelector('.login-form');
        if (form) {
            form.reset();
        }
    }

    handleFileUpload(files) {
        if (files.length === 0) return;

        files.forEach(file => {
            if (this.validateFile(file)) {
                this.uploadFile(file);
            } else {
                this.showNotification(`Invalid file type: ${file.name}`, 'error');
            }
        });
    }

    validateFile(file) {
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        return allowedTypes.includes(file.type);
    }

    uploadFile(file) {
        // Simulate file upload
        this.showNotification(`Uploading ${file.name}...`, 'info');
        
        setTimeout(() => {
            this.showNotification(`Successfully uploaded ${file.name}`, 'success');
            this.addToUploadHistory(file);
        }, 2000);
    }

    addToUploadHistory(file) {
        // Add file to upload history (simplified)
        console.log('File uploaded:', file.name, file.size);
    }

    handleTranslation() {
        const textarea = document.querySelector('.translator-input textarea');
        if (!textarea || !textarea.value.trim()) {
            this.showNotification('Please enter text to translate', 'error');
            return;
        }

        const translateBtn = document.querySelector('.translate-btn');
        if (translateBtn) {
            translateBtn.textContent = 'Translating...';
            translateBtn.disabled = true;
        }

        // Simulate translation process
        setTimeout(() => {
            this.showNotification('Translation completed successfully', 'success');
            
            if (translateBtn) {
                translateBtn.textContent = 'Translate';
                translateBtn.disabled = false;
            }
        }, 2000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            maxWidth: '300px',
            wordWrap: 'break-word',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility methods
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MediSyncApp();
    
    // Make app globally available for debugging
    window.MediSync = app;
});

// Handle any uncaught errors gracefully
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
});
