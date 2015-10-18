audio = new UniRecorder({
        name: 'audio',
        targetFileFormat: 'wav'
});

audio.allow({
        // download & play
        download: function() { return true; },
        update: function(){ return true; },
        insert: function (){ return true; }
});


Stories = new Meteor.Collection('stories');