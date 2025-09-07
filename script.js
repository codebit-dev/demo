class MediSyncApp {
    constructor() {
        this.currentScreen = 'login';
        this.sidebarCollapsed = false;
        this.isMobile = window.innerWidth < 1024;
        this.sidebarOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeIcons();
        this.handleResponsive();
        
        // Show initial screen
        this.showScreen(this.currentScreen);
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
