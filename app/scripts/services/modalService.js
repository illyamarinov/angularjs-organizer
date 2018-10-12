app.factory('modalService', modalService);

function modalService() {
  let modals = [];
  const service = {};

  service.Add = function(modal) {
    modals.push(modal);
  };

  servise.Remove = function(id) {
    modals.splice(modals.findIndex(function(modal) {
       return modal.id === id;
    }), 1);
  };

  service.Open = function(id) {
    const modal = modals.find(function(modal) {
      return modal.id === id;
    });
    modal.open();
  };

  service.Close = function(id) {
    const modal = modals.find(function(modal) {
      return modal.id === id;
    });
    modal.close();
  };

  return service;
};
