(function () {
  window.Components = window.Components || {};

  window.Components.announcement = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-announcement";
      div.innerHTML = `<p>${section.text || "It's your birthday!!"}</p>`;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      tl.from(el.querySelector("p"), {
        duration: 0.9, opacity: 0, y: 15, ease: "power2.out"
      })
      .to(el.querySelector("p"), {
        duration: 0.8, opacity: 0, y: -15, ease: "power2.in"
      }, "+=3.5");
    },
  };
})();
