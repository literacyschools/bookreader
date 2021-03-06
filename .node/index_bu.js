var watson = require('watson-developer-cloud');
var fs = require('fs');

var ibmCredentials = JSON.parse(fs.readFileSync('../secrets/ibmCredentials.json'));

var speech_to_text = watson.speech_to_text({
  username: ibmCredentials.username,
  password: ibmCredentials.password,
  version: 'v1'
});

var createStory = function(ibmJson, originalSentences, callback) {
  var story = {};
  story.title = 'TITLE';
  story.author = 'AUTHOR';
  story.grade = 4;
  story.cover = 'COVER IMAGE ID';
  story.sentences = [];

  var sentences = story.sentences;

  ibmJson.results.forEach(function(ibmSentence){
    var sentence = {};
    sentence.id = 'SENTENCE ID';
    sentence.sentence = ibmSentence.alternatives[0].transcript;
    sentence.words = [];

    ibmSentence.alternatives[0].timestamps.forEach(function(ibmWord){
      var word = {};
      word.id = 'WORD ID';
      word.word = ibmWord[0];
      word.start = ibmWord[1];
      word.end = ibmWord[2];
      sentence.words.push(word);
    })
    sentences.push(sentence);
  })

  // check sentence with original sentences
  if(sentences.length != originalSentences.length){
    // var error = {
    //   "status": "error",
    //   "message": "number of senteces do not match"
    // }
    // return callback(error);
    return callback(null, story);
  }

  sentences.forEach(function(sentence, i){
    var originalSentence = originalSentences[i];
    var originalWords = originalSentence.split(' ');
    if(sentence.length == originalWords.length){
      sentence.sentence = originalSentence;
      sentence.forEach(function(word, j){
        word.word = originalWords[j];
      })
    }
  })
  return callback(null, story);
}

var start = function(filename, 
                     originalSentences,
                     callback) {
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
      var story = createStory(res, 
                              convertTextToJson(originalSentences), 
                              callback);
      return story;
      // console.log(JSON.stringify(story, null, 2));
    }
  })
};

var convertTextToJson = function(originalTxt){
  // console.log(originalTxt)
  var originalTextJson = {};
  originalTextJson.originalSentences = originalTxt.split('.\n');
  return originalTextJson;
}

var originalSentences = fs.readFileSync('./audio8.original.txt', 'utf8');
// start('./audio8.wav', originalSentences, function(err, story){
//   if(err){
//     return console.log(err);
//   }
//   return console.log(JSON.stringify(story, null, 2));
// });

module.exports = start;