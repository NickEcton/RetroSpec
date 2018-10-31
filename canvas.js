//Instantiate bufferLoader class

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
var canvas = document.querySelector('canvas');
var c = canvas.getContext("2d");

window.addEventListener('load', init, false);
function init() {


window.AudioContext = window.AudioContext||window.webkitAudioContext;
context = new AudioContext();
bufferLoader = new BufferLoader(
    context,
    [
'https://cf-media.sndcdn.com/TZhxv0XBJcsa.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vVFpoeHYwWEJKY3NhLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1NDA5NDU3MjV9fX1dfQ__&Signature=lTVj2V3idpIQIEDHMd97~LzPilm~6wDhiXM36KpjCcjq0Wd8Ld5ZrhGXqhmx~KO9y-LLw6Js7qabGI0-Z6j43VqtcibsB1UAsA1REWP8Hi6odc-5odDx~ynFqrnjtJ19ZcmJizJNKjtNGUSHHh5uETfSTCBnfOPVbMdh4sTFaAxIebewzcMPFi8p0Rq1S3mZqa-5szYFmGUZw0-cVgUuNuJytiLJxdwcATyk96NEk9NAiN22J6KZYrRALcuzZx0mCCHz-pVTl3FRjvSmMVg0veWRfZO4xlVzrlQb2iY6DEEJf0Cnmyl0DR4gr6JRECLFltSNxhHG8St1ALlliRMFNA__&Key-Pair-Id=APKAJAGZ7VMH2PFPW6UQ'    
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



canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



function draw() {
    
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);
  analyser2.getByteTimeDomainData(dataArray2);

  c.fillStyle = "rgb(0, 0, 0)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  c.lineWidth = 2;

  c.beginPath();

  var x = 0;

  var sliceWidth = canvas.width * 1.0 / bufferLength2;

    //creates circles//

  for (var j = 0; j < squareArray.length; j++) {
      
        squareArray[j].update()
    }
    
    // ------ // 
    lilCircleRadius = dataArray[3] / 10
    
    if (dataArray[3] > 165) {  
        
        squareArray.push(new Square(Math.random() * canvas.width, Math.random() * canvas.height, lilCircleRadius, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, colors[Math.floor(Math.random() * colors.length)]));    
    } 
    console.log(dataArray[3])
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
  
//   c.rotate(5*Math.PI/180)
  c.stroke();
    // ------ // 
}

draw();



}
    
function finishedLoading(bufferList) {
    // Create two sources and play them both together.
    var source1 = context.createBufferSource();
    source1.connect(analyser)
    source1.connect(analyser2)
    // var source2 = context.createBufferSource();
    source1.buffer = bufferList[0];
    // source2.buffer = bufferList[1];
    source1.connect(context.destination);
    // source2.connect(context.destination);
    source1.start(0);
    // source2.start(0);
}





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
        c.fill();
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

function animate() {
    requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight)
        

    for (var j = 0; j < squareArray.length; j++) {
        squareArray[j].update()
    }

}

animate()