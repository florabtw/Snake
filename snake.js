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

function Snake() {
  // TODO snake should start near center of canvas
  this.points = [new Point(50, 50)];
  this.direction = Direction.RIGHT;

  this.headCollidesWithWall = function(canvas) {
    var head = this.points[0];
    var xCollides = 0 > head.x || head.x > canvas.width - 10;
    var yCollides = 0 > head.y || head.y > canvas.height - 10;
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

  this.turnLeft = function() {
    if (this.direction !== Direction.RIGHT)
      this.direction = Direction.LEFT;
  };

  this.turnRight = function() {
    if (this.direction !== Direction.LEFT)
      this.direction = Direction.RIGHT;
  };

  this.turnUp = function() {
    if (this.direction !== Direction.DOWN)
      this.direction = Direction.UP;
  };

  this.turnDown = function() {
    if (this.direction !== Direction.UP)
      this.direction = Direction.DOWN;
  };

  this.draw = function(context) {
    context.fillStyle = 'black';

    for (i = 0; i < this.points.length; i++) {
      context.fillRect(this.points[i].x, this.points[i].y, 10, 10);
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
    var x = Math.random() * (canvas.width - 10);
    return Math.round(x / 10) * 10;
  }

  function generateY() {
    var y = Math.random() * (canvas.height - 10);
    return Math.round(y / 10) * 10;
  }

  this.draw = function(context) {
    context.fillRect(this.x, this.y, 10, 10);
  };
}

function SnakeGame(canvas) {
  var snake = new Snake();
  var apple = new Apple(canvas);
  var btnReset = new ResetButton(canvas, this);

  var context = canvas.getContext('2d');

  var time = Date.now();
  var gameOver = false;
  var score = 0;

  this.resize = function() {
    if (apple.x > canvas.width - 10 || apple.y > canvas.height - 10) {
      apple.move();
    }

    btnReset.updateLocation();

    drawGame();
  };

  this.reset = function() {
    gameOver = false;
    time = Date.now();
    score = 0;

    snake = new Snake();
    apple.move();
  };

  this.play = function() {
    // listen for reset button
    btnReset.listen();

    // listen for key presses
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

        score++;

        apple.move();
      }

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

      if (snake.headCollidesWithWall(canvas) || snake.headCollidesWithSelf()) {
        gameOver = true;
      }
    }
  }

  function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.draw(context);

    apple.draw(context);

    // draw score
    context.font = 'bold 36px sans-serif';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillText('Score: ' + score, 10, 10);

    btnReset.draw(context);
  }
}
