const logo = document.getElementById("logomiddle");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const maxScroll = 1000;
  const progress = Math.min(scrollY / maxScroll, 1);

  const scale = 1 - progress * 0.7; // 1 ➝ 0.3
  const translateY = -progress * 200; // 0 ➝ -200px

  logo.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;

  // Quand on atteint le scroll max, on le fixe au header
  if (progress === 1) {
    logo.style.position = "absolute";
    logo.style.top = "10px";
    logo.style.left = "50%";
    logo.style.transform = "translateX(-50%) scale(0.3)";
  } else {
    logo.style.position = "fixed";
    logo.style.top = "50%";
    logo.style.left = "50%";
  }
});
