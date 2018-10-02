'use strict';

app.directive('noDirty', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			// override the $setDirty method on ngModelController
			ngModelCtrl.$setDirty = angular.noop;
		}
	}
});