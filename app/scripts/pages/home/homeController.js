app.controller('homeController', homeController);

homeController.$inject = ['$scope', 'dashboardService'];

function homeController($scope, dashboardService) {
  $scope.boards = [];

  $scope.getDashboards = function() {
    dashboardService.getDashboards().then(
      function(response) {
        $scope.boards = response.data;
      },
      function(response) {
        $scope.boards = response.statusText;
      }
    );
  };

  this.addBoard = function() {
    var data = { name: 'Dashboard ' + ($scope.boards.length + 1) };
    dashboardService
      .createDashboard(data)
      .then(function() {
        $scope.getDashboards();
      });

  };

  this.deleteDashboard = function(id) {
    dashboardService
      .deleteDashboard(id)
      .then(function() {
        $scope.getDashboards();
      });
  };

  $scope.init = function() {
    $scope.getDashboards();
  };

  $scope.init();

};
