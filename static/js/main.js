// MemorialBridge JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('MemorialBridge initialized');
    
    // Initialize all interactive components
    initializeTooltips();
    initializeCopyLinks();
    initializeFormValidation();
    initializeMemoryTypeToggle();
    initializeImagePreviews();
    initializeScrollAnimations();
    
    // Add fade-in animation to page elements
    addPageAnimations();
});

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Copy link functionality for memorials
 */
function initializeCopyLinks() {
    const copyBtns = document.querySelectorAll('.copy-link-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const slug = this.dataset.slug;
            const url = window.location.origin + '/m/' + slug + '/';
            
            // Use modern clipboard API
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    showCopySuccess(this);
                }).catch(() => {
                    fallbackCopyText(url);
                    showCopySuccess(this);
                });
            } else {
                fallbackCopyText(url);
                showCopySuccess(this);
            }
        });
    });
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Could not copy text', err);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Show copy success feedback
 */
function showCopySuccess(button) {
    const originalText = button.innerHTML;
    const originalClasses = button.className;
    
    button.innerHTML = '<i class="fas fa-check me-2"></i>Link Copied!';
    button.className = button.className.replace('btn-primary', 'btn-success');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.className = originalClasses;
    }, 2000);
}

/**
 * Enhanced form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        });
    });
    
    // Real-time validation for specific fields
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', validateEmail);
    });
    
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        field.addEventListener('blur', validatePassword);
    });
}

/**
 * Email validation
 */
function validateEmail(event) {
    const field = event.target;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (field.value && !emailRegex.test(field.value)) {
        field.setCustomValidity('Please enter a valid email address');
        field.classList.add('is-invalid');
    } else {
        field.setCustomValidity('');
        field.classList.remove('is-invalid');
        if (field.value) field.classList.add('is-valid');
    }
}

/**
 * Password validation
 */
function validatePassword(event) {
    const field = event.target;
    const password = field.value;
    
    if (password.length > 0 && password.length < 8) {
        field.setCustomValidity('Password must be at least 8 characters long');
        field.classList.add('is-invalid');
    } else {
        field.setCustomValidity('');
        field.classList.remove('is-invalid');
        if (field.value) field.classList.add('is-valid');
    }
}

/**
 * Memory type toggle functionality
 */
function initializeMemoryTypeToggle() {
    const typeSelect = document.getElementById('memory-type');
    if (!typeSelect) return;
    
    const contentField = document.getElementById('memory-content-field');
    const imageField = document.getElementById('memory-image-field');
    const videoField = document.getElementById('memory-video-field');
    
    function toggleFields() {
        const selectedType = typeSelect.value;
        
        // Hide all fields first
        if (contentField) contentField.style.display = 'none';
        if (imageField) imageField.style.display = 'none';
        if (videoField) videoField.style.display = 'none';
        
        // Show appropriate fields based on selection
        switch (selectedType) {
            case 'text':
                if (contentField) {
                    contentField.style.display = 'block';
                    contentField.querySelector('textarea').required = true;
                }
                break;
            case 'image':
                if (imageField) {
                    imageField.style.display = 'block';
                    imageField.querySelector('input[type="file"]').required = true;
                }
                if (contentField) {
                    contentField.style.display = 'block';
                    contentField.querySelector('textarea').required = false;
                    contentField.querySelector('label').textContent = 'Caption (optional)';
                }
                break;
            case 'video':
                if (videoField) {
                    videoField.style.display = 'block';
                    videoField.querySelector('input[type="url"]').required = true;
                }
                if (contentField) {
                    contentField.style.display = 'block';
                    contentField.querySelector('textarea').required = false;
                    contentField.querySelector('label').textContent = 'Description (optional)';
                }
                break;
        }
    }
    
    typeSelect.addEventListener('change', toggleFields);
    toggleFields(); // Initialize on page load
}

/**
 * Image preview functionality
 */
function initializeImagePreviews() {
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    
    imageInputs.forEach(input => {
        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                this.value = '';
                return;
            }
            
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image file size must be less than 5MB.');
                this.value = '';
                return;
            }
            
            // Create preview
            const reader = new FileReader();
            reader.onload = function(e) {
                showImagePreview(input, e.target.result);
            };
            reader.readAsDataURL(file);
        });
    });
}

/**
 * Show image preview
 */
function showImagePreview(input, imageSrc) {
    // Remove existing preview
    const existingPreview = input.parentNode.querySelector('.image-preview');
    if (existingPreview) {
        existingPreview.remove();
    }
    
    // Create new preview
    const preview = document.createElement('div');
    preview.className = 'image-preview mt-2';
    preview.innerHTML = `
        <img src="${imageSrc}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="removeImagePreview(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    input.parentNode.appendChild(preview);
}

/**
 * Remove image preview
 */
function removeImagePreview(button) {
    const preview = button.closest('.image-preview');
    const input = preview.parentNode.querySelector('input[type="file"]');
    
    input.value = '';
    preview.remove();
}

/**
 * Scroll animations
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .memorial-card, .feature-box');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Add initial page animations
 */
function addPageAnimations() {
    // Stagger animation for cards
    const cards = document.querySelectorAll('.card, .memorial-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Hero section animation
    const heroContent = document.querySelector('.hero-section .container > .row');
    if (heroContent) {
        heroContent.classList.add('slide-up');
    }
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Form loading states
 */
function setFormLoading(form, loading = true) {
    const submitButton = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    if (loading) {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        inputs.forEach(input => input.disabled = true);
    } else {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        inputs.forEach(input => input.disabled = false);
    }
}

/**
 * Auto-dismiss alerts
 */
function initializeAutoDismissAlerts() {
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.opacity = '0';
                alert.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }
        }, 5000);
    });
}

/**
 * Utility function to format dates
 */
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle search form enhancements
 */
function initializeSearchEnhancements() {
    const searchForm = document.querySelector('form[method="get"]');
    const searchInput = searchForm?.querySelector('input[name="search"]');
    
    if (searchInput) {
        // Add search icon inside input
        searchInput.style.paddingLeft = '2.5rem';
        
        // Add clear button when there's text
        searchInput.addEventListener('input', function() {
            const clearBtn = searchForm.querySelector('.clear-search');
            
            if (this.value.length > 0 && !clearBtn) {
                const clearButton = document.createElement('button');
                clearButton.type = 'button';
                clearButton.className = 'btn btn-sm btn-outline-secondary clear-search';
                clearButton.innerHTML = '<i class="fas fa-times"></i>';
                clearButton.style.position = 'absolute';
                clearButton.style.right = '60px';
                clearButton.style.top = '50%';
                clearButton.style.transform = 'translateY(-50%)';
                clearButton.style.zIndex = '10';
                
                clearButton.addEventListener('click', () => {
                    searchInput.value = '';
                    clearButton.remove();
                    searchForm.submit();
                });
                
                searchInput.parentNode.style.position = 'relative';
                searchInput.parentNode.appendChild(clearButton);
            } else if (this.value.length === 0 && clearBtn) {
                clearBtn.remove();
            }
        });
    }
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoDismissAlerts();
    initializeSmoothScrolling();
    initializeSearchEnhancements();
});

// Export functions for global use
window.MemorialBridge = {
    setFormLoading,
    showImagePreview,
    removeImagePreview,
    formatDate,
    debounce
};
