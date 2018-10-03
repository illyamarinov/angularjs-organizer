const app = angular.module('Trello', ['ngAnimate', 'ngRoute', 'ngSanitize']);

app.config([
    '$routeProvider', '$locationProvider', '$provide', '$httpProvider', '$qProvider', 'CONSTANTS', 'EVENTS',
    function ($routeProvider, $locationProvider, $provide, $httpProvider, $qProvider, CONSTANTS, EVENTS) {

        // disable error on unhandled rejections
        //$qProvider.errorOnUnhandledRejections(false);

        $routeProvider
            .when('/', {
                templateUrl: 'scripts/pages/home/home.html'
            })
            .when('/board', {
                templateUrl: 'scripts/pages/board/board.html',
                controller: 'boardController',
                controllerAs: 'bc'
            })
            .when('/404', {
                templateUrl: 'scripts/pages/404/404.html'
            })
            .otherwise({
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
    }
]);
