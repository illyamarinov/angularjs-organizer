app.controller('boardController', boardController);

boardController.$inject = ['$scope', '$routeParams', 'dashboardService', 'listService', 'modalService'];

function boardController($scope, $routeParams, dashboardService, listService, modalService) {
  const boardId = $routeParams.boardId;
  $scope.lists = [];
  $scope.title = '';
  $scope.search = {
    listTitle: '',
    cardTitle: ''
  };

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
      $scope.title = `${$scope.board.name} List ${$scope.lists.length + 1}`;
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

  this.openModal = function(modalId, list) {
    modalService.Open(modalId);
    $scope.list = list;
  };

  this.closeModal = function(modalId) {
    listService.updateList($scope.list._id, { title: $scope.list.title });
    modalService.Close(modalId);
  };

  $scope.init = function() {
    $scope.getLists();
  }

  $scope.init();

};
