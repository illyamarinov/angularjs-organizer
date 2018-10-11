app.service('cardService', ['$http', 'CONSTANTS', function($http, CONSTANTS) {
  return {
    getCards: function(listId) {
      return $http.get(CONSTANTS.API_URL + 'lists/' + listId + '/cards');
    },

    createCard: function(data) {      
      return $http.post(CONSTANTS.API_URL + 'cards', data);
    },

    deleteCard: function(cardId) {
      return $http.delete(CONSTANTS.API_URL + 'cards/' + cardId);
    }
  }
}]);
