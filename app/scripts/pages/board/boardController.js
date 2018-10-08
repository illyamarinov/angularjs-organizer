app.controller('boardController', boardController);

boardController.$inject = ['$scope', '$routeParams', 'dashboardService', 'listService'];

function boardController($scope, $routeParams, dashboardService, listService) {
  const boardId = $routeParams.boardId;
  $scope.lists = [];
  $scope.title = '';

  dashboardService.getDashboardbyId(boardId).then(
    function(response) {
      $scope.board = response.data;
    },
    function(response) {
      $scope.boards = response.statusText;
    }
  );

  $scope.getLists = function() {
    listService.getLists(boardId).then(
      function(response) {
        $scope.lists = response.data;
      },
      function(response) {
        $scope.lists = response.statusText;
      }
    );
  };

  this.addList = function() {
    if ($scope.title === '') {
      $scope.title = `Dashboard 1 List ${$scope.lists.length + 1}`;
    }
    const data = { title: $scope.title, _dashboardId: boardId };
    listService
      .createList(data)
      .then(function() {
        $scope.getLists();
      });
    $scope.title = '';
  };

  this.deleteList = function(listId) {
    listService
      .deleteList(listId)
      .then(function() {
        $scope.getLists();
      });
  };

  this.addCard = function(index) {
    $scope.lists[index].items.push({ content: '' });
  };

  $scope.init = function() {
    $scope.getLists();
  }

  $scope.init();

};
