'use strict';

Meteor.subscribe('audio');

Router.configure({
  layoutTemplate: 'ApplicationLayout',
  template: 'edit'
})

Router.route('/', function () {
  this.render('catalog');
});

Router.route('/catalog', function () {
  this.render('catalog');
});

Router.route('/edit/:story', function () {
  this.render('edit');
});

Router.route('/play/:story', function () {
  this.render('play');
});

Template.catalog.helpers({
  counter: function () {
    return Session.get('counter');
  },
  stories: function() {
    return Stories.find();
  }
});

Template.catalog.events({
  'click button': function () {
    var story = Stories.insert({title: 'My Title', author: 'Ricky'})
    Router.go('/edit/' + story);
  }
});

Template.editaudio.rendered = function() {
  var btnStopRecording = document.getElementById("stop");
  btnStopRecording.onclick = function () {
      audio.stopRecording();
      console.log("stop recording");
      btnStopRecording.disabled = true;
      btnStartRecording.disabled = false;
  };

  var btnStartRecording = document.getElementById("start");
  btnStartRecording.onclick = function () {
    console.log("start recording");
    btnStopRecording.disabled = false;
    btnStartRecording.disabled = true;
    audio.startRecording();
  };

  var btnPlayRecording = document.getElementById("play");
  btnPlayRecording.onclick = function () {
    console.log("start recording");
    var audioDoc = audio.findOne();
    audioDoc.play();
    var btnStopPlaying = document.getElementById("stopplay");

  };

  var btnStopPlaying = document.getElementById("stopplay");
  btnStopPlaying.onclick = function () {
    console.log("start recording");
    var audioDoc = audio.findOne();
    audioDoc.play();
  };


  btnStartRecording.disabled = false;
  btnStopRecording.disabled = true;
  btnPlayRecording.disabled = false;
}
