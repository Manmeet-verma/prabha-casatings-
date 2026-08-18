/* PRABHAT CASTINGS - Optimized JavaScript */
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        setTimeout(function() {
            var preloader = document.getElementById('preloader');
            if (preloader) preloader.classList.add('hidden');
        }, 800);
    });

    // Header scroll
    var header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile menu
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('navMenu');
    var navOverlay = document.getElementById('navOverlay');
    function closeMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    function openMenu() {
        if (hamburger) hamburger.classList.add('active');
        if (navMenu) navMenu.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }
    }
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            closeMenu();
        });
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });

    // Get header height
    function getHeaderHeight() {
        return header ? header.offsetHeight : 80;
    }

    // Smooth scroll with proper offset
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                closeMenu();
                var offset = getHeaderHeight() + 10;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // Active nav on scroll
    var sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        var scrollY = window.pageYOffset;
        var headerH = getHeaderHeight();
        var currentSection = 'home';
        sections.forEach(function(section) {
            var top = section.offsetTop - headerH - 60;
            var bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                currentSection = section.getAttribute('id');
            }
        });
        if (scrollY < 200) currentSection = 'home';
        document.querySelectorAll('.nav-link').forEach(function(link) {
            var href = link.getAttribute('href');
            if (href === '#' + currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Product filter
    var filterBtns = document.querySelectorAll('.filter-btn');
    var productCards = document.querySelectorAll('.product-card[data-category]');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.getAttribute('data-filter');
            productCards.forEach(function(card) {
                var show = filter === 'all' || card.getAttribute('data-category') === filter;
                card.classList.toggle('hidden', !show);
            });
        });
    });

    // Scroll reveal
    function reveal() {
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(function(el) {
            var top = el.getBoundingClientRect().top;
            if (top < window.innerHeight - 80) {
                var delay = el.getAttribute('data-delay') || 0;
                setTimeout(function() { el.classList.add('revealed'); }, delay);
            }
        });
    }
    window.addEventListener('scroll', reveal);
    reveal();

    // Counter animation
    function animateCounters() {
        document.querySelectorAll('.stat-number, .hero-stat-number').forEach(function(counter) {
            if (counter.classList.contains('done')) return;
            var top = counter.getBoundingClientRect().top;
            if (top < window.innerHeight - 80) {
                counter.classList.add('done');
                var target = parseInt(counter.getAttribute('data-count'));
                var current = 0;
                var increment = target / 50;
                var timer = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + '+';
                    }
                }, 40);
            }
        });
    }
    window.addEventListener('scroll', animateCounters);
    animateCounters();

    // Lightbox
    var galleryItems = document.querySelectorAll('.gallery-item');
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<div class="lightbox-content"><button class="lightbox-close">&times;</button><button class="lightbox-nav lightbox-prev">&lsaquo;</button><button class="lightbox-nav lightbox-next">&rsaquo;</button><img src="" alt=""><div class="lightbox-caption"></div></div>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('.lightbox-caption');
    var currentIndex = 0;
    var images = [];

    galleryItems.forEach(function(item, i) {
        var img = item.querySelector('img');
        if (img) {
            images.push({ src: img.src, alt: img.alt });
            item.addEventListener('click', function() {
                currentIndex = i;
                updateLightbox();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });

    function updateLightbox() {
        if (images[currentIndex]) {
            lbImg.src = images[currentIndex].src;
            lbCaption.textContent = images[currentIndex].alt;
        }
    }

    lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    lightbox.querySelector('.lightbox-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        }
    });

    // Contact form
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var phone = document.getElementById('phone').value.trim();
            var msg = document.getElementById('message').value.trim();

            if (!name || !email || !phone || !msg) {
                alert('Please fill in all required fields');
                return;
            }
            alert('Thank you for your enquiry! We will contact you soon.');
            form.reset();
        });
    }

    // Hero particles
    var particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (var i = 0; i < 12; i++) {
            var p = document.createElement('div');
            p.className = 'particle';
            var size = Math.random() * 4 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = Math.random() * 10 + 8 + 's';
            p.style.animationDelay = Math.random() * 5 + 's';
            particlesContainer.appendChild(p);
        }
    }
});