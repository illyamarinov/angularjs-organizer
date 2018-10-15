app.directive('list', function() {
  return {
    scope: {
      list: '=',
      cardsCount: '=',
      openModal: '=',
      deleteList: '=',
      filter: '='
    },
    restrict: 'E',
    templateUrl: 'scripts/components/list/list.html',
    controller: 'listController',
    controllerAs: 'lc'
  }
});
