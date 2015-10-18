var startSeechAnalysis = require('./index.js');

var inputSentenceObject = {
  sentence: 'The child crawled into the dense grass'
}

startSeechAnalysis('./audio10.wav', inputSentenceObject, function(err, sentenceObject){
  if(err){
    return console.log(err);
  }
  // console.log(sentenceObject.status.code);
  // console.log(sentenceObject.status.message);
  // console.log(sentenceObject.confidence);
  // console.log(sentenceObject.words);
  // console.log(sentenceObject.sentence);
  // console.log(sentenceObject.recordedSentence);
  console.log(sentenceObject);
})