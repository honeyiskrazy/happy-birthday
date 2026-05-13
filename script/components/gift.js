(function () {
  window.Components = window.Components || {};

  // ── Scratch Card ───────────────────────────────────────────────
  function initScratchCard(canvas, onComplete) {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);

    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0,   "#D4A373");
    grad.addColorStop(0.4, "#E8C99B");
    grad.addColorStop(0.7, "#DBAD7A");
    grad.addColorStop(1,   "#D4A373");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    const fs = Math.min(15, rect.width * 0.055);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = `bold ${fs}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch Here", rect.width / 2, rect.height / 2);

    let drawing = false, count = 0, done = false;

    function scratch(x, y) {
      if (done) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
      if (++count % 8 === 0) check();
    }

    function check() {
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      for (let i = 3; i < d.length; i += 160) if (d[i] === 0) clear++;
      if (clear / (d.length / 160) > 0.38) {
        done = true;
        canvas.style.transition = "opacity 0.5s";
        canvas.style.opacity = "0";
        setTimeout(() => { canvas.style.display = "none"; onComplete && onComplete(); }, 500);
      }
    }

    function pos(e) {
      const r  = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: cx - r.left, y: cy - r.top };
    }

    canvas.addEventListener("mousedown",  (e) => { drawing = true;  const p = pos(e); scratch(p.x, p.y); });
    canvas.addEventListener("mousemove",  (e) => { if (drawing) { const p = pos(e); scratch(p.x, p.y); } });
    canvas.addEventListener("mouseup",    ()  => { drawing = false; });
    canvas.addEventListener("mouseleave", ()  => { drawing = false; });
    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); drawing = true;  const p = pos(e); scratch(p.x, p.y); }, { passive: false });
    canvas.addEventListener("touchmove",  (e) => { e.preventDefault(); if (drawing) { const p = pos(e); scratch(p.x, p.y); } }, { passive: false });
    canvas.addEventListener("touchend",   ()  => { drawing = false; });
  }

  // ── Gift Component ─────────────────────────────────────────────
  window.Components.gift = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-gift";
      div.innerHTML = `
        <p class="gift-pretext" style="opacity:0">${section.preText || ""}</p>

        <div class="gift-box" id="gift-box" style="opacity:0; cursor:pointer">
          <div class="gift-box-lid">
            <div class="gift-box-bow">🎀</div>
            <div class="gift-box-lid-ribbon"></div>
          </div>
          <div class="gift-box-base">
            <div class="gift-box-ribbon-v"></div>
          </div>
          <p class="gift-box-hint" style="opacity:0">Tap to unwrap</p>
        </div>

        <div class="gift-reveal" id="gift-reveal" style="display:none; opacity:0">
          <p class="gift-reveal-title">${section.title || "A Gift For You"}</p>
          <div class="gift-scratch-card" id="gift-scratch-card">
            <div class="gift-scratch-content">
              <span class="gift-discount-value">${section.discount || "Free"}</span>
              <span class="gift-discount-label">${section.description || "DOMAIN SETUP"}</span>
              <div class="gift-card-code">
                <span class="gift-code-label">Gift Code</span>
                <span class="gift-code-value">${section.code || "GROWZIQ-DOMAIN"}</span>
              </div>
              <p class="gift-card-validity">${section.validity || ""}</p>
            </div>
            <canvas id="scratch-canvas"></canvas>
          </div>
          <p class="gift-scratch-hint" style="opacity:0">Scratch the gold to reveal</p>
          <p class="gift-card-footnote" style="opacity:0">${section.footnote || ""}</p>
        </div>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const pretext     = el.querySelector(".gift-pretext");
      const giftBox     = el.querySelector("#gift-box");
      const lid         = el.querySelector(".gift-box-lid");
      const base        = el.querySelector(".gift-box-base");
      const boxHint     = el.querySelector(".gift-box-hint");
      const reveal      = el.querySelector("#gift-reveal");
      const scratchHint = el.querySelector(".gift-scratch-hint");
      const footnote    = el.querySelector(".gift-card-footnote");
      const canvas      = el.querySelector("#scratch-canvas");

      let unwrapped = false;

      // Phase 1: show gift box
      tl.to(pretext, { duration: 0.9, opacity: 1 })
        .to(pretext, { duration: 0.6, opacity: 0, y: -20 }, "+=2.5")
        .to(giftBox,  { duration: 0.9, opacity: 1, ease: "back.out(1.5)" })
        .call(() => {
          el.classList.add("is-interactive");
          boxHint.classList.add("is-active");
          gsap.to(boxHint, { duration: 0.4, opacity: 0.6 });

          function doUnwrap(e) {
            if (unwrapped) return;
            if (e) e.preventDefault();
            unwrapped = true;
            
            giftBox.removeEventListener("click", doUnwrap);
            giftBox.removeEventListener("touchstart", doUnwrap);

            gsap.to(lid,     { duration: 0.8, y: -150, rotation: -25, opacity: 0, ease: "power2.out" });
            gsap.to(base,    { duration: 0.6, delay: 0.3, scaleY: 0, opacity: 0, ease: "power2.in" });
            gsap.to(boxHint, { duration: 0.3, opacity: 0 });

            setTimeout(() => tl.play(), 1000);
          }

          giftBox.addEventListener("click", doUnwrap);
          giftBox.addEventListener("touchstart", doUnwrap, { passive: false });
        });

      tl.addPause();

      // Phase 2: scratch card
      tl.call(() => { 
        gsap.set(giftBox, { display: "none" }); 
        gsap.set(reveal, { display: "flex", opacity: 0 });
        el.classList.add("is-interactive");

        // Initialize canvas BEFORE reveal animation
        initScratchCard(canvas, () => {
          gsap.to(scratchHint, { duration: 0.3, opacity: 0 });
          setTimeout(() => tl.play(), 800);
        });
      })
        .to(reveal,  { duration: 0.8, opacity: 1, ease: "back.out(1.3)" })
        .call(() => {
          scratchHint.classList.add("is-active");
          gsap.to(scratchHint, { duration: 0.4, opacity: 0.6 });
        });

      tl.addPause();

      // Phase 3: footnote
      tl.to(footnote, { duration: 0.8, opacity: 1 });
    },

    exit(tl, el) {
      tl.call(() => el.classList.remove("is-interactive"));
      tl.to(el, { duration: 0.8, opacity: 0, scale: 0.95 }, "+=3.5");
    },
  };
})();
