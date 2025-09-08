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
