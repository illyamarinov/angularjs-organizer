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
                        result.then(function (data) { // For promise type result object
                            ngModelCtrl.$setValidity(attr.customValidator, data);
                        }, function (error) {
                            ngModelCtrl.$setValidity(attr.customValidator, false);
                        });
                    }
                    else {
                        ngModelCtrl.$setValidity(attr.customValidator, result);
                        return result ? value : undefined; // For boolean result return based on boolean value
                    }
                }
                return value;
            });
        }
    };
}]);