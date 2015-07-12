const BLOCK_SIZE = 10;

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

function Controls(canvas) {
  const SIZE = 50;
  const GAP = 5;

  var left, right, up, down;

  var listener = null;

  this.updateLocation = function() {
    left  = new Point(canvas.width - SIZE * 3 - GAP * 3,
                      canvas.height - SIZE - GAP);
    down  = new Point(canvas.width - SIZE * 2 - GAP * 2,
                      canvas.height - SIZE - GAP);
    right = new Point(canvas.width - SIZE - GAP,
                      canvas.height - SIZE - GAP);
    up    = new Point(canvas.width - SIZE * 2 - GAP * 2,
                      canvas.height - SIZE * 2 - GAP * 2);
  }
  this.updateLocation();

  this.register = function(newListener) {
    listener = newListener;
  }

  this.listen = function() {
    window.addEventListener('mousedown', checkForClick, false);
  }

  function checkForClick(e) {
    var eventX = e.pageX - canvas.offsetLeft;
    var eventY = e.pageY - canvas.offsetTop;

    if (collidesWithLeft(eventX, eventY)) {
      listener.turnLeft();
    } else if (collidesWithRight(eventX, eventY)) {
      listener.turnRight();
    } else if (collidesWithUp(eventX, eventY)) {
      listener.turnUp();
    } else if (collidesWithDown(eventX, eventY)) {
      listener.turnDown();
    }
  }

  function collidesWithLeft(x, y) {
    return collidesWithControl(left, x, y);
  }

  function collidesWithRight(x, y) {
    return collidesWithControl(right, x, y);
  }

  function collidesWithUp(x, y) {
    return collidesWithControl(up, x, y);
  }

  function collidesWithDown(x, y) {
    return collidesWithControl(down, x, y);
  }

  function collidesWithControl(control, x, y) {
    var xCollides = control.x <= x && x <= control.x + SIZE;
    var yCollides = control.y <= y && y <= control.y + SIZE;
    return xCollides && yCollides;
  }

  this.draw = function(context) {
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';

    context.fillRect(left.x, left.y, SIZE, SIZE);
    context.fillRect(right.x, right.y, SIZE, SIZE);
    context.fillRect(up.x, up.y, SIZE, SIZE);
    context.fillRect(down.x, down.y, SIZE, SIZE);
  }
}

function ResetButton(canvas, game) {
  this.x = 10;
  this.y = canvas.height - 50;
  this.width = 100;
  this.height = 40;

  var btn = this;

  this.updateLocation = function() {
    this.y = canvas.height - 50;
  };

  this.listen = function() {
    window.addEventListener('mousedown', checkForClick, false);
  };

  function checkForClick(e) {
    var eventX = e.pageX - canvas.offsetLeft;
    var eventY = e.pageY - canvas.offsetTop;

    var xCollides = btn.x <= eventX && eventX <= btn.x + btn.width;
    var yCollides = btn.y <= eventY && eventY <= btn.y + btn.height;

    if (xCollides && yCollides) {
      game.reset();
    }
  }

  this.draw = function(context) {
    context.fillRect(this.x, this.y, this.width, this.height);

    context.font = '16px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#333';

    var centerX = this.x + (this.width / 2);
    var centerY = this.y + (this.height / 2);
    context.fillText('Reset', centerX, centerY);
  };
}

function Score() {
  this.score = 0;

  this.reset = function() {
    this.score = 0;
  }

  this.increment = function() {
    this.score++;
  }

  this.draw = function(context) {
    context.font = 'bold 36px sans-serif';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillText('Score: ' + this.score, 10, 10);
  }
}

function Snake() {
  this.points = [new Point(BLOCK_SIZE, BLOCK_SIZE)];
  this.direction = Direction.RIGHT;

  var snake = this;

  this.reset = function() {
    this.points = [new Point(50, 50)];
    this.direction = Direction.RIGHT;
  }

  this.headCollidesWithWall = function(canvas) {
    var head = this.points[0];
    var xCollides = 0 > head.x || head.x > canvas.width - BLOCK_SIZE;
    var yCollides = 0 > head.y || head.y > canvas.height - BLOCK_SIZE;
    return xCollides || yCollides;
  };

  this.headCollidesWithSelf = function() {
    var head = this.points[0];
    for (i = 1; i < this.points.length; i++) {
      if (head.x == this.points[i].x && head.y == this.points[i].y) {
        return true;
      }
    }

    return false;
  };

  this.headCollidesWithApple = function(apple){
    var head = this.points[0];
    return head.x === apple.x && head.y === apple.y;
  };

  this.listenForKeyPress = function() {
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
  }

  this.turnLeft = function() {
    if (snake.direction !== Direction.RIGHT)
      snake.direction = Direction.LEFT;
  };

  this.turnRight = function() {
    if (snake.direction !== Direction.LEFT)
      snake.direction = Direction.RIGHT;
  };

  this.turnUp = function() {
    if (snake.direction !== Direction.DOWN)
      snake.direction = Direction.UP;
  };

  this.turnDown = function() {
    if (snake.direction !== Direction.UP)
      snake.direction = Direction.DOWN;
  };

  this.draw = function(context) {
    context.fillStyle = 'black';

    for (i = 0; i < this.points.length; i++) {
      context.fillRect(this.points[i].x, this.points[i].y, BLOCK_SIZE, BLOCK_SIZE);
    }
  };
}

function Apple(canvas) {
  this.x = generateX();
  this.y = generateY();

  this.move = function() {
    this.x = generateX();
    this.y = generateY();
  };

  function generateX() {
    var x = Math.random() * (canvas.width - BLOCK_SIZE);
    return Math.round(x / BLOCK_SIZE) * BLOCK_SIZE;
  }

  function generateY() {
    var y = Math.random() * (canvas.height - BLOCK_SIZE);
    return Math.round(y / BLOCK_SIZE) * BLOCK_SIZE;
  }

  this.draw = function(context) {
    context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
  };
}

function SnakeGame(canvas) {
  var snake = new Snake();
  var apple = new Apple(canvas);
  var btnReset = new ResetButton(canvas, this);
  var score = new Score();
  var controls = null;

  var context = canvas.getContext('2d');

  var time = Date.now();
  var gameOver = false;

  this.resize = function() {
    var appleOutsideX = apple.x > canvas.width - BLOCK_SIZE;
    var appleOutsideY = apple.y > canvas.height - BLOCK_SIZE;

    if (appleOutsideX || appleOutsideY) {
      apple.move();
    }

    btnReset.updateLocation();

    if (controls !== null) {
      controls.updateLocation();
    }

    drawGame();
  };

  this.reset = function() {
    gameOver = false;
    time = Date.now();

    snake.reset();
    apple.move();
    score.reset();
  };

  this.enableControls = function() {
    controls = new Controls(canvas);
    controls.register(snake);
  }

  this.play = function() {
    btnReset.listen();
    snake.listenForKeyPress();

    if (controls !== null) {
      controls.listen();
    }

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

    // game loop
    function mainloop() {
      if (!gameOver) {
        updateGame();
        drawGame();
      }
    }
  };

  function updateGame() {
    var newTime = Date.now();

    if (newTime - time > 50) {
      time = newTime;

      if (snake.headCollidesWithApple(apple)) {
        var last = snake.points[snake.points.length-1];
        snake.points.push(new Point(last.x, last.y));

        score.increment();

        apple.move();
      }

      // update all but head of snake
      for (i = snake.points.length - 1; i > 0; i--) {
        snake.points[i].x = snake.points[i-1].x;
        snake.points[i].y = snake.points[i-1].y;
      }

      // update head
      if (snake.direction === Direction.LEFT) {
        snake.points[0].x -= BLOCK_SIZE;
      } else if (snake.direction === Direction.RIGHT) {
        snake.points[0].x += BLOCK_SIZE;
      } else if (snake.direction === Direction.UP) {
        snake.points[0].y -= BLOCK_SIZE;
      } else {
        snake.points[0].y += BLOCK_SIZE;
      }

      if (snake.headCollidesWithWall(canvas) || snake.headCollidesWithSelf()) {
        gameOver = true;
      }
    }
  }

  function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.draw(context);

    apple.draw(context);

    score.draw(context);

    btnReset.draw(context);

    if (controls !== null) {
      controls.draw(context);
    }
  }
}
