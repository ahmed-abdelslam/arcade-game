// Enemies our player must avoid
class Enemy {
    constructor(x, y, speed) {
      // The image/sprite for our enemies, to load images
      this.sprite = 'images/enemy-bug.png';

      // X position
      this.x = x;

      /* Store X position in a variable called initialX
       * to reset the x position later when the enemy cross the screen
       */
      this.initialX = x;

      // Y position
      this.y = y;

      /* Location of player
       * to check collision
       */
      this.locationOfPlayer;

      // Speed of the enemy
      this.speed = speed;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // Multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x = this.x + (this.speed * dt) ;

        // When enemies cross the screen, reset them to the initial location
        if (this.x  >= 500) {
          this.x = this.initialX;
        }

        // Get the current location of player
        this.locationOfPlayer = player.getLocation();
        // Check if an enemy has collided with player or not
        if (this.x >= (this.locationOfPlayer[0] - 80) && this.x <= (this.locationOfPlayer[0] + 50) && this.y >= (this.locationOfPlayer[1] - 20) && this.y <= (this.locationOfPlayer[1] + 20)) {
          // Reset player to initial location
          player.reset();
          // Remove one heart
          if (numOfHearts !== 0) {
            hearts[numOfHearts - 1].remove(hearts);
          }
          // Remove one star
          if (scores !== 0) {
            stars[scores - 1].remove(stars);
          }
        }

    };

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
}

class Player {
    constructor() {
      // The image/sprite for our player, to load images
      this.sprite = 'images/char-boy.png';

      // X position
      this.x = 200;

      // Y position
      this.y = 380;

      // Location of player
      this.location;
    }

    /* Move the player
     * show 'won or game over' modal
     */
    update(value, direction) {
        /* Check that the value is not undefined
         * because if there is no movement the value will be undefined and will cause errors
         */
        if (value !== undefined) {
          // Move in x-axis
          if (direction == 'x') {
            /* To ensure the player will not move outside the canvas (x-axis)
             * player can move in x-axis just between 400 and 0
             */
            if ((this.x + value) <= 400 && (this.x + value) >= 0) {
              // Move right or left according to the 'value'
              this.x = this.x + value;
            }
            // Do not move or cross the screen
            else {
              this.x = this.x;
            }
          }
          // Move in y-axis
          else {
            /* To ensure the player will not move outside the canvas (y-axis)
             * player can move in y-axis just between 380 and -20
             */
            if ((this.y + value) >= -20 && (this.y + value) <= 380) {
              // Move up or down according to the 'value'
              this.y = this.y + value;

              // Reset the player to the initial location if player has reached the sea
              if (this.y == -20) {
                this.reset();
                // Create a new star "new object"
                scores++;
                xOfStar = 25 * scores;
                stars.push(new Object('images/Star.png', xOfStar, 0));
              }
            }
            // Do not move or cross the screen
            else {
              this.y = this.y;
            }
          }
        }

        // Show 'won modal' when user collect 5 stars
        if (scores === 5 && !createModal) {
          won.create();
        }

        // Show 'game over modal' when user lose all hearts
        if (numOfHearts === 0 && !createModal) {
          gameOver.create();
        }
    };

    // Draw the player on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    // Reset the player to the initial location
    reset() {
        // X position
        this.x = 200;

        // Y position
        this.y = 380;
    };

    // Handle input and update player location according to the pressed key
    handleInput(k) {
        if (k == 'right') {
          this.update(100, 'x');
        }
        else if (k == 'left') {
          this.update(-100, 'x');
        }
        else if (k == 'up') {
          this.update(-80, 'y');
        }
        else if (k == 'down') {
          this.update(80, 'y');
        }
    };

    // Get the current location of the player
    getLocation() {
        return this.location = [this.x, this.y];
    };
}

//* Old ES5 Classes Syntax :) *//
// Object class, objects like hearts and stars
let Object = function(sprite, x, y) {
    // The image/sprite for our objects
    this.sprite = sprite;

    // X position
    this.x = x;

    // Y position
    this.y = y;

};

// Draw the object on the screen
Object.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 30, 50.78);
};

// Remove a heart or star
Object.prototype.remove = function(type) {
    if (type === hearts) {
      // Remove first created heart
      type.shift();
      numOfHearts--;
    }
    else {
      // Remove last created star
      type.pop();
      scores--;
    }
};

// Modal calss, to show win or game over screen
let Modal = function(title, image, action) {
    // Title of modal
    this.title = title;

    // Image, like 'award or game over' image
    this.image = image;

    // A text represents an action like 'play again'
    this.action = action;
};

// Build the components of the modal
Modal.prototype.create = function() {
    // Create a container
    const CONTAINER = document.createElement("div");
    CONTAINER.classList.add("container");

    // Create h1 element to represent the title
    const H1 = document.createElement("h1");
    H1.innerText = this.title;

    // Create an img element to load the image
    const IMG = document.createElement("img");
    IMG.setAttribute("src", this.image);

    // Create span element to represent the action
    const SPAN = document.createElement("span");
    SPAN.innerText = this.action;
    SPAN.classList.add("restart");
    // Reload the page when user click on it
    SPAN.addEventListener('click', function() {
      // Reload the current page without the browser cache
         location.reload(true);
    });

    // Insert the container before the canvas element
    const CANVAS = document.querySelector("canvas");
    document.body.insertBefore(CONTAINER, CANVAS);

    // Append these elements into the container
    CONTAINER.appendChild(H1);
    CONTAINER.appendChild(IMG);
    CONTAINER.appendChild(SPAN);

    createModal = true;
};

// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Place all heart objects in an array called hearts
// Place all stars objects in an array called stars
// Place the won modal object in a variable called won
// Place the game over modal object in a variable called gameOver
let allEnemies = [new Enemy(-200, 60, 150), new Enemy(-300, 60, 250), new Enemy(-150, 142, 120), new Enemy(-240, 142, 220), new Enemy(-300, 226, 100), new Enemy(-400, 226, 200)],
    player = new Player(),
    hearts = [new Object('images/Heart.png',390, 0), new Object('images/Heart.png',420, 0), new Object('images/Heart.png',450, 0)],
    stars = [],
    won = new Modal("YOU WON", "images/award.png", "Play Again");
    gameOver = new Modal("GAME OVER", "images/gameover.png", "Play Again");

// Set number of hearts to 3, scores to 0, x position of star to 0 and create a modal to false
let numOfHearts = 3,
    scores = 0,
    xOfStar = 0,
    createModal = false;


// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
