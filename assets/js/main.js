/* PRABHAT CASTINGS - Professional Animation System */
document.addEventListener('DOMContentLoaded', function() {

    // ===== Preloader =====
    window.addEventListener('load', function() {
        setTimeout(function() {
            var preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                setTimeout(function() { preloader.style.display = 'none'; }, 500);
            }
        }, 600);
    });

    // ===== Header scroll effect =====
    var header = document.getElementById('header');
    var lastScroll = 0;
    window.addEventListener('scroll', function() {
        var scrollY = window.pageYOffset;
        header.classList.toggle('scrolled', scrollY > 50);

        // Auto-hide header on scroll down, show on scroll up
        if (scrollY > lastScroll && scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = scrollY;
    });

    // ===== Mobile menu =====
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
            navMenu.classList.contains('active') ? closeMenu() : openMenu();
        });
        if (navOverlay) navOverlay.addEventListener('click', closeMenu);
    }
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });

    // ===== Smooth scroll =====
    function getHeaderHeight() { return header ? header.offsetHeight : 80; }

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

    // ===== Active nav on scroll =====
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
            link.classList.toggle('active', href === '#' + currentSection);
        });
    }
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // ===== Intersection Observer for animations =====
    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var delay = el.getAttribute('data-delay') || 0;
                setTimeout(function() {
                    el.classList.add('revealed');
                }, parseInt(delay));
                revealObserver.unobserve(el);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate').forEach(function(el) {
        revealObserver.observe(el);
    });

    // Observe stagger children containers
    document.querySelectorAll('.stagger-children').forEach(function(el) {
        revealObserver.observe(el);
    });

    // Observe section headers and specific elements
    document.querySelectorAll('.section-header, .about-header, .cta-content, .footer-grid, .map-section').forEach(function(el) {
        revealObserver.observe(el);
    });

    // Observe individual animated elements
    document.querySelectorAll('.product-card, .why-us-card, .testimonial-card, .stat-item, .process-step, .gallery-item, .trust-badge, .contact-info-card, .contact-form-wrapper').forEach(function(el) {
        revealObserver.observe(el);
    });

    // ===== Counter animation with easing =====
    function animateCounters() {
        document.querySelectorAll('.stat-number, .hero-stat-number').forEach(function(counter) {
            if (counter.classList.contains('done')) return;
            var top = counter.getBoundingClientRect().top;
            if (top < window.innerHeight - 80) {
                counter.classList.add('done', 'counting');
                var target = parseInt(counter.getAttribute('data-count'));
                var current = 0;
                var startTime = null;
                var duration = 2000;

                function easeOutExpo(t) {
                    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                }

                function updateCounter(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var easedProgress = easeOutExpo(progress);
                    current = Math.floor(easedProgress * target);
                    counter.textContent = current + '+';
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + '+';
                        setTimeout(function() { counter.classList.remove('counting'); }, 500);
                    }
                }
                requestAnimationFrame(updateCounter);
            }
        });
    }
    window.addEventListener('scroll', animateCounters);
    animateCounters();

    // ===== Product filter with animation =====
    var filterBtns = document.querySelectorAll('.filter-btn');
    var productCards = document.querySelectorAll('.product-card[data-category]');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.getAttribute('data-filter');
            var delay = 0;
            productCards.forEach(function(card) {
                var show = filter === 'all' || card.getAttribute('data-category') === filter;
                if (show) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px) scale(0.95)';
                    setTimeout(function() {
                        card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, delay);
                    delay += 80;
                } else {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(function() { card.classList.add('hidden'); }, 300);
                }
            });
        });
    });

    // ===== Magnetic button effect =====
    document.querySelectorAll('.btn, .floating-btn, .social-link').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
        });
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ===== Parallax effect on hero =====
    var hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            var scrollY = window.pageYOffset;
            var heroHeight = hero.offsetHeight;
            if (scrollY < heroHeight) {
                hero.style.backgroundPositionY = (scrollY * 0.4) + 'px';
            }
        });
    }

    // ===== Lightbox =====
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

    // ===== Contact form with loading & toast =====
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var phone = document.getElementById('phone').value.trim();
            var msg = document.getElementById('message').value.trim();

            if (!name || !email || !phone || !msg) {
                showToast('Please fill in all required fields', 'error');
                return;
            }

            var submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.classList.add('btn-loading');

            setTimeout(function() {
                submitBtn.classList.remove('btn-loading');
                showToast('Thank you for your enquiry! We will contact you soon.', 'success');
                form.reset();
            }, 1500);
        });
    }

    // ===== Toast notification =====
    function showToast(message, type) {
        var existing = document.querySelector('.toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'toast';
        var icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill';
        var bgColor = type === 'success' ? '#28a745' : '#dc3545';
        toast.style.background = bgColor;
        toast.innerHTML = '<i class="bi ' + icon + '"></i> ' + message;
        document.body.appendChild(toast);

        setTimeout(function() { toast.classList.add('show'); }, 100);
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() { toast.remove(); }, 500);
        }, 4000);
    }

    // ===== Hero particles =====
    var particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (var i = 0; i < 20; i++) {
            var p = document.createElement('div');
            p.className = 'particle';
            var size = Math.random() * 5 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = Math.random() * 12 + 8 + 's';
            p.style.animationDelay = Math.random() * 8 + 's';
            p.style.opacity = Math.random() * 0.5 + 0.1;
            particlesContainer.appendChild(p);
        }
    }

    // ===== Back to top button =====
    var backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        backToTop.classList.toggle('visible', window.pageYOffset > 400);
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Typing effect for hero subtitle =====
    var heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        var originalText = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.opacity = '1';
        var charIndex = 0;
        function typeWriter() {
            if (charIndex < originalText.length) {
                heroSubtitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 12);
            }
        }
        setTimeout(typeWriter, 800);
    }

    // ===== Tilt effect on product cards =====
    document.querySelectorAll('.product-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 20;
            var rotateY = (centerX - x) / 20;
            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-12px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== Scroll progress indicator =====
    var progressBar = document.createElement('div');
    progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(135deg,#c8a45c,#e8c97a);z-index:10001;transition:width 0.1s linear;width:0';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        var scrollTop = window.pageYOffset;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // ===== Re-trigger reveal on filter change =====
    window.addEventListener('hashchange', function() {
        setTimeout(function() {
            document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate').forEach(function(el) {
                if (!el.classList.contains('revealed')) {
                    revealObserver.observe(el);
                }
            });
        }, 100);
    });
});
