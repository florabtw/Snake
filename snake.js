document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.querySelector('#screen');
  var context =  canvas.getContext('2d');

  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawSnake();
  }

  resizeCanvas();

  if (window.requestAnimationFrame !== null) {
    var recursiveAnim = function() {
      mainloop();
      window.requestAnimationFrame(recursiveAnim);
    };

    window.requestAnimationFrame(recursiveAnim);
  } else {
    setInterval(mainloop, 1000.0 / 60.0);
  }

  var point = 0;
  function mainloop() {
    updateSnake();
    drawSnake();
  }

  function updateSnake() {
    if (point >= canvas.width || point >= canvas.height) {
      point = 0;
    } else {
      point++;
    }
  }

  function drawSnake() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(point, point, 10, 10);
  }
});
