
(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Footer year
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Active primary navigation
  const currentPage = document.body.dataset.page;
  $$(".main-nav a").forEach(link => {
    const active = link.dataset.page === currentPage;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  // Theme
  const themeButton = $(".theme-toggle");

  const currentTheme = () =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light";

  const setTheme = theme => {
    if (theme === "dark") {
      document.documentElement.dataset.theme = "dark";
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    themeButton?.setAttribute("aria-pressed", String(theme === "dark"));
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
  };

  if (themeButton) {
    themeButton.setAttribute("aria-pressed", String(currentTheme() === "dark"));
    themeButton.addEventListener("click", () => {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  // Mobile navigation
  const menuButton = $(".menu-toggle");
  const nav = $(".main-nav");
  const backdrop = $(".mobile-nav-backdrop");

  const setMenu = open => {
    nav?.classList.toggle("open", open);
    backdrop?.classList.toggle("visible", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  };

  menuButton?.addEventListener("click", () => {
    setMenu(!nav?.classList.contains("open"));
  });

  backdrop?.addEventListener("click", () => setMenu(false));
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setMenu(false);
  });

  // Scroll reveal
  const revealElements = $$(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09 });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  // Scroll UI
  const progress = $(".scroll-progress span");
  const backToTop = $(".back-to-top");
  const header = $(".site-header");

  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const percent = max > 0 ? Math.min(100, Math.max(0, (scrollY / max) * 100)) : 0;
    if (progress) progress.style.width = `${percent}%`;
    backToTop?.classList.toggle("visible", scrollY > 600);
    header?.classList.toggle("scrolled", scrollY > 24);
  };

  addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  backToTop?.addEventListener("click", () => {
    scrollTo({ top: 0, behavior: "smooth" });
  });

  // Fine-pointer profile parallax
  const photoPanel = $(".hero-photo-panel");
  if (
    photoPanel &&
    matchMedia("(pointer:fine)").matches &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    photoPanel.addEventListener("pointermove", event => {
      const rect = photoPanel.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
      photoPanel.style.transform =
        `perspective(950px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    photoPanel.addEventListener("pointerleave", () => {
      photoPanel.style.transform = "";
    });
  }

  // Card spotlight
  $$(".research-tile,.skill-panel,.contact-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });

  // Research sub-navigation
  const researchLinks = $$('.research-subnav a[href^="#"]');
  if (researchLinks.length) {
    const sections = researchLinks
      .map(a => $(a.getAttribute("href")))
      .filter(Boolean);

    const updateResearchNav = () => {
      let current = "";
      const offset = scrollY + 125;
      sections.forEach(section => {
        if (section.offsetTop <= offset) current = section.id;
      });
      researchLinks.forEach(a => {
        a.classList.toggle(
          "subnav-active",
          a.getAttribute("href") === `#${current}`
        );
      });
    };

    addEventListener("scroll", updateResearchNav, { passive: true });
    updateResearchNav();
  }

  // Publications filter
  const filterButtons = $$(".publication-tools .filter-btn");
  const publicationEntries = $$(".publication-entry[data-type]");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(b => b.classList.toggle("active", b === button));
      publicationEntries.forEach(entry => {
        entry.classList.toggle(
          "filtered-out",
          filter !== "all" && entry.dataset.type !== filter
        );
      });
    });
  });

  // Clipboard helper with fallback
  const copyText = async text => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    let successful = false;
    try {
      successful = document.execCommand("copy");
    } finally {
      textarea.remove();
    }
    return successful;
  };

  // Copy citations
  $$(".copy-citation").forEach(button => {
    button.addEventListener("click", async () => {
      const citation = button.dataset.citation || "";
      const original = button.textContent.trim();

      try {
        const ok = await copyText(citation);
        if (!ok) throw new Error("copy failed");
        button.textContent = "Copied";
        button.classList.add("copied");
      } catch (_) {
        button.textContent = "Copy failed";
      }

      setTimeout(() => {
        button.textContent = original;
        button.classList.remove("copied");
      }, 1500);
    });
  });

  // Copy university email
  $$("[data-copy-email]").forEach(button => {
    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail || "";
      const original = button.textContent.trim();

      try {
        const ok = await copyText(email);
        if (!ok) throw new Error("copy failed");
        button.textContent = "Copied";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = original;
          button.classList.remove("copied");
        }, 1500);
      } catch (_) {
        location.href = `mailto:${email}`;
      }
    });
  });

  // Internal page transition
  $$('a[href$=".html"],a[href="index.html"]').forEach(link => {
    link.addEventListener("click", event => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank"
      ) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      event.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(() => { location.href = href; }, 130);
    });
  });
})();
