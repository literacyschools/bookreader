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

Template.editaudio.helpers = function() {

}

Template.editaudio.events = function() {
  'click #stop':  function () {
      audio.stopRecording();
      btnStopRecording.disabled = true;
      btnStartRecording.disabled = false;
  },

  'click #start':  function () {
    console.log("start recording");
    btnStopRecording.disabled = false;
    btnStartRecording.disabled = true;
    audio.startRecording({}, function(err, id) {
      console.log('audio id ' + id  + ' for story ' + this._id + ' sentence ' + sentence);
      this.recording = id;
    });
  };

  'click #play':  function () {
    console.log("start playback");
    var audioDoc = audio.findOne();
    audioDoc.play();
  };

  'click #stopplay':  function () {
    console.log("stop playback");
    var audioDoc = audio.findOne();
    audioDoc.stop();
  };

  btnStartRecording.disabled = false;
  btnStopRecording.disabled = true;
  btnPlayRecording.disabled = false;
}
