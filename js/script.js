"use strict";
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const isStandalone =
  window.navigator.standalone ||
  window.matchMedia("(display-mode: standalone)").matches;
const { Engine, Render, World, Bodies, Vertices, Composite, Runner, Body } =
  Matter;
const physicsContainer = document.getElementById("physics-container");
if (!physicsContainer) {
  document.getElementById("menu-container").innerHTML =
    '<h1 style="color:red">Error: Physics container not found</h1>';
  throw new Error("Physics container not found");
}
document.addEventListener("DOMContentLoaded", function () {
  const menuButtons = document.querySelectorAll(
    "#menu-container a, #menu-container button"
  );
  menuButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      ensureVibrationManager(() => {
        if (typeof VibrationManager !== "undefined") {
          VibrationManager.vibrate(VibrationManager.patterns.menu);
        }
      });
      const originalHref = this.href;
      if (originalHref && this.tagName === "A") {
        e.preventDefault();
        setTimeout(() => {
          window.location.href = originalHref;
        }, 100);
      }
    });
  });
});
const engine = Engine.create({
  enableSleeping: true,
  gravity: { x: 0, y: 0.1 },
});
const colors = [
  "#FE0000",
  "#3FFF0F",
  "#005DFF",
  "#F5FF00",
  "#FF009C",
  "#01FFE5",
  "#FF9C00",
  "#C500FF",
  "#960000",
  "#259609",
  "#00389C",
  "#999E00",
  "#99005E",
  "#019C8C",
  "#965C00",
  "#770099",
];
const shapes = [
  "circle",
  "square",
  "rectangle",
  "triangle",
  "pentagon",
  "hexagon",
  "trapezoid",
  "rhombus",
  "oval",
];
const pieceMaterial = {
  friction: 0.3,
  restitution: 0.2,
  density: 1,
  render: {
    strokeStyle: "#FFFFFF",
    lineWidth: 3,
    fillStyle: "#000000",
  },
};
let pieces = [];
let canSpawn = true;
const render = Render.create({
  element: physicsContainer,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "transparent",
    showSleeping: false,
    enabled: false,
  },
});
Render.run(render);
const wallOptions = { isStatic: true, render: { visible: false } };
const walls = [
  Bodies.rectangle(
    -50,
    window.innerHeight / 2,
    100,
    window.innerHeight * 2,
    wallOptions
  ),
  Bodies.rectangle(
    window.innerWidth + 50,
    window.innerHeight / 2,
    100,
    window.innerHeight * 2,
    wallOptions
  ),
];
World.add(engine.world, walls);
const runner = Runner.create();
Runner.run(runner, engine);
function createPiece(x = Math.random() * window.innerWidth) {
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const targetArea = 1500;
  let piece;
  if (shape === "circle") {
    const radius = Math.sqrt(targetArea / Math.PI);
    piece = Matter.Bodies.circle(x, -radius, radius, {
      ...pieceMaterial,
      chamfer: { radius: 5 },
      render: {
        ...pieceMaterial.render,
        fillStyle: color,
        strokeStyle: "#FFFFFF",
        lineWidth: 3,
      },
    });
  } else if (shape === "square") {
    const side = Math.sqrt(targetArea);
    piece = Matter.Bodies.rectangle(x, -side / 2, side, side, {
      ...pieceMaterial,
      chamfer: { radius: 5 },
      render: {
        ...pieceMaterial.render,
        fillStyle: color,
        strokeStyle: "#FFFFFF",
        lineWidth: 3,
      },
    });
  } else if (shape === "rectangle") {
    const width = Math.sqrt(targetArea) * 2;
    const height = targetArea / width;
    piece = Matter.Bodies.rectangle(x, -height / 2, width, height, {
      ...pieceMaterial,
      chamfer: { radius: 5 },
      render: {
        ...pieceMaterial.render,
        fillStyle: color,
        strokeStyle: "#FFFFFF",
        lineWidth: 3,
      },
    });
  } else if (shape === "triangle") {
    const side = Math.sqrt((4 * targetArea * 0.8) / Math.sqrt(3));
    piece = Matter.Bodies.polygon(
      x,
      -side / 2,
      3,
      side / (2 * Math.sin(Math.PI / 3)),
      {
        ...pieceMaterial,
        render: {
          ...pieceMaterial.render,
          fillStyle: color,
          strokeStyle: "#FFFFFF",
          lineWidth: 3,
        },
      }
    );
  } else if (shape === "pentagon") {
    const side = Math.sqrt((4 * targetArea * Math.tan(Math.PI / 5)) / 5);
    piece = Matter.Bodies.polygon(
      x,
      -side / 2,
      5,
      side / (2 * Math.sin(Math.PI / 5)),
      {
        ...pieceMaterial,
        render: {
          ...pieceMaterial.render,
          fillStyle: color,
          strokeStyle: "#FFFFFF",
          lineWidth: 3,
        },
      }
    );
  } else if (shape === "hexagon") {
    const side = Math.sqrt((2 * targetArea) / (3 * Math.sqrt(3)));
    piece = Matter.Bodies.polygon(x, -side / 2, 6, side, {
      ...pieceMaterial,
      render: {
        ...pieceMaterial.render,
        fillStyle: color,
        strokeStyle: "#FFFFFF",
        lineWidth: 3,
      },
    });
  } else if (shape === "trapezoid") {
    const width = Math.sqrt(targetArea * 1.5);
    const height = (targetArea / width) * 1.2;
    const vertices = Matter.Vertices.fromPath("-50 -25, 50 -25, 30 25, -30 25");
    Vertices.scale(vertices, width / 100, height / 50);
    piece = Matter.Bodies.fromVertices(x, -height / 2, [vertices], {
      ...pieceMaterial,
      render: {
        ...pieceMaterial.render,
        fillStyle: color,
        strokeStyle: "#FFFFFF",
        lineWidth: 3,
      },
    });
  } else if (shape === "rhombus") {
    const width = Math.sqrt(targetArea * 3.5);
    const height = (targetArea / width) * 2;
    const vertices = Matter.Vertices.fromPath("0 -50, 50 0, 0 50, -50 0");
    Vertices.scale(vertices, width / 100, height / 100);
    piece = Matter.Bodies.fromVertices(x, -height / 2, [vertices], {
      ...pieceMaterial,
      render: {
        ...pieceMaterial.render,
        fillStyle: color,
        strokeStyle: "#FFFFFF",
        lineWidth: 3,
      },
    });
  } else if (shape === "oval") {
    const width = Math.sqrt(targetArea * 3);
    const height = (targetArea / width) * 1.2;
    const vertices = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      vertices.push({
        x: (width / 2) * Math.cos(angle),
        y: (height / 2) * Math.sin(angle),
      });
    }
    piece = Matter.Bodies.fromVertices(x, -height / 2, [vertices], {
      ...pieceMaterial,
      render: {
        ...pieceMaterial.render,
        fillStyle: color,
        strokeStyle: "#FFFFFF",
        lineWidth: 3,
      },
    });
  }
  if (piece) {
    Body.setAngularVelocity(piece, (Math.random() - 0.5) * 0.05);
    Body.setVelocity(piece, {
      x: (Math.random() - 0.5) * 2,
      y: 0.5 + Math.random() * 0.5,
    });
    World.add(engine.world, piece);
    return piece;
  }
  return null;
}
function updatePieces() {
  pieces = pieces.filter((piece) => {
    if (!piece || piece.position.y > window.innerHeight + 100) {
      if (piece) Composite.remove(engine.world, piece);
      return false;
    }
    return true;
  });
  if (
    pieces.some((p) => p.position.y >= window.innerHeight * 0.3) &&
    canSpawn
  ) {
    canSpawn = false;
    setTimeout(() => {
      for (let i = 0; i < 2; i++) {
        const newPiece = createPiece();
        if (newPiece) pieces.push(newPiece);
      }
      canSpawn = true;
    }, 1000);
  }
}
function gameLoop() {
  Engine.update(engine, 1000 / 60);
  updatePieces();
  requestAnimationFrame(gameLoop);
}
window.addEventListener("load", () => {
  const title = document.getElementById("title");
  "GLOW FLOW".split("").forEach((letter, i) => {
    const span = document.createElement("span");
    span.textContent = letter === " " ? "" : letter;
    span.style.animationDelay = `${i * 0.1}s`;
    title.appendChild(span);
  });
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const piece = createPiece();
      if (piece) pieces.push(piece);
    }, i * 1000);
  }
  gameLoop();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((err) => console.error("SW error", err));
  }
  if (isMobile && !isStandalone) {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }
});
window.addEventListener("resize", () => {
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
  Body.setPosition(walls[0], { x: -50, y: window.innerHeight / 2 });
  Body.setPosition(walls[1], {
    x: window.innerWidth + 50,
    y: window.innerHeight / 2,
  });
});
