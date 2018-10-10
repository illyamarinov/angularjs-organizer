app.filter('cardsCountFilter', ['cardService', function(cardService) {

    return function(lists, cardsCount) {
      console.log(cardsCount, lists);
      let filteredList = [];
      // lists.forEach(function(item) {
      //   cardService.getCards(item._id).then(
      //     function(response) {
      //       filteredList = response.data;
      //     },
      //     function(response) {
      //       filteredList = response.statusText;
      //     }
      //   );
      // });
      // cardService.getCards(lists._id).then(
      //   function(response) {
      //     console.log(response.data);
      //   }
      // )
      if (cardsCount === undefined || cardsCount === '' || lists.length === +cardsCount ) {
        return lists;
      }
      return;
    };

}]);
