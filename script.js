// MediSync - Healthcare Integration Platform JavaScript

class MediSync {
    constructor() {
        this.currentScreen = 'login';
        this.currentContentScreen = 'dashboard';
        this.sidebarCollapsed = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeLogin();
        this.initializeSidebar();
        this.initializeUpload();
        this.initializeTranslator();
        this.initializeSettings();
        this.loadDemoData();
    }

    bindEvents() {
        // Login form
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Password toggle
        const passwordToggle = document.querySelector('.password-toggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePassword());
        }

        // OAuth login
        const oauthBtn = document.querySelector('.oauth-btn');
        if (oauthBtn) {
            oauthBtn.addEventListener('click', () => this.handleOAuthLogin());
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
