// Back-to-top button
var btn = $('#back-to-top-button');

$(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
});

btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
});


// Toggle navigation menu bar
function toggleNav() {
    document.querySelector('nav').classList.toggle('animated-menu');
    document.querySelector('.nav-toggle-btn').classList.toggle('active');
}


// Change the text interchangably "See More" and "See Less"
function toggleText(linkElement) {
    var collapseId = linkElement.getAttribute('href').substring(1);
    var collapseElement = document.getElementById(collapseId);

    $(collapseElement).on('hidden.bs.collapse', function () {
        linkElement.textContent = '... See More';
    });
    $(collapseElement).on('shown.bs.collapse', function () {
        linkElement.textContent = '... See Less';
    });
}


// Initialize the toggleText function for each link
document.querySelectorAll('[data-toggle="collapse"]').forEach(function (linkElement) {
    toggleText(linkElement);
});


// Scroll to top of a div based on its tag
function scrollToTopDiv(divTag) {
    $(divTag)[0].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


// Button for toggle theme (dark/light)
function toggleTheme() {
    const bodyEl = document.body;
    const htmlEl = document.documentElement;
    const buttonEl = document.querySelector('.toggle-theme-button');

    if (bodyEl.classList.contains('light-theme')) {
        // Switch to dark theme
        htmlEl.classList.remove('light-theme');
        htmlEl.classList.add('dark-theme');
        bodyEl.classList.remove('light-theme');
        bodyEl.classList.add('dark-theme');
        if (buttonEl) {
            buttonEl.classList.remove('light-theme');
            buttonEl.classList.add('dark-theme');
            buttonEl.innerText = '◐';
        }
        localStorage.setItem('theme', 'dark');
    } else {
        // Switch to light theme
        htmlEl.classList.remove('dark-theme');
        htmlEl.classList.add('light-theme');
        bodyEl.classList.remove('dark-theme');
        bodyEl.classList.add('light-theme');
        if (buttonEl) {
            buttonEl.classList.remove('dark-theme');
            buttonEl.classList.add('light-theme');
            buttonEl.innerText = '◑';
        }
        localStorage.setItem('theme', 'light');
    }
}


// Handle scroll event to hide/show back-to-top and toggle theme button
window.addEventListener('scroll', function() {
    const buttonEl = document.querySelector('.toggle-theme-button');
    if (window.scrollY > 0) {
        buttonEl.style.display = 'none';
    } else {
        buttonEl.style.display = 'block';
    }
});


// Owl carousel for updates
function initializeOwlCarousel() {
    // Only initialize if owlCarousel is available and element exists
    if ($('.owl-carousel').length && typeof $.fn.owlCarousel === 'function') {
        $('.owl-carousel').owlCarousel({
            loop: false,
            rewind: false,
            margin: 10,
            nav: true,
            dots: false,
            lazyLoad: false,
            slideBy: 'page',
            responsive: {
                0: {items: 1.75},
                600: {items: 3},
                900: {items: 5},
                1200: {items: 6}
            }
        });
    }
}

// Touch and mouse event listeners
let isDragging = false;
let isMobile = 'ontouchstart' in window;
let startEvent = isMobile ? 'touchstart' : 'mousedown';
let moveEvent = isMobile ? 'touchmove' : 'mousemove';
let endEvent = isMobile ? 'touchend' : 'mouseup';

// Get popup icon elements (may not exist on all pages)
const popupIconContainer = document.getElementById('popupIconContainer');
const dismissalArea = document.getElementById('dismissalArea');

// Capture mouse down (desktop) or touch start (mobile) events
if (popupIconContainer && dismissalArea) {
    popupIconContainer.addEventListener(startEvent, (e) => {
        e.preventDefault();
        isDragging = true;
        let clientX = isMobile ? e.touches[0].clientX : e.clientX;
        let clientY = isMobile ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;
        originalX = popupIconContainer.getBoundingClientRect().left;
        originalY = popupIconContainer.getBoundingClientRect().top;
        dismissalArea.style.display = 'flex';
    });


    // Capture mouse move (desktop) or touch move (mobile) events
    document.addEventListener(moveEvent, (e) => {
        if (!isDragging) {
            return;
        }

        let clientX = isMobile ? e.touches[0].clientX : e.clientX;
        let clientY = isMobile ? e.touches[0].clientY : e.clientY;

        let x = originalX + (clientX - startX);
        let y = originalY + (clientY - startY);
        popupIconContainer.style.left = `${x}px`;
        popupIconContainer.style.bottom = `calc(100% - ${y}px - ${popupIconContainer.offsetHeight}px)`;
    });


    // Capture mouse up (desktop) or touch end (mobile) events
    document.addEventListener(endEvent, (e) => {
        const clickSound = new Audio('assets/sounds/disappear_sound.wav');

        if (!isDragging) {
            return;
        }

        let clientX = isMobile ? e.changedTouches[0].clientX : e.clientX;
        let clientY = isMobile ? e.changedTouches[0].clientY : e.clientY;
        let centerX = window.innerWidth / 2;
        let centerY = window.innerHeight;

        // Check if icon is near the middle bottom dismissal area
        if (Math.abs(clientX - centerX) < 50 && Math.abs(clientY - centerY) < 100) {
            popupIconContainer.classList.add('hidden');
            clickSound.play();
        }

        dismissalArea.style.display = 'none';
        isDragging = false;
    });
}


// Update progress bar as user scrolls down
window.onscroll = function() {progressBar()};

function progressBar() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
}


// Scripts to activate/deactivate contact info card
$(document).ready(function() {
    var overlaybg = document.getElementById('overlay-bg');

    if (overlaybg) {
        var contactTrigger = document.getElementById('contact-info-trigger');
        if (contactTrigger) {
            contactTrigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                overlaybg.style.display = 'flex';
                console.log('Contact info clicked, overlay display set to flex');
                return false;
            });
        } else {
            console.log('Contact trigger not found');
        }

        overlaybg.addEventListener('click', function(event) {
            if (event.target === overlaybg) {
                overlaybg.style.display = 'none';
            }
        });
    }
});


// Removed flipping-card functionality - contact card now displays info directly


// Get all filter buttons and change their active status as user clicks
var filterButtonsProject = document.querySelectorAll('#filters-project .filter-button');
var filterButtonsGithub = document.querySelectorAll('#filters-resources .filter-button');

filterButtonsProject.forEach(function(filterButtonProject) {
    filterButtonProject.addEventListener('click', function() {
        filterButtonsProject.forEach(function(flrbtn) {
            flrbtn.classList.remove('active');
        });
        this.classList.add('active');
    });
});

filterButtonsGithub.forEach(function(filterButtonGithub) {
    filterButtonGithub.addEventListener('click', function() {
        filterButtonsGithub.forEach(function(flrbtn) {
            flrbtn.classList.remove('active');
        });
        this.classList.add('active');
    });
});


// Function to update Isotope layout with smooth transitions
function updateLayout(collapseElement, isExpanding) {
    
    // Initialize Isotope with vertical layout
    var iso = new Isotope('#projects', {
        itemSelector: '.project',
        layoutMode: 'vertical'
    });

    if (isExpanding) {
        $(collapseElement).css('display', 'none');
        iso.arrange();
        setTimeout(function() {
            $(collapseElement).css('display', '');
            iso.arrange();
        }, 300);
    } else {
        iso.arrange();
        setTimeout(function() {
            $(collapseElement).css('display', 'none');
            iso.arrange();
        }, 300);
    }
}


// Bind updateLayout function to the collapsible elements' events
$('.collapse').on('show.bs.collapse', function () {
    updateLayout(this, true);
}).on('hide.bs.collapse', function () {
    updateLayout(this, false);
});


// Modified from https://codepen.io/SohRonery/pen/wvvBLyP
var itemsPerPageDefault = 5;
var currentNumberPages = 1;
var currentPage = 1;
var currentFilter = '*';
var filterAtribute = 'data-filter';
var pageAtribute = 'data-page-project';
var pagerClass = 'isotope-pager-project';
var $projects = null;

// Only initialize isotope if #projects exists
if ($('#projects').length) {
    $projects = $('#projects').isotope({
        itemcategory: '.project',
        layoutMode: 'vertical'
    });
}


// Filter based on input category
function filterCategoryProjects(category) {
    if ($projects) {
        $projects.isotope({
            filter: category
        });
    }
}


// Determine items to be categorized and displayed per page
function showPageProjects(n) {
    currentPage = n;
    var category = '.project';
        category += ( currentFilter != '*' ) ? '[' + filterAtribute + '="' + currentFilter + '"]' : '';
        category += '[' + pageAtribute + '="' + currentPage+'"]';
    filterCategoryProjects(category);
}


// Update pager indicator when user clicks previous or next button, and disable buttons as needed
function updatePagerProjects() {
    var $isotopePager = ($('.' + pagerClass).length == 0 ) ? $('<div class="' + pagerClass + '"></div>') : $('.' + pagerClass);
    $isotopePager.html('');

    // Hide pagination if only one page
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
    if (currentPage === 1) {
        $previous.prop('disabled', true);
    }

    var $next = $('<button class="pager" id="next-page">next &#8594;</button>');
    $next.click(function() {
        if (currentPage < currentNumberPages) {
            showPageProjects(currentPage + 1);
            updatePagerProjects();
            scrollToTopDiv('#research');
        }
    });
    if (currentPage === currentNumberPages) {
        $next.prop('disabled', true);
    }

    var $currentPageIndicator = $('<span class="current-page">page ' + currentPage + ' of ' + currentNumberPages + '</span>');

    $previous.appendTo($isotopePager);
    $currentPageIndicator.appendTo($isotopePager);
    $next.appendTo($isotopePager);
    $projects.after($isotopePager);
}


// Set pagination
function setPaginationProjects() {
    var SettingsPagesOnItems = function() {
        var itemsLength = $projects.children('.project').length;
        var pages = Math.ceil(itemsLength / itemsPerPageDefault);
        var item = 1;
        var page = 1;
        var category = '.project';
            category += ( currentFilter != '*' ) ? '[' + filterAtribute + '="' + currentFilter + '"]' : '';
        
        $projects.children(category).each(function() {
            if (item > itemsPerPageDefault) {
                page++;
                item = 1;
            }
            $(this).attr(pageAtribute, page);
            item++;
        });
        currentNumberPages = page;
    }();

    updatePagerProjects();
}


function initializeIsotopeProjects() {
    // Set number of pages, return to first page,
    setPaginationProjects();
    showPageProjects(1);


    // Filter projects based on category, including change active buttons, filter projects, 
    // set the number of pages, return to the first page, and update the pager indicator 
    $('#filters-project .filter-button').click(function() {
        $('#filters-project .filter-button').removeClass('active');
        $(this).addClass('active');
        var filter = $(this).attr('data-filter');
        currentFilter = filter;
        setPaginationProjects();
        showPageProjects(1);
        updatePagerProjects();
    });
}


// Function load GitHub repositories
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('github-cards');
    if (!container) return; // Exit if resources section doesn't exist on this page

    const repoElements = container.querySelectorAll('div[data-url]');

    repoElements.forEach(repoElement => {
        const repoUrl = repoElement.getAttribute('data-url');

        // Convert GitHub web URL to API URL
        // https://github.com/owner/repo -> https://api.github.com/repos/owner/repo
        const apiUrl = repoUrl.replace('https://github.com/', 'https://api.github.com/repos/');

        axios.get(apiUrl)
            .then(response => {
                const { name, description, html_url, stargazers_count, forks_count, language } = response.data;
                const cardHtml = `
                        <div class="repo-header">
                            <i class="far fa-bookmark bookmark-icon"></i>
                            <a href="${html_url}" target="_blank" class="repo-name">${name}</a>
                        </div>
                        <div class="repo-description">${description || 'No description provided.'}</div>
                        <div class="repo-stats">
                            <i class="fas fa-code language-icon"></i>
                            <span class="language">${language || 'N/A'}</span>
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

                repoElement.outerHTML = cardHtml;

                // Refresh GitHub cards isotope layout
                if ($cards) {
                    $cards.isotope('layout');
                }

            })
            .catch(error => {
                console.error('Error fetching repository data for', repoUrl, error);
                // Display error card
                repoElement.outerHTML = `
                    <div class="repo-header">
                        <i class="far fa-bookmark bookmark-icon"></i>
                        <span class="repo-name">Failed to load repository</span>
                    </div>
                    <div class="repo-description">Could not fetch data from ${repoUrl}</div>
                `;
            });
    });
});


// Modified from https://codepen.io/SohRonery/pen/wvvBLyP
var itemsPerPageDefault_1 = 6;
var currentNumberPages_1 = 1;
var currentPage_1 = 1;
var currentFilter_1 = '*';
var filterAtribute_1 = 'data-filter';
var pageAtribute_1 = 'data-page-github';
var pagerClass_1 = 'isotope-pager-github';
var $cards = null;

// Only initialize isotope if #github-cards exists
if ($('#github-cards').length) {
    $cards = $('#github-cards').isotope({
        itemcategory: '.github-card',
        layoutMode: 'fitRows'
    });
}


// Filter based on input category
function filterCategoryGithub(category) {
    if ($cards) {
        $cards.isotope({
            filter: category
        });
    }
}


// Determine items to be categorized and displayed per page
function showPageGithub(n) {
    currentPage_1 = n;
    var category = '.github-card';
        category += ( currentFilter_1 != '*' ) ? '[' + filterAtribute_1 + '="' + currentFilter_1 + '"]' : '';
        category += '[' + pageAtribute_1 + '="' + currentPage_1+'"]';
    filterCategoryGithub(category);
}


// Update pager indicator when user clicks previous or next button, and disable buttons as needed
function updatePagerGithub() {
    var $isotopePager = ($('.' + pagerClass_1).length == 0 ) ? $('<div class="' + pagerClass_1 + '"></div>') : $('.' + pagerClass_1);
    $isotopePager.html('');

    // Hide pagination if only one page
    if (currentNumberPages_1 <= 1) {
        $isotopePager.hide();
        return;
    }

    $isotopePager.show();

    var $previous = $('<button class="pager" id="previous-page">&#8592; previous</button>');
    $previous.click(function() {
        if (currentPage_1 > 1) {
            showPageGithub(currentPage_1 - 1);
            updatePagerGithub();
            scrollToTopDiv('#resources');
        }
    });
    if (currentPage_1 === 1) {
        $previous.prop('disabled', true);
    }

    var $next = $('<button class="pager" id="next-page">next &#8594;</button>');
    $next.click(function() {
        if (currentPage_1 < currentNumberPages_1) {
            showPageGithub(currentPage_1 + 1);
            updatePagerGithub();
            scrollToTopDiv('#resources');
        }
    });
    if (currentPage_1 === currentNumberPages_1) {
        $next.prop('disabled', true);
    }

    var $currentPage_1Indicator = $('<span class="current-page">page ' + currentPage_1 + ' of ' + currentNumberPages_1 + '</span>');

    $previous.appendTo($isotopePager);
    $currentPage_1Indicator.appendTo($isotopePager);
    $next.appendTo($isotopePager);
    $cards.after($isotopePager);
}


// Set pagination
function setPaginationGithub() {
    var SettingsPagesOnItems = function() {
        var itemsLength = $cards.children('.github-card').length;
        var pages = Math.ceil(itemsLength / itemsPerPageDefault_1);
        var item = 1;
        var page = 1;
        var category = '.github-card';
            category += ( currentFilter_1 != '*' ) ? '[' + filterAtribute_1 + '="' + currentFilter_1 + '"]' : '';
        
        $cards.children(category).each(function() {
            if (item > itemsPerPageDefault_1) {
                page++;
                item = 1;
            }
            $(this).attr(pageAtribute_1, page);
            item++;
        });
        currentNumberPages_1 = page;
    }();

    updatePagerGithub();
}


function initializeIsotopeGithub() {
    // Set number of pages, return to first page,
    setPaginationGithub();
    showPageGithub(1);


    // Filter cards based on category, including change active buttons, filter cards, 
    // set the number of pages, return to the first page, and update the pager indicator 
    $('#filters-resources .filter-button').click(function() {
        $('#filters-resources .filter-button').removeClass('active');
        $(this).addClass('active');
        var filter = $(this).attr('data-filter');
        currentFilter_1 = filter;
        setPaginationGithub();
        showPageGithub(1);
        updatePagerGithub();
    });
}


// // Guarantee correct layouts when all web resources are fully loaded 
// This version is slow --> only re-layout when all the gifs are fully loaded
// $(window).on('load', function() {
//     initializeOwlCarousel();
//     initializeIsotopeProjects();
// });
// This version is faster --> re-layout when all the images are fully loaded not neccessarily all the gifs
$(document).ready(function() {
    var Images = $('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]').get();
    var imageLoadPromises = Images.map(function(img) {
        return new Promise(function(resolve) {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
            }
        });
    });

    Promise.all(imageLoadPromises).then(function() {
        initializeOwlCarousel();
        initializeIsotopeProjects();
        initializeIsotopeGithub();
    });
});


// Apply theme to body and update button on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const buttonEl = document.querySelector('.toggle-theme-button');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    // Apply theme to body (html already has it from inline script)
    if (isDark) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        if (buttonEl) buttonEl.innerText = '◐';
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        if (buttonEl) buttonEl.innerText = '◑';
    }

    // Listen for browser preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.remove('light-theme');
                document.documentElement.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
                if (buttonEl) buttonEl.innerText = '◐';
            } else {
                document.documentElement.classList.remove('dark-theme');
                document.documentElement.classList.add('light-theme');
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                if (buttonEl) buttonEl.innerText = '◑';
            }
        }
    });
});


// Automatically update year in footer
const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}
