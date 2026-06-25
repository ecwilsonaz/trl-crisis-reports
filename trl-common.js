// ─── Theme initialization ───
// Runs immediately (blocking) to set data-theme before first paint.
(function() {
  var t;
  try { t = localStorage.getItem('theme'); } catch(e) {}
  if (!t) t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
})();

// ─── Live OS theme listener ───
// Follows system changes when user hasn't manually toggled.
(function() {
  var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  if (!mq || !mq.addEventListener) return;
  mq.addEventListener('change', function(e) {
    try { if (localStorage.getItem('theme')) return; } catch(ex) {}
    document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    var b = document.querySelector('.theme-toggle');
    if (b) {
      b.setAttribute('aria-label', 'Switch to ' + (e.matches ? 'light' : 'dark') + ' mode');
      var s = b.querySelector('span');
      if (s) s.textContent = e.matches ? '\u2600\uFE0F' : '\uD83C\uDF19';
    }
  });
})();

// ─── Print helpers ───
// Rebuild charts for print (correct colors + proportions), force <details> open,
// build endnotes section with superscript numbering.
var _chartBuildFn = null; // set by setupChartInfra

(function() {
  var printState = null;

  window.addEventListener('beforeprint', function() {
    if (printState) return; // guard against double-fire (pdf(), print preview re-render)
    printState = { opened: [], footnotes: [], endnotesEl: null, swappedGlossary: false };

    // 0. Move glossary to just before first exhibit (Part 2 only).
    //    This puts header → intro → exec summary → callout on page 1,
    //    with glossary starting page 2 (via break-before: page).
    var glossary = document.querySelector('details.glossary');
    var firstExhibit = document.querySelector('.exhibit');
    if (glossary && firstExhibit) {
      printState.glossaryOrigNext = glossary.nextElementSibling;
      glossary.parentNode.insertBefore(glossary, firstExhibit);
      printState.swappedGlossary = true;
    }

    // 1. Force closed <details> open
    document.querySelectorAll('details:not([open])').forEach(function(d) {
      d.setAttribute('open', '');
      printState.opened.push(d);
    });

    // 2. Force light theme so tc() reads print-appropriate colors.
    //    getComputedStyle during beforeprint may not reflect @media print
    //    overrides in all browsers, so dark-theme palettes (pastels on dark bg)
    //    would leak into the captured images without this.
    printState.prevTheme = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = 'light';

    // 3. Rebuild charts with print colors, then replace canvases with static
    //    images. This sidesteps all Chart.js sizing/ResizeObserver issues —
    //    <img> elements scale naturally in print layouts.
    if (_chartBuildFn && typeof Chart !== 'undefined') {
      printState.prevAnimation = Chart.defaults.animation;
      Chart.defaults.animation = false; // ensure snapshot captures final state
      Chart.defaults.devicePixelRatio = 3; // high-res print output
      _chartBuildFn(); // rebuild with light-theme colors at screen dimensions
      printState.canvasImages = [];
      document.querySelectorAll('canvas').forEach(function(canvas) {
        var chart = Chart.getChart(canvas);
        if (!chart) return;
        var img = document.createElement('img');
        img.src = chart.toBase64Image();
        img.className = 'print-chart-img';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        canvas.classList.add('print-hidden');
        canvas.parentNode.insertBefore(img, canvas.nextSibling);
        printState.canvasImages.push({ canvas: canvas, img: img });
      });
    }

    // 3. Build endnotes from external links
    var page = document.querySelector('.page');
    if (!page) return;
    var links = page.querySelectorAll('a[href^="http"]');
    if (!links.length) return;

    var urlMap = {};   // href → footnote number
    var urlList = [];  // ordered unique URLs
    var sups = [];     // superscript elements to clean up

    links.forEach(function(a) {
      // Skip timestamp links
      if (a.classList.contains('ts-link')) return;
      // Skip links inside elements hidden in print
      if (a.closest('.toc-sidebar, .draft-banner, .theme-toggle, .skip-link')) return;

      var href = a.getAttribute('href');
      if (!urlMap[href]) {
        urlList.push(href);
        urlMap[href] = urlList.length;
      }

      var sup = document.createElement('sup');
      sup.className = 'print-fn';
      sup.textContent = urlMap[href];
      a.parentNode.insertBefore(sup, a.nextSibling);
      sups.push(sup);
    });

    printState.footnotes = sups;

    if (urlList.length) {
      var section = document.createElement('section');
      section.className = 'print-endnotes';
      var heading = document.createElement('h2');
      heading.textContent = 'Links';
      section.appendChild(heading);
      var ol = document.createElement('ol');
      urlList.forEach(function(url) {
        var li = document.createElement('li');
        li.textContent = url;
        ol.appendChild(li);
      });
      section.appendChild(ol);
      page.appendChild(section);
      printState.endnotesEl = section;
    }
  });

  window.addEventListener('afterprint', function() {
    if (!printState) return;

    // Restore glossary to original position
    if (printState.swappedGlossary && printState.glossaryOrigNext) {
      var glossary = document.querySelector('details.glossary');
      if (glossary) {
        glossary.parentNode.insertBefore(glossary, printState.glossaryOrigNext);
      }
    }

    // Restore closed <details>
    printState.opened.forEach(function(d) { d.removeAttribute('open'); });

    // Remove superscript footnote markers
    printState.footnotes.forEach(function(sup) { sup.parentNode.removeChild(sup); });

    // Remove endnotes section
    if (printState.endnotesEl && printState.endnotesEl.parentNode) {
      printState.endnotesEl.parentNode.removeChild(printState.endnotesEl);
    }

    // Remove print images, restore canvases
    if (printState.canvasImages) {
      printState.canvasImages.forEach(function(pair) {
        pair.canvas.classList.remove('print-hidden');
        if (pair.img.parentNode) pair.img.parentNode.removeChild(pair.img);
      });
    }

    // Restore theme before rebuilding charts so tc() reads screen colors
    if (printState.prevTheme !== undefined) {
      document.documentElement.dataset.theme = printState.prevTheme;
    }

    // Rebuild charts — restores screen colors, dimensions, and animation
    if (_chartBuildFn && typeof Chart !== 'undefined') {
      if (printState.prevAnimation !== undefined) Chart.defaults.animation = printState.prevAnimation;
      Chart.defaults.devicePixelRatio = window.devicePixelRatio || 1;
    }

    printState = null;

    if (_chartBuildFn && typeof Chart !== 'undefined') {
      _chartBuildFn();
    }
  });
})();

// ─── Theme-aware color resolver ───
// Unified across all pages; superset of all fields used by any page's charts.
function tc() {
  var s = getComputedStyle(document.documentElement);
  var g = function(v) { return s.getPropertyValue(v).trim(); };
  return {
    red: g('--red'), blue: g('--blue'), green: g('--green'), amber: g('--amber'),
    purple: g('--purple'),
    text: g('--text-primary'), textSec: g('--text-secondary'), muted: g('--text-muted'),
    border: g('--border'), grid: g('--chart-grid'),
    redBg: g('--red-bg'), blueBg: g('--blue-bg'), amberBg: g('--amber-bg'), purpleBg: g('--purple-bg'),
    bgCard: g('--bg-card'),
    mono: "'IBM Plex Mono', monospace", body: "'IBM Plex Serif', Georgia, serif",
    sans: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif"
  };
}

// ─── Chart infrastructure ───
// Call from each page's inline script with the page's buildAllCharts function.
// Sets up: DOMContentLoaded build, theme observer, resize handler, tooltip dismiss.
function setupChartInfra(buildFn) {
  _chartBuildFn = buildFn; // Store for print handler

  // Wrap buildFn so it waits for Chart.js (loaded with defer) to be available.
  // Fonts may resolve before the deferred script executes.
  function safeBuild() {
    if (typeof Chart !== 'undefined') { buildFn(); return; }
    var tries = 0;
    var poll = setInterval(function() {
      if (typeof Chart !== 'undefined') { clearInterval(poll); buildFn(); }
      else if (++tries > 200) { clearInterval(poll); } // give up after 2s
    }, 10);
  }

  // Wait for fonts to load before building charts (prevents canvas text measurement
  // with fallback metrics that won't update after font swap)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(safeBuild);
  } else {
    document.addEventListener('DOMContentLoaded', safeBuild);
  }

  new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === 'data-theme') { buildFn(); break; }
    }
  }).observe(document.documentElement, { attributes: true });

  var resizeTimer;
  var lastBracket = window.innerWidth < 480 ? 0 : window.innerWidth < 768 ? 1 : 2;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      var newBracket = window.innerWidth < 480 ? 0 : window.innerWidth < 768 ? 1 : 2;
      if (newBracket !== lastBracket) {
        lastBracket = newBracket;
        buildFn();
      }
    }, 250);
  });

  // ─── ToC collapse/expand ───
  var tocNav = document.querySelector('.toc-sidebar');
  if (tocNav) {
    var collapseBtn = tocNav.querySelector('.toc-collapse');
    var expandBtn = tocNav.querySelector('.toc-expand');
    if (collapseBtn) collapseBtn.addEventListener('click', function() {
      tocNav.classList.add('collapsed');
      collapseBtn.setAttribute('aria-expanded', 'false');
      expandBtn.setAttribute('aria-expanded', 'false');
      expandBtn.focus();
    });
    if (expandBtn) expandBtn.addEventListener('click', function() {
      tocNav.classList.remove('collapsed');
      expandBtn.setAttribute('aria-expanded', 'true');
      collapseBtn.setAttribute('aria-expanded', 'true');
      collapseBtn.focus();
    });
  }

  // ─── ToC active-section tracking ───
  var tocLinks = document.querySelectorAll('.toc-link');
  if (tocLinks.length) {
    var tocIds = Array.prototype.map.call(tocLinks, function(a) { return a.getAttribute('data-target'); });
    var tocSections = tocIds.map(function(id) { return document.getElementById(id); }).filter(Boolean);
    if (tocSections.length) {
      var tocCurrent = null;
      function tocSetActive(id) {
        tocCurrent = id;
        tocLinks.forEach(function(a) {
          var isActive = a.getAttribute('data-target') === tocCurrent;
          a.classList.toggle('active', isActive);
          if (isActive) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      }

      var tocClicking = false;
      tocLinks.forEach(function(a) {
        a.addEventListener('click', function(e) {
          e.preventDefault();
          tocClicking = true;
          var targetId = a.getAttribute('data-target');
          tocSetActive(targetId);
          var el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', ' ');
          setTimeout(function() { tocClicking = false; }, 800);
        });
      });

      var tocObserver = new IntersectionObserver(function(entries) {
        if (tocClicking) return;
        entries.forEach(function(entry) {
          if (entry.isIntersecting) tocSetActive(entry.target.id);
        });
      }, { rootMargin: '-10% 0px -80% 0px' });

      tocSections.forEach(function(s) { tocObserver.observe(s); });

      // Sync active state after browser restores scroll position
      function tocSyncInitial() {
        var best = null;
        tocSections.forEach(function(s) {
          if (s.getBoundingClientRect().top <= window.innerHeight * 0.2) best = s.id;
        });
        if (best) tocSetActive(best);
      }
      // Browser restores scroll after DOMContentLoaded; run after load + rAF to be safe
      if (document.readyState === 'complete') { requestAnimationFrame(tocSyncInitial); }
      else { window.addEventListener('load', function() { requestAnimationFrame(tocSyncInitial); }); }

      var tocLastId = tocIds[tocIds.length - 1];
      window.addEventListener('scroll', function() {
        if (tocClicking) return;
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
          tocSetActive(tocLastId);
        }
      }, { passive: true });
    }
  }

  document.addEventListener('click', function(e) {
    if (typeof Chart === 'undefined') return;
    var t = e.target.nodeType === 1 ? e.target : e.target.parentElement;
    if (t && !t.closest('canvas')) {
      document.querySelectorAll('canvas').forEach(function(el) {
        var c = Chart.getChart(el);
        if (c) { c.setActiveElements([]); c.tooltip.setActiveElements([]); c.update('none'); }
      });
    }
  });

  // ─── Mobile TOC ───
  initMobileToc();

  // ─── Desktop TOC fit check ───
  // If the sidebar TOC doesn't fit vertically, force mobile TOC.
  if (tocNav) {
    var MIN_PADDING = 40; // px above + below
    function checkTocFit() {
      // Only relevant when CSS would show the desktop TOC
      if (window.innerWidth < 1280) {
        document.body.classList.remove('force-mobile-toc');
        return;
      }
      // Temporarily remove override so we can measure the sidebar
      document.body.classList.remove('force-mobile-toc');
      // Check vertical fit: TOC content should fit with padding
      var tooTall = tocNav.scrollHeight > window.innerHeight - MIN_PADDING * 2;
      document.body.classList.toggle('force-mobile-toc', tooTall);
    }
    checkTocFit();
    window.addEventListener('resize', checkTocFit, { passive: true });
  }
}

// ─── Mobile TOC ───
// Context header bar + progress bar + FAB + bottom sheet.
// Visible below 1280px. Header auto-hides on phone, persistent on tablet.
function initMobileToc() {
  if (document.querySelector('.mtoc-root')) return; // guard against double init

  // 1. Build section map from DOM
  var sections = [];
  var exhibits = document.querySelectorAll('section.exhibit[id]');

  // Build a map of desktop sidebar TOC subsection targets → display text.
  // This gives us clean labels for items like callout divs where textContent is verbose.
  var desktopSubLabels = {};
  document.querySelectorAll('.toc-link.toc-sub').forEach(function(a) {
    desktopSubLabels[a.getAttribute('data-target')] = a.textContent.trim();
  });

  exhibits.forEach(function(sec) {
    var labelEl = sec.querySelector('.exhibit-label');
    var titleEl = sec.querySelector('h2');
    var letter = '';
    if (labelEl) {
      var m = labelEl.textContent.match(/Exhibit\s+([A-Z])/i);
      if (m) letter = m[1].toUpperCase();
    }
    var title = titleEl ? titleEl.textContent.trim() : '';

    sections.push({ id: sec.id, letter: letter, title: title, depth: 0 });

    // Subsections: h3[id], h4[id], and any element targeted by the desktop sidebar TOC
    sec.querySelectorAll('[id]').forEach(function(el) {
      if (el === sec) return; // skip the exhibit section itself
      var isHeading = /^h[34]$/i.test(el.tagName);
      var isDesktopTarget = el.id in desktopSubLabels;
      if (!isHeading && !isDesktopTarget) return;
      // Prefer desktop TOC label (clean, short), fall back to element text
      var text = desktopSubLabels[el.id] || el.textContent.trim().split('\n')[0].trim();
      if (text.length > 60) text = text.substring(0, 57) + '\u2026';
      sections.push({ id: el.id, letter: letter, title: text, depth: 1 });
    });
  });

  // Prose-page fallback (no exhibits): build the section map from the sidebar TOC links.
  if (!sections.length) {
    document.querySelectorAll('.toc-link[data-target]').forEach(function(a) {
      var id = a.getAttribute('data-target');
      if (document.getElementById(id)) {
        sections.push({ id: id, letter: '', title: a.textContent.trim(), depth: 0 });
      }
    });
  }
  if (!sections.length) return;

  // Determine current page part
  var pagePart = window.location.pathname.indexOf('part2') !== -1 ? 'Part 2'
    : window.location.pathname.indexOf('part3') !== -1 ? 'Part 3' : 'Part 1';

  // HTML escape for defense-in-depth (content is author-controlled but good hygiene)
  function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  // Checkmark SVG for past exhibits
  var checkSvg = '<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">'
    + '<path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // 2. Generate markup
  var container = document.createElement('div');
  container.className = 'mtoc-root';

  // Header bar
  var header = document.createElement('div');
  header.className = 'mtoc-header';
  header.innerHTML = '<div class="mtoc-header-inner">'
    + '<div class="mtoc-header-left">'
    + '<div class="mtoc-header-label"></div>'
    + '<div class="mtoc-header-title"></div>'
    + '</div>'
    + '<div class="mtoc-header-part">' + pagePart + '</div>'
    + '</div>';

  // Progress bar — separate element so it can be visible on desktop too
  var progressBar = document.createElement('div');
  progressBar.className = 'mtoc-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  progressBar.innerHTML = '<div class="mtoc-progress-fill"></div>';

  // FAB
  var fab = document.createElement('button');
  fab.className = 'mtoc-fab';
  fab.setAttribute('aria-label', 'Open table of contents');
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = '<div class="mtoc-fab-icon"><span></span><span></span><span></span></div>';

  // Backdrop
  var backdrop = document.createElement('div');
  backdrop.className = 'mtoc-backdrop';

  // Sheet
  var sheet = document.createElement('div');
  sheet.className = 'mtoc-sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-label', 'Table of contents');
  sheet.setAttribute('aria-modal', 'true');

  var sheetHtml = '<button class="mtoc-sheet-handle" aria-label="Close table of contents"><div class="mtoc-sheet-handle-bar"></div></button>'
    + '<div class="mtoc-sheet-header">'
    + '<span>Table of Contents</span>'
    + '<span class="mtoc-sheet-header-exhibit"></span>'
    + '</div>'
    + '<div class="mtoc-sheet-list">';

  sections.forEach(function(s) {
    if (s.depth === 0) {
      sheetHtml += '<a class="mtoc-item" data-depth="0" data-id="' + esc(s.id) + '" href="#' + esc(s.id) + '">'
        + '<span class="mtoc-badge is-future">' + esc(s.letter) + '</span>'
        + '<span class="mtoc-item-text">' + esc(s.title) + '</span>'
        + '<span class="mtoc-here">HERE</span></a>';
    } else {
      sheetHtml += '<a class="mtoc-item" data-depth="1" data-id="' + esc(s.id) + '" href="#' + esc(s.id) + '">'
        + '<span class="mtoc-item-text">' + esc(s.title) + '</span>'
        + '<span class="mtoc-here">HERE</span></a>';
    }
  });

  sheetHtml += '</div>';
  sheet.innerHTML = sheetHtml;

  container.appendChild(progressBar);
  container.appendChild(header);
  container.appendChild(fab);
  container.appendChild(backdrop);
  container.appendChild(sheet);
  document.body.appendChild(container);

  // Cache DOM references
  var headerLabel = header.querySelector('.mtoc-header-label');
  var headerTitle = header.querySelector('.mtoc-header-title');
  var progressFill = progressBar.querySelector('.mtoc-progress-fill');
  var sheetExhibit = sheet.querySelector('.mtoc-sheet-header-exhibit');
  var sheetItems = sheet.querySelectorAll('.mtoc-item');

  // 3. Scroll spy — IntersectionObserver
  var currentId = ''; // empty so first updateMobileToc call renders initial state

  function findExhibitIdx(id) {
    // Walk backward from the section to find its parent exhibit
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].id === id) {
        // Found the section; walk back to its parent exhibit
        for (var j = i; j >= 0; j--) {
          if (sections[j].depth === 0) return j;
        }
      }
    }
    return 0;
  }

  function updateMobileToc(id) {
    if (id === currentId) return; // short-circuit if unchanged (#12)
    currentId = id;
    var exhibitIdx = findExhibitIdx(id);
    var exhibit = sections[exhibitIdx];

    // Header
    headerLabel.textContent = exhibit.letter ? 'Exhibit ' + exhibit.letter : '';
    // Show the specific section title if it's a subsection
    var sec = sections.find(function(s) { return s.id === id; });
    headerTitle.textContent = sec ? sec.title : exhibit.title;

    // Sheet header
    sheetExhibit.textContent = exhibit.letter ? 'Exhibit ' + exhibit.letter : '';

    // Sheet items — update active/past/future states
    var curIdx = sections.findIndex(function(s) { return s.id === id; });
    sheetItems.forEach(function(item) {
      var itemId = item.getAttribute('data-id');
      var depth = item.getAttribute('data-depth');
      var isActive = itemId === id;
      var badge = item.querySelector('.mtoc-badge');

      item.classList.toggle('is-active', isActive);

      if (depth === '0') {
        // Determine if this exhibit is past, active, or future
        var secIdx = sections.findIndex(function(s) { return s.id === itemId; });
        var isPastExhibit = secIdx < exhibitIdx;
        var isActiveExhibit = secIdx === exhibitIdx;

        item.classList.toggle('is-past', isPastExhibit && !isActive);

        if (badge) {
          badge.classList.remove('is-past', 'is-active', 'is-future');
          if (isPastExhibit) {
            badge.classList.add('is-past');
            badge.innerHTML = checkSvg;
          } else if (isActiveExhibit) {
            badge.classList.add('is-active');
            badge.textContent = sections[secIdx].letter;
          } else {
            badge.classList.add('is-future');
            badge.textContent = sections[secIdx].letter;
          }
        }
      } else {
        // Subsection: past if before current section
        var subIdx = sections.findIndex(function(s) { return s.id === itemId; });
        item.classList.toggle('is-past', subIdx < curIdx && !isActive);
      }
    });
  }

  // IntersectionObserver for section tracking
  var mtocSections = sections.map(function(s) { return document.getElementById(s.id); }).filter(Boolean);

  // Sync mobile TOC after browser restores scroll position
  function mtocSyncInitial() {
    var best = sections[0].id;
    mtocSections.forEach(function(s) {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.2) best = s.id;
    });
    updateMobileToc(best);
  }
  if (document.readyState === 'complete') { requestAnimationFrame(mtocSyncInitial); }
  else { window.addEventListener('load', function() { requestAnimationFrame(mtocSyncInitial); }); }
  var mtocObserver = new IntersectionObserver(function(entries) {
    if (mtocClicking) return; // skip during smooth-scroll navigation
    // When multiple sections intersect simultaneously, pick the topmost one
    var best = null;
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        if (!best || entry.boundingClientRect.top < best.boundingClientRect.top) {
          best = entry;
        }
      }
    });
    if (best) updateMobileToc(best.target.id);
  }, { rootMargin: '-10% 0px -80% 0px' });

  mtocSections.forEach(function(el) { mtocObserver.observe(el); });

  // End-of-document fallback
  var lastId = sections[sections.length - 1].id;
  // (Scroll listener added below handles this along with progress + header)

  // 4. Scroll listener — progress bar, header hide/show, FAB fade, end-of-doc
  var sheetOpen = false;      // hoisted for scroll guard
  var mtocClicking = false;   // debounce during smooth scroll after sheet navigation
  var lastScrollY = window.scrollY;
  var scrollDelta = 0;
  var headerHidden = false;
  var isPhone = window.matchMedia('(max-width: 767px)');
  var scrollTimer = null;
  var fabScrolling = false;

  window.addEventListener('scroll', function() {
    if (sheetOpen) return; // skip during body-locked state
    var scrollY = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    var pct = docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;
    progressFill.style.width = pct + '%';

    // End-of-document: activate last section
    if (docHeight > 0 && scrollY >= docHeight - 50) {
      updateMobileToc(lastId);
    }

    // Header auto-hide (phone only)
    if (isPhone.matches) {
      var delta = scrollY - lastScrollY;
      // Reset accumulator on direction change before testing thresholds
      if ((delta > 0 && scrollDelta < 0) || (delta < 0 && scrollDelta > 0)) {
        scrollDelta = 0;
      }
      scrollDelta += delta;
      if (scrollDelta > 8 && scrollY > 80 && !headerHidden) {
        header.classList.add('is-hidden');
        progressBar.classList.add('is-hidden');
        headerHidden = true;
      } else if (scrollDelta < -5 && headerHidden) {
        header.classList.remove('is-hidden');
        progressBar.classList.remove('is-hidden');
        headerHidden = false;
      }
    } else if (headerHidden) {
      // If viewport resized to tablet+, ensure header is visible
      header.classList.remove('is-hidden');
      progressBar.classList.remove('is-hidden');
      headerHidden = false;
    }

    lastScrollY = scrollY;

    // FAB fade while scrolling
    if (!fabScrolling) {
      fab.classList.add('is-scrolling');
      fabScrolling = true;
    }
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
      fab.classList.remove('is-scrolling');
      fabScrolling = false;
    }, 600);

  }, { passive: true });

  // Ensure header visibility on resize/orientation change (e.g., phone → tablet)
  isPhone.addEventListener('change', function() {
    if (!isPhone.matches && headerHidden) {
      header.classList.remove('is-hidden');
      progressBar.classList.remove('is-hidden');
      headerHidden = false;
      scrollDelta = 0;
    }
  });

  // 5. Sheet open/close
  var savedScrollY = 0;

  function openSheet() {
    sheetOpen = true;
    // Lock scroll — iOS-safe approach
    savedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + savedScrollY + 'px';
    document.body.style.left = '0';
    document.body.style.width = '100%';

    // Mark all body children inert except the mobile TOC root
    Array.prototype.forEach.call(document.body.children, function(child) {
      if (child !== container) child.setAttribute('inert', '');
    });
    // Also mark sibling elements inside the container (header, progressBar, fab) inert
    header.setAttribute('inert', '');
    progressBar.setAttribute('inert', '');
    fab.setAttribute('inert', '');

    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Close table of contents');
    backdrop.style.pointerEvents = 'auto';
    backdrop.classList.add('is-open');
    sheet.classList.add('is-open');

    // Scroll active item into view within sheet
    var activeItem = sheet.querySelector('.mtoc-item.is-active');
    if (activeItem) {
      setTimeout(function() {
        activeItem.scrollIntoView({ block: 'center', behavior: 'auto' });
      }, 50);
    }

    // Focus management
    sheet.setAttribute('tabindex', '-1');
    sheet.focus();
  }

  function closeSheet() {
    if (!sheetOpen) return;
    sheetOpen = false;

    sheet.style.transform = ''; // clear any inline transform from swipe drag
    sheet.style.transition = ''; // restore CSS transition if drag was in progress
    backdrop.classList.remove('is-open');
    sheet.classList.remove('is-open');
    backdrop.style.pointerEvents = 'none';
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Open table of contents');

    // Restore inert on all body children
    Array.prototype.forEach.call(document.body.children, function(child) {
      child.removeAttribute('inert');
    });
    header.removeAttribute('inert');
    progressBar.removeAttribute('inert');
    fab.removeAttribute('inert');

    // Restore scroll
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY);

    // Reset scroll state to prevent header flash from spurious scroll events
    lastScrollY = savedScrollY;
    scrollDelta = 0;

    fab.focus();
  }

  fab.addEventListener('click', function() {
    if (sheetOpen) closeSheet(); else openSheet();
  });

  backdrop.addEventListener('click', closeSheet);

  var sheetHandle = sheet.querySelector('.mtoc-sheet-handle');
  sheetHandle.addEventListener('click', closeSheet);

  // Swipe-to-dismiss on the sheet handle and top area
  (function() {
    var touchStartY = 0;
    var touchDelta = 0;
    sheet.addEventListener('touchstart', function(e) {
      // Only track if touch starts on the handle or sheet header area
      if (!e.target.closest('.mtoc-sheet-handle, .mtoc-sheet-header')) return;
      touchStartY = e.touches[0].clientY;
      touchDelta = 0;
      sheet.style.transition = 'none'; // disable transition during drag
    }, { passive: true });
    sheet.addEventListener('touchmove', function(e) {
      if (!touchStartY) return;
      touchDelta = e.touches[0].clientY - touchStartY;
      // Visual feedback: translate sheet down as user drags
      if (touchDelta > 0) {
        sheet.style.transform = 'translateY(' + touchDelta + 'px)';
      }
    }, { passive: true });
    sheet.addEventListener('touchend', function() {
      sheet.style.transition = ''; // restore CSS transition
      if (touchDelta > 60) {
        closeSheet();
      } else {
        sheet.style.transform = ''; // snap back if below threshold
      }
      touchStartY = 0;
      touchDelta = 0;
    });
    sheet.addEventListener('touchcancel', function() {
      sheet.style.transition = '';
      sheet.style.transform = '';
      touchStartY = 0;
      touchDelta = 0;
    });
  })();

  // Section link clicks
  sheetItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      var targetId = item.getAttribute('data-id');
      mtocClicking = true;
      closeSheet();
      // Double-rAF ensures layout is recalculated after scroll restore
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          var el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateMobileToc(targetId);
          }
          setTimeout(function() { mtocClicking = false; }, 800);
        });
      });
    });
  });

  // Escape key closes sheet
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sheetOpen) {
      closeSheet();
    }
  });
}
