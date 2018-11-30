// Color Gradient
var colour = [
    [62,35,230],
    [60,230,60],
    [210,35,98],
    [45,175,230],
    [210,0,230],
    [210,128,0]
];
  var step = 0;
  //color table indices for: 
  // current color left
  // next color left
  // current color right
  // next color right
  var colorIndices = [0,1,2,3];
  
  //transition speed
  var gradientSpeed = 0.001;
  
  function updateGradient()
  {
    

    
  var c0_0 = colour[colorIndices[0]];
  var c0_1 = colour[colorIndices[1]];
  var c1_0 = colour[colorIndices[2]];
  var c1_1 = colour[colorIndices[3]];
  
  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var color1 = "rgb("+r1+","+g1+","+b1+")";

  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var color2 = "rgb("+r2+","+g2+","+b2+")";
  
   document.querySelector('canvas').style.background = "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"

    step += gradientSpeed;
    if ( step >= 1 )
    {
      step %= 1;
      colorIndices[0] = colorIndices[1];
      colorIndices[2] = colorIndices[3];
      
      //pick two new target color indices
      //do not pick the same as the current one
      colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colour.length - 1))) % colour.length;
      colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colour.length - 1))) % colour.length;
      
    }
  }
  
  setInterval(updateGradient,10);


////////////////////////////////////////////////


var context;
var bufferLoader;
var analyzer;
var splash = document.querySelector('#splash')
var canvas = document.querySelector('canvas');
var c = canvas.getContext("2d");

window.addEventListener('load', init, false); 
function init() {


window.AudioContext = window.AudioContext||window.webkitAudioContext;
context = new AudioContext();

analyser = context.createAnalyser();
analyser2 = context.createAnalyser();


analyser.maxDecibels = 0
analyser2.maxDecibels = -50


analyser.fftSize = 256;
analyser2.fftSize = 2048
var bufferLength = analyser.frequencyBinCount;
var bufferLength2 = analyser2.frequencyBinCount;

var dataArray = new Uint8Array(bufferLength);
var dataArray2 = new Uint8Array(bufferLength2);

var body =document.querySelector('body')

canvas.width = body.offsetWidth
canvas.height = body.offsetHeight
splash.width = body.offsetWidth
splash.height = body.offsetHeight


function draw() {
c.clearRect(0, 0, canvas.width, canvas.height)
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);
  analyser2.getByteTimeDomainData(dataArray2);
 
  
  c.lineWidth = 1;

  c.beginPath();

  var x = 0;


    //creates circles//

  for (var j = 0; j < squareArray.length; j++) {
      
        squareArray[j].update()
    }
    
    // ------ // 
    lilCircleRadius = dataArray[3] / 10
    
    if (dataArray[3] > 165 && squareArray.length < 150) {  
        
        squareArray.push(new Square(Math.random() * canvas.width, Math.random() * canvas.height, lilCircleRadius, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, colors[Math.floor(Math.random() * colors.length)]));    
    } 
    if (dataArray[3] > 155) {
        gradientSpeed = 0.005
      }

      if (dataArray[3] > 165) {
        gradientSpeed = 0.010
      }

    if (dataArray[3] <= 165) {
        squareArray.pop();
    }
    

    // Creates middle Circle // 
    
    circleRadius = dataArray[10] / 2
    circleRadius1 = dataArray[3] / 2
    // circleRadius2 = dataArray[5] / 2
    c.beginPath()
    c.strokeStyle = `rgb(${rand()},${rand()}, 0)`;
    c.arc(canvas.width / 2, canvas.height / 2, circleRadius,0,Math.PI * 2, false);
    c.stroke();
    c.closePath()
    c.beginPath();
    c.strokeStyle = `rgb(${rand()},${rand()}, 0)`;
    c.arc(canvas.width / 2, canvas.height / 2, circleRadius1,0,Math.PI * 2, false);
    c.stroke();
    c.closePath()
    // c.beginPath()
    // c.strokeStyle = `rgb(${rand()},${rand()}, 0)`;
    // c.arc(canvas.width / 2, canvas.height / 2, circleRadius2,0,Math.PI * 2, false);
    // c.closePath()
    // c.stroke();

    // -------- // 

    
    // Creates line //
    c.beginPath()
    c.strokeStyle = `rgb(${rand()},0,${rand()})`;
    


var sliceWidth = canvas.width * 1.0 / bufferLength2;
c.lineWidth = 2.5;

  for ( i = 0; i < bufferLength2; i++) {
    var v = dataArray2[i] / 128.0;
    var y = v * canvas.height / 2;

    
    if (i === 0) {
      c.moveTo(x, y);
    } else {
      c.lineTo(x, y);
    }

    x += sliceWidth;
  }
 
  

  c.lineTo(canvas.width, ((canvas.height / 2)));
  
  c.stroke();
  c.closePath();
    // ------ // 
}

draw();

}
 
function rand() {
    return Math.floor(Math.random() * 200)
}

// Button Functionality //

document.querySelector('#back').addEventListener('click', (e) => {
    audio.pause();
    audio.currentTime = 0;
    document.querySelector('canvas').style.display = "none"
    document.querySelector('#splash').style.display = "block"
    
})

document.querySelector('#playNpause').addEventListener('click', (e) => {
     if (audio.paused) {
        audio.play()    
     } else {
         audio.pause()
     }
})
/////////////////////


// DROP AND DRAG FUNCTIONALITY //
var dropzone = document.querySelector('.dropzone')
var counter = 0
dropzone.addEventListener("dragenter", function( event ) {
    event.preventDefault();
      
    dropzone.style.color = "purple";

    counter +=1 
}, false);

dropzone.addEventListener("dragleave", function( event ) {
  event.preventDefault();
  counter -=1
    if (counter === 0) {
        dropzone.style.color = "";
    }

}, false);

document.addEventListener("dragover", function( event ) {
    event.preventDefault();
});

dropzone.addEventListener("drop", function( event ) {

    event.preventDefault();
    if (event.dataTransfer.files[0].type == "audio/mp3") {

        dt = event.dataTransfer
        files = dt.files

        
        document.querySelector('audio').src = event.dataTransfer.files[0].name
        document.querySelector('audio').play();
        document.querySelector('canvas').style.display = "block"
        document.querySelector('#splash').style.display = "none"
    } else {
        alert('Please Drop a .mp3 File')      
    }
    dropzone.style.color=""
    
  
}, false);


////////////////////////////////////////////



// add onclick to front page //


var audio = document.querySelector('audio');

context = new AudioContext();


window.addEventListener('load', function(e) {
  
  var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  source.connect(analyser2);
  analyser.connect(context.destination);

  document.querySelector('#demo').addEventListener('click', ()=> {
    document.querySelector('canvas').style.display = "block"
    document.querySelector('#splash').style.display = "none"           
    audio.play();
})

}, false);

var colors = ['red', 'pink', 'yellow', 'purple', 'blue', 'green']

function Square(x, y, radius, dx, dy, color) {

    this.x = x;
    this.y = y;
    this.radius = radius
    this.dx = dx;
    this.dy = dy;
    this.color = color;

    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.color
        c.stroke();
        
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

        this.draw()
    }
}

var squareArray = [] 




