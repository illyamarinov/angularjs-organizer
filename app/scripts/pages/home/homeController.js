app.controller('homeController', function($scope, dashboardService) {

  $scope.getDashboards = dashboardService.getDashboards;
  $scope.createDashboard = dashboardService.createDashboard;
  $scope.deleteDashboard = dashboardService.deleteDashboard;

  $scope.getDashboards = function() {
    dashboardService.getDashboards().then(function success(response) {
      $scope.boards = response.data;
    }, function error(response) {
      $scope.boards = response.statusText;
    });
  };

  $scope.getDashboards();

  this.addBoard = function(data) {
    $scope.createDashboard(data);
    $scope.getDashboards();
  };

  this.deleteDashboard = function(id) {
    $scope.deleteDashboard(id);
    $scope.getDashboards();
  }
});
