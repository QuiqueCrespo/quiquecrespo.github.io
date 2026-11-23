// Interactive neuro-symbolic proof/causal graph background
(function initSymbolicCanvas() {
    var canvas = document.getElementById('symbolic-canvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var nodes = [];
    var nodeCount = 28;
    var mouse = { x: -9999, y: -9999 };
    var width = 0;
    var height = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function seed() {
        nodes = [];
        for (var i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                r: 2 + Math.random() * 1.6,
                diamond: i % 4 === 0
            });
        }
    }

    window.addEventListener('resize', function() {
        resize();
        seed();
    });

    window.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', function() {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    resize();
    seed();

    function draw() {
        ctx.clearRect(0, 0, width, height);
        var styles = getComputedStyle(document.documentElement);
        var nodeColor = styles.getPropertyValue('--canvas-node').trim() || 'rgba(24,23,21,0.2)';
        var edgeColor = styles.getPropertyValue('--canvas-edge').trim() || 'rgba(184,67,46,0.15)';

        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            // Connect nearby nodes
            for (var j = i + 1; j < nodes.length; j++) {
                var m = nodes[j];
                var dx = n.x - m.x;
                var dy = n.y - m.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 155) {
                    ctx.beginPath();
                    ctx.strokeStyle = edgeColor;
                    ctx.globalAlpha = (1 - dist / 155) * 0.75;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(m.x, m.y);
                    ctx.stroke();
                }
            }

            // Subtle cursor interaction
            var mdx = n.x - mouse.x;
            var mdy = n.y - mouse.y;
            var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 180) {
                ctx.beginPath();
                ctx.strokeStyle = edgeColor;
                ctx.globalAlpha = (1 - mdist / 180) * 0.9;
                ctx.lineWidth = 0.9;
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }

            // Draw node (circle or Art Deco diamond)
            ctx.globalAlpha = 1;
            ctx.fillStyle = nodeColor;
            ctx.beginPath();
            if (n.diamond) {
                var s = n.r * 1.45;
                ctx.moveTo(n.x, n.y - s);
                ctx.lineTo(n.x + s, n.y);
                ctx.lineTo(n.x, n.y + s);
                ctx.lineTo(n.x - s, n.y);
                ctx.closePath();
            } else {
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            }
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
})();


// Copy-to-clipboard helper (Email & BibTeX)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.copy-inline-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var text = btn.getAttribute('data-copy');
            var targetSel = btn.getAttribute('data-copy-target');
            if (!text && targetSel) {
                var el = document.querySelector(targetSel);
                if (el) text = el.textContent.trim();
            }
            if (!text || !navigator.clipboard) return;
            navigator.clipboard.writeText(text).then(function() {
                var original = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(function() { btn.textContent = original; }, 1400);
            });
        });
    });
});


// Scroll reveal & active sidebar section tracking
document.addEventListener('DOMContentLoaded', function() {
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var revealObs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        reveals.forEach(function(el) { revealObs.observe(el); });
    } else {
        reveals.forEach(function(el) { el.classList.add('is-visible'); });
    }

    var navLinks = document.querySelectorAll('.sidebar-nav-link');
    if (navLinks.length && 'IntersectionObserver' in window) {
        var sections = ['about', 'updates', 'research', 'resources']
            .map(function(id) { return document.getElementById(id); })
            .filter(Boolean);

        var navObs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.getAttribute('id');
                    navLinks.forEach(function(link) {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { rootMargin: '-20% 0px -65% 0px' });

        sections.forEach(function(sec) { navObs.observe(sec); });
    }
});


// Back-to-top button
var btn = $('#back-to-top-button');

if (btn.length) {
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });

    btn.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, '300');
    });
}


// Toggle "Read more" / "Read less" on abstracts and refresh Isotope on BibTeX/abstract collapse
document.querySelectorAll('[data-toggle="collapse"]').forEach(function(trigger) {
    var targetSel = trigger.getAttribute('href') || trigger.getAttribute('data-target');
    if (!targetSel || targetSel.charAt(0) !== '#') return;
    var collapseElement = document.getElementById(targetSel.substring(1));
    if (!collapseElement) return;

    $(collapseElement).on('hidden.bs.collapse', function() {
        if (trigger.classList.contains('abstract-toggle')) {
            trigger.textContent = '... Read more';
        }
        if ($projects) $projects.isotope('layout');
    });
    $(collapseElement).on('shown.bs.collapse', function() {
        if (trigger.classList.contains('abstract-toggle')) {
            trigger.textContent = 'Show less';
        }
        if ($projects) $projects.isotope('layout');
    });
});


// Smooth scroll helper
function scrollToTopDiv(divTag) {
    var target = $(divTag)[0];
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


// Toggle dark/light theme
function toggleTheme() {
    const htmlEl = document.documentElement;
    const buttonEl = document.querySelector('.toggle-theme-button');

    if (htmlEl.classList.contains('light-theme')) {
        htmlEl.classList.remove('light-theme');
        htmlEl.classList.add('dark-theme');
        if (buttonEl) buttonEl.innerText = '◐';
        localStorage.setItem('theme', 'dark');
    } else {
        htmlEl.classList.remove('dark-theme');
        htmlEl.classList.add('light-theme');
        if (buttonEl) buttonEl.innerText = '◑';
        localStorage.setItem('theme', 'light');
    }
}


// Update progress bar on scroll
function updateProgressBar() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    bar.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateProgressBar);


// Contact info card overlay (shared across index and CV pages)
document.addEventListener('DOMContentLoaded', function() {
    var overlaybg = document.getElementById('overlay-bg');
    var contactTrigger = document.getElementById('contact-info-trigger');
    var closeBtn = document.getElementById('contact-close-btn');

    if (overlaybg && contactTrigger) {
        contactTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            overlaybg.style.display = 'flex';
        });

        overlaybg.addEventListener('click', function(event) {
            if (event.target === overlaybg) {
                overlaybg.style.display = 'none';
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                overlaybg.style.display = 'none';
            });
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && overlaybg.style.display === 'flex') {
                overlaybg.style.display = 'none';
            }
        });
    }
});


// Publications Isotope filtering & pagination
var itemsPerPageDefault = 5;
var currentNumberPages = 1;
var currentPage = 1;
var currentFilter = '*';
var filterAtribute = 'data-filter';
var pageAtribute = 'data-page-project';
var pagerClass = 'isotope-pager-project';
var $projects = null;

if ($('#projects').length && typeof $.fn.isotope === 'function') {
    $projects = $('#projects').isotope({
        itemSelector: '.project',
        layoutMode: 'vertical'
    });
}

function filterCategoryProjects(category) {
    if ($projects) {
        $projects.isotope({ filter: category });
    }
}

function showPageProjects(n) {
    currentPage = n;
    var category = '.project';
    category += (currentFilter !== '*') ? '[' + filterAtribute + '="' + currentFilter + '"]' : '';
    category += '[' + pageAtribute + '="' + currentPage + '"]';
    filterCategoryProjects(category);
}

function updatePagerProjects() {
    var $isotopePager = ($('.' + pagerClass).length === 0)
        ? $('<div class="' + pagerClass + '"></div>')
        : $('.' + pagerClass);
    $isotopePager.html('');

    if (currentNumberPages <= 1) {
        $isotopePager.hide();
        return;
    }

    $isotopePager.show();

    var $previous = $('<button class="pager" id="previous-page">&#8592; previous</button>');
    $previous.click(function() {
        if (currentPage > 1) {
            showPageProjects(currentPage - 1);
            updatePagerProjects();
            scrollToTopDiv('#research');
        }
    });
    if (currentPage === 1) $previous.prop('disabled', true);

    var $next = $('<button class="pager" id="next-page">next &#8594;</button>');
    $next.click(function() {
        if (currentPage < currentNumberPages) {
            showPageProjects(currentPage + 1);
            updatePagerProjects();
            scrollToTopDiv('#research');
        }
    });
    if (currentPage === currentNumberPages) $next.prop('disabled', true);

    var $currentPageIndicator = $('<span class="current-page">page ' + currentPage + ' of ' + currentNumberPages + '</span>');

    $previous.appendTo($isotopePager);
    $currentPageIndicator.appendTo($isotopePager);
    $next.appendTo($isotopePager);
    $projects.after($isotopePager);
}

function setPaginationProjects() {
    var item = 1;
    var page = 1;
    var category = '.project';
    category += (currentFilter !== '*') ? '[' + filterAtribute + '="' + currentFilter + '"]' : '';

    $projects.children(category).each(function() {
        if (item > itemsPerPageDefault) {
            page++;
            item = 1;
        }
        $(this).attr(pageAtribute, page);
        item++;
    });
    currentNumberPages = page;
    updatePagerProjects();
}

function initializeIsotopeProjects() {
    if (!$projects) return;

    setPaginationProjects();
    showPageProjects(1);

    $('#filters-project .filter-button').click(function() {
        $('#filters-project .filter-button').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).attr('data-filter');
        setPaginationProjects();
        showPageProjects(1);
        updatePagerProjects();
    });
}


// GitHub repositories loader & Isotope pagination
var itemsPerPageDefault_1 = 6;
var currentNumberPages_1 = 1;
var currentPage_1 = 1;
var currentFilter_1 = '*';
var filterAtribute_1 = 'data-filter';
var pageAtribute_1 = 'data-page-github';
var pagerClass_1 = 'isotope-pager-github';
var $cards = null;

if ($('#github-cards').length && typeof $.fn.isotope === 'function') {
    $cards = $('#github-cards').isotope({
        itemSelector: '.github-card',
        layoutMode: 'fitRows'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('github-cards');
    if (!container || typeof axios === 'undefined') return;

    const repoElements = container.querySelectorAll('div[data-url]');

    repoElements.forEach(function(repoElement) {
        const repoUrl = repoElement.getAttribute('data-url');
        const repoSlug = repoUrl.replace('https://github.com/', '');
        const apiUrl = 'https://api.github.com/repos/' + repoSlug;

        axios.get(apiUrl)
            .then(function(response) {
                const { name, description, html_url, stargazers_count, forks_count, language } = response.data;
                repoElement.outerHTML = `
                    <div class="repo-header">
                        <i class="far fa-bookmark bookmark-icon"></i>
                        <a href="${html_url}" target="_blank" rel="noopener" class="repo-name">${name}</a>
                    </div>
                    <div class="repo-description">${description || 'No description provided.'}</div>
                    <div class="repo-stats">
                        <div>
                            <i class="fas fa-code language-icon"></i>
                            <span class="language">${language || 'N/A'}</span>
                        </div>
                        <div>
                            <i class="fas fa-star star-icon"></i>
                            <span class="stats-number">${stargazers_count}</span>
                        </div>
                        <div>
                            <i class="fas fa-code-branch fork-icon"></i>
                            <span class="stats-number">${forks_count}</span>
                        </div>
                    </div>
                `;
                if ($cards) $cards.isotope('layout');
            })
            .catch(function() {
                repoElement.outerHTML = `
                    <div class="repo-header">
                        <i class="far fa-bookmark bookmark-icon"></i>
                        <a href="${repoUrl}" target="_blank" rel="noopener" class="repo-name">${repoSlug}</a>
                    </div>
                    <div class="repo-description">View repository on GitHub.</div>
                `;
                if ($cards) $cards.isotope('layout');
            });
    });
});

function filterCategoryGithub(category) {
    if ($cards) {
        $cards.isotope({ filter: category });
    }
}

function showPageGithub(n) {
    currentPage_1 = n;
    var category = '.github-card';
    category += (currentFilter_1 !== '*') ? '[' + filterAtribute_1 + '="' + currentFilter_1 + '"]' : '';
    category += '[' + pageAtribute_1 + '="' + currentPage_1 + '"]';
    filterCategoryGithub(category);
}

function updatePagerGithub() {
    var $isotopePager = ($('.' + pagerClass_1).length === 0)
        ? $('<div class="' + pagerClass_1 + '"></div>')
        : $('.' + pagerClass_1);
    $isotopePager.html('');

    if (currentNumberPages_1 <= 1) {
        $isotopePager.hide();
        return;
    }

    $isotopePager.show();

    var $previous = $('<button class="pager">&#8592; previous</button>');
    $previous.click(function() {
        if (currentPage_1 > 1) {
            showPageGithub(currentPage_1 - 1);
            updatePagerGithub();
            scrollToTopDiv('#resources');
        }
    });
    if (currentPage_1 === 1) $previous.prop('disabled', true);

    var $next = $('<button class="pager">next &#8594;</button>');
    $next.click(function() {
        if (currentPage_1 < currentNumberPages_1) {
            showPageGithub(currentPage_1 + 1);
            updatePagerGithub();
            scrollToTopDiv('#resources');
        }
    });
    if (currentPage_1 === currentNumberPages_1) $next.prop('disabled', true);

    var $currentPageIndicator = $('<span class="current-page">page ' + currentPage_1 + ' of ' + currentNumberPages_1 + '</span>');

    $previous.appendTo($isotopePager);
    $currentPageIndicator.appendTo($isotopePager);
    $next.appendTo($isotopePager);
    $cards.after($isotopePager);
}

function setPaginationGithub() {
    var item = 1;
    var page = 1;
    var category = '.github-card';
    category += (currentFilter_1 !== '*') ? '[' + filterAtribute_1 + '="' + currentFilter_1 + '"]' : '';

    $cards.children(category).each(function() {
        if (item > itemsPerPageDefault_1) {
            page++;
            item = 1;
        }
        $(this).attr(pageAtribute_1, page);
        item++;
    });
    currentNumberPages_1 = page;
    updatePagerGithub();
}

function initializeIsotopeGithub() {
    if (!$cards) return;

    setPaginationGithub();
    showPageGithub(1);

    $('#filters-resources .filter-button').click(function() {
        $('#filters-resources .filter-button').removeClass('active');
        $(this).addClass('active');
        currentFilter_1 = $(this).attr('data-filter');
        setPaginationGithub();
        showPageGithub(1);
        updatePagerGithub();
    });
}


// Initialize layouts once images have loaded
$(document).ready(function() {
    var images = $('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]').get();
    var imageLoadPromises = images.map(function(img) {
        return new Promise(function(resolve) {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = resolve;
            }
        });
    });

    Promise.all(imageLoadPromises).then(function() {
        initializeIsotopeProjects();
        initializeIsotopeGithub();
    });
});


// Sync theme toggle icon and respond to OS preference changes
document.addEventListener('DOMContentLoaded', function() {
    const buttonEl = document.querySelector('.toggle-theme-button');
    if (!buttonEl) return;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    buttonEl.innerText = isDark ? '◐' : '◑';

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const htmlEl = document.documentElement;
            if (e.matches) {
                htmlEl.classList.remove('light-theme');
                htmlEl.classList.add('dark-theme');
                buttonEl.innerText = '◐';
            } else {
                htmlEl.classList.remove('dark-theme');
                htmlEl.classList.add('light-theme');
                buttonEl.innerText = '◑';
            }
        }
    });
});


// Automatically update year in footer
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}
