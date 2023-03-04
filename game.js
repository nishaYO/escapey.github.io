// DOM element objects
const h1 = document.querySelector("h1");
const output = document.getElementById("output");
const replay = document.getElementById("replay");

// setup canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// setup canvas width and height
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// finish and start line X axis
const finishX = width - (10 * width) / 100;
const startX = (15 * width) / 100;

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

// class for enemy balls
class Ball extends Shape {
  constructor(x, y, size, color, velx, vely) {
    super(x, y, velx, vely);
    this.size = size;
    this.color = color;
    this.exists = true;
  }

  // draw function for the balls
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // function to change direction when collided with boundary
  update() {
    // detecting right side boundary collision
    if (this.x + this.size >= finishX) {
      this.velx = -this.velx; //go in opposite direction
    }
    // detecting left side boundary collision
    if (this.x - this.size <= startX) {
      this.velx = -this.velx;
    }
    // detecting downside boundary collision
    if (this.y + this.size >= height) {
      this.vely = -this.vely;
    }
    // detecting upside boundary collision
    if (this.y - this.size <= 0) {
      this.vely = -this.vely;
    }

    // adding velocity to x and y to cause movement
    this.x += this.velx;
    this.y += this.vely;
  }
}

// user circle class
class UserCircle extends Shape {
  constructor(x, y) {
    super(x, y);
    this.color = "rgb(255,255,255)";
    this.size = 10;

    // moving usercircle using keys
    let wPressed = false;
    let dPressed = false;
    let aPressed = false;
    let sPressed = false;
    document.addEventListener("keydown", (e) => {
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        userCircle.x -= 6;
        aPressed = true;
      }
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        userCircle.x += 6;
        dPressed = true;
      }
      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        userCircle.y += 6;
        sPressed = true;
      }
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        userCircle.y -= 6;
        wPressed = true;
      }
      if (dPressed && wPressed) {
        userCircle.x += 3;
        userCircle.y -= 3;
      }
      if (aPressed && wPressed) {
        userCircle.x -= 3;
        userCircle.y -= 3;
      }
      if (dPressed && sPressed) {
        userCircle.x += 3;
        userCircle.y += 3;
      }
      if (aPressed && sPressed) {
        userCircle.x -= 3;
        userCircle.y += 3;
      }
    });
    window.addEventListener("keyup", (e)=>{
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        aPressed = false;
      }
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        wPressed = false;
      }
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        dPressed = false;
      }
      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        sPressed = false;
      }
    });
  }

  //drawing user circle
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
  }

  //detecting collision with the canvas boundary
  checkBounds() {
    // detecting right side  edge collision
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }
    // detecting left side  edge collision
    if (this.x - this.size <= 0) {
      this.x += this.size;
    }
    // detecting downside  edge collision
    if (this.y + this.size >= height) {
      this.y -= this.size;
    }
    // detecting upside  edge collision
    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }
  //detecting collision with enemy balls
  collisionDetect() {
    for (const ball of balls) {
      // ignoring the same ball's distance from itself
      if (ball.exists) {
        // applying pythogores thoeram [ c = sqt(a**2 + b**2)]
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        //calling lost() if distance lesser then sum of their radii
        if (distance < this.size + ball.size) {
          ball.exists = false;
          setTimeout(lost, 500);
        }
      }
    }
  }
}

// creating a user circle instance
const userCircle = new UserCircle(100, 250);

// creating a balls array and storing all 10 ball instances of the Ball constructor object using a loop
const balls = [];
for (let i = 0; i < 10; i++) {
  const Size = random(15, 20);
  const X = random(startX + Size, finishX - Size);
  const Y = random(0 + Size, height - Size);
  let VelX, VelY;
  do {
    VelX = random(-3, 3);
    VelY = random(-3, 3);
  } while (VelX == 0 && VelY == 0); //ensuring that the velocity x and y are not zero at the same time
  const ball = new Ball(X, Y, Size, randomRGB(), VelX, VelY);
  balls.push(ball);
}

// number of balls initially
const count = 20;

function loop() {
  // drawing black background of the game
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  // drawing finish line
  ctx.moveTo(finishX, height);
  ctx.lineTo(finishX, 0);

  // drawing start line
  ctx.moveTo(startX, height);
  ctx.lineTo(startX, 0);

  ctx.strokeStyle = "white";
  ctx.stroke();

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
    } else {
      count--;
    }
  }

  userCircle.draw();
  userCircle.checkBounds();
  userCircle.collisionDetect();
  requestAnimationFrame(loop);
}

loop();

// if collided with the enemy balls
const lost = () => {
  output.insertAdjacentHTML("afterbegin", "<p>YOU LOST:(</p>");
  output.classList.remove("hidden");
  replay.classList.remove("hidden");
  canvas.classList.add("hidden");
  h1.classList.add("hidden");
  replay.addEventListener("click", () => location.reload());
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      location.reload();
    }
  });
};

//if reached finish line
const won = () => {
  output.insertAdjacentHTML("afterbegin", "<p>YOU WON:)</p>");
  output.classList.remove("hidden");
  replay.classList.remove("hidden");
  canvas.classList.add("hidden");
  h1.classList.add("hidden");
  replay.addEventListener("click", () => location.reload());
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      location.reload();
    }
  });
};

//calling won()
function checkCollision() {
  if (userCircle.x >= finishX + userCircle.size) {
    won();
  } else {
    requestAnimationFrame(checkCollision);
  }
}

checkCollision();
