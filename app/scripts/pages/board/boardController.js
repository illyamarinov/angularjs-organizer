app.controller('boardController', function() {
  this.cards = [
    {
      title: 'Need to do',
      list: [{
        content: 'Learn Angular6'
      }],
      button: 'Add a card'
    },
    {
      title: 'Ready',
      list: [{
        content: 'JavaScript'
      }],
      button: 'Add a card'
    },
    {
      title: 'In process',
      list: [{
        content: 'Investigate AngularJS'
      }],
      button: 'Add a card'
    }
  ];

});
