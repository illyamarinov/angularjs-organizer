app.filter('sortNotEmpty', function() {

    return function(items, field) {
      return items
        .filter(function(item) {
          return !!item[field];
        })
        .sort(function(a, b) {
          return a[field][0] < b[field][0];
        });
    };

});
