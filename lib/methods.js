Meteor.methods({
  updateAudioId: function(story_id, audio_id, sentence) {
     console.log('audio id ' + audio_id  + ' for story ' + story_id + ' sentence ' + sentence);
      //sentence.recording = id;
      Stories.update({ _id: story_id,'sentences.sentence': sentence},
        { $set: {'sentences.$.recording': audio_id }});
  }
})
