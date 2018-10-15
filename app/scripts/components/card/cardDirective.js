app.directive('card', function() {
  return {
    scope: {
      card: '='
    },
    restrict: 'E',
    templateUrl: 'scripts/components/card/card.html',
    controller: 'cardController',
    controllerAs: 'cc'
  }
});
