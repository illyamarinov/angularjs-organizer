app.controller('listController', listController);

listController.$inject = ['$scope', 'listService', 'cardService', 'eventBusService'];

function listController($scope, listService, cardService, eventBusService) {
  $scope.cards = [];

  eventBusService.subscribe('updateList', $scope, function(event, data) {
    if ($scope.list._id === data) {
      $scope.getCards();
    }
  });

  $scope.getCards = function() {
    cardService.getCards($scope.list._id).then(
      function(response) {
        $scope.cards = response.data;
      },
      function(response) {
        $scope.cards = response.statusText;
      }
    );
  };

  this.addCard = function() {
    const data = {
       _dashboardId: $scope.list._dashboardId,
       _listId: $scope.list._id,
       title: `${$scope.list.title} Card ${$scope.cards.length + 1}`,
       description: `Card ${$scope.cards.length + 1}`,
    };
    cardService
      .createCard(data)
      .then(function() {
        $scope.getCards();
      });
  }

  this.deleteCard = function(cardId) {
    cardService
      .deleteCard(cardId)
      .then(function() {
        $scope.getCards();
      });
  };

  $scope.init = function() {
    $scope.getCards();
  }

  $scope.init();
};
