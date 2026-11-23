// Interactive neuro-symbolic graph background
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

    window.addEventListener('resize', function() { resize(); seed(); });
    window.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', function() { mouse.x = -9999; mouse.y = -9999; });

    resize();
    seed();

    function draw() {
        ctx.clearRect(0, 0, width, height);
        var styles = getComputedStyle(document.documentElement);
        var nodeColor = styles.getPropertyValue('--canvas-node').trim() || 'rgba(20,20,20,0.18)';
        var edgeColor = styles.getPropertyValue('--canvas-edge').trim() || 'rgba(20,20,20,0.1)';

        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

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


// Theme toggle (global for onclick attribute)
function toggleTheme() {
    var htmlEl = document.documentElement;
    var buttonEl = document.querySelector('.toggle-theme-button');

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


document.addEventListener('DOMContentLoaded', function() {
    // Sync theme toggle icon & OS theme changes
    var themeBtn = document.querySelector('.toggle-theme-button');
    if (themeBtn) {
        var saved = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = saved === 'dark' || (!saved && prefersDark);
        themeBtn.innerText = isDark ? '◐' : '◑';

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                document.documentElement.classList.toggle('dark-theme', e.matches);
                document.documentElement.classList.toggle('light-theme', !e.matches);
                themeBtn.innerText = e.matches ? '◐' : '◑';
            }
        });
    }

    // Footer year
    var yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Progress bar & back-to-top button
    var bar = document.getElementById('progressBar');
    var topBtn = document.getElementById('back-to-top-button');
    window.addEventListener('scroll', function() {
        var y = window.scrollY || document.documentElement.scrollTop;
        if (bar) {
            var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
        }
        if (topBtn) {
            topBtn.classList.toggle('show', y > 300);
        }
    });
    if (topBtn) {
        topBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Vanilla collapsible toggles (Abstracts & BibTeX drawers)
    document.querySelectorAll('[data-collapse]').forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(trigger.getAttribute('data-collapse'));
            if (!target) return;
            var open = target.classList.toggle('is-open');
            trigger.setAttribute('aria-expanded', String(open));
            if (trigger.classList.contains('abstract-toggle')) {
                trigger.textContent = open ? 'Show less' : '... Read more';
            }
        });
    });

    // Copy-to-clipboard (Email & BibTeX)
    document.querySelectorAll('.copy-inline-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var text = btn.getAttribute('data-copy');
            var sel = btn.getAttribute('data-copy-target');
            if (!text && sel) {
                var el = document.querySelector(sel);
                if (el) text = el.textContent.trim();
            }
            if (!text || !navigator.clipboard) return;
            navigator.clipboard.writeText(text).then(function() {
                var orig = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(function() { btn.textContent = orig; }, 1400);
            });
        });
    });

    // Contact card modal
    var overlay = document.getElementById('overlay-bg');
    var contactTrigger = document.getElementById('contact-info-trigger');
    var closeBtn = document.getElementById('contact-close-btn');
    if (overlay && contactTrigger) {
        contactTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            overlay.style.display = 'flex';
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.style.display = 'none';
        });
        if (closeBtn) {
            closeBtn.addEventListener('click', function() { overlay.style.display = 'none'; });
        }
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.style.display === 'flex') overlay.style.display = 'none';
        });
    }

    // Vanilla category filtering (Publications & Resources)
    function setupFilter(filterBarSel, itemSel) {
        var btns = document.querySelectorAll(filterBarSel + ' .filter-button');
        var items = document.querySelectorAll(itemSel);
        if (!btns.length || !items.length) return;
        btns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                btns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var filter = btn.getAttribute('data-filter');
                items.forEach(function(item) {
                    var show = filter === '*' || item.getAttribute('data-filter') === filter;
                    item.style.display = show ? '' : 'none';
                });
            });
        });
    }
    setupFilter('#filters-project', '#projects .project');
    setupFilter('#filters-resources', '#github-cards .github-card');

    // Native fetch for GitHub repository cards
    var ghContainer = document.getElementById('github-cards');
    if (ghContainer) {
        ghContainer.querySelectorAll('div[data-url]').forEach(function(el) {
            var repoUrl = el.getAttribute('data-url');
            var slug = repoUrl.replace('https://github.com/', '');
            fetch('https://api.github.com/repos/' + slug)
                .then(function(res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(function(data) {
                    el.outerHTML =
                        '<div class="repo-header">' +
                            '<i class="far fa-bookmark bookmark-icon"></i>' +
                            '<a href="' + data.html_url + '" target="_blank" rel="noopener" class="repo-name">' + data.name + '</a>' +
                        '</div>' +
                        '<div class="repo-description">' + (data.description || 'No description provided.') + '</div>' +
                        '<div class="repo-stats">' +
                            '<div><i class="fas fa-code language-icon"></i><span class="language">' + (data.language || 'N/A') + '</span></div>' +
                            '<div><i class="fas fa-star star-icon"></i><span class="stats-number">' + data.stargazers_count + '</span></div>' +
                            '<div><i class="fas fa-code-branch fork-icon"></i><span class="stats-number">' + data.forks_count + '</span></div>' +
                        '</div>';
                })
                .catch(function() {
                    el.outerHTML =
                        '<div class="repo-header">' +
                            '<i class="far fa-bookmark bookmark-icon"></i>' +
                            '<a href="' + repoUrl + '" target="_blank" rel="noopener" class="repo-name">' + slug + '</a>' +
                        '</div>' +
                        '<div class="repo-description">View repository on GitHub.</div>';
                });
        });
    }

    // Scroll reveal & active sidebar section tracking
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
