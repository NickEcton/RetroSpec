var context;
window.addEventListener('load', init, false);
function init() {

// Fix up for prefixing
window.AudioContext = window.AudioContext||window.webkitAudioContext;
context = new AudioContext();
bufferLoader = new BufferLoader(
    context,
    [
        '../sounds/hyper-reality/br-jam-loop.wav',
        '../sounds/hyper-reality/laughter.wav',
    ],
    finishedLoading
    );

    bufferLoader.load();
}
    
function finishedLoading(bufferList) {
    // Create two sources and play them both together.
    var source1 = context.createBufferSource();
    var source2 = context.createBufferSource();
    source1.buffer = bufferList[0];
    source2.buffer = bufferList[1];

    source1.connect(context.destination);
    source2.connect(context.destination);
    source1.start(0);
    source2.start(0);
}


let canvas = document.querySelector('canvas')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d')

//squares 
c.fillStyle= "blue"
c.fillRect(100, 400, 200, 250)
c.fillStyle= "red"
c.fillRect(800, 100, 300, 100)
c.fillStyle= "green"
c.fillRect(100, 200, 100, 100)

//lines
// c.beginPath();
// c.strokeStyle = 'pink'
// c.moveTo(100, 100);
// c.lineTo(300,300);
// c.lineTo(600,300)
// c.stroke();

// //arc / cirlce

// c.beginPath();
// c.arc(500,500,50,0,Math.PI * 2, false);
// c.strokeStyle="purple";
// c.stroke();
var mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', function(e) {
    mouse.x = event.x;
    mouse.y = event.y
})

var colors = ['red', 'pink', 'yellow', 'purple', 'blue', 'green']

function Square(x, y, w, h, dx, dy, color) {

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dx = dx;
    this.dy = dy;
    this.color = color;

    this.draw = () => {
        c.fillStyle= this.color
        c.fillRect(this.x, this.y, this.w, this.h)
    }

    this.update = () => {
        if (this.x > innerWidth || this.x < 0 ) {
            this.dx = -this.dx;
        }
        if (this.y > innerHeight || this.y < 0) {
            this.dy = -this.dy
        }

        this.y += this.dy 
        this.x += this.dx
        
        if (mouse.x - this.x < 100 && mouse.x - this.x > -100 && mouse.y - this.y < 100 && mouse.y - this.y > -100) {
            if (this.w === 25) {
                this.w += 100;
                this.h += 100;
            }
        } else if (this.w > 100) {
            this.w -= 100;
            this.h -= 100;
        }


        this.draw()
    }
}

var squareArray = [] 

for (var i = 0; i < 100; i++) {
    var x = Math.random() * innerWidth;
    var y = Math.random()* innerHeight;
    var dx = (Math.random() - 0.5) * 10;
    var dy = (Math.random() - 0.5) * 10;
    squareArray.push( new Square(x, y, 25, 25, dx, dy, colors[Math.floor(Math.random() * colors.length)]))
}

function animate() {
    requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight)

    for (var j = 0; j < squareArray.length; j++) {
        squareArray[j].update()
    }

}

animate()