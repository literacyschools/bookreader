'use strict';

Meteor.subscribe('audio');
Meteor.subscribe('stories');

Router.configure({
  layoutTemplate: 'ApplicationLayout',
  // template: 'edit'
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
      return { sentence: sentence, recording: null}
    });
    Stories.update({ _id: this._id }, {$set: { sentences: sentencesArray }}); 
  }
});

Template.editaudio.helpers({
});

Template.editaudio.rendered = function() {
  //console.log(this.data);
}

Template.editaudio.events({
  'click #start':  function () {
    console.log("start recording");
    var story = this.story;
    var sentence = this.sentence;
    audio.startRecording({}, function(err, id) {
      Meteor.call('updateAudioId', story._id, id, sentence.sentence);
    });
  },

  'click #stop':  function () {
      audio.stopRecording();
  },

  'click #play':  function () {
    console.log("start playback");
    this.audioDoc = audio.findOne(this.sentence.recording);
    this.audioDoc.play();
  },

  'click #words':  function () {
    console.log("convert to words");
    Meteor.call('processWords2', this.sentence.recording, this.story._id, this.sentence);
  }
});
