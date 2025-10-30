// script.js — Final Polished Interactive Version by Kamal ✨

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌌 DOM ready — initializing Solar Explorer...");

  const JSON_PATH = "data/planet.json"; // <-- ensure this path exists
  let planetsData = null;

  // Shortcuts
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Fetch JSON data
  fetch(JSON_PATH)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status} — failed to load ${JSON_PATH}`);
      return res.json();
    })
    .then(data => {
      planetsData = data;
      console.log("✅ Loaded planets JSON:", planetsData);
      initApp();
    })
    .catch(err => {
      console.error("❌ Failed to load planet data:", err);
      alert("Error loading planet data. Check the console for details.");
    });

  // -------------------------------
  // 🚀 Initialize All App Logic
  // -------------------------------
  function initApp() {
    const popup = $("#planet-popup");
    const nameEl = $("#planet-name");
    const descEl = $("#planet-desc");
    const detailsEl = $("#planet-details");
    const closeBtn = $(".close-popup");

    if (!popup || !nameEl || !descEl || !detailsEl) {
      console.error("Missing popup elements in DOM.");
      return;
    }

    // -------------------------------
    // 🌠 Popup Handling
    // -------------------------------
    function showPopup(obj) {
      if (!obj) {
        console.warn("showPopup: no data provided");
        return;
      }

      nameEl.innerText = obj.name || "Unknown";
      descEl.innerText = obj.description || "";

      const lines = [];
      const add = (label, val) => {
        if (val) lines.push(`<li><strong>${label}:</strong> ${val}</li>`);
      };

      add("Type", obj.type);
      add("Distance from Sun", obj.distanceFromSun);
      add("Diameter", obj.diameter);
      add("Mass", obj.mass);
      add("Moons", obj.moons);
      add("Orbital Period", obj.orbitalPeriod);
      add("Rotation Period", obj.rotationPeriod);
      add("Temperature", obj.temperature);
      add("Composition", obj.composition);
      add("Age", obj.age);
      add("Fun Fact", obj.funFact);

      detailsEl.innerHTML = lines.join("\n");

      popup.style.display = "flex";
      popup.classList.add("fade-in");
      closeBtn?.focus();
    }

    function closePopup() {
      popup.classList.remove("fade-in");
      popup.style.display = "none";
    }

    closeBtn?.addEventListener("click", closePopup);
    popup.addEventListener("click", e => { if (e.target === popup) closePopup(); });

    // -------------------------------
    // ☀️ Sun Click Event
    // -------------------------------
    const sunEl = $("#sun");
    if (sunEl) {
      sunEl.style.cursor = "pointer";
      sunEl.addEventListener("click", () => {
        const sunData =
          planetsData?.sun ||
          planetsData?.planets?.find(p => p.name?.toLowerCase() === "sun");
        if (!sunData) {
          alert("Sun data not found!");
          return;
        }
        showPopup(sunData);
      });
    }

    // -------------------------------
    // 🪐 Planet Orbit Click Events
    // -------------------------------
    const planetEls = $$(".planet");
    if (!planetEls.length) console.warn("No .planet elements found!");

    planetEls.forEach(el => {
      if (!el.id) return;
      el.style.cursor = "pointer";

      // Hover tooltip (label)
      const label = document.createElement("div");
      label.className = "planet-label";
      label.innerText = el.id.charAt(0).toUpperCase() + el.id.slice(1);
      document.body.appendChild(label);

      el.addEventListener("mouseenter", () => (label.style.opacity = 1));
      el.addEventListener("mousemove", e => {
        label.style.left = `${e.pageX + 10}px`;
        label.style.top = `${e.pageY - 25}px`;
      });
      el.addEventListener("mouseleave", () => (label.style.opacity = 0));

      el.addEventListener("click", e => {
        e.stopPropagation();
        const id = el.id.toLowerCase();
        const info =
          planetsData?.planets?.find(p => p.name?.toLowerCase() === id) ||
          planetsData?.[id];
        if (!info) {
          alert(`No data found for ${id}`);
          return;
        }
        showPopup(info);
      });
    });

    // -------------------------------
    // 🌍 Planet Cards (Grid Section)
    // -------------------------------
    const cardEls = $$(".card");
    cardEls.forEach(card => {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        const planetName = card.innerText.trim().toLowerCase();
        const info =
          planetsData?.planets?.find(p => p.name?.toLowerCase() === planetName) ||
          planetsData?.[planetName];
        if (!info) {
          alert(`No data for ${planetName}`);
          return;
        }

        // Smooth scroll to solar system
        const target = $("#solar-system");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => showPopup(info), 400);
        } else {
          showPopup(info);
        }
      });
    });

    // -------------------------------
    // 🧭 Navbar Smooth Scroll
    // -------------------------------
    $$(".nav-links a").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const section = document.querySelector(link.getAttribute("href"));
        if (section) section.scrollIntoView({ behavior: "smooth" });
      });
    });

    // -------------------------------
    // 🔥 Active Nav Highlight
    // -------------------------------
    const navLinks = $$(".nav-links a");
    const sections = navLinks.map(a => document.querySelector(a.getAttribute("href")));
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      sections.forEach((sec, i) => {
        if (!sec) return;
        const top = sec.offsetTop - 150;
        const bottom = top + sec.offsetHeight;
        const link = navLinks[i];
        if (scrollY >= top && scrollY < bottom) link.classList.add("active");
        else link.classList.remove("active");
      });
    });

    // -------------------------------
    // 🌠 Scroll Animations
    // -------------------------------
    const fadeElems = $$("section, .card");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    fadeElems.forEach(el => observer.observe(el));

    console.log("✅ Solar Explorer initialized. Click planets or cards for details!");
  }
});
