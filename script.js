$('document').ready(function() {
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  $("button.btn-more").on('click', function() {
    $("div.row-footer").toggle();
  });

  function start_game() {
    alert("Yey");
    console.log(window.books);
  }

  start_game();
});
