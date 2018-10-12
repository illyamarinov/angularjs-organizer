app.controller('cardController', cardController);

cardController.$inject = ['$scope', 'cardService', 'eventBusService'];

function cardController($scope, cardService, eventBusService) {

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
        eventBusService.publish('updateList', card._listId);
      });
    this.editingCard = null;
    this.isEditing = false;
  }
};
