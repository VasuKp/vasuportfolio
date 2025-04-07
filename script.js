// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader when page is loaded
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 600);
    }

    // Navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinksItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.hamburger')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close mobile menu on resize if it was open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Accounting for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation based on scroll position
    const sections = document.querySelectorAll('section');
    
    function setActiveNav() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinksItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNav);

    // Initialize active nav on page load
    setActiveNav();

    // Animate elements when they come into view
    function initSectionAnimation() {
        const animateElements = document.querySelectorAll('.services-list li, .portfolio-item, .testimonial-card, .contact-form');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Call the animation function
    initSectionAnimation();

    // Add scroll-up button functionality
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.classList.add('scroll-top-btn');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Fix for iOS touch events on mobile menu
    if ('ontouchstart' in window) {
        document.documentElement.style.cursor = 'pointer';
    }

    console.log('Portfolio website loaded successfully!');
});

// Contact form functionality with enhanced interaction
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    // Add focus animation to form fields
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentNode.classList.remove('focused');
            }
        });
        
        // Check for existing values (in case of browser autofill)
        if (input.value !== '') {
            input.parentNode.classList.add('focused');
        }
    });
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                showFormError('Please fill in all fields');
                return;
            }
            
            // Email validation
            if (!validateEmail(email)) {
                showFormError('Please enter a valid email address');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                formInputs.forEach(input => {
                    input.parentNode.classList.remove('focused');
                });
                
                // Show success message
                showFormSuccess('Message sent successfully! I will get back to you soon.');
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
            
            // In a real implementation, you would send the form data to a server
            // using fetch() or XMLHttpRequest
        });
    }
}

// Email validation function
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Show form error message
function showFormError(message) {
    const errorElement = document.getElementById('form-error');
    
    if (!errorElement) {
        const formGroup = document.querySelector('.form-group');
        const errorDiv = document.createElement('div');
        errorDiv.id = 'form-error';
        errorDiv.className = 'form-message error';
        errorDiv.textContent = message;
        
        formGroup.parentNode.insertBefore(errorDiv, formGroup);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }
}

// Show form success message
function showFormSuccess(message) {
    const successElement = document.getElementById('form-success');
    
    if (!successElement) {
        const form = document.querySelector('.contact-form');
        const successDiv = document.createElement('div');
        successDiv.id = 'form-success';
        successDiv.className = 'form-message success';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        form.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }
}

// Change navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.background = '#ffffff';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    }
});

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    const target = e.target;
    
    if (target.classList.contains('btn') || target.classList.contains('view-sample-btn')) {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}); 