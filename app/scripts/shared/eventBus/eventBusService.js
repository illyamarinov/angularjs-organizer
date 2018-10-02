'use strict';

app.factory('eventBusService', function ($rootScope) {

   var msgBus = {};

   msgBus.publish = function(msg, data) {
       data = data || {};
       $rootScope.$broadcast(msg, data);
   };

   msgBus.subscribe = function(msg, scope, func) {
       return scope.$on(msg, func); // return for destroying listener
   };

   return msgBus;

});
