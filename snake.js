var time = Date.now();

var Direction = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function Snake() {
  this.points = [new Point(50, 50), new Point(40, 50), new Point(30, 50)];
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

    if (newTime - time > 50) {
      time = newTime;

      // update all but head of snake
      for (i = snake.points.length - 1; i > 0; i--) {
        snake.points[i].x = snake.points[i-1].x;
        snake.points[i].y = snake.points[i-1].y;
      }

      // update head
      if (snake.direction === Direction.LEFT) {
        snake.points[0].x -= 10;
      } else if (snake.direction === Direction.RIGHT) {
        snake.points[0].x += 10;
      } else if (snake.direction === Direction.UP) {
        snake.points[0].y -= 10;
      } else {
        snake.points[0].y += 10;
      }
    }
  }

  function drawSnake() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < snake.points.length; i++) {
      context.fillRect(snake.points[i].x, snake.points[i].y, 10, 10);
    }
  }
});
