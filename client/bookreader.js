'use strict';

// counter starts at 0

Router.configure({
  layoutTemplate: 'ApplicationLayout',
  template: 'record'
})
Router.route('/catalog', function () {
  this.render('catalog');
});

Router.route('/record', function () {
  this.render('record');
});

Router.route('/play/:story', function () {
  this.render('play');
});

Session.setDefault('counter', 0);

Template.catalog.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.catalog.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  }
});

Template.record.rendered = function() {
  if (!hasGetUserMedia()) {
    alert('getUserMedia() is not supported in your browser');
  } 

  console.log('calling getUserMedia');
  // Firefox is buggy without the permission dialog and will fail regularly
  // we delay getUserMedia a tiny bit to make this more reliable

  var constraints = window.constraints = {
    audio: true,
    video: true
  };

  setTimeout(function() {
    navigator.getUserMedia(constraints, successCallback, errorCallback); 
  }, 1000);
}

function successCallback(localMediaStream) {  
  var video = document.getElementById("preview");
  var replay = document.getElementById("replay");
  video.src = window.URL.createObjectURL(localMediaStream);
  video.play();

  var mediaRecorder = new MediaStreamRecorder(localMediaStream);
  mediaRecorder.mimeType = 'video/webm';
  var blobs = [];
  var timeline = document.getElementById("timeline");
  var calls = 0;

  function createReplayOnClick(blobsIndex) {
      return function() {
        console.log('clicked: ' + blobs[blobsIndex]);
        replay.src = blobs[blobsIndex];
        var events = ['stalled', 'ended', 'waiting', 'pause', 'suspend', 'error', 'abort', 'play', 'playing']
        events.map(function(eventName) {
          console.log('adding listener for ' + eventName)
          replay.addEventListener(eventName, function() {
            console.log('replay ' + eventName);
          });
          replay.addEventListener('ended', function() {
            console.log('getting next video slice');
            var timeline = document.getElementById("timeline");
            timeline.childNodes[blobsIndex+1].click();
          });
        })
        replay.play();
      };
  }

  mediaRecorder.ondataavailable = function (blob) {
      var blobURL = URL.createObjectURL(blob);
      blobs.push(blobURL);
      var createEntry = document.createElement('div');
      createEntry.setAttribute('class', 'entry');
      var createTitle = document.createElement('h1');
      createTitle.onclick = createReplayOnClick(calls);
      var createTText = document.createTextNode('' + calls);
      createTitle.appendChild(createTText)
      createEntry.appendChild(createTitle);
      timeline.appendChild(createEntry);
      calls++;

  };

  var btnStopRecording = document.getElementById("stop");
  btnStopRecording.onclick = function () {
      mediaRecorder.stop();
      console.log("stop recording");
      btnStopRecording.disabled = true;
      btnStartRecording.disabled = false;
  };

  var btnStartRecording = document.getElementById("start");
  btnStartRecording.onclick = function () {
    console.log("start recording");
    btnStopRecording.disabled = false;
    btnStartRecording.disabled = true;
    mediaRecorder.start(3000);
  };

  btnStopRecording.disabled = true;
  btnStartRecording.disabled = false;

  btnStartRecording.onclick();
}

function errorCallback(error){  
  console.log("navigator.getUserMedia error: ", error);
}

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}


Meteor.startup(function () {
});