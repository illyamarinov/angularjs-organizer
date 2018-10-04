app.service('dashboardService', ['$http', 'CONSTANTS', function($http, CONSTANTS) {
  return {
    getDashboards: function() {
      return $http.get(CONSTANTS.API_URL + 'dashboards');
    },

    getDashboardbyId: function(id) {
      return $http.get(CONSTANTS.API_URL + 'dashboards/' + id);
    },

    createDashboard: function(data) {
      return $http.post(CONSTANTS.API_URL + 'dashboards', data);
    },

    deleteDashboard: function(id) {
      return $http.delete(CONSTANTS.API_URL + 'dashboards/' + id);
    }
  }
}]);
