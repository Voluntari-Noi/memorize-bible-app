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
  },
  verses: [
    {
      reference: "Geneza 1:1",
      text: "La început...",
      correct: false,
      tried: false,
    },
    {
      reference: "Geneza 1:2",
      text: "Demo text",
      correct: false,
      tried: false,
    },
    {
      reference: "Geneza 1:3",
      text: "Demo text",
      correct: false,
      tried: false,
    },
  ],
  title: "Învățăm Geneza 1:1 - Exodul 2:2",
  current_card: -1,
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

  function init_books_select() {
    for (let book of window.books) {
      $('select.select-start-book').append($('<option>', {
        value: book,
        text: book
      }));
      $('select.select-stop-book').append($('<option>', {
        value: book,
        text: book
      }));
    }
  }

  function search_book(book_name) {
    var index = 0;
    for (let book of window.books) {
      if (book === book_name) {
        return index;
      }
      index++;
    }

    return -1;
  }

  function get_verses_number(book_name, chapter) {

  }

  function init_verses_select(chapter, select) {
    // input: selected chapter, start/stop
    // Init the verses select based on current start/stop book and chapter
    const book_index = search_book(window.settings[select].book);
    const verses = window.bible_cornilescu[book_index].chapters[chapter-1].length;
    console.log("INIT ", chapter, select);
    if (select === "start") {
      $('select.select-start-verse').html("");
      for (let verse = 1; verse <= verses; verse++) {
        $('select.select-start-verse').append($('<option>', {
          value: verse,
          text: "Versetul " + verse
        }));
      }
    }

    if (select === "stop") {
      $('select.select-stop-verse').html("");
      for (let verse = 1; verse <= verses; verse++) {
        $('select.select-stop-verse').append($('<option>', {
          value: verse,
          text: "Versetul " + verse
        }));
      }
    }
  }

  function init_chapters_select(book_name, select) {
    // input: romanian book name, start/stop
    // Init the chapters select (start or stop) with real chapters for given book
    const book_index = search_book(book_name);
    const book_chapters = window.bible_cornilescu[book_index].chapters.length;

    console.log("INIT ", book_name, select);
    if (select === "start") {
      $('select.select-start-chapter').html("");
      for (let chapter = 1; chapter <= book_chapters; chapter++) {
        $('select.select-start-chapter').append($('<option>', {
          value: chapter,
          text: "Capitolul " + chapter
        }));
      }
    }

    if (select === "stop") {
      $('select.select-stop-chapter').html("");
      for (let chapter = 1; chapter <= book_chapters; chapter++) {
        $('select.select-stop-chapter').append($('<option>', {
          value: chapter,
          text: "Capitolul " + chapter
        }));
      }
    }
  }

  $("button.btn-show-settings").on('click', function() {
    init_books_select();

    $("button.btn-show-settings").hide();
    $("div.text-intro").hide();
    $("div.row.settings").show();
    $("button.btn-start-game").show();
  });

  $("select.form-select").on("change", function() {
    if($(this).hasClass("select-start-book")) {
      window.settings.start.book = this.value;
      init_chapters_select(this.value, "start");
      init_verses_select(1, "start");
    }
    if($(this).hasClass("select-start-chapter")) {
      window.settings.start.chapter = this.value;
      init_verses_select(this.value, "start");
    }
    if($(this).hasClass("select-start-verse")) {
      window.settings.start.verse = this.value;
    }
    if($(this).hasClass("select-stop-book")) {
      window.settings.stop.book = this.value;
      init_chapters_select(this.value, "stop");
      init_verses_select(1, "stop");
    }
    if($(this).hasClass("select-stop-chapter")) {
      window.settings.stop.chapter = this.value;
      init_verses_select(this.value, "stop");
    }
    if($(this).hasClass("select-stop-verse")) {
      window.settings.stop.verse = this.value;
    }
  });

  function init_verses() {
    // Generate the list of texts to be used in exercises, based on the settings
    // TODO Get the verses from start to stop as set by user and generate a list like this:
    if (window.settings.start.book === window.settings.stop.book) {
      if (window.settings.start.chapter === window.settings.stop.chapter) {
        var start_book_index = search_book(window.settings.start.book);
        var start_chapter_index = window.settings.start.chapter - 1;
        var start_verse_index = window.settings.start.verse - 1;
        var stop_verse_index = window.settings.stop.verse - 1;
        var temp_verses = window.bible_cornilescu[start_book_index].chapters[start_chapter_index];

        window.settings.verses = [];
        for (let verse_index = start_verse_index; verse_index <= stop_verse_index; verse_index++) {
          window.settings.verses.push({
            reference: window.settings.start.book + " " + window.settings.start.chapter + ":" + (verse_index + 1),
            text: temp_verses[verse_index],
            correct: false,
            tried: false,
          });
        }
      } else {
        alert("TODO Implementeaza pentru aceeasi carte, dar capitole diferite");
      }
    } else {
      alert("TODO Implementeaza pentru carti diferite");
    }
  }

  function validate_settings() {
    // Validation before generatind the cards with verses
    // TODO: Make sure the order is correct, for example if you select Exod as start,
    // you can't select Geneza as stop. The same for chapters and verses.
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

  function init_card() {
    var card_id = window.settings.current_card;
    var current_verse = window.settings.verses[card_id];

    $("div.cards div.card div.front").hide();
    $("div.cards div.card div.back").hide();
    $("button.btn-verify-verse-correct").hide();
    $("button.btn-verify-verse-incorrect").hide();

    $("div.cards div.card div.front").text(current_verse.reference);
    $("div.cards div.card div.back").text(current_verse.text);

    $("div.cards div.card div.front").show();

    $("button.btn-next-verse").show();
    $("button.btn-verify-verse").show();
  }

  function next_exercise() {
    window.settings.current_card += 1;
    init_card();
  }

  function start_exercises() {
    // Prepare the board and the cards
    init_verses();
    alert(window.settings.title);
    console.log(window.settings.verses);

    $("div.row.settings").hide();
    $("div.cards").show();

    next_exercise();
  }

  $("button.btn-next-verse").on('click', function() {
    next_exercise();
  });

  $("button.btn-verify-verse").on('click', function() {
    $("button.btn-next-verse").hide();
    $("div.cards div.card div.front").hide();
    $("div.cards div.card div.back").show();
    $(this).hide();
    $("button.btn-verify-verse-correct").show();
    $("button.btn-verify-verse-incorrect").show();
  });

  $("button.btn-verify-verse-correct").on('click', function() {
    window.settings.verses[window.settings.current_card].tried = true;
    window.settings.verses[window.settings.current_card].correct = true;
    next_exercise();
  });

  $("button.btn-verify-verse-incorrect").on('click', function() {
    window.settings.verses[window.settings.current_card].tried = true;
    window.settings.verses[window.settings.current_card].correct = false;
    next_exercise();
  });

  $("button.btn-start-game").on('click', function() {
    var start = window.settings.start;
    var stop = window.settings.stop;
    var title = "Învățăm " + start.book + " " + start.chapter + ":" + start.verse
      + " - " + stop.book + " " + stop.chapter + ":" + stop.verse;
    var validation_result = validate_settings();
    if (validation_result.status === true) {
      window.settings.title = title;
      $(this).hide();
      start_exercises();
    } else {
      alert(validation_result.message);
    }
  });
});
