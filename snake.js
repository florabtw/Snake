document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.querySelector('#screen');
  var context =  canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
});
