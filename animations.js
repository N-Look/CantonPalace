// Detect when elements enter viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.1
});

// Observe all elements with fade-in class
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    const navbar = document.querySelector('.navbar');
    if (navbar){
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

    // Mobile menu functionality
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburgerBtn && navMenu){
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Toggle menu icon
            const icon = hamburgerBtn.querySelector('i');
            if (icon) { // Check if icon element exists
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        }); 
    }
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');

            const icon = hamburgerBtn.querySelector('i');
            if (icon) { 
                icon.classList.add('fa-bars'); // Reset icon to fa-bars
                icon.classList.remove('fa-times');
            }
        }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            const icon = hamburgerBtn.querySelector('i');
            if (icon) { // Check if icon element exists
                icon.classList.add('fa-bars'); // Reset icon to fa-bars
                icon.classList.remove('fa-times');
            }
        }
        }); 
    });
}); 