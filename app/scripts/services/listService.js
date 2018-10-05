app.service('listService', ['$http', 'CONSTANTS', function($http, CONSTANTS) {
  return {
    getLists: function(boardId) {
      return $http.get(CONSTANTS.API_URL + 'dashboards/' + boardId + '/lists');
    },

    createList: function(data) {
      return $http.post(CONSTANTS.API_URL + 'dashboards/' + id + '/lists', data);
    },

    deleteList: function(boardId, listId) {
      return $http.delete(CONSTANTS.API_URL + 'dashboards/' + boardId + '/lists/' + listId);
    }
  }
}]);
