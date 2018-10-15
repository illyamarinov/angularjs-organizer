app.directive('modal', function(modalService) {
  return {
    link: function(scope, element, attrs) {
      if (!attrs.id) {
        console.error('modal must have an id');
        return;
      }
      const body = document.querySelector('body');

      body.appendChild(element[0]);

      element.on('click', function(e) {
        const target = e.target;
        if (target.classList.contains('modal')) {
          scope.$evalAsync(close);
        }
      });

      const modal = {
        id: attrs.id,
        open,
        close
      };

      modalService.Add(modal);

      scope.$on('$destroy', function() {
        modalService.Remove(attrs.id);
        element.remove();
      });

      function open() {
        element[0].style.display = 'block';
        body.classList.add('modal-open');
      };

      function close() {
        element[0].style.display = 'none';
        body.classList.remove('modal-open');
      };
    }
  };
});
