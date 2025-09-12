// JS pour l'effet "magnet"
const btn = document.getElementById("contact-btn");

btn.addEventListener("mousemove", (e) => {
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2; // distance horizontale du centre
  const y = e.clientY - rect.top - rect.height / 2; // distance verticale du centre

  // on limite le déplacement max
  const maxTranslate = 150;
  const translateX = (x / (rect.width / 2)) * maxTranslate;
  const translateY = (y / (rect.height / 2)) * maxTranslate;

  btn.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
});

btn.addEventListener("mouseleave", () => {
  // remettre le bouton à sa position initiale
  btn.style.transform = "translate(0, 0) scale(1)";
});

// Sélectionne toutes les cards
const cards = document.querySelectorAll(".section1 #cards .card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Reflet (glare)
    card.style.setProperty("--x", `${x - rect.width / 2}px`);
    card.style.setProperty("--y", `${y - rect.height / 2}px`);

    // Tilt 3D
    const rotateX = ((y - rect.height / 2) / rect.height) * 20;
    const rotateY = ((x - rect.width / 2) / rect.width) * 20;
    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--x", `0px`);
    card.style.setProperty("--y", `0px`);
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
  });
});

(function () {
  const bodyEl = document.body;
  const container = document.querySelector(".container");
  if (!bodyEl || !container) return;

  let resizeTimer = null;

  function applyHeight() {
    const rectH = Math.ceil(container.getBoundingClientRect().height);
    const newH = rectH + "px";

    if (bodyEl.style.height !== newH) {
      bodyEl.style.height = newH;
    }
    bodyEl.style.marginBottom = "0";
  }

  function scheduleApply() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyHeight, 60);
  }

  // Initial
  window.addEventListener("load", () => {
    applyHeight();
    setTimeout(applyHeight, 500); // sécurité après fonts/images
  });

  // resize/orientation
  window.addEventListener("resize", scheduleApply);
  window.addEventListener("orientationchange", scheduleApply);

  // observer mutations
  const mo = new MutationObserver(() => {
    requestAnimationFrame(applyHeight);
  });
  mo.observe(container, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  // fallback
  requestAnimationFrame(applyHeight);
})();

window.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("cards");
  const secondCard = cardsContainer.querySelectorAll(".card")[1]; // index 1 = 2e card

  // calcule le décalage pour centrer la 2e card
  const offset =
    secondCard.offsetLeft -
    (cardsContainer.clientWidth - secondCard.clientWidth) / 2;

  cardsContainer.scrollLeft = offset;
});

const faqItems = document.querySelectorAll(".faq li");

faqItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Fermer tous les autres
    faqItems.forEach((el) => {
      if (el !== item) el.classList.remove("active");
    });
    // Toggle l'élément cliqué
    item.classList.toggle("active");
  });
});

(function () {
  // Réglable : fraction du viewport (non utilisé ici, on se base sur data-aos-offset)
  const DEFAULT_OFFSET = 120;

  // --- BEGIN : adapter data-aos-offset à la hauteur du viewport (baseline 1080px)
  const BASELINE_VH_PX = 1080;

  function adjustOffsetsToVH() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const factor = vh / BASELINE_VH_PX;

    document.querySelectorAll("[data-aos]").forEach((el) => {
      // sauvegarde l'original si besoin (string, peut être négatif)
      if (!el.hasAttribute("data-aos-offset-original")) {
        const raw = el.getAttribute("data-aos-offset");
        el.setAttribute(
          "data-aos-offset-original",
          raw === null ? String(DEFAULT_OFFSET) : raw
        );
      }
      const origStr =
        el.getAttribute("data-aos-offset-original") || String(DEFAULT_OFFSET);
      const orig = parseInt(origStr, 10) || 0;
      const sign = orig < 0 ? -1 : 1;
      const abs = Math.abs(orig);

      // calcule ajusté (conserver au moins 2px si orig non-zero)
      let adjusted = Math.round(abs * factor);
      if (abs !== 0 && adjusted < 2) adjusted = 2;

      el.setAttribute("data-aos-offset", String(sign * adjusted));
    });

    // si AOS est chargé, refresh pour prendre en compte les nouveaux offsets
    if (window.AOS && typeof window.AOS.refresh === "function") {
      try {
        AOS.refresh();
      } catch (e) {
        /* silent */
      }
    }
  }

  // Exécution initiale + écoute resize (débounce léger)
  const _adjDebounced = debounce(adjustOffsetsToVH, 90);
  window.addEventListener("resize", _adjDebounced);

  // observe nouvelles insertions (si tu ajoutes dynamiquement des éléments)
  const _moForOffsets = new MutationObserver(
    debounce((mutations) => {
      // pour les nouveaux [data-aos], on s'assure qu'ils ont data-aos-offset-original et qu'on recalcul
      let shouldRun = false;
      mutations.forEach((m) => {
        if (m.addedNodes && m.addedNodes.length) shouldRun = true;
        if (
          m.type === "attributes" &&
          m.attributeName &&
          m.attributeName.includes("data-aos")
        )
          shouldRun = true;
      });
      if (shouldRun) adjustOffsetsToVH();
    }, 160)
  );
  _moForOffsets.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });

  // appel initial : (mettre avant le premier checkAll / AOS.init)
  adjustOffsetsToVH();
  // --- END

  // debounce & raf util
  function debounce(fn, ms = 120) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  // Ajoute classes AOS pour déclencher les animations CSS (ne modifie pas data-attr)
  function triggerElement(el) {
    if (el.dataset.aosAnimated === "true") return;
    el.classList.add("aos-init");
    // microframe pour éviter glitch
    requestAnimationFrame(() => {
      el.classList.add("aos-animate");
      el.dataset.aosAnimated = "true";
      // facultatif : si AOS a besoin d'un refresh interne
      if (window.AOS && typeof AOS.refresh === "function") {
        try {
          AOS.refresh();
        } catch (e) {}
      }
    });
  }

  // Teste si un élément doit être déclenché maintenant (utilise data-aos-offset tel quel)
  function shouldTrigger(el) {
    // si déjà animé -> skip
    if (el.dataset.aosAnimated === "true") return false;

    const rect = el.getBoundingClientRect();
    const rawOffset = el.getAttribute("data-aos-offset");
    // supporte valeurs négatives dans ton HTML si tu en as
    const offset =
      rawOffset !== null ? parseInt(rawOffset, 10) || 0 : DEFAULT_OFFSET;

    // ligne (px) à partir du top du viewport au moment du trigger
    const triggerLine = window.innerHeight - offset;

    // Si top <= triggerLine => afficher (élément est arrivé assez haut dans le viewport)
    if (rect.top <= triggerLine) return true;

    // Si on a déjà scrollé *au-delà* de l'élément (passé en haut du viewport), on déclenche aussi
    if (rect.bottom <= 0) return true;

    return false;
  }

  // Parcours et déclenche les éléments éligibles
  function checkAll() {
    const list = document.querySelectorAll("[data-aos]");
    for (let i = 0; i < list.length; i++) {
      const el = list[i];
      if (!el) continue;
      try {
        if (shouldTrigger(el)) triggerElement(el);
      } catch (e) {
        // ne casse pas tout si un élément pose problème
        console.error("AOS helper error:", e);
      }
    }
  }

  // RAF-driven scroll handler pour perf
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      checkAll();
      ticking = false;
    });
  }

  // Recompute utile (exposé)
  const recompute = debounce(() => {
    // enlever marqueurs pour retester si nécessaire (optionnel)
    // document.querySelectorAll("[data-aos]").forEach(el => delete el.dataset.aosAnimated);
    checkAll();
    if (window.AOS && typeof AOS.refresh === "function") {
      try {
        AOS.refresh();
      } catch (e) {}
    }
  }, 80);

  // Observe DOM pour éléments dynamiques
  const mo = new MutationObserver(
    debounce((mutations) => {
      // On pourrait observer additions spécifiques, mais un simple checkAll suffit
      checkAll();
    }, 120)
  );
  mo.observe(document.body, { childList: true, subtree: true });

  // Resize -> recalcul
  window.addEventListener("resize", recompute);

  // Scroll listener
  window.addEventListener("scroll", onScroll, { passive: true });

  // Au load, on attend un tout petit peu pour laisser tes scripts d'ajustement (scale/height) finir
  window.addEventListener("load", () => {
    // si ton page applique du scale/height après load, augmente ce délai (150-250)
    setTimeout(() => {
      // initialise AOS si présent (mais si tu as déjà initialisé ailleurs, ok)
      if (window.AOS && typeof AOS.init === "function") {
        try {
          AOS.init({
            once: true,
            mirror: false,
            anchorPlacement: "top-bottom",
          });
        } catch (e) {}
      }
      // première passe
      checkAll();
      // et une seconde passe plus tard au cas où le layout a bougé
      setTimeout(checkAll, 120);
    }, 120);
  });

  // Expose util pour debug / recompute manuel
  window.__AOS_manual_recompute = () => {
    checkAll();
  };

  // Expose debug helper si besoin (supprime en prod)
  window.__AOS_debug_shouldTrigger = (selector = "[data-aos]") => {
    const els = document.querySelectorAll(selector);
    return Array.from(els).map((el) => {
      const rect = el.getBoundingClientRect();
      const rawOffset = el.getAttribute("data-aos-offset");
      const offset =
        rawOffset !== null ? parseInt(rawOffset, 10) || 0 : DEFAULT_OFFSET;
      return {
        el,
        top: rect.top,
        bottom: rect.bottom,
        offset,
        triggerLine: window.innerHeight - offset,
        willTrigger:
          rect.top <= window.innerHeight - offset || rect.bottom <= 0,
      };
    });
  };
})();
