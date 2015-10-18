var watson = require('watson-developer-cloud');
var fs = require('fs');

var ibmCredentials = JSON.parse(fs.readFileSync('../secrets/ibmCredentials.json'));

var speech_to_text = watson.speech_to_text({
  username: ibmCredentials.username,
  password: ibmCredentials.password,
  version: 'v1'
});

var createStory = function(ibmJson) {
  var story = {};
  story.title = 'TITLE';
  story.author = 'AUTHOR';
  story.grade = 4;
  story.cover = 'COVER IMAGE ID';
  story.sentences = [];

  senteces = story.sentences;

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
    senteces.push(sentence);
  })
  return story;
}

var start = function(filename) {
  var params = {
    // From file
    // audio: fs.createReadStream('./audio5.wav'),
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
    }
    else{
      var story = createStory(res);
      console.log(JSON.stringify(story, null, 2));
    }
  })
};

start('./audio6.wav');
