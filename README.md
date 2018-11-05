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

<img src="https://github.com/NickEcton/RetroSpec/blob/master/VisualizerDemo.gif" width="100%" height="10%" />
