  Template.lyrics.onRendered(function() {

    $()

  });

  Template.lyrics.helpers({
    counter: function () {
      return 2;
    }
  });

  Template.lyrics.events({
    'click button': function () {
      // increment the counter when button is clicked
      // Session.set('counter', Session.get('counter') + 1);
    }
  });