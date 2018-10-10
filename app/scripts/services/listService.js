app.service('listService', ['$http', 'CONSTANTS', function($http, CONSTANTS) {
  return {
    getLists: function(boardId) {
      return $http.get(CONSTANTS.API_URL + 'dashboards/' + boardId + '/lists');
    },

    createList: function(data) {
      return $http.post(CONSTANTS.API_URL + 'lists', data);
    },

    deleteList: function(listId) {
      return $http.delete(CONSTANTS.API_URL + 'lists/' + listId);
    }
  }
}]);
