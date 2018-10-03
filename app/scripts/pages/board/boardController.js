app.controller('boardController', function($scope) {
  this.addCard = function(index) {
    debugger;
    this.lists[index].items.push({
      content: ''
    })
  };
  $scope.lists = [
    {
      title: 'Need to do',
      items: [{
        content: 'Learn Angular6'
      }]
    },
    {
      title: 'Ready',
      items: [{
        content: 'JavaScript'
      }]
    },
    {
      title: 'In process',
      items: [{
        content: 'Investigate AngularJS'
      }]
    }
  ];

});
