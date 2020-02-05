//* Define Canvas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

//* Size Canvas to Screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//* Functions
function random(min, max) {
    // num = random decimal * domain + shift to left or right
    num = Math.random() * (max - min) + min;
    return num;
}

function randomInt(min, max) {
    num = Math.floor(Math.random() * (max - min + 1) + min);
    return num;
}

//* Event Listeners
// Screen Resize
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    generate();
})

var mouse = {x: canvas.width/2, y: canvas.height/2}

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
})

canvas.addEventListener('click', function() {
    spawnAtMouse();
})

//* Constants
var ballCount = 125;
var radius = 30;
var g = 0.7;
var maxSpeed = 20;
var bounceFriction = 0.85;
var rollFriction = 0.98;

var colorArray = [
    '#2185C5',
    '#7ECEFD',
    '#FFF6E5',
    '#FF7F66'
]

//* Ball Object
function Ball(x, y, dx, dy, g, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.g = g;
    this.radius = radius;
    this.color = color;

    // Update Ball's motion and position
    this.update = function() {
        
        // Reverse velocity when each ball contacts the walls of the canvas
        if ( this.x + this.radius + this.dx >= canvas.width || this.x - this.radius + this.dx <= 0 ) {
            
            this.dx = -this.dx * bounceFriction;
        }
        if ( this.y + this.radius + this.dy >= canvas.height || this.y - this.radius + this.dy <= 0 ) {

            this.dy = -this.dy * bounceFriction;
            this.dx = this.dx * rollFriction;
            
            // Prevent the speed from infinitely trying to approach zero to reduce CPU strain
            if (this.dy > -0.25 && this.dy < 0.25) {
                this.dy = 0;
                this.y = canvas.height - this.radius;
            }
            if (this.dx > -0.05 && this.dx < 0.05) {
                this.dx = 0;
            }
        }

        // Don't accelerate when reversing direction b/c it will cause ball to be stuck
        else {
            // Accelerate downward
            this.dy += this.g;
        }

        // Velocity
        this.x += this.dx;
        this.y += this.dy;

        // Draw the ball after variables have changed
        this.draw();
    }

    // Draw ball
    this.draw = function() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.strokeStyle='black';
        context.stroke();
        context.fillStyle = this.color;
        context.fill();
        
    }
}

var ballArray = [];

function generate() {
    ballArray = [];
    // Ball(x, y, dy, a, radius, color)
    for (let i = 0; i < ballCount; i++) {
        let x = random(radius, canvas.width - radius);
        let y = randomInt(radius, canvas.height - radius);
        let dx = random(-maxSpeed, maxSpeed);
        let dy = random(-maxSpeed, maxSpeed);
        let color = colorArray[randomInt(0, colorArray.length)];
        
        ballArray.push( new Ball(x, y, dx, dy, g, radius, color) );
        
    }

}

function spawnAtMouse() {
    ballArray = [];
    // Ball(x, y, dy, a, radius, color)
    var x = mouse.x;
    var y = mouse.y;

    // Prevent balls from getting spawned into the walls
    if (mouse.x < radius) {
        x = radius + 1;
    }
    if (mouse.x > canvas.width - radius) {
        x = canvas.width - radius - 1;
    }
    if (mouse.y < radius) {
        y = radius + 1;
    }
    if (mouse.y > canvas.height - radius) {
        y = canvas.height - radius - 1;
    }

    // Spawn balls into array
    for (let i = 0; i < ballCount; i++) {
        var dx = random(-maxSpeed, maxSpeed);
        var dy = random(-maxSpeed, maxSpeed);
        var color = colorArray[randomInt(0, colorArray.length)];
        
        ballArray.push( new Ball(x, y, dx, dy, g, radius, color) );
        
    }
}

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < ballArray.length; i++) {

        ballArray[i].update();
        
    }

}

generate();
animate();