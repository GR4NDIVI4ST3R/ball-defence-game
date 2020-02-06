//* Define Canvas
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

//* Size Canvas to Screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//* Constants
var angle = -30;
var velocity = 5;
var margin = 5;
var mouse = {x: canvas.width/2, y: canvas.height/2}

var ballCount = 125;
var radius = 30;
var g = 0.7;
var maxSpeed = 20;
var bounceFriction = 0.85;
var rollFriction = 0.98;

var cannonRadius = 30;

var colorArray = [
    '#2185C5',
    '#7ECEFD',
    '#FFF6E5',
    '#FF7F66'
]

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
});

// Mouse Position Tracking
canvas.addEventListener('mousemove', event => {
    mouse.x = event.x;
    mouse.y = canvas.height - event.y;

    let cannonY = cannonRadius + margin;
    let angleLimit = -30 * Math.PI / 180;

    // if (angle < angleLimit) {
    //     angle = angleLimit;
    // }
    if ((this.y - barrelSize * Math.sin(this.angle)) > canvas.height) {
        angle = angleLimit;
    }
    else if (mouse.x - cannon.x < 0) {
        angle = Math.PI + Math.atan( (mouse.y - cannonY) / (mouse.x - cannon.x) );
    }
    else {
        angle = Math.atan( (mouse.y - cannonY) / (mouse.x - cannon.x) );
    }
});

// Fire Cannon
canvas.addEventListener('click', function() {
});

// Change Cannon Angle
canvas.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 229) {
      console.log('keypress');
    }
});

//* Cannon Object
function Cannon(velocity) {
    velocity += 10;
    this.velocity = velocity;
    console.log(velocity);
    this.angle = angle * Math.PI / 180;
    this.x = cannonRadius + margin;
    this.y = canvas.height - cannonRadius - margin;
    
    this.drawBarrel = function() {
        
        let barrelSize = cannonRadius * 1.7;
        let x = this.x + barrelSize * Math.cos(this.angle);
        let y = this.y - barrelSize * Math.sin(this.angle);

        // Put x and y text over mouse
        // context.fillText(text,x,y);
        // context.strokeText(text, x, y);

        context.beginPath();
        context.strokeStyle='#555555';
        context.lineWidth = 20;
        context.moveTo(this.x, this.y);
        context.lineTo(x, y);
        context.stroke();
        
    }
    
    this.drawBase = function() {
        // Draw Circle
        context.beginPath();
        context.lineWidth = 1;
        context.arc(this.x, this.y, cannonRadius, 0, 2 * Math.PI, false);
        context.fill();

        // Draw Rectangular Base
        context.beginPath();
        context.lineWidth = cannonRadius * 2;
        context.moveTo(this.x, this.y);
        context.lineTo(this.x, canvas.height);
        context.stroke();
        
    }
    
    this.update = function() {

        this.angle = angle;
        this.drawBarrel();
        this.drawBase();
    }
}

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
        
        // Draw ball
        this.draw = function() {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            context.strokeStyle='black';
            context.stroke();
            context.fillStyle = this.color;
            context.fill();
            
        }

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
}

var ballArray = [];

var cannon = new Cannon(velocity);

function generate() {
    
    cannon = new Cannon(velocity);

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

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    cannon.update();

    // for (let i = 0; i < ballArray.length; i++) {

    //     ballArray[i].update();
        
    // }

}

generate();
animate();