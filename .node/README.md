
```
npm install
```

### Usage

```javascript
var startSentenceSegmentation = require('./index.js');

var inputSentenceObject = {
  sentence: 'Original Text In String'
}

startSentenceSegmentation(pathToAudioFile, inputSentenceObject, function(err, sentenceObject){
  if(err){
    return console.log(err);
  }
  // do something with sentenceObject
  console.log(sentenceObject.status.code);
  console.log(sentenceObject.status.message);
  console.log(sentenceObject.confidence);
  console.log(sentenceObject.words);
  console.log(sentenceObject.sentence);
})
```

Or check the example.js




Return status codes:
```
code: 100,
message: 'sentence count is more than one'

code: 101,
message: 'word count do not match'

code: 102,
message: 'confidence below 0.6'

code: 0,
message: 'words autocorrection applied'

code: 9,
message: 'invalid input'
```

