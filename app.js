// Load configuration and render portfolio
let config = null;

// Fetch config.json
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
        renderPortfolio();
    } catch (error) {
        console.error('Error loading config:', error);
        document.body.innerHTML = '<div style="padding: 40px; text-align: center;">Error loading portfolio configuration.</div>';
    }
}

// Render entire portfolio
function renderPortfolio() {
    if (!config) return;

    // Update page title
    document.title = `${config.personal.name} - ${config.personal.title}`;

    // Render sections
    renderNavigation();
    renderHero();
    renderFeaturedProjects();
    renderOtherProjects();
    renderWriting();
    renderSkills();
    renderContact();
    renderFooter();

    // Setup interactions
    setupMobileMenu();
    setupSmoothScroll();
}

// Render navigation
function renderNavigation() {
    document.getElementById('nav-brand').textContent = config.personal.name;
}

// Render hero section
function renderHero() {
    document.getElementById('hero-name').textContent = config.personal.name;
    document.getElementById('hero-title').textContent = config.personal.title;
    document.getElementById('hero-tagline').textContent = config.personal.tagline;

    // Render stats
    const statsContainer = document.getElementById('hero-stats');
    statsContainer.innerHTML = config.personal.stats
        .map(stat => `<span class="stat-badge">${stat}</span>`)
        .join('');
}

// Render featured projects
function renderFeaturedProjects() {
    const container = document.getElementById('featured-projects');

    container.innerHTML = config.featuredProjects
        .map(project => `
            <article class="project-card">
                <h3 class="project-title">${project.title}</h3>

                ${project.architectureHighlight ? `
                <div class="architecture-highlight">
                    <span class="architecture-label">Architecture Decision</span>
                    <p class="architecture-text">${project.architectureHighlight}</p>
                </div>
                ` : ''}

                <div class="project-section">
                    <h4 class="project-subheading">The Problem</h4>
                    <p>${project.problem}</p>
                </div>

                <div class="project-section">
                    <h4 class="project-subheading">The Approach</h4>
                    <p>${project.approach}</p>
                </div>

                <div class="project-section">
                    <h4 class="project-subheading">Results</h4>
                    <ul class="results-list">
                        ${project.results.map(result => `<li>${result}</li>`).join('')}
                    </ul>
                </div>

                <div class="tech-stack">
                    ${project.techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
            </article>
        `)
        .join('');
}

// Render other projects
function renderOtherProjects() {
    const container = document.getElementById('other-projects');

    container.innerHTML = config.otherProjects
        .map(project => `
            <article class="brief-card">
                <h4 class="brief-title">${project.title}</h4>
                <p class="brief-desc">${project.description}</p>
                <div class="tech-stack">
                    ${project.techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
            </article>
        `)
        .join('');
}

// Render skills section
function renderSkills() {
    const container = document.getElementById('skills-container');

    container.innerHTML = config.skills.categories
        .map(category => `
            <div class="skill-category">
                <h3 class="skill-category-name">${category.name}</h3>
                <div class="skill-items">
                    ${category.items.map(skill => `<span class="tech-badge">${skill}</span>`).join('')}
                </div>
            </div>
        `)
        .join('');
}

// Render writing section
function renderWriting() {
    const container = document.getElementById('writing-list');

    container.innerHTML = config.writing
        .map(article => `
            <article class="writing-item">
                <h3 class="writing-title">${article.title}</h3>
                <p class="writing-desc">${article.description}</p>
                <a href="${article.url}" class="writing-link" target="_blank" rel="noopener">→ Read ${article.url.includes('dzone') ? 'on DZone' : article.url.includes('nagarro') ? 'on Nagarro' : 'the documentation'}</a>
            </article>
        `)
        .join('');
}

// Render contact section
function renderContact() {
    const container = document.getElementById('contact-links');
    const links = [];

    if (config.contact.email) {
        const maskedEmail = maskEmail(config.contact.email);
        links.push(`<span class="contact-link masked-contact" data-value="${config.contact.email}" data-type="email">${maskedEmail} <span class="reveal-text">→ Click to reveal</span></span>`);
    }

    if (config.contact.linkedin) {
        links.push(`<a href="${config.contact.linkedin}" class="contact-link" target="_blank" rel="noopener">LinkedIn</a>`);
    }

    if (config.contact.phone) {
        const maskedPhone = maskPhone(config.contact.phone);
        links.push(`<span class="contact-link masked-contact" data-value="${config.contact.phone}" data-type="phone">${maskedPhone} <span class="reveal-text">→ Click to reveal</span></span>`);
    }

    if (config.contact.github && config.contact.github.trim() !== '') {
        links.push(`<a href="${config.contact.github}" class="contact-link" target="_blank" rel="noopener">GitHub</a>`);
    }

    container.innerHTML = links.join('');

    // Add click handlers to reveal masked contacts
    document.querySelectorAll('.masked-contact').forEach(element => {
        element.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const type = this.getAttribute('data-type');

            if (type === 'email') {
                this.outerHTML = `<a href="mailto:${value}" class="contact-link">${value}</a>`;
            } else if (type === 'phone') {
                this.outerHTML = `<a href="tel:${value.replace(/\s/g, '')}" class="contact-link">${value}</a>`;
            }
        });
    });

    // Handle resume link
    if (config.resume.show && config.resume.url) {
        document.getElementById('resume-link-container').style.display = 'block';
        document.getElementById('resume-link').href = config.resume.url;
    }
}

// Mask email: show first 3 chars + @domain
function maskEmail(email) {
    const [local, domain] = email.split('@');
    if (local.length <= 3) {
        return `${local[0]}***@${domain}`;
    }
    return `${local.substring(0, 3)}***@${domain}`;
}

// Mask phone: show country code + masked digits
function maskPhone(phone) {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('+')) {
        return `${cleaned.substring(0, 3)} *** *** ***`;
    }
    return '*** *** ***';
}

// Render footer
function renderFooter() {
    const currentYear = new Date().getFullYear();
    document.getElementById('footer-text').textContent =
        `© ${currentYear} ${config.personal.name}. Built with HTML, CSS, and JavaScript.`;
}

// Setup mobile menu toggle
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Setup smooth scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = 60;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadConfig);
