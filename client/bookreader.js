'use strict';

Meteor.subscribe('audio');
Meteor.subscribe('stories');

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

Router.route('/edit/:_id', {
  name: "edit",
  data: function() {
    var currentStory = this.params._id;
    return Stories.findOne(currentStory);
  }
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

Template.edit.helpers({
});

Template.edit.events({
  'keyup [name=storyTitle]': function(event) {
    var storyTitle = $(event.target).val();
    Stories.update({ _id: this._id }, {$set: { title: storyTitle }});
  },
  'keyup [name=storyAuthor]': function(event) {
   var storyAuthor = $(event.target).val();
    Stories.update({ _id: this._id }, {$set: { author: storyAuthor }});
  },
  'keyup [name=storyContent]': function(event) {
    var storyContent = $(event.target).val();
    Stories.update({ _id: this._id }, {$set: { story: storyContent }}); 
    console.log('story updated');
  },
  'keyup [name=storyGrade]': function(event) {
    var storyGrade = $(event.target).val();
    Stories.update({ _id: this._id }, {$set: { grade: Number.parseInt(storyGrade) }}); 
    console.log('story updated');
  },
  'click #import': function () {
    var sentences = this.story.split('\n');
    var sentencesArray = sentences.map(function(sentence) {
      return { sentence: sentence, start: null, end: null, recording: null}
    });
    Stories.update({ _id: this._id }, {$set: { sentences: sentencesArray }}); 
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
