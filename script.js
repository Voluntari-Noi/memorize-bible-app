window.settings = {
  start: {
    book: "Carte start",
    chapter: "1",
    verse: "1"
  },
  stop: {
    book: "Carte stop",
    chapter: "10",
    verse: "10"
  }
};

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

  $("button.btn-show-settings").on('click', function() {
    $("button.btn-show-settings").hide();
    $("div.text-intro").hide();
    $("div.row.settings").show();
    $("button.btn-start-game").show();
  });

  $("select.form-select").on("change", function() {
    if($(this).hasClass("select-start-book")) {
      window.settings.start.book = this.value;
    }
    if($(this).hasClass("select-start-chapter")) {
      window.settings.start.chapter = this.value;
    }
    if($(this).hasClass("select-start-verse")) {
      window.settings.start.verse = this.value;
    }
    if($(this).hasClass("select-stop-book")) {
      window.settings.stop.book = this.value;
    }
    if($(this).hasClass("select-stop-chapter")) {
      window.settings.stop.chapter = this.value;
    }
    if($(this).hasClass("select-stop-verse")) {
      window.settings.stop.verse = this.value;
    }
  });

  $("button.btn-start-game").on('click', function() {
    var start = window.settings.start;
    var stop = window.settings.stop;
    var title = "Învățăm " + start.book + " " + start.chapter + ":" + start.verse
      + " - " + stop.book + " " + stop.chapter + ":" + stop.verse;
    alert(title);
  });
});
