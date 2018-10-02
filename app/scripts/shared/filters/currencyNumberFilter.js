"use strict";

app.filter('currencyNumberFilter', ['$locale', function ($locale) {

    return function(amount, divider) {
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
