var watson = Meteor.npmRequire('watson-developer-cloud');
var fs = Meteor.npmRequire('fs');
var path = Meteor.npmRequire('path');

//var watson = new Watson();

Meteor.publish('audio', function() {
  return audio.find(); 
});

var relativePath = "../../../../../secrets/ibmCredentials.json"
var pathToCredentials = path.join(__meteor_bootstrap__.serverDir, relativePath);
var ibmCredentials = JSON.parse(fs.readFileSync(pathToCredentials));

var speech_to_text = watson.speech_to_text({
  username: ibmCredentials.username,
  password: ibmCredentials.password,
  version: 'v1'
});

var processSentence = function(ibmJson, originalSentenceObject, callback) {

  var originalSentence = originalSentenceObject.sentence;
  var ibmSentence = ibmJson.results[0].alternatives[0];
  var originalWords = originalSentence.split(' ');

  originalSentenceObject.words = convertIbmTimestamps(ibmSentence.timestamps)
  originalSentenceObject.confidence = ibmSentence.confidence;
  originalSentenceObject.recordedSentence = ibmSentence.transcript;

  if(ibmJson.results.length != 1){
    originalSentenceObject.status = {
      code: 100,
      message: 'sentence count is more than one'
    };
    return callback(null, originalSentenceObject);
  }

  if(originalSentenceObject.words.length != originalWords.length){
    originalSentenceObject.status = {
      code: 101,
      message: 'word count do not match'
    };
    return callback(null, originalSentenceObject);;
  }

  if(originalSentenceObject.confidence < 0.6){
    originalSentenceObject.status = {
      code: 102,
      message: 'confidence below 0.6'
    };
    return callback(null, originalSentenceObject);;
  }

  correctWords(originalSentenceObject.words, originalWords);
  originalSentenceObject.status = {
    code: 0,
    message: 'words autocorrection applied'
  };
  return callback(null, originalSentenceObject);;
}

var convertIbmTimestamps = function(ibmTimestamps){
  var words = [];
  ibmTimestamps.forEach(function(timestamp, i){
    var word = {};
    word.word = timestamp[0];
    word.start = timestamp[1];
    word.end = timestamp[2];
    words.push(word);
  })
  return words;
}

var correctWords = function(recordedWords, originalWords){
  recordedWords.forEach(function(recordedWord, i){
    recordedWord.word = originalWords[i];
  })
}

var start = function(filename, 
                     originalSentenceObject,
                     callback) {

  if(!originalSentenceObject || !originalSentenceObject.sentence){
    callback({
      code: 9,
      message: 'invalid input'
    })
    return;
  }

  var params = {
    // From file
    audio: fs.createReadStream(filename),
    content_type: 'audio/wav; rate=44100',
    timestamps: true,
    max_alternatives: 1,
    continuous: true,  // if set to false, it will get only the first sentence
    // word_confidence: false
  };
  speech_to_text.recognize(params, function(err, res) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    else{
      var story = processSentence(res, 
                                   originalSentenceObject, 
                                   callback);
      return story;
    }
  })
};

var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');

Meteor.methods({
  processWords: function(audio_id, story_id, sentence) {
    console.log('processWords called');
    var relativePath = "../../../../local/uniRecorder/audio/" + audio_id + '.wav'
    // var fiber = Fiber.current;
    // var fence = Meteor._CurrentWriteFence.get()
    //   , handle = fence && fence.beginWrite();

    start(relativePath, sentence, function(err, sentence) {
      console.log('response received');

      Stories.update({ _id: story_id,'sentences.sentence': sentence.sentence},
        { $set: {'sentences.$.recording': audio_id }});     
      // handle && handle.committed();
      // fiber.run(res); 
    });

    // return Fiber.yield();

  },
  processWords2: function(audio_id, story_id, sentence) {
    console.log('processWords2 called');
    var relativePath = "../../../../local/uniRecorder/audio/" + audio_id + '.wav'
    var fut = new Future();
    var bound_callback = Meteor.bindEnvironment(function (err, sentence) {
      if(err) {
        console.log('error ' + err);
        fut.throw(err);
      }  else {
        console.log('update');
        Stories.update({ _id: story_id,'sentences.sentence': sentence.sentence},
          { $set: {'sentences.$.words':  sentence.words}});     
        fut.return(sentence);
      }
    });

    start(relativePath, sentence, bound_callback);

    fut.wait();


    // return Fiber.yield();

  }
})