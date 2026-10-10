const menuButton = document.getElementById('mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
const overlay = document.getElementById('sidebar-overlay');
const MOBILE_BREAKPOINT = 900;

if (menuButton && sidebar && overlay) {
    const closeSidebar = () => {
        sidebar.classList.remove('sidebar-open');
        overlay.classList.remove('active');
    };

    const updateMobileMenuVisibility = () => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            menuButton.style.display = 'grid';
            overlay.style.display = 'block';
        } else {
            menuButton.style.display = 'none';
            overlay.style.display = 'none';
            closeSidebar();
        }
    };

    const toggleSidebar = () => {
        sidebar.classList.toggle('sidebar-open');
        overlay.classList.toggle('active');
    };

    menuButton.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
    window.addEventListener('resize', updateMobileMenuVisibility);
    window.addEventListener('DOMContentLoaded', updateMobileMenuVisibility);
    updateMobileMenuVisibility();
}
