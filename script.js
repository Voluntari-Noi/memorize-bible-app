window.settings = {
  start: {
    book: "Cartea",
    chapter: "Capitolul",
    verse: "Versetul"
  },
  stop: {
    book: "Cartea",
    chapter: "Capitolul",
    verse: "Versetul"
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

  function validate_settings() {
    var start = window.settings.start;
    var stop = window.settings.stop;
    var status = true;
    var message = "";

    if (stop.verse === "Versetul") {
      status = false;
      message = "Alege versetul de sfârșit";
    }

    if (stop.chapter === "Capitolul") {
      status = false;
      message = "Alege capitolul de sfârșit";
    }

    if (stop.book === "Cartea") {
      status = false;
      message = "Alege cartea de sfârșit";
    }

    if (start.verse === "Versetul") {
      status = false;
      message = "Alege versetul de început";
    }

    if (start.chapter === "Capitolul") {
      status = false;
      message = "Alege capitolul de început";
    }

    if (start.book === "Cartea") {
      status = false;
      message = "Alege cartea de început";
    }

    return {status: status, message: message};
  }

  $("button.btn-start-game").on('click', function() {
    var start = window.settings.start;
    var stop = window.settings.stop;
    var title = "Învățăm " + start.book + " " + start.chapter + ":" + start.verse
      + " - " + stop.book + " " + stop.chapter + ":" + stop.verse;
    var validation_result = validate_settings();
    if (validation_result.status === true) {
      alert(title);
    } else {
      alert(validation_result.message);
    }
  });
});
