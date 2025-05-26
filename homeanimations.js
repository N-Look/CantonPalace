// Enhanced Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
  
        // Add staggered animation for cards
        if (entry.target.classList.contains("about-grid")) {
          const cards = entry.target.querySelectorAll(".info-card")
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = "1"
              card.style.transform = "translateY(0)"
            }, index * 200)
          })
        }
      }
    })
  }, observerOptions)
  
  // Enhanced navbar scroll effect
  const navbar = document.querySelector(".navbar")
  let lastScrollY = window.scrollY
  
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY
  
    if (currentScrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  
    lastScrollY = currentScrollY
  })
  
  // Smooth scroll for navigation links
  document.querySelectorAll(".nav-link, .footer-links a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href")
      if (href.startsWith("#")) {
        e.preventDefault()
        const targetSection = document.querySelector(href)
  
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      }
    })
  })
  
  // Initialize animations when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    // Observe all scroll animation elements
    const scrollElements = document.querySelectorAll(".fade-in-scroll")
    scrollElements.forEach((el) => observer.observe(el))
  
    // Button click handlers
    const CTA = document.querySelector(".cta-button")
    const locationBtn = document.querySelector(".location-btn")
  
    if (CTA) {
      CTA.addEventListener("click", () => {
        console.log("Navigate to menu page")
        window.location.href = 'menu.html';
      })
    }
  
    if (locationBtn) {
      locationBtn.addEventListener("click", () => {
        window.open("https://maps.app.goo.gl/DtppUdCXDg88UQfJA", "_blank")
      })
    }
  
    // Enhanced button hover effects
    const buttons = document.querySelectorAll(".cta-button, .location-btn, .phone-highlight")
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-4px) scale(1.05)"
      })
  
      button.addEventListener("mouseleave", () => {
        button.style.transform = "translateY(0) scale(1)"
      })
    })
  
    // Add smooth scroll for any internal links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  })
  
  // Performance optimization: Pause animations when page is not visible
  document.addEventListener("visibilitychange", () => {
    const animatedElements = document.querySelectorAll(".hero-entrance, .reservation-entrance")
  
    if (document.hidden) {
      animatedElements.forEach((el) => {
        el.style.animationPlayState = "paused"
      })
    } else {
      animatedElements.forEach((el) => {
        el.style.animationPlayState = "running"
      })
    }
  })
  
  // Add loading state for images
  window.addEventListener("load", () => {
    document.body.classList.add("loaded")
  })
  
  // Enhanced scroll-triggered animations
  const enhancedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )
  
  // Observe footer for entrance animation
  const footer = document.querySelector(".footer")
  if (footer) {
    enhancedObserver.observe(footer)
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburgerBtn && navMenu) {
      hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.add('closing');
            setTimeout(() => {
                navMenu.classList.remove('active', 'closing');
            }, 400);
        } else {
            navMenu.classList.add('active');
        }
        
        // Toggle menu icon
        const icon = hamburgerBtn.querySelector('i');
        if (icon) { 
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    }); 

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
          navMenu.classList.add('closing');
          setTimeout(() => {
            navMenu.classList.remove('active','closing');
            hamburgerBtn.classList.remove('active');
            const icon = hamburgerBtn.querySelector('i');
            if (icon) { 
              icon.classList.add('fa-bars');
              icon.classList.remove('fa-times');
            }
          }, 400);
        }
      });

      // Close menu when clicking a link
      navMenu.forEach(link => {
        link.addEventListener('click', () => {
          if (navMenu.classList.contains('active')) {
            navMenu.classList.add('closing');
            setTimeout(() => {
                navMenu.classList.remove('active', 'closing');
                hamburgerBtn.classList.remove('active');
                const icon = hamburgerBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }, 400);
          }
        });
      });
    }
  });
  