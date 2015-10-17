# bookreader

## decrypting secrets/

```
brew install git-crypt
```

you can now unlock file:

```
git-crypt unlock ../git-crypt-ls-keyfile
```



## Using IBM Speech Recognition API 
Upload an audio file and get a json with the transcript with each word's start and end time.

API Documentation:
https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/speech-to-text/quick-curl.shtml

#### With Curl

```
curl -u username:password -X POST \
--limit-rate 40000 \
--header "Content-Type: audio/flac" \
--header "Transfer-Encoding: chunked" \
--data-binary @audio2.flac \
"https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?continuous=false\
&timestamps=true&max_alternatives=1"
```

Example result:

```
{
   "results": [
      {
         "alternatives": [
            {
               "timestamps": [
                  [
                     "several":,
                     1.0,
                     1.51
                  ],

                  [
                     "tornadoes":,
                     1.51,
                     2.15
                  ],

                  [
                     "several":,
                     2.15,
                     2.5
                  ],
                  . . .
               ]
            },
            {
               "confidence": 0.8691191673278809,
               "transcript": "several tornadoes touch down as a line of severe thunderstorms swept
 through colorado on sunday "
            },
            {
               "transcript": "several tornadoes touched down as a line of severe thunderstorms swept
 through colorado on sunday "
            },
            {
               "transcript": "several tornadoes touch down is a line of severe thunderstorms swept
 through colorado on sunday "
            }
         ],
         "final": true
      }
   ],
   "result_index": 0
}
```

#### With Nodejs

```
var watson = require('watson-developer-cloud');
var fs = require('fs');

var speech_to_text = watson.speech_to_text({
  username: 'username',
  password: 'password',
  version: 'v1'
});

var params = {
  // From file
  audio: fs.createReadStream('./audio3.flac'),
  content_type: 'audio/flac; rate=44100',
  timestamps: true,
  max_alternatives: 1,
  // continuous: false,
  // word_confidence: false
};

speech_to_text.recognize(params, function(err, res) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(res, null, 2));
});
```


