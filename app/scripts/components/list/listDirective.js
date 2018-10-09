app.directive('list', function() {
  return {
    scope: {
      list: '=',
      deleteList: '=',
    },
    restrict: 'E',
    templateUrl: 'scripts/components/list/list.html',
    controller: 'listController',
    controllerAs: 'lc'
  }
});
