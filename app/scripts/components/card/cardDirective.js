app.directive('card', function() {
  return {
    scope: {
      content: '='
    },
    restrict: 'E',
    templateUrl: 'scripts/components/card/card.html',
    controller: 'cardController',
    controllerAs: 'cc'
  }
});
