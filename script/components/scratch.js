(function () {
  window.Components = window.Components || {};

  window.Components.scratch = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-scratch";
      
      div.innerHTML = `
        <div class="scratch-wrapper" style="opacity:0">
          <p class="scratch-pretext" style="opacity:0">${section.preText || ""}</p>
          
          <div class="scratch-card-container" style="opacity:0">
            <p class="scratch-title">${section.title || "A Gift For You"}</p>
            
            <div class="scratch-card" id="scratch-canvas-wrapper">
              <div class="scratch-card-content">
                <span class="scratch-discount-value">${section.discount || "Free"}</span>
                <span class="scratch-discount-label">${section.description || "DOMAIN SETUP"}</span>
                <div class="scratch-code-box">
                  <span class="scratch-code-label">Gift Code</span>
                  <span class="scratch-code-value">${section.code || "GROWZIQ-DOMAIN"}</span>
                </div>
                <p class="scratch-card-validity">${section.validity || ""}</p>
              </div>
              <canvas id="scratch-canvas"></canvas>
            </div>
            
            <p class="scratch-hint" style="opacity:0">Scratch the gold to reveal</p>
            <p class="scratch-footnote" style="opacity:0">${section.footnote || ""}</p>
          </div>
        </div>
      `;
      
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const pretext = el.querySelector(".scratch-pretext");
      const wrapper = el.querySelector(".scratch-wrapper");
      const cardContainer = el.querySelector(".scratch-card-container");
      const hint = el.querySelector(".scratch-hint");
      const footnote = el.querySelector(".scratch-footnote");
      const canvas = el.querySelector("#scratch-canvas");

      // IMPORTANT: Initialize canvas immediately so it's covered in gold 
      // BEFORE the card container starts to fade in.
      initScratchCard(canvas, () => {
        gsap.to(hint, { duration: 0.3, opacity: 0 });
        setTimeout(() => tl.play(), 800);
      });

      // Show pretext
      tl.to(wrapper, { duration: 0.6, opacity: 1 })
        .to(pretext, { duration: 0.8, opacity: 1 })
        .to(pretext, { duration: 0.6, opacity: 0, y: -20 }, "+=2")
        // Show scratch card
        .to(cardContainer, { duration: 0.9, opacity: 1, ease: "back.out(1.3)" })
        .call(() => {
          el.classList.add("is-interactive");
          hint.classList.add("is-active");
          gsap.to(hint, { duration: 0.4, opacity: 0.65 });
        });

      tl.addPause();

      // Show footnote
      tl.to(footnote, { duration: 0.8, opacity: 1 });
    },

    exit(tl, el) {
      tl.call(() => el.classList.remove("is-interactive"));
      tl.to(el, { duration: 0.8, opacity: 0, scale: 0.95 }, "+=3.5");
    },
  };

  // Scratch card logic
  function initScratchCard(canvas, onComplete) {
    const rect = canvas.getBoundingClientRect();
    const w = canvas.width = rect.width * window.devicePixelRatio;
    const h = canvas.height = rect.height * window.devicePixelRatio;
    const ctx = canvas.getContext("2d");
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Draw gold overlay
    ctx.fillStyle = "#D4A373";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw hint text
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "16px 'Poppins', sans-serif";
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
        setTimeout(() => { 
          canvas.style.display = "none"; 
          onComplete && onComplete(); 
        }, 500);
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
    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); drawing = true;  const p = pos(e); scratch(p.x, p.y); }, false);
    canvas.addEventListener("touchmove",  (e) => { e.preventDefault(); if (drawing) { const p = pos(e); scratch(p.x, p.y); } }, false);
    canvas.addEventListener("touchend",   ()  => { drawing = false; }, false);
  }
})();
