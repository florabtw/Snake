document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.querySelector('#screen');

  var game = new SnakeGame(canvas);
  game.play();

  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    game.resize();
  }

  resizeCanvas();
});
