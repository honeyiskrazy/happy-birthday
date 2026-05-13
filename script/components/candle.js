(function () {
  window.Components = window.Components || {};

  window.Components.candle = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-candle";
      div.innerHTML = `
        <p class="candle-instruction" style="opacity:0">${section.instruction || "Make a wish &amp; blow out the candle!"}</p>
        <div class="candle-stage" style="opacity:0">
          <div class="candle-body">
            <div class="candle-flame-wrap">
              <div class="candle-flame"></div>
              <div class="candle-flame-inner"></div>
            </div>
            <div class="candle-wick"></div>
            <div class="candle-wax"></div>
          </div>
        </div>
        <p class="candle-hint" style="opacity:0"></p>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const instruction = el.querySelector(".candle-instruction");
      const stage = el.querySelector(".candle-stage");
      const flameWrap = el.querySelector(".candle-flame-wrap");
      const flame = el.querySelector(".candle-flame");
      const flameInner = el.querySelector(".candle-flame-inner");
      const hint = el.querySelector(".candle-hint");

      tl.to(instruction, { duration: 1.0, opacity: 1 })
        .to(stage, { duration: 0.8, opacity: 1, ease: "back.out(1.4)" })
        .call(() => {
          el.classList.add("is-interactive");

          // Show hint
          gsap.to(hint, { duration: 0.4, opacity: 0.6 });
          hint.classList.add("is-active");

          let blown = false;

          function blowOut(e) {
            if (blown) return;
            if (e) { e.preventDefault(); e.stopPropagation(); }
            blown = true;

            // Remove listeners
            flameWrap.removeEventListener("click", blowOut);
            flameWrap.removeEventListener("touchstart", blowOut);

            // Hide hint
            gsap.to(hint, { duration: 0.2, opacity: 0 });

            // Step 1: Flame flickers wildly & leans to one side (~0.5s)
            var flickerTl = gsap.timeline();
            flickerTl
              .to(flame, {
                duration: 0.08, scaleX: 1.3, scaleY: 0.7, rotation: 15,
                repeat: 5, yoyo: true, ease: "none",
              })
              .to(flameInner, {
                duration: 0.08, scaleX: 1.4, scaleY: 0.6, rotation: -10,
                repeat: 5, yoyo: true, ease: "none",
              }, 0);

            // Step 2: Flame leans hard and shrinks away
            flickerTl.to(flame, {
              duration: 0.35, scaleY: 0.15, scaleX: 0.3, rotation: 35,
              x: 6, opacity: 0, ease: "power3.in",
            })
            .to(flameInner, {
              duration: 0.25, scaleY: 0, scaleX: 0, opacity: 0, ease: "power3.in",
            }, "-=0.3");

            // Step 3: Ember glow on wick tip
            flickerTl.call(function() {
              var ember = document.createElement("div");
              ember.className = "candle-ember";
              flameWrap.appendChild(ember);
              gsap.fromTo(ember,
                { opacity: 1, scale: 1 },
                { duration: 1.5, opacity: 0, scale: 0.3, ease: "power1.out" }
              );
            });

            // Step 4: Multiple smoke wisps
            flickerTl.call(function() {
              for (var i = 0; i < 3; i++) {
                var smoke = document.createElement("div");
                smoke.className = "candle-smoke";
                flameWrap.appendChild(smoke);

                var xDrift = (Math.random() - 0.5) * 30;
                var delay = i * 0.15;

                gsap.fromTo(smoke,
                  { opacity: 0.5 + Math.random() * 0.3, y: 0, x: 0, scale: 0.8 },
                  {
                    duration: 1.8 + Math.random() * 0.6,
                    y: -60 - Math.random() * 50,
                    x: xDrift,
                    opacity: 0,
                    scale: 2 + Math.random() * 1.5,
                    ease: "power1.out",
                    delay: delay,
                  }
                );
              }
            }, null, null, "-=0.1");

            // Step 5: Update text and continue timeline
            setTimeout(function() {
              instruction.textContent = "\u2728 Wish granted!";
              gsap.fromTo(instruction,
                { opacity: 0, scale: 0.9 },
                { duration: 0.6, opacity: 1, scale: 1 }
              );
            }, 800);

            setTimeout(function() { tl.play(); }, 2500);
          }

          // Attach listeners to the FLAME only
          flameWrap.addEventListener("click", blowOut);
          flameWrap.addEventListener("touchstart", blowOut, { passive: false });
        });

      tl.addPause();
    },

    exit(tl, el) {
      tl.call(() => {
        el.classList.remove("is-interactive");
      });
      tl.to(el, { duration: 0.8, opacity: 0, y: 20 }, "+=1");
    },
  };
})();
