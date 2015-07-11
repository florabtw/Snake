var time = Date.now();

var Direction = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.speed = 200; // pixels per second
  this.direction = Direction.RIGHT;

  this.turnLeft = function() {
    if (this.direction !== Direction.RIGHT)
      this.direction = Direction.LEFT;
  }
  this.turnRight = function() {
    if (this.direction !== Direction.LEFT)
      this.direction = Direction.RIGHT;
  }
  this.turnUp = function() {
    if (this.direction !== Direction.DOWN)
      this.direction = Direction.UP;
  }
  this.turnDown = function() {
    if (this.direction !== Direction.UP)
      this.direction = Direction.DOWN;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.querySelector('#screen');
  var context =  canvas.getContext('2d');
  var snake = new Snake();

  // responsive canvas
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawSnake();
  }

  resizeCanvas();

  // game loop timing
  if (window.requestAnimationFrame !== null) {
    var recursiveAnim = function() {
      mainloop();
      window.requestAnimationFrame(recursiveAnim);
    };

    window.requestAnimationFrame(recursiveAnim);
  } else {
    setInterval(mainloop, 1000.0 / 60);
  }

  // handle keypress events
  window.addEventListener('keydown', keyPress, false);

  function keyPress(e) {
    var code = e.keyCode;
    switch (code) {
      case 37: snake.turnLeft(); break;
      case 38: snake.turnUp(); break;
      case 39: snake.turnRight(); break;
      case 40: snake.turnDown(); break;
    }
  }

  // game loop
  function mainloop() {
    updateSnake();
    drawSnake();
  }

  function updateSnake() {
    var newTime = Date.now();

    // seconds since last draw
    var timeDelta = (newTime - time) / 1000;
    time = newTime;

    var distance = timeDelta * snake.speed;

    if (snake.direction === Direction.LEFT) {
      snake.x -= distance;
    } else if (snake.direction === Direction.RIGHT) {
      snake.x += distance;
    } else if (snake.direction === Direction.UP) {
      snake.y -= distance;
    } else {
      snake.y += distance;
    }
  }

  function drawSnake() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(snake.x, snake.y, 10, 10);
  }
});
