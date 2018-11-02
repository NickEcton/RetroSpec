//Instantiate bufferLoader class
var colour = [
    [62,35,255],
    [60,255,60],
    [255,35,98],
    [45,175,230],
    [255,0,255],
    [255,128,0]
];
  var step = 0;
  //color table indices for: 
  // current color left
  // next color left
  // current color right
  // next color right
  var colorIndices = [0,1,2,3];
  
  //transition speed
  var gradientSpeed = 0.002;
  
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



function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
  }
  
  BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
  
    var loader = this;
  
    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }
  
    request.onerror = function() {
      alert('BufferLoader: XHR error');
    }
  
    request.send();
  }
  
  BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
  }
  
//End of BufferLoader


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
bufferLoader = new BufferLoader(
    context,
    [
'https://cf-media.sndcdn.com/FZLX3fivFdu1.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vRlpMWDNmaXZGZHUxLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1NDExNDA0Nzl9fX1dfQ__&Signature=r0oBaukVpT2pQrHK~37V9tOfIIW7PLvOI33usTwdqFQXj6jDRTVeo4ls0L6aiQS0ypfzDnbtv94vmAtA9tKX8chXr3w69HmQ1ovEUGHG6EERpno1oF9EWwKBbuyUnYa7ZLmdERIQt0ukIeo5n7oLTrs6XAsO9OQD9iGQQUPmOAychkrW0HDifvfGy1CL3kR4SXKrLiwNeK3iqgv3HZ9kaeoMqMJYhCpIFlTNRZMhkR~ftYdo99nCuFXS8APfnTpSscB8OidUes2nRKOa9UPg~2N83ho2Hx5KXfMtbLZcpROupkSasAxiU1KFWYrjg9CIDp6Mcce8sAuUVx8rlyFUAA__&Key-Pair-Id=APKAJAGZ7VMH2PFPW6UQ'
    ],
    finishedLoading
    );


bufferLoader.load();

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


function finishedLoading(bufferList) {
    var source1 = context.createBufferSource();
    source1.connect(analyser)
    source1.connect(analyser2)
    source1.buffer = bufferList[0];
    source1.connect(context.destination);
    document.querySelector('#demo').addEventListener('click', ()=> {
        document.querySelector('canvas').style.display = "block"
        document.querySelector('#splash').style.display = "none"
        source1.playbackRate = 5.0
        source1.start(0);
    })
}



canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
splash.width = window.innerWidth;
splash.height = window.innerHeight;


function draw() {
c.clearRect(0, 0, innerWidth, innerHeight)
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);
  analyser2.getByteTimeDomainData(dataArray2);
 
  
  c.lineWidth = 2;

  c.beginPath();

  var x = 0;


    //creates circles//

  for (var j = 0; j < squareArray.length; j++) {
      
        squareArray[j].update()
    }
    
    // ------ // 
    lilCircleRadius = dataArray[3] / 10
    
    if (dataArray[3] > 165 && squareArray.length < 200) {  
        
        squareArray.push(new Square(Math.random() * canvas.width, Math.random() * canvas.height, lilCircleRadius, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, colors[Math.floor(Math.random() * colors.length)]));    
    } 
    
    if (dataArray[3] <= 165) {
        squareArray.pop();
    }

    // Creates middle Circle // 

    circleRadius = dataArray[3] / 2
    c.strokeStyle = "rgb(255,105,180)";
    c.beginPath()
    c.arc(canvas.width / 2, canvas.height / 2, circleRadius,0,Math.PI * 2, false);
    c.stroke();
    
    // -------- // 

    
    // Creates line //
var sliceWidth = canvas.width * 1.0 / bufferLength2;

  for ( i = 0; i < bufferLength2; i++) {
    var v = dataArray2[i] / 128.0;
    var y = v * canvas.height / 2;

    if (i === 0) {
      c.moveTo(x, y);
    } else if (i < bufferLength2 / 2) {
      c.lineTo(x, y);
    } else if (i > bufferLength2 / 2) {
      c.lineTo(x, y)
    }

    x += sliceWidth;
  }
 
  c.strokeStyle = "rgb(124,252,0)";

  c.lineTo(canvas.width, ((canvas.height / 2)));
  
  c.stroke();
    // ------ // 
}

draw();



}
    

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
        dropzone.style.color=""
    }
    
  
}, false);


////////////////////////////////////////////



// add onclick to front page 


var audio = document.querySelector('audio');

context = new AudioContext();

// Wait for window.onload to fire. See crbug.com/112368
window.addEventListener('load', function(e) {
  // Our <audio> element will be the audio source.
  var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  source.connect(analyser2);
  analyser.connect(context.destination);

  // ...call requestAnimationFrame() and render the analyser's output to canvas.
}, false);


// //squares 
// c.fillStyle= "blue"
// c.fillRect(100, 400, 200, 250)
// c.fillStyle= "red"
// c.fillRect(800, 100, 300, 100)
// c.fillStyle= "green"
// c.fillRect(100, 200, 100, 100)

// //lines
// // c.beginPath();
// // c.strokeStyle = 'pink'
// // c.moveTo(100, 100);
// // c.lineTo(300,300);
// // c.lineTo(600,300)
// // c.stroke();

// // //arc / cirlce

// // c.beginPath();
// // c.arc(500,500,50,0,Math.PI * 2, false);
// // c.strokeStyle="purple";
// // c.stroke();



var mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', function(e) {
    mouse.x = event.x;
    mouse.y = event.y
})

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

for (var i = 0; i < 0; i++) {
    var x = Math.random() * innerWidth;
    var y = Math.random()* innerHeight;
    var dx = (Math.random() - 0.5) * 10;
    var dy = (Math.random() - 0.5) * 10;
    squareArray.push( new Square(x, y, 25, dx, dy, colors[Math.floor(Math.random() * colors.length)]))
}



