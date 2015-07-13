The popular Snake game, built in JS for HTML5 Canvas.

Meant to be played using arrow keys.

The `index.*` files in this repo are a demonstration of Snake being played in a full-page canvas.

# Instructions

### Download

Download snake-*.min.js and place it in the root of your website or in a subdirectory.

Include snake-*.min.js:

```html
<script src="/path/to/snake-*.min.js"></script>
```

### Canvas Element

Create a ```canvas``` element in which Snake can be played.

The canvas element needs the ability to be focused on. One way to do that is giving it a ```tabindex```.

**Important:** The `width` and `height` properties must be set and must match the width and height of
the canvas element style, *unless* you use JavaScript to make it responsive. More on this below.

Example:

```html
<canvas id="snake" tabindex="1" width="400" height="200"></canvas>
```

```css
#snake {
  width: 400px;
  height: 200px;
}
```

### JavaScript

You need your own JavaScript to start the gameplay.

Example:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.querySelector('#snake');
  canvas.focus(); // include if you want the game to focus when the page loads
    
  var game = new SnakeGame(canvas);
  game.enableControls(); // enables on-screen arrow keys (optional)
  game.play();
}
```

If you want a responsive canvas, add this JavaScript:

```javascript
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  // set these to whatever dimensions you want
  canvas.style.width = canvas.parentNode.clientWidth + 'px'; // width same as parent
  canvas.style.height = canvas.parentNode.clientHeight + 'px'; // height same as parent
  
  // these must be set for proper drawing
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  
  game.resize(); // let SnakeGame know that the canvas has resized, also necessary
});
resizeCanvas();
```
