app.directive('list', function() {
  return {
    scope: {
      list: '=',
      cardsCount: '=',
      deleteList: '='
    },
    restrict: 'E',
    templateUrl: 'scripts/components/list/list.html',
    controller: 'listController',
    controllerAs: 'lc'
  }
});
