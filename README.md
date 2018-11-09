# RetroSpec

### Background and Overview 

RetroSpec is an audio visualizer inspired by the old-school and undeniably cool Windows Media Player.
+ The inspiration for this project is dervied from the exciting and powerful visualizations first seen in WMP, but now with an updated and fresh visual appeal utilizing new technologies to bring everyones favorite audio and sounds to life.
+ This project will allow users to upload any media file they wish and watch as the visualizer takes control.

### Funcionality and MVP features
+ Be able to read from a default audio file provided to demo the functionality
+ Create abstract and exciting visualizations in tune with the frequency and tempo of the music
+ Allow for multiple color schemes and visualization switches based on user preference
+ Allow users to upload their own audio files for audio visualization
+ Give the users the ability to make slight audio changes to files including voice modulation or tempo control

## Architecture and Technologies
  ### Web Audio API
  + An HTML5 API used to load, control, and manipulate audio files while interacting with the DOM.
  + This API will handle the bulk of the work when it comes to playing the audio files as well as deriving the visualizations.
  ### JavaScript and HTML5 Canvas
  + JavaScript and Canvas will be used to create the exciting and new visualizations on the html page in real time with the music.
  + These technologies have since grown in popularity after the creation of the Windows Media Player and are incredibly powerful at creating unique and colorful designs. These technologies will showcase how far audio visualization has come since WMP.
  
## Features 

### Splash Page 

This the first page the user sees upon visiting RetroSpec, and as such the site's functionality is described in a short series of sentences. The user is given the option to either drag and drop a song from their own PC into the visualizer or click on the demo to play a preloaded song. There is also a link to the creators GitHub profile in between the selection options.

<img src="https://github.com/NickEcton/RetroSpec/blob/master/RetroSpecSplash.gif" width="100%" height="10%" />

### Visualizer

This page uses the given mp3's frequency and time data to display visually appealing effects. Feel free to check out the demo for yourself!

<img src="https://github.com/NickEcton/RetroSpec/blob/master/RetroSpecPortfolio.gif" width="100%" height="10%" />

## Code 

### Alternating Gradient Background 

Creating the color background in this manner allows me to later maniuplate the gradient transition speed according to the frequency of the music. This creates the visual effect of the background 'speeding up' as the music hits its climax. 

```javascript 
var colour = [
    [62,35,230],
    [60,230,60],
    [210,35,98],
    [45,175,230],
    [210,0,230],
    [210,128,0]
];
  var step = 0;
  var colorIndices = [0,1,2,3];
  var gradientSpeed = 0.001;  
  function updateGradient() {
  
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

      colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colour.length - 1))) % colour.length;
      colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colour.length - 1))) % colour.length;    
    }
  }
  setInterval(updateGradient,10);
```

### Parsing the Audio Data 

Using the Web Audio API, I created two analyzer nodes to track both frequency and time domain data. The frequency tracker was used to create the waveform visual while the time domain tracker was used to create both the center beat and floating circles. *Note the use of 8 bit unit arrays to capture the data returned from the analyzers.

```javascript 
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

/// inside draw animation loop 
analyser.getByteFrequencyData(dataArray);
analyser2.getByteTimeDomainData(dataArray2);
///
```

### Creating the Waveform

Using the frequency data captured through the web audio analyzer node, I was able to iterate through the array of frequency values multiple times a second. This creates the constantly updating waveform visual in the center of the screen that spikes and widens its domain when the song begins to reach its highest frequency differentials.

```javascript 
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
```

### Using the Data to Alter the Visuals 

Here I chose to index into the array at a point I found to be most susceptible to changes in frequency, specifically in relation to vocals. When the frequency reaches a ceratin level I begin to populate my circles array with new instances of my circle class. These circles float around the screen randomly until the frequency drops below a certain threshold, at which point the circles begin to be removed from the array until it is again empty. 

This is also where I alter the background transition speed to create the effect that the visuals are increasing in speed along with the intensity of the music.

```javascript 
lilCircleRadius = dataArray[3] / 10
    
    if (dataArray[3] > 165 && circleArray.length < 150) {  
        
        squareArray.push(new Square(Math.random() * canvas.width, Math.random() * canvas.height, lilCircleRadius, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, colors[Math.floor(Math.random() * colors.length)]));    
    } 
    if (dataArray[3] > 155) {
        gradientSpeed = 0.005
      }

      if (dataArray[3] > 165) {
        gradientSpeed = 0.010
      }

    if (dataArray[3] <= 165) {
        circleArray.pop();
    }
```
