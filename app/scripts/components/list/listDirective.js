app.directive('list', function() {
  return {
    scope: {
      cards: '=',
      title: '=',
      addCard: '&',
      key: '@'
    },
    restrict: 'E',
    templateUrl: 'scripts/components/list/list.html',
    controller: 'listController',
    controllerAs: 'lc'
  }
});
