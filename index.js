// ---- Hero 3D model: drag to orbit (built into model-viewer) + scroll-driven spin ----
const heroModel = document.getElementById("heroModel");

if (heroModel) {
  let userIsDragging = false;
  let ticking = false;

  heroModel.addEventListener("pointerdown", () => {
    userIsDragging = true;
  });
  window.addEventListener("pointerup", () => {
    userIsDragging = false;
  });

  const updateModelFromScroll = () => {
    ticking = false;
    if (userIsDragging) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    const theta = progress * 360; // one full rotation across the scrollable page

    heroModel.cameraOrbit = `${theta}deg 75deg 105%`;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateModelFromScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
}

// ---- Sidebar navigation: show the clicked section, hide the rest ----
document.querySelectorAll(".sidebar__item")?.forEach((button) => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".section")?.forEach((element) => {
      if (element.id !== button.id + "Section") {
        element.classList.add("d-none");
      }
    });
    document.getElementById(button.id + "Section")?.classList.toggle("d-none");
  });
});
