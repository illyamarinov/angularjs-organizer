'use strict';

app.factory('utils', [function() {
    return {
        findByField: function (array, value, field) {
            field = field || 'Id';
            if (array) {
                return array.filter(function(item) {
                    return item[field] === value;
                })[0];
            } else {
                return null;
            }
        },
	    findAllByField: function (array, field, value) {
            field = field || 'Id';
            if (array) {
                return array.filter(function(item) {
                    return item[field] === value;
                });
            } else {
                return null;
            }
        },
        makeFlat: function (object) {
            var newObject = {};
	        if (!object) return {};

            Object.keys(object).map(function(key) {
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
