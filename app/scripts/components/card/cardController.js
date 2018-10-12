app.controller('cardController', cardController);

cardController.$inject = ['$scope', 'cardService'];

function cardController($scope, cardService) {

  this.editCard = function(card) {
    this.isEditing = true;
    this.editingCard = angular.copy(card);
  }

  this.closeEditEsc = function(event) {
    if (event.keyCode === 27) {
      this.editingCard = null;
      this.isEditing = false;
    }
  }

  this.closeEdit = function() {
    this.editingCard = null;
    this.isEditing = false;
  }

  this.updateCard = function(card) {
    const data = { title: card.title, description: card.description };
    cardService
      .updateCard(card._id, data)
      .then(function() {
        $scope.$parent.$parent.getCards();
      });
    this.editingCard = null;
    this.isEditing = false;
  }
};
