(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      });
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Scroll progress bar + sticky header polish
  const progressBar = document.querySelector(".scroll-progress span");
  const topbar = document.querySelector(".topbar");
  function updateScrollEffects() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + "%";
    if (topbar) topbar.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", updateScrollEffects, { passive: true });
  updateScrollEffects();

  // Visible, reliable scroll-in animations. If unsupported, everything stays visible.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Soft cursor glow and pointer-reactive quick cards
  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("pointermove", event => {
    if (glow && window.matchMedia("(pointer:fine)").matches) {
      glow.style.left = event.clientX + "px";
      glow.style.top = event.clientY + "px";
    }
    const card = event.target.closest(".quick-card");
    if (card && window.matchMedia("(pointer:fine)").matches) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }
  }, { passive: true });

  // Gentle magnetic tilt for interactive cards on desktop
  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".social-profile, .education-card, .business-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const r = card.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - .5;
        const y = (event.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-5px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }
})();
