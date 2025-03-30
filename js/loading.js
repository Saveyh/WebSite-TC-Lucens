document.addEventListener("DOMContentLoaded", function () {
  let loadingText = document.querySelector("#loading-txt");
  let loadingScreen = document.querySelector("#loading-screen");
  let progress = 0;
  let speed = 30;

  let interval = setInterval(function () {
    progress += 1;
    loadingText.textContent = "Chargement... " + progress + "%";

    if (progress >= 23) {
      speed = 60;
    }
    if (progress >= 31) {
      speed = 5;
    }
    if (progress >= 44) {
      speed = 45;
    }
    if (progress >= 70) {
      speed = 15;
    }
    if (progress >= 90) {
      speed = 5;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(function () {
        loadingScreen.style.opacity = 0;
      }, 500);
    } else {
      clearInterval(interval);
      interval = setInterval(arguments.callee, speed);
    }
  }, speed);
});
