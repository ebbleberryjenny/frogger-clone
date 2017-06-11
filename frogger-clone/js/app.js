// Enemies our player must avoid
var Enemy = function(x, y) {
  // The image/sprite for our enemies, this uses
  // a helper to easily load images
  this.sprite = 'images/enemy-bug-1.png';
  //sets enemy location
  this.x = x;
  this.y = y;
};

// Updates the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // dt multiplied by any movement
  // ensures the game runs at the same speed for
  // all computers.
  //resets enemy's location to beginning of screen
  if (this.x > 505){
    this.x = 5;
  //sets speed of different enemies
  } else {
    if (this === enemySlow){
      this.x += 50 * dt;
    } else if (this === enemyMedium){
      this.x += 100 * dt;
    } else {
      this.x += 150 * dt;
    }
  }
}

// Draw the enemy on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Player class
var Player = function(x, y) {
  this.sprite = 'images/char-cat-girl-1.png';
  this.x = x;
  this.y = y;
};

//resets player to starting position
Player.prototype.reset = function() {
  player.x = 200;
  player.y = 380;
}

//runs reset function is player moves off board
Player.prototype.offsides = function() {
  if (player.x > 400 || player.x < 0 || player.y > 483 || player.y < -83) {
    player.reset();
  }
}

//Checks that player is not running into any enemies with axis-aligned
//bounding box algorithm
Player.prototype.checkCollisions = function(enemy){
  var rect1 = {x: enemy.x, y: enemy.y, width: 78, height: 43}
  var rect2 = {x: this.x, y: this.y, width: 78, height: 50}

  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y) {
    player.reset();
  }
}

//alerts player if they win
Player.prototype.youWin = function() {
  if (player.y <= -8){
    window.alert('You won!');
    player.reset();
  }
}

//updates player location by invoking checkCollisions, offsides, handleInput, &
//youWin functions
Player.prototype.update = function(dt) {
  player.offsides();
  player.checkCollisions(enemySlow);
  player.checkCollisions(enemyMedium);
  player.checkCollisions(enemyFast);
  player.handleInput();
  player.x * dt;
  player.y * dt;
  player.youWin();
}

//renders updated player
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//function for input arrows keys
Player.prototype.handleInput = function(key) {
  switch(key){
    case 'left':
      player.x -= 100;
    break;
    case 'up':
      player.y -= 82;
      break;
    case 'right':
      player.x += 100;
      break;
    case 'down':
      player.y += 82;
      break;
  }
}

// Object instantiation
// all enemy objects in an array called allEnemies
// player object in a variable called player
var enemyFast = new Enemy(5, 135);
var enemyMedium = new Enemy(5, 218);
var enemySlow = new Enemy(5, 301);

var allEnemies = [enemyFast, enemyMedium, enemySlow];

var player = new Player(200, 380);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
})
