var Direction = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.direction = Direction.RIGHT;

  this.turnLeft = function() {
    this.direction = Direction.LEFT;
  }
  this.turnRight = function() {
    this.direction = Direction.RIGHT;
  }
  this.turnUp = function() {
    this.direction = Direction.UP;
  }
  this.turnDown = function() {
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
  setInterval(mainloop, 1000.0 / 10);

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
    if (snake.direction === Direction.LEFT) {
      snake.x -= 10;
    } else if (snake.direction === Direction.RIGHT) {
      snake.x += 10;
    } else if (snake.direction === Direction.UP) {
      snake.y -= 10;
    } else {
      snake.y += 10;
    }
  }

  function drawSnake() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(snake.x, snake.y, 10, 10);
  }
});
