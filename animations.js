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
    const fadeElements = document.querySelectorAll('.fade-in, .about-right');
    fadeElements.forEach(el => observer.observe(el));

    // Header scroll effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else if (!document.body.classList.contains('menu-page')) {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu functionality
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navContainer.classList.toggle('active');
        // Toggle menu icon
        const icon = hamburgerBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && !hamburgerBtn.contains(e.target) && navContainer.classList.contains('active')) {
            navContainer.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
}); 