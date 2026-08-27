
document.getElementById("year").textContent = new Date().getFullYear();

const bodyPage = document.body.dataset.page;
document.querySelectorAll(".main-nav a").forEach(link => {
  if (link.dataset.page === bodyPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

const toggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".main-nav");
if (toggle && navMenu) {
  toggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  navMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navMenu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add("visible"));
}

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const sync = () => backToTop.classList.toggle("visible", window.scrollY > 650);
  window.addEventListener("scroll", sync, { passive: true });
  sync();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* Subtle pointer parallax on the profile photo panel */
const photoPanel = document.querySelector(".hero-photo-panel");
if (photoPanel && window.matchMedia("(pointer:fine)").matches) {
  photoPanel.addEventListener("mousemove", e => {
    const r = photoPanel.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 8;
    const y = ((e.clientY - r.top) / r.height - .5) * 8;
    photoPanel.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  photoPanel.addEventListener("mouseleave", () => {
    photoPanel.style.transform = "";
  });
}
