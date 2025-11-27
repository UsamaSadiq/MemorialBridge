// MemorialBridge JavaScript - Enhanced Version
// Comprehensive frontend functionality with error handling, performance optimizations, and accessibility

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        DEBOUNCE_DELAY: 300,
        IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
        TOAST_AUTO_HIDE_DELAY: 5000,
        LAZY_LOAD_ROOT_MARGIN: '50px'
    };

    // State management
    const state = {
        observers: [],
        activeToasts: []
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        try {
            console.log('MemorialBridge initializing...');
            
            initializeTooltips();
            initializeCopyLinks();
            initializeRealTimeFormValidation();
            initializeMemoryTypeToggle();
            initializeImagePreviews();
            initializeLazyLoading();
            initializeScrollAnimations();
            initializeSearchEnhancements();
            initializeAutoDismissAlerts();
            initializeSmoothScrolling();
            initializeFormLoadingStates();
            
            addPageAnimations();
            
            console.log('MemorialBridge initialized successfully');
        } catch (error) {
            console.error('Error initializing MemorialBridge:', error);
        }
    });

    /**
     * Initialize Bootstrap tooltips with error handling
     */
    function initializeTooltips() {
        try {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.forEach(function (tooltipTriggerEl) {
                new bootstrap.Tooltip(tooltipTriggerEl);
            });
        } catch (error) {
            console.error('Error initializing tooltips:', error);
        }
    }

    /**
     * Initialize copy link functionality with improved error handling
     */
    function initializeCopyLinks() {
        try {
            const copyBtns = document.querySelectorAll('.copy-link-btn');
            
            copyBtns.forEach(btn => {
                btn.addEventListener('click', handleCopyLink);
            });
        } catch (error) {
            console.error('Error initializing copy links:', error);
        }
    }

    /**
     * Handle copy link action
     */
    async function handleCopyLink(e) {
        e.preventDefault();
        
        const button = e.currentTarget;
        const slug = button.dataset.slug;
        
        if (!slug) {
            console.error('No slug found on copy button');
            return;
        }
        
        const url = `${window.location.origin}/m/${slug}/`;
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                showCopySuccess(button);
            } else {
                fallbackCopyText(url);
                showCopySuccess(button);
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            fallbackCopyText(url);
            showCopySuccess(button);
        }
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
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.className = originalClasses;
            button.disabled = false;
        }, 2000);
    }

    /**
     * Initialize real-time form validation
     */
    function initializeRealTimeFormValidation() {
        try {
            const forms = document.querySelectorAll('form:not(.no-validation)');
            
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), textarea, select');
                
                inputs.forEach(input => {
                    // Validate on blur
                    input.addEventListener('blur', function() {
                        validateField(this);
                    });
                    
                    // Validate on input if already has validation state
                    input.addEventListener('input', debounce(function() {
                        if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
                            validateField(this);
                        }
                    }, CONFIG.DEBOUNCE_DELAY));
                });
                
                // Prevent invalid form submission
                form.addEventListener('submit', function(e) {
                    let isValid = true;
                    
                    inputs.forEach(input => {
                        if (!validateField(input)) {
                            isValid = false;
                        }
                    });
                    
                    if (!isValid) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Focus first invalid field
                        const firstInvalid = form.querySelector('.is-invalid');
                        if (firstInvalid) {
                            firstInvalid.focus();
                        }
                    }
                    
                    form.classList.add('was-validated');
                });
            });
        } catch (error) {
            console.error('Error initializing form validation:', error);
        }
    }

    /**
     * Validate individual field
     */
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.required;
        
        // Clear previous validation
        field.classList.remove('is-invalid', 'is-valid');
        
        // Check if required field is empty
        if (required && !value) {
            setFieldInvalid(field, 'This field is required');
            return false;
        }
        
        // Skip validation if field is empty and not required
        if (!value && !required) {
            return true;
        }
        
        // Type-specific validation
        switch(type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    setFieldInvalid(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'password':
                if (value.length < 8) {
                    setFieldInvalid(field, 'Password must be at least 8 characters');
                    return false;
                }
                // Check for password confirmation
                const confirmField = document.querySelector(`input[name="${field.name}2"]`);
                if (confirmField && confirmField.value && value !== confirmField.value) {
                    setFieldInvalid(field, 'Passwords do not match');
                    return false;
                }
                break;
                
            case 'url':
                try {
                    new URL(value);
                } catch {
                    setFieldInvalid(field, 'Please enter a valid URL');
                    return false;
                }
                break;
                
            case 'number':
                if (isNaN(value)) {
                    setFieldInvalid(field, 'Please enter a valid number');
                    return false;
                }
                break;
        }
        
        // Min/max length validation
        if (field.minLength && value.length < field.minLength) {
            setFieldInvalid(field, `Minimum ${field.minLength} characters required`);
            return false;
        }
        
        if (field.maxLength && value.length > field.maxLength) {
            setFieldInvalid(field, `Maximum ${field.maxLength} characters allowed`);
            return false;
        }
        
        // If we get here, field is valid
        setFieldValid(field);
        return true;
    }

    /**
     * Set field as invalid
     */
    function setFieldInvalid(field, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        let feedback = field.parentElement.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentElement.appendChild(feedback);
        }
        feedback.textContent = message;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', feedback.id || 'error-' + field.name);
    }

    /**
     * Set field as valid
     */
    function setFieldValid(field) {
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
        
        const feedback = field.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }

    /**
     * Memory type toggle functionality
     */
    function initializeMemoryTypeToggle() {
        try {
            const typeSelect = document.getElementById('memory-type');
            if (!typeSelect) return;
            
            const contentField = document.getElementById('memory-content-field');
            const imageField = document.getElementById('memory-image-field');
            const videoField = document.getElementById('memory-video-field');
            
            function toggleFields() {
                const selectedType = typeSelect.value;
                
                // Hide all fields first
                [contentField, imageField, videoField].forEach(field => {
                    if (field) field.style.display = 'none';
                });
                
                // Show appropriate fields based on selection
                switch (selectedType) {
                    case 'text':
                        if (contentField) {
                            contentField.style.display = 'block';
                            const textarea = contentField.querySelector('textarea');
                            if (textarea) textarea.required = true;
                        }
                        break;
                        
                    case 'image':
                        if (imageField) {
                            imageField.style.display = 'block';
                            const fileInput = imageField.querySelector('input[type="file"]');
                            if (fileInput) fileInput.required = true;
                        }
                        if (contentField) {
                            contentField.style.display = 'block';
                            const textarea = contentField.querySelector('textarea');
                            if (textarea) {
                                textarea.required = false;
                                contentField.querySelector('label').textContent = 'Caption (optional)';
                            }
                        }
                        break;
                        
                    case 'video':
                        if (videoField) {
                            videoField.style.display = 'block';
                            const urlInput = videoField.querySelector('input[type="url"]');
                            if (urlInput) urlInput.required = true;
                        }
                        if (contentField) {
                            contentField.style.display = 'block';
                            const textarea = contentField.querySelector('textarea');
                            if (textarea) {
                                textarea.required = false;
                                contentField.querySelector('label').textContent = 'Description (optional)';
                            }
                        }
                        break;
                }
            }
            
            typeSelect.addEventListener('change', toggleFields);
            toggleFields(); // Initialize on page load
        } catch (error) {
            console.error('Error initializing memory type toggle:', error);
        }
    }

    /**
     * Image preview functionality with validation
     */
    function initializeImagePreviews() {
        try {
            const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
            
            imageInputs.forEach(input => {
                input.addEventListener('change', handleImageSelect);
            });
        } catch (error) {
            console.error('Error initializing image previews:', error);
        }
    }

    /**
     * Handle image selection
     */
    function handleImageSelect(event) {
        const input = event.target;
        const file = input.files[0];
        
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            input.value = '';
            return;
        }
        
        // Validate file size
        if (file.size > CONFIG.IMAGE_MAX_SIZE) {
            alert('Image file size must be less than 5MB.');
            input.value = '';
            return;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = function(e) {
            showImagePreview(input, e.target.result, file.name);
        };
        reader.onerror = function() {
            console.error('Error reading file');
            alert('Error reading file. Please try again.');
        };
        reader.readAsDataURL(file);
    }

    /**
     * Show image preview
     */
    function showImagePreview(input, imageSrc, fileName) {
        // Remove existing preview
        const existingPreview = input.parentNode.querySelector('.image-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Create new preview
        const preview = document.createElement('div');
        preview.className = 'image-preview mt-2 d-flex align-items-center gap-2';
        preview.innerHTML = `
            <img src="${imageSrc}" alt="Preview" class="rounded shadow-sm" 
                 style="max-width: 200px; max-height: 200px; object-fit: cover;">
            <div class="flex-grow-1">
                <p class="mb-1 small text-muted">${fileName}</p>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="window.MemorialBridge.removeImagePreview(this)">
                    <i class="fas fa-times me-1"></i>Remove
                </button>
            </div>
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
     * Initialize lazy loading for images
     */
    function initializeLazyLoading() {
        try {
            if (!('IntersectionObserver' in window)) {
                console.warn('IntersectionObserver not supported, loading all images');
                loadAllImages();
                return;
            }
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: CONFIG.LAZY_LOAD_ROOT_MARGIN
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
            
            state.observers.push(imageObserver);
        } catch (error) {
            console.error('Error initializing lazy loading:', error);
            loadAllImages();
        }
    }

    /**
     * Load single image
     */
    function loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    }

    /**
     * Fallback: load all images
     */
    function loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(loadImage);
    }

    /**
     * Scroll animations with Intersection Observer
     */
    function initializeScrollAnimations() {
        try {
            if (!('IntersectionObserver' in window)) {
                return;
            }
            
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
            const animateElements = document.querySelectorAll('.card:not(.no-animate), .memorial-card:not(.no-animate), .feature-box');
            animateElements.forEach(el => {
                observer.observe(el);
            });
            
            state.observers.push(observer);
        } catch (error) {
            console.error('Error initializing scroll animations:', error);
        }
    }

    /**
     * Enhanced search functionality
     */
    function initializeSearchEnhancements() {
        try {
            const searchInput = document.getElementById('searchInput');
            const clearBtn = document.getElementById('clearSearch');
            const searchForm = document.querySelector('#searchForm');
            
            if (!searchInput) return;
            
            // Show/hide clear button
            searchInput.addEventListener('input', function() {
                if (clearBtn) {
                    clearBtn.classList.toggle('d-none', !this.value);
                }
            });
            
            // Clear search
            if (clearBtn) {
                clearBtn.addEventListener('click', function() {
                    searchInput.value = '';
                    this.classList.add('d-none');
                    searchInput.focus();
                    
                    if (searchForm) {
                        searchForm.submit();
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing search enhancements:', error);
        }
    }

    /**
     * Auto-dismiss alerts after delay
     */
    function initializeAutoDismissAlerts() {
        try {
            const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
            
            alerts.forEach(alert => {
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.style.opacity = '0';
                        alert.style.transform = 'translateY(-20px)';
                        alert.style.transition = 'all 0.3s ease';
                        
                        setTimeout(() => {
                            alert.remove();
                        }, 300);
                    }
                }, CONFIG.TOAST_AUTO_HIDE_DELAY);
            });
        } catch (error) {
            console.error('Error initializing auto-dismiss alerts:', error);
        }
    }

    /**
     * Smooth scrolling for anchor links
     */
    function initializeSmoothScrolling() {
        try {
            const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
            
            anchorLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update URL without jumping
                        if (history.pushState) {
                            history.pushState(null, null, '#' + targetId);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error initializing smooth scrolling:', error);
        }
    }

    /**
     * Initialize form loading states
     */
    function initializeFormLoadingStates() {
        try {
            const forms = document.querySelectorAll('form:not(.no-loading)');
            
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    const submitBtn = this.querySelector('button[type="submit"]');
                    
                    if (submitBtn && !this.classList.contains('was-validated')) {
                        setFormLoading(this, true);
                    }
                });
            });
        } catch (error) {
            console.error('Error initializing form loading states:', error);
        }
    }

    /**
     * Set form loading state
     */
    function setFormLoading(form, loading = true) {
        const submitButton = form.querySelector('button[type="submit"]');
        const inputs = form.querySelectorAll('input, textarea, select, button');
        
        if (loading) {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add('loading');
            }
            inputs.forEach(input => input.disabled = true);
            form.classList.add('loading');
        } else {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
            inputs.forEach(input => input.disabled = false);
            form.classList.remove('loading');
        }
    }

    /**
     * Add initial page animations
     */
    function addPageAnimations() {
        try {
            // Stagger animation for cards
            const cards = document.querySelectorAll('.card, .memorial-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        } catch (error) {
            console.error('Error adding page animations:', error);
        }
    }

    /**
     * Utility: Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility: Format date
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
     * Cleanup on page unload
     */
    window.addEventListener('beforeunload', function() {
        // Disconnect observers
        state.observers.forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
    });

    // Export public API
    window.MemorialBridge = {
        setFormLoading,
        showImagePreview,
        removeImagePreview,
        formatDate,
        debounce,
        validateField
    };

})();
