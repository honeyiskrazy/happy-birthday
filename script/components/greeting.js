(function () {
  window.Components = window.Components || {};

  window.Components.greeting = {
    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-greeting";
      div.innerHTML = `
        <h1 class="greeting-title">
          ${section.title || "Hi"}
          <span class="greeting-name">${config.name}</span>
        </h1>
        <p class="greeting-subtitle">${section.subtitle || ""}</p>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      tl.from(el.querySelector(".greeting-title"), {
        duration: 1.0, opacity: 0, y: 15, ease: "power2.out"
      })
      .from(el.querySelector(".greeting-subtitle"), {
        duration: 0.8, opacity: 0, y: 15, ease: "power2.out"
      }, "-=0.4")
      .to(el.querySelector(".greeting-title"), {
        duration: 0.8, opacity: 0, y: -15, ease: "power2.in"
      }, "+=3.5")
      .to(el.querySelector(".greeting-subtitle"), {
        duration: 0.8, opacity: 0, y: -15, ease: "power2.in"
      }, "-=0.6");
    },
  };
})();
