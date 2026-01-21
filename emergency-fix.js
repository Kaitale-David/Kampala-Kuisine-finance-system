// EMERGENCY FIX FOR STUCK LOADING
// Add this script to your index.html BEFORE other scripts

(function() {
    console.log('Emergency fix loaded');
    
    // Method 1: Immediately hide loading overlay
    const hideLoadingNow = function() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            console.log('Emergency: Loading overlay hidden');
        }
        
        // Also remove any other loading elements
        document.querySelectorAll('.loading-spinner, .progress-bar').forEach(el => {
            el.style.display = 'none';
        });
    };
    
    // Hide immediately
    hideLoadingNow();
    
    // Hide again after DOM loads
    document.addEventListener('DOMContentLoaded', hideLoadingNow);
    
    // Hide again after page fully loads
    window.addEventListener('load', hideLoadingNow);
    
    // Final safety: hide after 2 seconds no matter what
    setTimeout(hideLoadingNow, 2000);
    
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Override any showLoading functions
    if (window.auth && window.auth.showLoading) {
        const originalShowLoading = window.auth.showLoading;
        window.auth.showLoading = function(show) {
            if (!show) {
                hideLoadingNow();
            }
            // Don't actually show loading at all
            return false;
        };
    }
})();
