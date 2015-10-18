
## Design

## Collections

What we want as the stories to be stored as:

```
[
  {
    title: "my title",
    author: "my author",
    grade: 4,
    cover: "COVER IMAGE ID",
    sentences: [
      { 
        recording: 'audio id',
        sentence: "hello world",
        words: [
          { id: "WORD ID", word: "hello", "start": 1, "stop": 1.9 },
          { id: "WORD ID", word: "world", "start": 2.5, "stop": 3.1 }
        ]
      }
    ]
  }
]

audio clips:

```
[
  {
    id: "AUDIO[SENTENCE,WORD] ID",
    audio_blob: "AUDIO BLOB"
  }
]
```

/stories/:storyid/sentences/:sentence_id/words/:word_id
/audio/:id

Ricky

* step 1: record story text (sentence by sentence)
* step 2: post story text to story collection
* step 3: record audio for a sentence on client
* step 4: post audio per sentence to audio clips collection

Hanyon

* step 4.5: retrieve audio sentence
* step 5: post to sentence segmenter (outputs start, stop of words)
* step 5.5: map to known sentences (validate matching)
* step 6: segment the audio into words

Yifei 

* replay story (back and forth)