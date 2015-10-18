
```
npm install watson-developer-cloud
```

```javascript
var startSentenceSegmentation = require('./index.js');
startSentenceSegmentation(pathToAudioFile, 'Original Text In String', function(err, story){
  if(err){
    return console.log(err);
  }
  //do something with story
})
```