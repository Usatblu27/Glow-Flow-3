"use strict";
class VibrationManager {
  static vibrate(duration = 15, pattern = null) {
    try {
      if (!this.isVibrationSupported()) return;
      const vibrationValue = parseInt(localStorage.getItem("vibration")) || 50;
      if (vibrationValue <= 0) return;
      let vibrationPattern;
      if (pattern) {
        vibrationPattern = pattern.map((ms) =>
          Math.min(ms * (vibrationValue / 100), 100)
        );
      } else {
        vibrationPattern = Math.min(duration * (vibrationValue / 100), 100);
      }
      navigator.vibrate(vibrationPattern);
    } catch (e) {
      console.debug("Vibration not supported", e);
    }
  }
  static isVibrationSupported() {
    return "vibrate" in navigator;
  }
  static patterns = {
    button: 15,
    collision: 20,
    explosion: [30, 10, 30],
    score: [50, 10, 50],
    gameOver: [40, 10, 40, 10, 40],
    menu: 10,
    error: [100, 50, 100],
  };
}
function getBasePath() {
  const scripts = document.getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes("vibration.js")) {
      const url = new URL(scripts[i].src);
      return url.pathname.replace("/js/vibration.js", "");
    }
  }
  const path = window.location.pathname;
  if (path.includes("/html/")) {
    return "..";
  }
  return ".";
}
function ensureVibrationManager(callback) {
  if (typeof VibrationManager !== "undefined") {
    callback();
    return;
  }
  if (!("vibrate" in navigator)) {
    callback();
    return;
  }
  const basePath = getBasePath();
  const scriptPath = `${basePath}/js/vibration.js`;
  if (document.querySelector(`script[src="${scriptPath}"]`)) {
    setTimeout(() => {
      if (typeof VibrationManager !== "undefined") {
        callback();
      } else {
        callback();
      }
    }, 100);
    return;
  }
  const script = document.createElement("script");
  script.src = scriptPath;
  script.onload = function () {
    setTimeout(callback, 50);
  };
  script.onerror = function () {
    console.log("Vibration script failed to load:", scriptPath);
    callback();
  };
  document.head.appendChild(script);
}
