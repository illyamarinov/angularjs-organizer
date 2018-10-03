app.controller('boardController', ['$scope', function($scope) {

  $scope.lists = [{
    title: 'Need to do',
    items: [{ content: 'Learn Angular6' }]
  }, {
    title: 'Ready',
    items: [{ content: 'JavaScript' }]
  }, {
    title: 'In process',
    items: [{ content: 'Investigate AngularJS' }]
  }];

  this.addCard = function(index) {
    $scope.lists[index].items.push({ content: '' });
  };

}]);
