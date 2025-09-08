class MediSyncApp {
    constructor() {
        this.currentScreen = 'login';
        this.sidebarCollapsed = false;
        this.isMobile = window.innerWidth < 1024;
        this.sidebarOpen = false;
        this.init();
    }

    init() {
        this.showScreen('login');
        this.setupEventListeners();
        this.initializeIcons();
        this.handleResponsive();
    }

    setupEventListeners() {
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        const passwordToggle = document.querySelector('.password-toggle');
        const passwordInput = document.getElementById('password');
        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', () => {
                this.togglePassword(passwordInput, passwordToggle);
            });
        }

        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                if (screen) this.navigateToScreen(screen);
            });
        });

        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.dataset.screen;
                if (screen) this.navigateToScreen(screen);
            });
        });

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Example: connect other feature events as needed here
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
            document.getElementById('login-screen').classList.add('active');
        } else {
            document.getElementById('main-app').classList.add('active');
            document.getElementById(`${screenName}-screen`).classList.add('active');
        }
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

    toggleSidebar() {
        if (this.isMobile) {
            this.sidebarOpen = !this.sidebarOpen;
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.style.left = this.sidebarOpen ? '0' : '-256px';
            }
        } else {
            this.sidebarCollapsed = !this.sidebarCollapsed;
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
            }
        }
    }

    closeMobileSidebar() {
        if (this.isMobile && this.sidebarOpen) {
            this.sidebarOpen = false;
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
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
        if (!abhaId.trim() || !password.trim()) {
            alert('Please enter any ABHA ID and password to continue');
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
        }, 1000);
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
}

document.addEventListener('DOMContentLoaded', () => {
    new MediSyncApp();
});
