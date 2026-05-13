(function () {
  window.Components = window.Components || {};

  const SVGS = ["ballon1.svg", "ballon2.svg", "ballon3.svg"];

  window.Components.balloons = {
    overlay: true,

    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-balloons";

      const count = section.count || 24;
      for (let i = 0; i < count; i++) {
        const wrapper = document.createElement("div");
        wrapper.className = "balloon-wrapper";

        const img = document.createElement("img");
        img.src = `img/${SVGS[i % SVGS.length]}`;
        img.alt = "balloon";

        // Perfectly symmetrical distribution: 
        // Half on left, half on right.
        const isLeft = i < count / 2;
        const leftPos = isLeft 
          ? (Math.random() * 18 + 2)    // Left zone: 2% to 20%
          : (Math.random() * 18 + 80);  // Right zone: 80% to 98%
        
        const scale = 0.35 + Math.random() * 0.6;

        wrapper.style.position = "absolute";
        wrapper.style.left = `${leftPos}%`;
        
        const hue = [-12, 18, 42, 74, 128][i % 5];
        img.style.filter = `hue-rotate(${hue}deg) brightness(0.95) saturate(0.82)`;
        img.style.opacity = "0.82";
        img.style.transform = `scale(${scale})`;
        img.style.animationDelay = `${Math.random() * 4}s`;
        img.style.animationDuration = `${3 + Math.random() * 3}s`;

        wrapper.appendChild(img);
        div.appendChild(wrapper);
      }

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const wrappers = el.querySelectorAll(".balloon-wrapper");
      const imgs = el.querySelectorAll("img");

      wrappers.forEach((w) => {
        // Settle in a broad vertical range (avoiding the very top banner)
        const finalTop = Math.random() * 60 + 12; 
        w.style.top = `${finalTop}%`;
      });

      tl.fromTo(
        wrappers,
        { y: "110vh" },
        {
          y: 0,
          duration: 5.5,
          stagger: { each: 0.25, from: "random" },
          ease: "power1.out",
          onStart: () => {
            imgs.forEach((img) => img.classList.add("balloon-float"));
          },
        }
      );
    },
  };
})();
