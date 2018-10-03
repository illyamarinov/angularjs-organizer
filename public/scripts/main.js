const app = angular.module('AngularJS-Trello', ['ngAnimate', 'ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', '$provide', '$httpProvider', '$qProvider', 'CONSTANTS', 'EVENTS', function ($routeProvider, $locationProvider, $provide, $httpProvider, $qProvider, CONSTANTS, EVENTS) {

    // disable error on unhandled rejections
    //$qProvider.errorOnUnhandledRejections(false);

    $routeProvider.when('/', {
        templateUrl: 'scripts/pages/home/home.html'
    }).when('/board', {
        templateUrl: 'scripts/pages/board/board.html',
        controller: 'boardController',
        controllerAs: 'bc'
    }).when('/404', {
        templateUrl: 'scripts/pages/404/404.html'
    }).otherwise({
        redirectTo: '/404'
    });

    $locationProvider.html5Mode(false).hashPrefix('');

    // $provide.decorator('$locale', function ($delegate) {
    //   var value = $delegate.DATETIME_FORMATS;
    //
    //   value.SHORTDAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    //
    //   return $delegate;
    // });

    $httpProvider.interceptors.push(function ($q, eventBusService, EVENTS) {
        return {
            'request': function (config) {
                // eventBusService.publish(EVENTS.loaderShow);
                return config;
            },
            'response': function (response) {
                // eventBusService.publish(EVENTS.loaderHide);
                return response;
            },
            'responseError': function (rejection) {
                // eventBusService.publish(EVENTS.loaderHide);
                return $q.reject(rejection);
            }
        };
    });

    $httpProvider.defaults.transformResponse.push(function (data) {
        return data;
    });
}]);
'use strict';

app.controller('rootController', ['$scope', '$rootScope', '$q', '$location', 'eventBusService', 'CONSTANTS', 'EVENTS', function ($scope, $rootScope, $q, $location, eventBusService, CONSTANTS, EVENTS) {

    $scope.init = function () {};

    $scope.init();
}]);
var constants = {
    API_URL: "api/",
    PATH: "app/scripts/"

    // userRoles: {
    //     all: '*',
    //     admin: 'admin',
    //     editor: 'editor',
    //     guest: 'guest'
    // }
};

app.constant('CONSTANTS', constants);
'use strict';

var events = {

    // route
    routeChangeStart: '$routeChangeStart',

    // loaded
    loaderShow: 'loader.show',
    loaderHide: 'loader.hide'
};

app.constant('EVENTS', events);
'use strict';

app.factory('utils', [function () {
    return {
        findByField: function (array, value, field) {
            field = field || 'Id';
            if (array) {
                return array.filter(function (item) {
                    return item[field] === value;
                })[0];
            } else {
                return null;
            }
        },
        findAllByField: function (array, field, value) {
            field = field || 'Id';
            if (array) {
                return array.filter(function (item) {
                    return item[field] === value;
                });
            } else {
                return null;
            }
        },
        makeFlat: function (object) {
            var newObject = {};
            if (!object) return {};

            Object.keys(object).map(function (key) {
                if (!angular.isObject(object[key]) || angular.isDate(object[key])) {
                    newObject[key] = object[key];
                } else {
                    newObject[key + "Id"] = object[key].Id;
                }
            });
            return newObject;
        }
    };
}]);
app.controller('cardController', function () {});
app.directive('card', function () {
  return {
    scope: {
      content: '='
    },
    restrict: 'E',
    templateUrl: 'scripts/components/card/card.html',
    controller: 'cardController',
    controllerAs: 'cc'
  };
});
app.controller('listController', function () {});
app.directive('list', function () {
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
  };
});
app.controller('boardController', function ($scope) {
  this.addCard = function (index) {
    debugger;
    this.lists[index].items.push({
      content: ''
    });
  };
  $scope.lists = [{
    title: 'Need to do',
    items: [{
      content: 'Learn Angular6'
    }]
  }, {
    title: 'Ready',
    items: [{
      content: 'JavaScript'
    }]
  }, {
    title: 'In process',
    items: [{
      content: 'Investigate AngularJS'
    }]
  }];
});
'use strict';

app.directive("contenteditable", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function () {
                scope.$apply(read);
            });
        }
    };
});
'use strict';

app.factory('eventBusService', function ($rootScope) {

    var msgBus = {};

    msgBus.publish = function (msg, data) {
        data = data || {};
        $rootScope.$broadcast(msg, data);
    };

    msgBus.subscribe = function (msg, scope, func) {
        return scope.$on(msg, func); // return for destroying listener
    };

    return msgBus;
});
"use strict";

app.filter('currencyNumberFilter', ['$locale', function ($locale) {

    return function (amount, divider) {
        if (angular.isUndefined(divider)) {
            divider = ' ';
        }

        if (amount === null) {
            return amount;
        }

        if (amount) {
            var parts = amount.toFixed(2).toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, divider);

            return parts.join('.');
        } else {
            return '0.00';
        }
    };
}]);
'use strict';

/**
 * Example of use:
 * <input type="email" name="email2" ng-model="emailReg2" custom-validator="emailMatch" data-validate-function="checkEmailMatch(value)">
 * <span ng-show="registerForm.email2.$error.emailMatch">Emails have to match!</span>
 *
 * In controller:
 * $scope.checkEmailMatch=function(value) {
 *    return value===$scope.emailReg;
 * }
 */

app.directive('customValidator', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            validateFunction: '&'
        },
        link: function (scope, elm, attr, ngModelCtrl) {
            ngModelCtrl.$parsers.push(function (value) {
                var result = scope.validateFunction({ 'value': value });
                if (result || result === false) {
                    if (result.then) {
                        result.then(function (data) {
                            // For promise type result object
                            ngModelCtrl.$setValidity(attr.customValidator, data);
                        }, function (error) {
                            ngModelCtrl.$setValidity(attr.customValidator, false);
                        });
                    } else {
                        ngModelCtrl.$setValidity(attr.customValidator, result);
                        return result ? value : undefined; // For boolean result return based on boolean value
                    }
                }
                return value;
            });
        }
    };
}]);
'use strict';

app.directive('noDirty', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			// override the $setDirty method on ngModelController
			ngModelCtrl.$setDirty = angular.noop;
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvb3RDb250cm9sbGVyLmpzIiwic2hhcmVkL2NvbnN0YW50cy5qcyIsInNoYXJlZC9ldmVudHMuanMiLCJzaGFyZWQvdXRpbHMuanMiLCJjb21wb25lbnRzL2NhcmQvY2FyZENvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2NhcmQvY2FyZERpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvbGlzdC9saXN0Q29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvbGlzdC9saXN0RGlyZWN0aXZlLmpzIiwicGFnZXMvYm9hcmQvYm9hcmRDb250cm9sbGVyLmpzIiwic2hhcmVkL2RpcmVjdGl2ZXMvY29udGVudGVkaXRhYmxlLmpzIiwic2hhcmVkL2V2ZW50QnVzL2V2ZW50QnVzU2VydmljZS5qcyIsInNoYXJlZC9maWx0ZXJzL2N1cnJlbmN5TnVtYmVyRmlsdGVyLmpzIiwic2hhcmVkL3ZhbGlkYXRpb24vY3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlLmpzIiwic2hhcmVkL3ZhbGlkYXRpb24vbm9EaXJ0eS5qcyJdLCJuYW1lcyI6WyJhcHAiLCJhbmd1bGFyIiwibW9kdWxlIiwiY29uZmlnIiwiJHJvdXRlUHJvdmlkZXIiLCIkbG9jYXRpb25Qcm92aWRlciIsIiRwcm92aWRlIiwiJGh0dHBQcm92aWRlciIsIiRxUHJvdmlkZXIiLCJDT05TVEFOVFMiLCJFVkVOVFMiLCJ3aGVuIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwiY29udHJvbGxlckFzIiwib3RoZXJ3aXNlIiwicmVkaXJlY3RUbyIsImh0bWw1TW9kZSIsImhhc2hQcmVmaXgiLCJpbnRlcmNlcHRvcnMiLCJwdXNoIiwiJHEiLCJldmVudEJ1c1NlcnZpY2UiLCJyZXNwb25zZSIsInJlamVjdGlvbiIsInJlamVjdCIsImRlZmF1bHRzIiwidHJhbnNmb3JtUmVzcG9uc2UiLCJkYXRhIiwiJHNjb3BlIiwiJHJvb3RTY29wZSIsIiRsb2NhdGlvbiIsImluaXQiLCJjb25zdGFudHMiLCJBUElfVVJMIiwiUEFUSCIsImNvbnN0YW50IiwiZXZlbnRzIiwicm91dGVDaGFuZ2VTdGFydCIsImxvYWRlclNob3ciLCJsb2FkZXJIaWRlIiwiZmFjdG9yeSIsImZpbmRCeUZpZWxkIiwiYXJyYXkiLCJ2YWx1ZSIsImZpZWxkIiwiZmlsdGVyIiwiaXRlbSIsImZpbmRBbGxCeUZpZWxkIiwibWFrZUZsYXQiLCJvYmplY3QiLCJuZXdPYmplY3QiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwia2V5IiwiaXNPYmplY3QiLCJpc0RhdGUiLCJJZCIsImRpcmVjdGl2ZSIsInNjb3BlIiwiY29udGVudCIsInJlc3RyaWN0IiwiY2FyZHMiLCJ0aXRsZSIsImFkZENhcmQiLCJpbmRleCIsImxpc3RzIiwiaXRlbXMiLCJyZXF1aXJlIiwibGluayIsImVsZW1lbnQiLCJhdHRycyIsIm5nTW9kZWwiLCJyZWFkIiwiJHNldFZpZXdWYWx1ZSIsImh0bWwiLCIkcmVuZGVyIiwiJHZpZXdWYWx1ZSIsImJpbmQiLCIkYXBwbHkiLCJtc2dCdXMiLCJwdWJsaXNoIiwibXNnIiwiJGJyb2FkY2FzdCIsInN1YnNjcmliZSIsImZ1bmMiLCIkb24iLCIkbG9jYWxlIiwiYW1vdW50IiwiZGl2aWRlciIsImlzVW5kZWZpbmVkIiwicGFydHMiLCJ0b0ZpeGVkIiwidG9TdHJpbmciLCJzcGxpdCIsInJlcGxhY2UiLCJqb2luIiwidmFsaWRhdGVGdW5jdGlvbiIsImVsbSIsImF0dHIiLCJuZ01vZGVsQ3RybCIsIiRwYXJzZXJzIiwicmVzdWx0IiwidGhlbiIsIiRzZXRWYWxpZGl0eSIsImN1c3RvbVZhbGlkYXRvciIsImVycm9yIiwidW5kZWZpbmVkIiwiJHNldERpcnR5Iiwibm9vcCJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsTUFBTUMsUUFBUUMsTUFBUixDQUFlLGtCQUFmLEVBQW1DLENBQUMsV0FBRCxFQUFjLFNBQWQsRUFBeUIsWUFBekIsQ0FBbkMsQ0FBWjs7QUFFQUYsSUFBSUcsTUFBSixDQUFXLENBQ1AsZ0JBRE8sRUFDVyxtQkFEWCxFQUNnQyxVQURoQyxFQUM0QyxlQUQ1QyxFQUM2RCxZQUQ3RCxFQUMyRSxXQUQzRSxFQUN3RixRQUR4RixFQUVQLFVBQVVDLGNBQVYsRUFBMEJDLGlCQUExQixFQUE2Q0MsUUFBN0MsRUFBdURDLGFBQXZELEVBQXNFQyxVQUF0RSxFQUFrRkMsU0FBbEYsRUFBNkZDLE1BQTdGLEVBQXFHOztBQUVqRztBQUNBOztBQUVBTixtQkFDS08sSUFETCxDQUNVLEdBRFYsRUFDZTtBQUNQQyxxQkFBYTtBQUROLEtBRGYsRUFJS0QsSUFKTCxDQUlVLFFBSlYsRUFJb0I7QUFDWkMscUJBQWEsZ0NBREQ7QUFFWkMsb0JBQVksaUJBRkE7QUFHWkMsc0JBQWM7QUFIRixLQUpwQixFQVNLSCxJQVRMLENBU1UsTUFUVixFQVNrQjtBQUNWQyxxQkFBYTtBQURILEtBVGxCLEVBWUtHLFNBWkwsQ0FZZTtBQUNQQyxvQkFBWTtBQURMLEtBWmY7O0FBZ0JBWCxzQkFBa0JZLFNBQWxCLENBQTRCLEtBQTVCLEVBQW1DQyxVQUFuQyxDQUE4QyxFQUE5Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQVgsa0JBQWNZLFlBQWQsQ0FBMkJDLElBQTNCLENBQWdDLFVBQVVDLEVBQVYsRUFBY0MsZUFBZCxFQUErQlosTUFBL0IsRUFBdUM7QUFDbkUsZUFBTztBQUNILHVCQUFXLFVBQVVQLE1BQVYsRUFBa0I7QUFDekI7QUFDQSx1QkFBT0EsTUFBUDtBQUNILGFBSkU7QUFLSCx3QkFBWSxVQUFVb0IsUUFBVixFQUFvQjtBQUM1QjtBQUNBLHVCQUFPQSxRQUFQO0FBQ0gsYUFSRTtBQVNILDZCQUFpQixVQUFVQyxTQUFWLEVBQXFCO0FBQ2xDO0FBQ0EsdUJBQU9ILEdBQUdJLE1BQUgsQ0FBVUQsU0FBVixDQUFQO0FBQ0g7QUFaRSxTQUFQO0FBY0gsS0FmRDs7QUFpQkFqQixrQkFBY21CLFFBQWQsQ0FBdUJDLGlCQUF2QixDQUF5Q1AsSUFBekMsQ0FBOEMsVUFBVVEsSUFBVixFQUFnQjtBQUMxRCxlQUFPQSxJQUFQO0FBQ0gsS0FGRDtBQUdILENBckRNLENBQVg7QUNGQTs7QUFFQTVCLElBQUlhLFVBQUosQ0FBZSxnQkFBZixFQUFpQyxDQUFDLFFBQUQsRUFBVyxZQUFYLEVBQXlCLElBQXpCLEVBQStCLFdBQS9CLEVBQTRDLGlCQUE1QyxFQUErRCxXQUEvRCxFQUE0RSxRQUE1RSxFQUM3QixVQUFVZ0IsTUFBVixFQUFrQkMsVUFBbEIsRUFBOEJULEVBQTlCLEVBQWtDVSxTQUFsQyxFQUE2Q1QsZUFBN0MsRUFBOERiLFNBQTlELEVBQXlFQyxNQUF6RSxFQUFpRjs7QUFFN0VtQixXQUFPRyxJQUFQLEdBQWMsWUFBWSxDQUFFLENBQTVCOztBQUVBSCxXQUFPRyxJQUFQO0FBRUgsQ0FQNEIsQ0FBakM7QUNGQSxJQUFJQyxZQUFZO0FBQ1pDLGFBQVMsTUFERztBQUVaQyxVQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRZLENBQWhCOztBQVlBbkMsSUFBSW9DLFFBQUosQ0FBYSxXQUFiLEVBQTBCSCxTQUExQjtBQ1pBOztBQUVBLElBQUlJLFNBQVM7O0FBRVQ7QUFDQUMsc0JBQWtCLG1CQUhUOztBQUtUO0FBQ0FDLGdCQUFZLGFBTkg7QUFPVEMsZ0JBQVk7QUFQSCxDQUFiOztBQVVBeEMsSUFBSW9DLFFBQUosQ0FBYSxRQUFiLEVBQXVCQyxNQUF2QjtBQ1pBOztBQUVBckMsSUFBSXlDLE9BQUosQ0FBWSxPQUFaLEVBQXFCLENBQUMsWUFBVztBQUM3QixXQUFPO0FBQ0hDLHFCQUFhLFVBQVVDLEtBQVYsRUFBaUJDLEtBQWpCLEVBQXdCQyxLQUF4QixFQUErQjtBQUN4Q0Esb0JBQVFBLFNBQVMsSUFBakI7QUFDQSxnQkFBSUYsS0FBSixFQUFXO0FBQ1AsdUJBQU9BLE1BQU1HLE1BQU4sQ0FBYSxVQUFTQyxJQUFULEVBQWU7QUFDL0IsMkJBQU9BLEtBQUtGLEtBQUwsTUFBZ0JELEtBQXZCO0FBQ0gsaUJBRk0sRUFFSixDQUZJLENBQVA7QUFHSCxhQUpELE1BSU87QUFDSCx1QkFBTyxJQUFQO0FBQ0g7QUFDSixTQVZFO0FBV05JLHdCQUFnQixVQUFVTCxLQUFWLEVBQWlCRSxLQUFqQixFQUF3QkQsS0FBeEIsRUFBK0I7QUFDeENDLG9CQUFRQSxTQUFTLElBQWpCO0FBQ0EsZ0JBQUlGLEtBQUosRUFBVztBQUNQLHVCQUFPQSxNQUFNRyxNQUFOLENBQWEsVUFBU0MsSUFBVCxFQUFlO0FBQy9CLDJCQUFPQSxLQUFLRixLQUFMLE1BQWdCRCxLQUF2QjtBQUNILGlCQUZNLENBQVA7QUFHSCxhQUpELE1BSU87QUFDSCx1QkFBTyxJQUFQO0FBQ0g7QUFDSixTQXBCRTtBQXFCSEssa0JBQVUsVUFBVUMsTUFBVixFQUFrQjtBQUN4QixnQkFBSUMsWUFBWSxFQUFoQjtBQUNILGdCQUFJLENBQUNELE1BQUwsRUFBYSxPQUFPLEVBQVA7O0FBRVZFLG1CQUFPQyxJQUFQLENBQVlILE1BQVosRUFBb0JJLEdBQXBCLENBQXdCLFVBQVNDLEdBQVQsRUFBYztBQUNsQyxvQkFBSSxDQUFDdEQsUUFBUXVELFFBQVIsQ0FBaUJOLE9BQU9LLEdBQVAsQ0FBakIsQ0FBRCxJQUFrQ3RELFFBQVF3RCxNQUFSLENBQWVQLE9BQU9LLEdBQVAsQ0FBZixDQUF0QyxFQUFtRTtBQUMvREosOEJBQVVJLEdBQVYsSUFBaUJMLE9BQU9LLEdBQVAsQ0FBakI7QUFDSCxpQkFGRCxNQUVPO0FBQ0hKLDhCQUFVSSxNQUFNLElBQWhCLElBQXdCTCxPQUFPSyxHQUFQLEVBQVlHLEVBQXBDO0FBQ0g7QUFDSixhQU5EO0FBT0EsbUJBQU9QLFNBQVA7QUFDSDtBQWpDRSxLQUFQO0FBbUNILENBcENvQixDQUFyQjtBQ0ZBbkQsSUFBSWEsVUFBSixDQUFlLGdCQUFmLEVBQWlDLFlBQVcsQ0FFM0MsQ0FGRDtBQ0FBYixJQUFJMkQsU0FBSixDQUFjLE1BQWQsRUFBc0IsWUFBVztBQUMvQixTQUFPO0FBQ0xDLFdBQU87QUFDTEMsZUFBUztBQURKLEtBREY7QUFJTEMsY0FBVSxHQUpMO0FBS0xsRCxpQkFBYSxtQ0FMUjtBQU1MQyxnQkFBWSxnQkFOUDtBQU9MQyxrQkFBYztBQVBULEdBQVA7QUFTRCxDQVZEO0FDQUFkLElBQUlhLFVBQUosQ0FBZSxnQkFBZixFQUFpQyxZQUFXLENBRTNDLENBRkQ7QUNBQWIsSUFBSTJELFNBQUosQ0FBYyxNQUFkLEVBQXNCLFlBQVc7QUFDL0IsU0FBTztBQUNMQyxXQUFPO0FBQ0xHLGFBQU8sR0FERjtBQUVMQyxhQUFPLEdBRkY7QUFHTEMsZUFBUyxHQUhKO0FBSUxWLFdBQUs7QUFKQSxLQURGO0FBT0xPLGNBQVUsR0FQTDtBQVFMbEQsaUJBQWEsbUNBUlI7QUFTTEMsZ0JBQVksZ0JBVFA7QUFVTEMsa0JBQWM7QUFWVCxHQUFQO0FBWUQsQ0FiRDtBQ0FBZCxJQUFJYSxVQUFKLENBQWUsaUJBQWYsRUFBa0MsVUFBU2dCLE1BQVQsRUFBaUI7QUFDakQsT0FBS29DLE9BQUwsR0FBZSxVQUFTQyxLQUFULEVBQWdCO0FBQzdCO0FBQ0EsU0FBS0MsS0FBTCxDQUFXRCxLQUFYLEVBQWtCRSxLQUFsQixDQUF3QmhELElBQXhCLENBQTZCO0FBQzNCeUMsZUFBUztBQURrQixLQUE3QjtBQUdELEdBTEQ7QUFNQWhDLFNBQU9zQyxLQUFQLEdBQWUsQ0FDYjtBQUNFSCxXQUFPLFlBRFQ7QUFFRUksV0FBTyxDQUFDO0FBQ05QLGVBQVM7QUFESCxLQUFEO0FBRlQsR0FEYSxFQU9iO0FBQ0VHLFdBQU8sT0FEVDtBQUVFSSxXQUFPLENBQUM7QUFDTlAsZUFBUztBQURILEtBQUQ7QUFGVCxHQVBhLEVBYWI7QUFDRUcsV0FBTyxZQURUO0FBRUVJLFdBQU8sQ0FBQztBQUNOUCxlQUFTO0FBREgsS0FBRDtBQUZULEdBYmEsQ0FBZjtBQXFCRCxDQTVCRDtBQ0FBOztBQUVBN0QsSUFBSTJELFNBQUosQ0FBYyxpQkFBZCxFQUFpQyxZQUFXO0FBQ3hDLFdBQU87QUFDSEcsa0JBQVUsR0FEUDtBQUVITyxpQkFBUyxTQUZOO0FBR0hDLGNBQU0sVUFBU1YsS0FBVCxFQUFnQlcsT0FBaEIsRUFBeUJDLEtBQXpCLEVBQWdDQyxPQUFoQyxFQUF5Qzs7QUFFM0MscUJBQVNDLElBQVQsR0FBZ0I7QUFDWkQsd0JBQVFFLGFBQVIsQ0FBc0JKLFFBQVFLLElBQVIsRUFBdEI7QUFDSDs7QUFFREgsb0JBQVFJLE9BQVIsR0FBa0IsWUFBVztBQUN6Qk4sd0JBQVFLLElBQVIsQ0FBYUgsUUFBUUssVUFBUixJQUFzQixFQUFuQztBQUNILGFBRkQ7O0FBSUFQLG9CQUFRUSxJQUFSLENBQWEsbUJBQWIsRUFBa0MsWUFBVztBQUN6Q25CLHNCQUFNb0IsTUFBTixDQUFhTixJQUFiO0FBQ0gsYUFGRDtBQUdIO0FBaEJFLEtBQVA7QUFrQkgsQ0FuQkQ7QUNGQTs7QUFFQTFFLElBQUl5QyxPQUFKLENBQVksaUJBQVosRUFBK0IsVUFBVVgsVUFBVixFQUFzQjs7QUFFbEQsUUFBSW1ELFNBQVMsRUFBYjs7QUFFQUEsV0FBT0MsT0FBUCxHQUFpQixVQUFTQyxHQUFULEVBQWN2RCxJQUFkLEVBQW9CO0FBQ2pDQSxlQUFPQSxRQUFRLEVBQWY7QUFDQUUsbUJBQVdzRCxVQUFYLENBQXNCRCxHQUF0QixFQUEyQnZELElBQTNCO0FBQ0gsS0FIRDs7QUFLQXFELFdBQU9JLFNBQVAsR0FBbUIsVUFBU0YsR0FBVCxFQUFjdkIsS0FBZCxFQUFxQjBCLElBQXJCLEVBQTJCO0FBQzFDLGVBQU8xQixNQUFNMkIsR0FBTixDQUFVSixHQUFWLEVBQWVHLElBQWYsQ0FBUCxDQUQwQyxDQUNiO0FBQ2hDLEtBRkQ7O0FBSUEsV0FBT0wsTUFBUDtBQUVGLENBZkQ7QUNGQTs7QUFFQWpGLElBQUk4QyxNQUFKLENBQVcsc0JBQVgsRUFBbUMsQ0FBQyxTQUFELEVBQVksVUFBVTBDLE9BQVYsRUFBbUI7O0FBRTlELFdBQU8sVUFBU0MsTUFBVCxFQUFpQkMsT0FBakIsRUFBMEI7QUFDN0IsWUFBSXpGLFFBQVEwRixXQUFSLENBQW9CRCxPQUFwQixDQUFKLEVBQWtDO0FBQzlCQSxzQkFBVSxHQUFWO0FBQ0g7O0FBRUQsWUFBSUQsV0FBVyxJQUFmLEVBQXFCO0FBQ2pCLG1CQUFPQSxNQUFQO0FBQ0g7O0FBRUQsWUFBSUEsTUFBSixFQUFZO0FBQ1IsZ0JBQUlHLFFBQVFILE9BQU9JLE9BQVAsQ0FBZSxDQUFmLEVBQWtCQyxRQUFsQixHQUE2QkMsS0FBN0IsQ0FBbUMsR0FBbkMsQ0FBWjtBQUNBSCxrQkFBTSxDQUFOLElBQVdBLE1BQU0sQ0FBTixFQUFTSSxPQUFULENBQWlCLHVCQUFqQixFQUEwQ04sT0FBMUMsQ0FBWDs7QUFFQSxtQkFBT0UsTUFBTUssSUFBTixDQUFXLEdBQVgsQ0FBUDtBQUNILFNBTEQsTUFLTztBQUNILG1CQUFPLE1BQVA7QUFDSDtBQUNKLEtBakJEO0FBbUJILENBckJrQyxDQUFuQztBQ0ZBOztBQUVBOzs7Ozs7Ozs7OztBQVdBakcsSUFBSTJELFNBQUosQ0FBYyxpQkFBZCxFQUFpQyxDQUFDLFlBQVk7QUFDMUMsV0FBTztBQUNIRyxrQkFBVSxHQURQO0FBRUhPLGlCQUFTLFNBRk47QUFHSFQsZUFBTztBQUNIc0MsOEJBQWtCO0FBRGYsU0FISjtBQU1INUIsY0FBTSxVQUFVVixLQUFWLEVBQWlCdUMsR0FBakIsRUFBc0JDLElBQXRCLEVBQTRCQyxXQUE1QixFQUF5QztBQUMzQ0Esd0JBQVlDLFFBQVosQ0FBcUJsRixJQUFyQixDQUEwQixVQUFVd0IsS0FBVixFQUFpQjtBQUN2QyxvQkFBSTJELFNBQVMzQyxNQUFNc0MsZ0JBQU4sQ0FBdUIsRUFBRSxTQUFTdEQsS0FBWCxFQUF2QixDQUFiO0FBQ0Esb0JBQUkyRCxVQUFVQSxXQUFXLEtBQXpCLEVBQWdDO0FBQzVCLHdCQUFJQSxPQUFPQyxJQUFYLEVBQWlCO0FBQ2JELCtCQUFPQyxJQUFQLENBQVksVUFBVTVFLElBQVYsRUFBZ0I7QUFBRTtBQUMxQnlFLHdDQUFZSSxZQUFaLENBQXlCTCxLQUFLTSxlQUE5QixFQUErQzlFLElBQS9DO0FBQ0gseUJBRkQsRUFFRyxVQUFVK0UsS0FBVixFQUFpQjtBQUNoQk4sd0NBQVlJLFlBQVosQ0FBeUJMLEtBQUtNLGVBQTlCLEVBQStDLEtBQS9DO0FBQ0gseUJBSkQ7QUFLSCxxQkFORCxNQU9LO0FBQ0RMLG9DQUFZSSxZQUFaLENBQXlCTCxLQUFLTSxlQUE5QixFQUErQ0gsTUFBL0M7QUFDQSwrQkFBT0EsU0FBUzNELEtBQVQsR0FBaUJnRSxTQUF4QixDQUZDLENBRWtDO0FBQ3RDO0FBQ0o7QUFDRCx1QkFBT2hFLEtBQVA7QUFDSCxhQWhCRDtBQWlCSDtBQXhCRSxLQUFQO0FBMEJILENBM0JnQyxDQUFqQztBQ2JBOztBQUVBNUMsSUFBSTJELFNBQUosQ0FBYyxTQUFkLEVBQXlCLFlBQVk7QUFDcEMsUUFBTztBQUNOVSxXQUFTLFNBREg7QUFFTkMsUUFBTSxVQUFVVixLQUFWLEVBQWlCVyxPQUFqQixFQUEwQkMsS0FBMUIsRUFBaUM2QixXQUFqQyxFQUE4QztBQUNuRDtBQUNBQSxlQUFZUSxTQUFaLEdBQXdCNUcsUUFBUTZHLElBQWhDO0FBQ0E7QUFMSyxFQUFQO0FBT0EsQ0FSRCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0FuZ3VsYXJKUy1UcmVsbG8nLCBbJ25nQW5pbWF0ZScsICduZ1JvdXRlJywgJ25nU2FuaXRpemUnXSk7XG5cbmFwcC5jb25maWcoW1xuICAgICckcm91dGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsICckcHJvdmlkZScsICckaHR0cFByb3ZpZGVyJywgJyRxUHJvdmlkZXInLCAnQ09OU1RBTlRTJywgJ0VWRU5UUycsXG4gICAgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJHByb3ZpZGUsICRodHRwUHJvdmlkZXIsICRxUHJvdmlkZXIsIENPTlNUQU5UUywgRVZFTlRTKSB7XG5cbiAgICAgICAgLy8gZGlzYWJsZSBlcnJvciBvbiB1bmhhbmRsZWQgcmVqZWN0aW9uc1xuICAgICAgICAvLyRxUHJvdmlkZXIuZXJyb3JPblVuaGFuZGxlZFJlamVjdGlvbnMoZmFsc2UpO1xuXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NjcmlwdHMvcGFnZXMvaG9tZS9ob21lLmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oJy9ib2FyZCcsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NjcmlwdHMvcGFnZXMvYm9hcmQvYm9hcmQuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2JvYXJkQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYmMnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oJy80MDQnLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzY3JpcHRzL3BhZ2VzLzQwNC80MDQuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLzQwNCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZShmYWxzZSkuaGFzaFByZWZpeCgnJyk7XG5cbiAgICAgICAgLy8gJHByb3ZpZGUuZGVjb3JhdG9yKCckbG9jYWxlJywgZnVuY3Rpb24gKCRkZWxlZ2F0ZSkge1xuICAgICAgICAvLyAgIHZhciB2YWx1ZSA9ICRkZWxlZ2F0ZS5EQVRFVElNRV9GT1JNQVRTO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgIHZhbHVlLlNIT1JUREFZID0gW1wiU3VcIiwgXCJNb1wiLCBcIlR1XCIsIFwiV2VcIiwgXCJUaFwiLCBcIkZyXCIsIFwiU2FcIl07XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgcmV0dXJuICRkZWxlZ2F0ZTtcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChmdW5jdGlvbiAoJHEsIGV2ZW50QnVzU2VydmljZSwgRVZFTlRTKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdyZXF1ZXN0JzogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICAvLyBldmVudEJ1c1NlcnZpY2UucHVibGlzaChFVkVOVFMubG9hZGVyU2hvdyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAncmVzcG9uc2UnOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXZlbnRCdXNTZXJ2aWNlLnB1Ymxpc2goRVZFTlRTLmxvYWRlckhpZGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAncmVzcG9uc2VFcnJvcic6IGZ1bmN0aW9uIChyZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXZlbnRCdXNTZXJ2aWNlLnB1Ymxpc2goRVZFTlRTLmxvYWRlckhpZGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy50cmFuc2Zvcm1SZXNwb25zZS5wdXNoKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFwcC5jb250cm9sbGVyKCdyb290Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHEnLCAnJGxvY2F0aW9uJywgJ2V2ZW50QnVzU2VydmljZScsICdDT05TVEFOVFMnLCAnRVZFTlRTJyxcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkcSwgJGxvY2F0aW9uLCBldmVudEJ1c1NlcnZpY2UsIENPTlNUQU5UUywgRVZFTlRTKSB7XG5cbiAgICAgICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgICAgICAkc2NvcGUuaW5pdCgpO1xuXG4gICAgfVxuXSk7XG4iLCJ2YXIgY29uc3RhbnRzID0ge1xuICAgIEFQSV9VUkw6IFwiYXBpL1wiLFxuICAgIFBBVEg6IFwiYXBwL3NjcmlwdHMvXCIsXG5cbiAgICAvLyB1c2VyUm9sZXM6IHtcbiAgICAvLyAgICAgYWxsOiAnKicsXG4gICAgLy8gICAgIGFkbWluOiAnYWRtaW4nLFxuICAgIC8vICAgICBlZGl0b3I6ICdlZGl0b3InLFxuICAgIC8vICAgICBndWVzdDogJ2d1ZXN0J1xuICAgIC8vIH1cbn07XG5cbmFwcC5jb25zdGFudCgnQ09OU1RBTlRTJywgY29uc3RhbnRzKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV2ZW50cyA9IHtcblxuICAgIC8vIHJvdXRlXG4gICAgcm91dGVDaGFuZ2VTdGFydDogJyRyb3V0ZUNoYW5nZVN0YXJ0JyxcblxuICAgIC8vIGxvYWRlZFxuICAgIGxvYWRlclNob3c6ICdsb2FkZXIuc2hvdycsXG4gICAgbG9hZGVySGlkZTogJ2xvYWRlci5oaWRlJ1xufTtcblxuYXBwLmNvbnN0YW50KCdFVkVOVFMnLCBldmVudHMpOyIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmZhY3RvcnkoJ3V0aWxzJywgW2Z1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZpbmRCeUZpZWxkOiBmdW5jdGlvbiAoYXJyYXksIHZhbHVlLCBmaWVsZCkge1xuICAgICAgICAgICAgZmllbGQgPSBmaWVsZCB8fCAnSWQnO1xuICAgICAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtW2ZpZWxkXSA9PT0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSlbMF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXHQgICAgZmluZEFsbEJ5RmllbGQ6IGZ1bmN0aW9uIChhcnJheSwgZmllbGQsIHZhbHVlKSB7XG4gICAgICAgICAgICBmaWVsZCA9IGZpZWxkIHx8ICdJZCc7XG4gICAgICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bZmllbGRdID09PSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1ha2VGbGF0OiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICAgICAgICB2YXIgbmV3T2JqZWN0ID0ge307XG5cdCAgICAgICAgaWYgKCFvYmplY3QpIHJldHVybiB7fTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzT2JqZWN0KG9iamVjdFtrZXldKSB8fCBhbmd1bGFyLmlzRGF0ZShvYmplY3Rba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5ICsgXCJJZFwiXSA9IG9iamVjdFtrZXldLklkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG5ld09iamVjdDtcbiAgICAgICAgfVxuICAgIH07XG59XSk7XG4iLCJhcHAuY29udHJvbGxlcignY2FyZENvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICBcclxufSk7XHJcbiIsImFwcC5kaXJlY3RpdmUoJ2NhcmQnLCBmdW5jdGlvbigpIHtcclxuICByZXR1cm4ge1xyXG4gICAgc2NvcGU6IHtcclxuICAgICAgY29udGVudDogJz0nXHJcbiAgICB9LFxyXG4gICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnc2NyaXB0cy9jb21wb25lbnRzL2NhcmQvY2FyZC5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6ICdjYXJkQ29udHJvbGxlcicsXHJcbiAgICBjb250cm9sbGVyQXM6ICdjYydcclxuICB9XHJcbn0pO1xyXG4iLCJhcHAuY29udHJvbGxlcignbGlzdENvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuXHJcbn0pO1xyXG4iLCJhcHAuZGlyZWN0aXZlKCdsaXN0JywgZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHNjb3BlOiB7XHJcbiAgICAgIGNhcmRzOiAnPScsXHJcbiAgICAgIHRpdGxlOiAnPScsXHJcbiAgICAgIGFkZENhcmQ6ICcmJyxcclxuICAgICAga2V5OiAnQCdcclxuICAgIH0sXHJcbiAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICdzY3JpcHRzL2NvbXBvbmVudHMvbGlzdC9saXN0Lmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogJ2xpc3RDb250cm9sbGVyJyxcclxuICAgIGNvbnRyb2xsZXJBczogJ2xjJ1xyXG4gIH1cclxufSk7XHJcbiIsImFwcC5jb250cm9sbGVyKCdib2FyZENvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuICB0aGlzLmFkZENhcmQgPSBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICB0aGlzLmxpc3RzW2luZGV4XS5pdGVtcy5wdXNoKHtcclxuICAgICAgY29udGVudDogJydcclxuICAgIH0pXHJcbiAgfTtcclxuICAkc2NvcGUubGlzdHMgPSBbXHJcbiAgICB7XHJcbiAgICAgIHRpdGxlOiAnTmVlZCB0byBkbycsXHJcbiAgICAgIGl0ZW1zOiBbe1xyXG4gICAgICAgIGNvbnRlbnQ6ICdMZWFybiBBbmd1bGFyNidcclxuICAgICAgfV1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRpdGxlOiAnUmVhZHknLFxyXG4gICAgICBpdGVtczogW3tcclxuICAgICAgICBjb250ZW50OiAnSmF2YVNjcmlwdCdcclxuICAgICAgfV1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRpdGxlOiAnSW4gcHJvY2VzcycsXHJcbiAgICAgIGl0ZW1zOiBbe1xyXG4gICAgICAgIGNvbnRlbnQ6ICdJbnZlc3RpZ2F0ZSBBbmd1bGFySlMnXHJcbiAgICAgIH1dXHJcbiAgICB9XHJcbiAgXTtcclxuXHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XG5cbmFwcC5kaXJlY3RpdmUoXCJjb250ZW50ZWRpdGFibGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6IFwiQVwiLFxuICAgICAgICByZXF1aXJlOiBcIm5nTW9kZWxcIixcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlYWQoKSB7XG4gICAgICAgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGVsZW1lbnQuaHRtbCgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5odG1sKG5nTW9kZWwuJHZpZXdWYWx1ZSB8fCBcIlwiKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGVsZW1lbnQuYmluZChcImJsdXIga2V5dXAgY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShyZWFkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmZhY3RvcnkoJ2V2ZW50QnVzU2VydmljZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG5cbiAgIHZhciBtc2dCdXMgPSB7fTtcblxuICAgbXNnQnVzLnB1Ymxpc2ggPSBmdW5jdGlvbihtc2csIGRhdGEpIHtcbiAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QobXNnLCBkYXRhKTtcbiAgIH07XG5cbiAgIG1zZ0J1cy5zdWJzY3JpYmUgPSBmdW5jdGlvbihtc2csIHNjb3BlLCBmdW5jKSB7XG4gICAgICAgcmV0dXJuIHNjb3BlLiRvbihtc2csIGZ1bmMpOyAvLyByZXR1cm4gZm9yIGRlc3Ryb3lpbmcgbGlzdGVuZXJcbiAgIH07XG5cbiAgIHJldHVybiBtc2dCdXM7XG5cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmFwcC5maWx0ZXIoJ2N1cnJlbmN5TnVtYmVyRmlsdGVyJywgWyckbG9jYWxlJywgZnVuY3Rpb24gKCRsb2NhbGUpIHtcblxuICAgIHJldHVybiBmdW5jdGlvbihhbW91bnQsIGRpdmlkZXIpIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZGl2aWRlcikpIHtcbiAgICAgICAgICAgIGRpdmlkZXIgPSAnICc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYW1vdW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYW1vdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFtb3VudCkge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gYW1vdW50LnRvRml4ZWQoMikudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgcGFydHNbMF0gPSBwYXJ0c1swXS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBkaXZpZGVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oJy4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnMC4wMCc7XG4gICAgICAgIH1cbiAgICB9O1xuXG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRXhhbXBsZSBvZiB1c2U6XG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsMlwiIG5nLW1vZGVsPVwiZW1haWxSZWcyXCIgY3VzdG9tLXZhbGlkYXRvcj1cImVtYWlsTWF0Y2hcIiBkYXRhLXZhbGlkYXRlLWZ1bmN0aW9uPVwiY2hlY2tFbWFpbE1hdGNoKHZhbHVlKVwiPlxuICogPHNwYW4gbmctc2hvdz1cInJlZ2lzdGVyRm9ybS5lbWFpbDIuJGVycm9yLmVtYWlsTWF0Y2hcIj5FbWFpbHMgaGF2ZSB0byBtYXRjaCE8L3NwYW4+XG4gKlxuICogSW4gY29udHJvbGxlcjpcbiAqICRzY29wZS5jaGVja0VtYWlsTWF0Y2g9ZnVuY3Rpb24odmFsdWUpIHtcbiAqICAgIHJldHVybiB2YWx1ZT09PSRzY29wZS5lbWFpbFJlZztcbiAqIH1cbiAqL1xuXG5hcHAuZGlyZWN0aXZlKCdjdXN0b21WYWxpZGF0b3InLCBbZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHZhbGlkYXRlRnVuY3Rpb246ICcmJ1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsbSwgYXR0ciwgbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHNjb3BlLnZhbGlkYXRlRnVuY3Rpb24oeyAndmFsdWUnOiB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0IHx8IHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC50aGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudGhlbihmdW5jdGlvbiAoZGF0YSkgeyAvLyBGb3IgcHJvbWlzZSB0eXBlIHJlc3VsdCBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0VmFsaWRpdHkoYXR0ci5jdXN0b21WYWxpZGF0b3IsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZhbGlkaXR5KGF0dHIuY3VzdG9tVmFsaWRhdG9yLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWYWxpZGl0eShhdHRyLmN1c3RvbVZhbGlkYXRvciwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgPyB2YWx1ZSA6IHVuZGVmaW5lZDsgLy8gRm9yIGJvb2xlYW4gcmVzdWx0IHJldHVybiBiYXNlZCBvbiBib29sZWFuIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufV0pOyIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmRpcmVjdGl2ZSgnbm9EaXJ0eScsIGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHtcblx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbEN0cmwpIHtcblx0XHRcdC8vIG92ZXJyaWRlIHRoZSAkc2V0RGlydHkgbWV0aG9kIG9uIG5nTW9kZWxDb250cm9sbGVyXG5cdFx0XHRuZ01vZGVsQ3RybC4kc2V0RGlydHkgPSBhbmd1bGFyLm5vb3A7XG5cdFx0fVxuXHR9XG59KTsiXX0=
