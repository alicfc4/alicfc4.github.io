
document.getElementById("year").textContent = new Date().getFullYear();

const page = document.body.dataset.page;
document.querySelectorAll(".main-nav a").forEach(link => {
  if (link.dataset.page === page) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

// Theme
const themeToggle = document.querySelector(".theme-toggle");
function applyTheme(theme) {
  if (theme === "dark") document.documentElement.dataset.theme = "dark";
  else document.documentElement.removeAttribute("data-theme");
  try { localStorage.setItem("theme", theme); } catch(e) {}
}
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    applyTheme(isDark ? "light" : "dark");
  });
}

// Mobile nav
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".main-nav");
const backdrop = document.querySelector(".mobile-nav-backdrop");
function closeMenu() {
  navMenu?.classList.remove("open");
  backdrop?.classList.remove("visible");
  menuToggle?.setAttribute("aria-expanded", "false");
}
if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const open = !navMenu.classList.contains("open");
    navMenu.classList.toggle("open", open);
    backdrop?.classList.toggle("visible", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  navMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  backdrop?.addEventListener("click", closeMenu);
}

// Reveal animations
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add("visible"));
}

// Scroll progress + back to top
const progressBar = document.querySelector(".scroll-progress span");
const backToTop = document.querySelector(".back-to-top");
function syncScrollUI() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progressBar) progressBar.style.width = `${pct}%`;
  backToTop?.classList.toggle("visible", window.scrollY > 650);
}
window.addEventListener("scroll", syncScrollUI, { passive: true });
syncScrollUI();
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Subtle pointer parallax
const photoPanel = document.querySelector(".hero-photo-panel");
if (photoPanel && window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  photoPanel.addEventListener("mousemove", e => {
    const r = photoPanel.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 7;
    const y = ((e.clientY - r.top) / r.height - .5) * 7;
    photoPanel.style.transform = `perspective(950px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  photoPanel.addEventListener("mouseleave", () => photoPanel.style.transform = "");
}

// Pointer spotlight
document.querySelectorAll(".research-tile,.skill-panel,.contact-card").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX-r.left}px`);
    card.style.setProperty("--my", `${e.clientY-r.top}px`);
  });
});

// Publication filter
const filterButtons = document.querySelectorAll(".filter-btn");
const publicationRows = document.querySelectorAll(".pub-row[data-type]");
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle("active", b === btn));
    publicationRows.forEach(row => {
      row.classList.toggle("filtered-out", filter !== "all" && row.dataset.type !== filter);
    });
  });
});

// Copy email
const copyEmail = document.querySelector("[data-copy-email]");
if (copyEmail) {
  copyEmail.addEventListener("click", async () => {
    const email = copyEmail.dataset.copyEmail;
    const state = copyEmail.querySelector(".copy-state");
    try {
      await navigator.clipboard.writeText(email);
      if (state) state.textContent = "Copied";
      setTimeout(() => { if (state) state.textContent = "Copy"; }, 1600);
    } catch(e) {
      window.location.href = `mailto:${email}`;
    }
  });
}

// Short page transition for internal navigation
document.querySelectorAll('a[href$=".html"], a[href="index.html"]').forEach(link => {
  link.addEventListener("click", e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === "_blank") return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    e.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(() => { window.location.href = href; }, 150);
  });
});


// Compact header after scroll
const header = document.querySelector(".site-header");
function syncHeaderState(){
  header?.classList.toggle("scrolled", window.scrollY > 24);
}
window.addEventListener("scroll", syncHeaderState, {passive:true});
syncHeaderState();


// Research sub-navigation active state
const researchSubnavLinks = [...document.querySelectorAll('.research-subnav a[href^="#"]')];
if (researchSubnavLinks.length) {
  const researchSections = researchSubnavLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const syncResearchSubnav = () => {
    let current = "";
    const y = window.scrollY + 120;

    researchSections.forEach(sec => {
      if (sec.offsetTop <= y) current = sec.id;
    });

    researchSubnavLinks.forEach(a => {
      a.classList.toggle("subnav-active", a.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", syncResearchSubnav, {passive:true});
  syncResearchSubnav();
}
