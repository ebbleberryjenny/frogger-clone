'use strict';

//Superclass for all characters
var Character = function(x, y, sprite){
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.speed = (Math.floor(Math.random() * 201) + 50);
};

// Subclass of character, Enemies our player must avoid
var Enemy = function(x, y, sprite) {
  Character.call(this, x, y, 'images/enemy-bug-1.png');
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Updates the enemy's position
// Parameter: dt, a time delta between ticks &
//rate, the factor for each enemy's speed
Enemy.prototype.update = function(dt) {
  // dt multiplied by any movement ensures the game
  // runs at the same speed for all computers.
  //The if part of the function resets enemy's location
  //to beginning of screen.
  if (this.x > 505){
    this.x = 5;
  //speeds of different enemies
  } else {
    this.x += this.speed * dt;
  }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Subclass of character, Player
var Player = function(x, y, sprite) {
  Character.call(this, x, y, 'images/char-cat-girl-1.png');
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

//resets player to starting position
Player.prototype.reset = function() {
  this.x = 200;
  this.y = 380;
};

//runs reset function is player moves off board
Player.prototype.offsides = function() {
  if (this.x > 400 || this.x < 0 || this.y > 483 || this.y < -83) {
    this.reset();
  }
};

//Checks that player is not running into any enemies with axis-aligned
//bounding box algorithm
Player.prototype.checkCollisions = function(enemy){
  var rect1 = {x: enemy.x, y: enemy.y, width: 78, height: 43};
  var rect2 = {x: this.x, y: this.y, width: 78, height: 50};

  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y) {
    this.reset();
  }
};

//alerts player if they win
Player.prototype.youWin = function() {
  if (this.y <= -8){
    window.alert('You won!');
    this.reset();
  }
};

//updates player location by invoking checkCollisions, offsides, handleInput, &
//youWin functions
Player.prototype.update = function(dt) {
  this.offsides();
  this.checkCollisions(enemySlow);
  this.checkCollisions(enemyMedium);
  this.checkCollisions(enemyFast);
  this.handleInput();
  this.speed = this.x * dt;
  this.speed = this.y * dt;
  this.youWin();
};

//renders updated player
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//function for input arrows keys
Player.prototype.handleInput = function(key) {
  switch(key){
    case 'left':
      this.x -= 100;
    break;
    case 'up':
      this.y -= 82;
      break;
    case 'right':
      this.x += 100;
      break;
    case 'down':
      this.y += 82;
      break;
  }
};

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
});
