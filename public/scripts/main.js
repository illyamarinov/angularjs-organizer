const app = angular.module('Trello', ['ngAnimate', 'ngRoute', 'ngSanitize']);

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
app.controller('listController', function () {});
app.directive('list', function () {
  return {
    scope: {
      cards: '=',
      title: '=',
      addCard: '=',
      key: '@'
    },
    restrict: 'E',
    templateUrl: 'scripts/components/list/list.html',
    controller: 'listController',
    controllerAs: 'lc'
  };
});
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
app.controller('boardController', ['$scope', function ($scope) {

  $scope.lists = [{
    title: 'Need to do',
    items: [{ content: 'Learn Angular6' }]
  }, {
    title: 'Ready',
    items: [{ content: 'JavaScript' }]
  }, {
    title: 'In process',
    items: [{ content: 'Investigate AngularJS' }]
  }];

  this.addCard = function (index) {
    $scope.lists[index].items.push({ content: '' });
  };
}]);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvb3RDb250cm9sbGVyLmpzIiwic2hhcmVkL2NvbnN0YW50cy5qcyIsInNoYXJlZC9ldmVudHMuanMiLCJzaGFyZWQvdXRpbHMuanMiLCJjb21wb25lbnRzL2xpc3QvbGlzdENvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL2xpc3QvbGlzdERpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvY2FyZC9jYXJkQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvY2FyZC9jYXJkRGlyZWN0aXZlLmpzIiwic2hhcmVkL2RpcmVjdGl2ZXMvY29udGVudGVkaXRhYmxlLmpzIiwicGFnZXMvYm9hcmQvYm9hcmRDb250cm9sbGVyLmpzIiwic2hhcmVkL2V2ZW50QnVzL2V2ZW50QnVzU2VydmljZS5qcyIsInNoYXJlZC9maWx0ZXJzL2N1cnJlbmN5TnVtYmVyRmlsdGVyLmpzIiwic2hhcmVkL3ZhbGlkYXRpb24vY3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlLmpzIiwic2hhcmVkL3ZhbGlkYXRpb24vbm9EaXJ0eS5qcyJdLCJuYW1lcyI6WyJhcHAiLCJhbmd1bGFyIiwibW9kdWxlIiwiY29uZmlnIiwiJHJvdXRlUHJvdmlkZXIiLCIkbG9jYXRpb25Qcm92aWRlciIsIiRwcm92aWRlIiwiJGh0dHBQcm92aWRlciIsIiRxUHJvdmlkZXIiLCJDT05TVEFOVFMiLCJFVkVOVFMiLCJ3aGVuIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwiY29udHJvbGxlckFzIiwib3RoZXJ3aXNlIiwicmVkaXJlY3RUbyIsImh0bWw1TW9kZSIsImhhc2hQcmVmaXgiLCJpbnRlcmNlcHRvcnMiLCJwdXNoIiwiJHEiLCJldmVudEJ1c1NlcnZpY2UiLCJyZXNwb25zZSIsInJlamVjdGlvbiIsInJlamVjdCIsImRlZmF1bHRzIiwidHJhbnNmb3JtUmVzcG9uc2UiLCJkYXRhIiwiJHNjb3BlIiwiJHJvb3RTY29wZSIsIiRsb2NhdGlvbiIsImluaXQiLCJjb25zdGFudHMiLCJBUElfVVJMIiwiUEFUSCIsImNvbnN0YW50IiwiZXZlbnRzIiwicm91dGVDaGFuZ2VTdGFydCIsImxvYWRlclNob3ciLCJsb2FkZXJIaWRlIiwiZmFjdG9yeSIsImZpbmRCeUZpZWxkIiwiYXJyYXkiLCJ2YWx1ZSIsImZpZWxkIiwiZmlsdGVyIiwiaXRlbSIsImZpbmRBbGxCeUZpZWxkIiwibWFrZUZsYXQiLCJvYmplY3QiLCJuZXdPYmplY3QiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwia2V5IiwiaXNPYmplY3QiLCJpc0RhdGUiLCJJZCIsImRpcmVjdGl2ZSIsInNjb3BlIiwiY2FyZHMiLCJ0aXRsZSIsImFkZENhcmQiLCJyZXN0cmljdCIsImNvbnRlbnQiLCJyZXF1aXJlIiwibGluayIsImVsZW1lbnQiLCJhdHRycyIsIm5nTW9kZWwiLCJyZWFkIiwiJHNldFZpZXdWYWx1ZSIsImh0bWwiLCIkcmVuZGVyIiwiJHZpZXdWYWx1ZSIsImJpbmQiLCIkYXBwbHkiLCJsaXN0cyIsIml0ZW1zIiwiaW5kZXgiLCJtc2dCdXMiLCJwdWJsaXNoIiwibXNnIiwiJGJyb2FkY2FzdCIsInN1YnNjcmliZSIsImZ1bmMiLCIkb24iLCIkbG9jYWxlIiwiYW1vdW50IiwiZGl2aWRlciIsImlzVW5kZWZpbmVkIiwicGFydHMiLCJ0b0ZpeGVkIiwidG9TdHJpbmciLCJzcGxpdCIsInJlcGxhY2UiLCJqb2luIiwidmFsaWRhdGVGdW5jdGlvbiIsImVsbSIsImF0dHIiLCJuZ01vZGVsQ3RybCIsIiRwYXJzZXJzIiwicmVzdWx0IiwidGhlbiIsIiRzZXRWYWxpZGl0eSIsImN1c3RvbVZhbGlkYXRvciIsImVycm9yIiwidW5kZWZpbmVkIiwiJHNldERpcnR5Iiwibm9vcCJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsTUFBTUMsUUFBUUMsTUFBUixDQUFlLFFBQWYsRUFBeUIsQ0FBQyxXQUFELEVBQWMsU0FBZCxFQUF5QixZQUF6QixDQUF6QixDQUFaOztBQUVBRixJQUFJRyxNQUFKLENBQVcsQ0FDUCxnQkFETyxFQUNXLG1CQURYLEVBQ2dD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REwsb0NBQVlJLFlBQVosQ0FBeUJMLEtBQUtNLGVBQTlCLEVBQStDSCxNQUEvQztBQUNBLCtCQUFPQSxTQUFTM0QsS0FBVCxHQUFpQmdFLFNBQXhCLENBRkMsQ0FFa0M7QUFDdEM7QUFDSjtBQUNELHVCQUFPaEUsS0FBUDtBQUNILGFBaEJEO0FBaUJIO0FBeEJFLEtBQVA7QUEwQkgsQ0EzQmdDLENBQWpDO0FDYkE7O0FBRUE1QyxJQUFJMkQsU0FBSixDQUFjLFNBQWQsRUFBeUIsWUFBWTtBQUNwQyxRQUFPO0FBQ05PLFdBQVMsU0FESDtBQUVOQyxRQUFNLFVBQVVQLEtBQVYsRUFBaUJRLE9BQWpCLEVBQTBCQyxLQUExQixFQUFpQ2dDLFdBQWpDLEVBQThDO0FBQ25EO0FBQ0FBLGVBQVlRLFNBQVosR0FBd0I1RyxRQUFRNkcsSUFBaEM7QUFDQTtBQUxLLEVBQVA7QUFPQSxDQVJEIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnVHJlbGxvJywgWyduZ0FuaW1hdGUnLCAnbmdSb3V0ZScsICduZ1Nhbml0aXplJ10pO1xyXG5cclxuYXBwLmNvbmZpZyhbXHJcbiAgICAnJHJvdXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHByb3ZpZGUnLCAnJGh0dHBQcm92aWRlcicsICckcVByb3ZpZGVyJywgJ0NPTlNUQU5UUycsICdFVkVOVFMnLFxyXG4gICAgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJHByb3ZpZGUsICRodHRwUHJvdmlkZXIsICRxUHJvdmlkZXIsIENPTlNUQU5UUywgRVZFTlRTKSB7XHJcblxyXG4gICAgICAgIC8vIGRpc2FibGUgZXJyb3Igb24gdW5oYW5kbGVkIHJlamVjdGlvbnNcclxuICAgICAgICAvLyRxUHJvdmlkZXIuZXJyb3JPblVuaGFuZGxlZFJlamVjdGlvbnMoZmFsc2UpO1xyXG5cclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc2NyaXB0cy9wYWdlcy9ob21lL2hvbWUuaHRtbCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9ib2FyZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc2NyaXB0cy9wYWdlcy9ib2FyZC9ib2FyZC5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdib2FyZENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYmMnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvNDA0Jywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzY3JpcHRzL3BhZ2VzLzQwNC80MDQuaHRtbCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLzQwNCdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZShmYWxzZSkuaGFzaFByZWZpeCgnJyk7XHJcblxyXG4gICAgICAgIC8vICRwcm92aWRlLmRlY29yYXRvcignJGxvY2FsZScsIGZ1bmN0aW9uICgkZGVsZWdhdGUpIHtcclxuICAgICAgICAvLyAgIHZhciB2YWx1ZSA9ICRkZWxlZ2F0ZS5EQVRFVElNRV9GT1JNQVRTO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICB2YWx1ZS5TSE9SVERBWSA9IFtcIlN1XCIsIFwiTW9cIiwgXCJUdVwiLCBcIldlXCIsIFwiVGhcIiwgXCJGclwiLCBcIlNhXCJdO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICByZXR1cm4gJGRlbGVnYXRlO1xyXG4gICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKGZ1bmN0aW9uICgkcSwgZXZlbnRCdXNTZXJ2aWNlLCBFVkVOVFMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICdyZXF1ZXN0JzogZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGV2ZW50QnVzU2VydmljZS5wdWJsaXNoKEVWRU5UUy5sb2FkZXJTaG93KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdyZXNwb25zZSc6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGV2ZW50QnVzU2VydmljZS5wdWJsaXNoKEVWRU5UUy5sb2FkZXJIaWRlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ3Jlc3BvbnNlRXJyb3InOiBmdW5jdGlvbiAocmVqZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXZlbnRCdXNTZXJ2aWNlLnB1Ymxpc2goRVZFTlRTLmxvYWRlckhpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy50cmFuc2Zvcm1SZXNwb25zZS5wdXNoKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5dKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ3Jvb3RDb250cm9sbGVyJywgWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckcScsICckbG9jYXRpb24nLCAnZXZlbnRCdXNTZXJ2aWNlJywgJ0NPTlNUQU5UUycsICdFVkVOVFMnLFxyXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHEsICRsb2NhdGlvbiwgZXZlbnRCdXNTZXJ2aWNlLCBDT05TVEFOVFMsIEVWRU5UUykge1xyXG5cclxuICAgICAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uICgpIHt9O1xyXG5cclxuICAgICAgICAkc2NvcGUuaW5pdCgpO1xyXG5cclxuICAgIH1cclxuXSk7XHJcbiIsInZhciBjb25zdGFudHMgPSB7XHJcbiAgICBBUElfVVJMOiBcImFwaS9cIixcclxuICAgIFBBVEg6IFwiYXBwL3NjcmlwdHMvXCIsXHJcblxyXG4gICAgLy8gdXNlclJvbGVzOiB7XHJcbiAgICAvLyAgICAgYWxsOiAnKicsXHJcbiAgICAvLyAgICAgYWRtaW46ICdhZG1pbicsXHJcbiAgICAvLyAgICAgZWRpdG9yOiAnZWRpdG9yJyxcclxuICAgIC8vICAgICBndWVzdDogJ2d1ZXN0J1xyXG4gICAgLy8gfVxyXG59O1xyXG5cclxuYXBwLmNvbnN0YW50KCdDT05TVEFOVFMnLCBjb25zdGFudHMpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgZXZlbnRzID0ge1xyXG5cclxuICAgIC8vIHJvdXRlXHJcbiAgICByb3V0ZUNoYW5nZVN0YXJ0OiAnJHJvdXRlQ2hhbmdlU3RhcnQnLFxyXG5cclxuICAgIC8vIGxvYWRlZFxyXG4gICAgbG9hZGVyU2hvdzogJ2xvYWRlci5zaG93JyxcclxuICAgIGxvYWRlckhpZGU6ICdsb2FkZXIuaGlkZSdcclxufTtcclxuXHJcbmFwcC5jb25zdGFudCgnRVZFTlRTJywgZXZlbnRzKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hcHAuZmFjdG9yeSgndXRpbHMnLCBbZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZpbmRCeUZpZWxkOiBmdW5jdGlvbiAoYXJyYXksIHZhbHVlLCBmaWVsZCkge1xyXG4gICAgICAgICAgICBmaWVsZCA9IGZpZWxkIHx8ICdJZCc7XHJcbiAgICAgICAgICAgIGlmIChhcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bZmllbGRdID09PSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0pWzBdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cdCAgICBmaW5kQWxsQnlGaWVsZDogZnVuY3Rpb24gKGFycmF5LCBmaWVsZCwgdmFsdWUpIHtcclxuICAgICAgICAgICAgZmllbGQgPSBmaWVsZCB8fCAnSWQnO1xyXG4gICAgICAgICAgICBpZiAoYXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtW2ZpZWxkXSA9PT0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtYWtlRmxhdDogZnVuY3Rpb24gKG9iamVjdCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3T2JqZWN0ID0ge307XHJcblx0ICAgICAgICBpZiAoIW9iamVjdCkgcmV0dXJuIHt9O1xyXG5cclxuICAgICAgICAgICAgT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNPYmplY3Qob2JqZWN0W2tleV0pIHx8IGFuZ3VsYXIuaXNEYXRlKG9iamVjdFtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0gb2JqZWN0W2tleV07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXkgKyBcIklkXCJdID0gb2JqZWN0W2tleV0uSWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3T2JqZWN0O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1dKTtcclxuIiwiYXBwLmNvbnRyb2xsZXIoJ2xpc3RDb250cm9sbGVyJywgZnVuY3Rpb24oKSB7XHJcblxyXG59KTtcclxuIiwiYXBwLmRpcmVjdGl2ZSgnbGlzdCcsIGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICBzY29wZToge1xyXG4gICAgICBjYXJkczogJz0nLFxyXG4gICAgICB0aXRsZTogJz0nLFxyXG4gICAgICBhZGRDYXJkOiAnPScsXHJcbiAgICAgIGtleTogJ0AnXHJcbiAgICB9LFxyXG4gICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnc2NyaXB0cy9jb21wb25lbnRzL2xpc3QvbGlzdC5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6ICdsaXN0Q29udHJvbGxlcicsXHJcbiAgICBjb250cm9sbGVyQXM6ICdsYydcclxuICB9XHJcbn0pO1xyXG4iLCJhcHAuY29udHJvbGxlcignY2FyZENvbnRyb2xsZXInLCBmdW5jdGlvbigpIHtcclxuICBcclxufSk7XHJcbiIsImFwcC5kaXJlY3RpdmUoJ2NhcmQnLCBmdW5jdGlvbigpIHtcclxuICByZXR1cm4ge1xyXG4gICAgc2NvcGU6IHtcclxuICAgICAgY29udGVudDogJz0nXHJcbiAgICB9LFxyXG4gICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnc2NyaXB0cy9jb21wb25lbnRzL2NhcmQvY2FyZC5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6ICdjYXJkQ29udHJvbGxlcicsXHJcbiAgICBjb250cm9sbGVyQXM6ICdjYydcclxuICB9XHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hcHAuZGlyZWN0aXZlKFwiY29udGVudGVkaXRhYmxlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogXCJBXCIsXHJcbiAgICAgICAgcmVxdWlyZTogXCJuZ01vZGVsXCIsXHJcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiByZWFkKCkge1xyXG4gICAgICAgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGVsZW1lbnQuaHRtbCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50Lmh0bWwobmdNb2RlbC4kdmlld1ZhbHVlIHx8IFwiXCIpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZWxlbWVudC5iaW5kKFwiYmx1ciBrZXl1cCBjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkocmVhZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pOyIsImFwcC5jb250cm9sbGVyKCdib2FyZENvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSkge1xyXG5cclxuICAkc2NvcGUubGlzdHMgPSBbe1xyXG4gICAgdGl0bGU6ICdOZWVkIHRvIGRvJyxcclxuICAgIGl0ZW1zOiBbeyBjb250ZW50OiAnTGVhcm4gQW5ndWxhcjYnIH1dXHJcbiAgfSwge1xyXG4gICAgdGl0bGU6ICdSZWFkeScsXHJcbiAgICBpdGVtczogW3sgY29udGVudDogJ0phdmFTY3JpcHQnIH1dXHJcbiAgfSwge1xyXG4gICAgdGl0bGU6ICdJbiBwcm9jZXNzJyxcclxuICAgIGl0ZW1zOiBbeyBjb250ZW50OiAnSW52ZXN0aWdhdGUgQW5ndWxhckpTJyB9XVxyXG4gIH1dO1xyXG5cclxuICB0aGlzLmFkZENhcmQgPSBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgJHNjb3BlLmxpc3RzW2luZGV4XS5pdGVtcy5wdXNoKHsgY29udGVudDogJycgfSk7XHJcbiAgfTtcclxuXHJcbn1dKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYXBwLmZhY3RvcnkoJ2V2ZW50QnVzU2VydmljZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XHJcblxyXG4gICB2YXIgbXNnQnVzID0ge307XHJcblxyXG4gICBtc2dCdXMucHVibGlzaCA9IGZ1bmN0aW9uKG1zZywgZGF0YSkge1xyXG4gICAgICAgZGF0YSA9IGRhdGEgfHwge307XHJcbiAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QobXNnLCBkYXRhKTtcclxuICAgfTtcclxuXHJcbiAgIG1zZ0J1cy5zdWJzY3JpYmUgPSBmdW5jdGlvbihtc2csIHNjb3BlLCBmdW5jKSB7XHJcbiAgICAgICByZXR1cm4gc2NvcGUuJG9uKG1zZywgZnVuYyk7IC8vIHJldHVybiBmb3IgZGVzdHJveWluZyBsaXN0ZW5lclxyXG4gICB9O1xyXG5cclxuICAgcmV0dXJuIG1zZ0J1cztcclxuXHJcbn0pO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmFwcC5maWx0ZXIoJ2N1cnJlbmN5TnVtYmVyRmlsdGVyJywgWyckbG9jYWxlJywgZnVuY3Rpb24gKCRsb2NhbGUpIHtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oYW1vdW50LCBkaXZpZGVyKSB7XHJcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZGl2aWRlcikpIHtcclxuICAgICAgICAgICAgZGl2aWRlciA9ICcgJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbW91bnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFtb3VudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbW91bnQpIHtcclxuICAgICAgICAgICAgdmFyIHBhcnRzID0gYW1vdW50LnRvRml4ZWQoMikudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIGRpdmlkZXIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oJy4nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJzAuMDAnO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59XSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBFeGFtcGxlIG9mIHVzZTpcclxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbDJcIiBuZy1tb2RlbD1cImVtYWlsUmVnMlwiIGN1c3RvbS12YWxpZGF0b3I9XCJlbWFpbE1hdGNoXCIgZGF0YS12YWxpZGF0ZS1mdW5jdGlvbj1cImNoZWNrRW1haWxNYXRjaCh2YWx1ZSlcIj5cclxuICogPHNwYW4gbmctc2hvdz1cInJlZ2lzdGVyRm9ybS5lbWFpbDIuJGVycm9yLmVtYWlsTWF0Y2hcIj5FbWFpbHMgaGF2ZSB0byBtYXRjaCE8L3NwYW4+XHJcbiAqXHJcbiAqIEluIGNvbnRyb2xsZXI6XHJcbiAqICRzY29wZS5jaGVja0VtYWlsTWF0Y2g9ZnVuY3Rpb24odmFsdWUpIHtcclxuICogICAgcmV0dXJuIHZhbHVlPT09JHNjb3BlLmVtYWlsUmVnO1xyXG4gKiB9XHJcbiAqL1xyXG5cclxuYXBwLmRpcmVjdGl2ZSgnY3VzdG9tVmFsaWRhdG9yJywgW2Z1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgdmFsaWRhdGVGdW5jdGlvbjogJyYnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsbSwgYXR0ciwgbmdNb2RlbEN0cmwpIHtcclxuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMucHVzaChmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBzY29wZS52YWxpZGF0ZUZ1bmN0aW9uKHsgJ3ZhbHVlJzogdmFsdWUgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0IHx8IHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnRoZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnRoZW4oZnVuY3Rpb24gKGRhdGEpIHsgLy8gRm9yIHByb21pc2UgdHlwZSByZXN1bHQgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0VmFsaWRpdHkoYXR0ci5jdXN0b21WYWxpZGF0b3IsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWYWxpZGl0eShhdHRyLmN1c3RvbVZhbGlkYXRvciwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWYWxpZGl0eShhdHRyLmN1c3RvbVZhbGlkYXRvciwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHZhbHVlIDogdW5kZWZpbmVkOyAvLyBGb3IgYm9vbGVhbiByZXN1bHQgcmV0dXJuIGJhc2VkIG9uIGJvb2xlYW4gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hcHAuZGlyZWN0aXZlKCdub0RpcnR5JywgZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXHJcblx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xyXG5cdFx0XHQvLyBvdmVycmlkZSB0aGUgJHNldERpcnR5IG1ldGhvZCBvbiBuZ01vZGVsQ29udHJvbGxlclxyXG5cdFx0XHRuZ01vZGVsQ3RybC4kc2V0RGlydHkgPSBhbmd1bGFyLm5vb3A7XHJcblx0XHR9XHJcblx0fVxyXG59KTsiXX0=
