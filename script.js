const formatUSD = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

function setupYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector("#nav-links");
  if (!toggle || !links) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    links.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  document.addEventListener("click", (e) => {
    if (!links.classList.contains("is-open")) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(".nav")) return;
    setOpen(false);
  });

  links.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.tagName.toLowerCase() === "a") setOpen(false);
  });
}

function setupReveal() {
  const nodes = Array.from(document.querySelectorAll(".reveal"));
  if (nodes.length === 0) return;

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduce) {
    nodes.forEach((n) => n.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12 }
  );

  nodes.forEach((n) => observer.observe(n));
}

function setupCart() {
  const countEl = document.querySelector("[data-cart-count]");
  const totalEl = document.querySelector("[data-cart-total]");
  const buttons = Array.from(document.querySelectorAll(".add-to-cart"));
  if (!countEl || !totalEl || buttons.length === 0) return;

  let count = 0;
  let total = 0;

  const toast = document.querySelector(".toast");
  const toastText = document.querySelector("[data-toast-text]");
  const toastClose = document.querySelector(".toast-close");

  let toastTimer = null;

  const showToast = (message) => {
    if (!(toast instanceof HTMLElement)) return;
    if (toastText) toastText.textContent = message;

    toast.hidden = false;
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";

    requestAnimationFrame(() => {
      toast.style.transition = "opacity 220ms ease, transform 220ms ease";
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    });

    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => hideToast(), 2600);
  };

  const hideToast = () => {
    if (!(toast instanceof HTMLElement)) return;
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
    window.setTimeout(() => {
      toast.hidden = true;
    }, 220);
  };

  if (toastClose) toastClose.addEventListener("click", hideToast);

  const render = () => {
    countEl.textContent = String(count);
    totalEl.textContent = formatUSD(total);
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = btn.getAttribute("data-product") || "Item";
      const price = Number(btn.getAttribute("data-price") || "0");

      count += 1;
      total += Number.isFinite(price) ? price : 0;
      render();
      showToast(`${product} added to cart`);
    });
  });

  render();
}

setupYear();
setupMobileNav();
setupReveal();
setupCart();

