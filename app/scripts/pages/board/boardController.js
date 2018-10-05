app.controller('boardController', boardController);

boardController.$inject = ['$scope', '$routeParams', 'dashboardService', 'listService'];

function boardController($scope, $routeParams, dashboardService, listService) {
  const boardId = $routeParams.boardId;

  $scope.boards = [];

  dashboardService.getDashboards().then(
    function(response) {
      $scope.boards = response.data;
      $scope.board = $scope.boards.find(function(item) {
        return item._id === boardId;
      });
    },
    function(response) {
      $scope.boards = response.statusText;
    }
  );

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

};
