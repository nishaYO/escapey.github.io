// DOM element objects
const h1 = document.querySelector("h1");
const output = document.getElementById("output");
const replay = document.getElementById("replay");

// setup canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// chaining multiple assignments
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// class for balls
class Shape {
  constructor(x, y, velx, vely) {
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
  }
}

class Ball extends Shape {
  constructor(x, y, size, color, velx, vely) {
    super(x, y, velx, vely);
    this.size = size;
    this.color = color;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    // detecting right side  edge collision
    if (this.x - this.size >= width - 200) {
      this.velx = -this.velx;
    }
    // detecting left side  edge collision
    if (this.x + this.size <= 300) {
      this.velx = -this.velx;
    }
    // detecting downside  edge collision
    if (this.y - this.size >= height) {
      this.vely = -this.vely;
    }
    // detecting upside  edge collision
    if (this.y + this.size <= 0) {
      this.vely = -this.vely;
    }

    // adding velocity to x and y to cause movement
    this.x += this.velx;
    this.y += this.vely;
  }
}

// creating the user's circle
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "rgb(255,255,255)";
    this.size = 10;
    // window.addEventListener("keydown", (e) => {
    //   switch (e.key) {
    //     case "a":
    //       this.x -= 6;
    //       break;
    //     case "d":
    //       this.x += 6;
    //       break;
    //     case "w":
    //       this.y -= 6;
    //       break;
    //     case "s":
    //       this.y += 6;
    //       break;
    //   }

    // });

    window.addEventListener("keydown", (e) => {
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        evilCircle.x -= 6;
      }
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        evilCircle.x += 6;
      }
      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        evilCircle.y += 6;
      }
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        evilCircle.y -= 6;
      }
    });

  }
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
  }
  checkBounds() {
    // detecting right side  edge collision
    if (this.x - this.size >= width) {
      this.x -= this.size;
    }
    // detecting left side  edge collision
    if (this.x + this.size <= 0) {
      this.x += this.size;
    }
    // detecting downside  edge collision
    if (this.y - this.size >= height) {
      this.y -= this.size;
    }
    // detecting upside  edge collision
    if (this.y + this.size <= 0) {
      this.y += this.size;
    }
  }

  collisionDetect() {
    for (const ball of Balls) {
      // ignoring the same ball's distance from itself
      if (ball.exists) {
        // applying pythogores thoeram [ c = sqt(a**2 + b**2)]
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // changing color if distance lesser then sum of their radii
        if (distance < this.size + ball.size) {
          ball.exists = false;
          setTimeout(lost, 500);
        }
      }
    }
  }
}

// creating a Balls array and storing all 10 ball instances of the Ball constructor object using a loop
const Balls = [];

for (let i = 0; i < 10; i++) {
  const Size = random(15, 20);
  const X = random(300 + Size, width - Size - 200);
  const Y = random(0 + Size, height - Size);
  const VelX = random(-3, 3);
  const VelY = random(-3, 3);
  const ball = new Ball(X, Y, Size, randomRGB(), VelX, VelY);
  Balls.push(ball);
}

// creating an evil circle instance
const evilCircle = new EvilCircle(100, 250);

// lost function when collision detected
const lost = () => {
  output.insertAdjacentHTML("afterbegin", "<p>YOU LOST:(</p>");
  output.classList.remove("hidden");
  replay.classList.remove("hidden");
  canvas.classList.add("hidden");
  h1.classList.add("hidden");
  replay.addEventListener("click", () => location.reload());
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      location.reload();
    }
  });
};

// won function if reached finish line
const won = () => {
  output.insertAdjacentHTML("afterbegin", "<p>YOU WON:)</p>");
  output.classList.remove("hidden");
  replay.classList.remove("hidden");
  canvas.classList.add("hidden");
  h1.classList.add("hidden");
  replay.addEventListener("click", () => location.reload());
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      location.reload();
    }
  });
};

function reachFinishLine() {
  if (this.x >= width - 164) {
    setTimeout(won, 2000);
  }
}

// number of balls initially
const count = 20;

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  ctx.moveTo(width - 164, height);
  ctx.lineTo(width - 164, 0);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.moveTo(265, height);
  ctx.lineTo(265, 0);
  ctx.strokeStyle = "white";
  ctx.stroke();

  for (const ball of Balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
    } else {
      count--;
    }
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();
  requestAnimationFrame(loop);
}

loop();

function checkCollision() {
  if (evilCircle.x >= width - 120) {
    won();
  } else {
    requestAnimationFrame(checkCollision);
  }
}

checkCollision();

