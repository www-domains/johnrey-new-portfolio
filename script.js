document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isOpen = mobileNavDrawer.classList.contains('active');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        mobileMenuBtn.classList.add('active');
        mobileNavDrawer.classList.add('active');
        mobileNavOverlay.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Close mobile menu
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileNavDrawer.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Event listeners for mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            // Smooth scroll to section (for hash links)
            if (link.getAttribute('href').startsWith('#')) {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            }
        });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavDrawer.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu when window is resized to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileNavDrawer.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Name typing animation
    const typedNameElement = document.querySelector('.typed-name');
    const nameCursor = document.querySelector('.name-cursor');
    const fullName = "John Rey Q. Clemeña";
    let nameIndex = 0;

    function typeUserName() {
        if (nameIndex < fullName.length) {
            typedNameElement.textContent += fullName.charAt(nameIndex);
            nameIndex++;
            setTimeout(typeUserName, 150); // Typing speed for name
        } else {
            // Hide name cursor after typing is complete
            setTimeout(() => {
                nameCursor.style.opacity = '0';
                // Start code typing after name is complete
                setTimeout(startCodeTyping, 500);
            }, 1000);
        }
    }

    // Code typing animation
    const codeTextElement = document.querySelector('.code-text');
    const codeCursor = document.querySelector('.code-cursor');
    const codeTexts = [
        'print("Hello, I am John Rey Q. Clemeña")',
        'String student = "IT Student";',
        'System.out.println("Coding Solutions");',
        'def convert_kg_to_lb(kg):',
        '    return kg * 2.20462',
        'git add .',
        'git commit -m "Fixed cashiering system"',
        'while(learning) { keep_coding(); }',
        'System.out.println("Computer Maintenance Expert");',
        '// Building the future with code'
    ];
    
    let codeTextIndex = 0;
    let codeCharIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80;
    const deletingSpeed = 40;
    const pauseTime = 2500;

    function startCodeTyping() {
        typeCodeText();
    }

    function typeCodeText() {
        const currentText = codeTexts[codeTextIndex];
        
        if (isDeleting) {
            codeTextElement.textContent = currentText.substring(0, codeCharIndex - 1);
            codeCharIndex--;
        } else {
            codeTextElement.textContent = currentText.substring(0, codeCharIndex + 1);
            codeCharIndex++;
        }

        let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && codeCharIndex === currentText.length) {
            typeSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && codeCharIndex === 0) {
            isDeleting = false;
            codeTextIndex = (codeTextIndex + 1) % codeTexts.length;
        }

        setTimeout(typeCodeText, typeSpeed);
    }

    // Start the name typing animation immediately
    setTimeout(typeUserName, 500); // Start after 0.5 seconds

    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Hide previous status
            formStatus.style.display = 'none';
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showFormStatus('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                showFormStatus('error', 'Oops! There was a problem sending your message. Please try again later or contact me directly.');
            } finally {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    function showFormStatus(type, message) {
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }

    // Add scroll animations to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const elementsToAnimate = document.querySelectorAll('section, .service-card, .portfolio-card, .skill-item, .resume-section, .contact-item');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-up-on-scroll');
        observer.observe(el);
    });

    // Audio control functionality
    const audioControlBtn = document.getElementById('audioControlBtn');
    const backgroundAudio = document.getElementById('backgroundAudio');
    
    if (audioControlBtn && backgroundAudio) {
        let isPlaying = false;
        
        audioControlBtn.addEventListener('click', () => {
            if (isPlaying) {
                backgroundAudio.pause();
                audioControlBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                audioControlBtn.setAttribute('aria-label', 'Unmute Background Music');
                isPlaying = false;
            } else {
                backgroundAudio.play().catch(e => {
                    console.log('Audio play failed:', e);
                });
                audioControlBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                audioControlBtn.setAttribute('aria-label', 'Mute Background Music');
                isPlaying = true;
            }
        });
    }

    // Skills hover effects
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Portfolio image generator (keeping the original functionality but updating for John Rey)
    const canvas = document.getElementById('portfolioCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const projectTextInput = document.getElementById('projectText');
    const generateBtn = document.getElementById('generateImageBtn');
    const outputImage = document.getElementById('generatedPortfolioImage');
    const downloadLink = document.getElementById('downloadLink');

    // Colors from CSS
    const primaryColor = '#0a192f';
    const secondaryColor = '#64ffda';
    const lightBgColor = '#112240';
    const textColorLight = '#ccd6f6';
    const textColor = '#8892b0';

    function drawPortfolioImage(projectText = "JRC") {
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.fillStyle = primaryColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle background grid
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 0.3;
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < canvas.width; i += 25) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 25) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0;

        // Central "Code Orb"
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const orbRadius = Math.min(canvas.width, canvas.height) / 4.5;

        // Orb Glow
        const glowGradient = ctx.createRadialGradient(centerX, centerY, orbRadius * 0.4, centerX, centerY, orbRadius * 1.3);
        glowGradient.addColorStop(0, secondaryColor + 'AA');
        glowGradient.addColorStop(0.6, secondaryColor + '44');
        glowGradient.addColorStop(1, primaryColor + '00');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Orb Body
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
        ctx.fillStyle = lightBgColor;
        ctx.fill();
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Inner Core
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbRadius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = secondaryColor;
        ctx.fill();

        // Radiating "code spikes"
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 1.8;
        const numSpikes = 8;
        for (let i = 0; i < numSpikes; i++) {
            const angle = (i / numSpikes) * Math.PI * 2 + (Math.PI / numSpikes);
            const lenMultiplier = (i % 2 === 0) ? 1.2 : 0.8;

            const startX = centerX + Math.cos(angle) * (orbRadius + 3);
            const endX = centerX + Math.cos(angle) * (orbRadius + 15 * lenMultiplier);
            const startY = centerY + Math.sin(angle) * (orbRadius + 3);
            const endY = centerY + Math.sin(angle) * (orbRadius + 15 * lenMultiplier);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Small dot at the end of spikes
            ctx.beginPath();
            ctx.arc(endX, endY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = secondaryColor;
            ctx.fill();
        }

        // Project Text
        ctx.fillStyle = textColorLight;
        ctx.font = `bold ${orbRadius * 0.55}px 'SF Mono', Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Neon glow effect for text
        ctx.shadowColor = secondaryColor;
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillText(projectText, centerX, centerY + 2);
        ctx.shadowBlur = 0;

        // Optional: Add a border to the canvas image itself
        ctx.strokeStyle = secondaryColor + '66';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(1.25, 1.25, canvas.width - 2.5, canvas.height - 2.5);
    }

    if (generateBtn && canvas) {
        generateBtn.addEventListener('click', () => {
            const textToDraw = projectTextInput.value || "JRC";
            drawPortfolioImage(textToDraw);

            const dataURL = canvas.toDataURL('image/png');
            if (outputImage) {
                outputImage.src = dataURL;
                outputImage.style.display = 'block';
            }

            if (downloadLink) {
                downloadLink.href = dataURL;
                downloadLink.download = `portfolio-thumbnail-${textToDraw.replace(/\s+/g, '_')}.png`;
                downloadLink.style.display = 'inline-block';
            }
        });

        // Initial draw with default text when page loads
        drawPortfolioImage(projectTextInput ? projectTextInput.value || "JRC" : "JRC");
        if (outputImage && downloadLink) {
            const initialDataURL = canvas.toDataURL('image/png');
            outputImage.src = initialDataURL;
            outputImage.style.display = 'block';
            downloadLink.href = initialDataURL;
            downloadLink.download = `portfolio-thumbnail-${(projectTextInput ? projectTextInput.value || "JRC" : "JRC").replace(/\s+/g, '_')}.png`;
            downloadLink.style.display = 'inline-block';
        }
    }

    // Add some interactive effects
    document.addEventListener('mousemove', (e) => {
        const cursor = document.createElement('div');
        cursor.classList.add('cursor-trail');
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
        document.body.appendChild(cursor);

        setTimeout(() => {
            cursor.remove();
        }, 500);
    });

    // Remove cursor trail on mobile devices
    if (window.innerWidth <= 768) {
        document.removeEventListener('mousemove', arguments.callee);
    }
});
