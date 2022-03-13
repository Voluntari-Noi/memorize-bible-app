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

window.stats = {
  score: 0,
  success: 0,
  tried: 0,
  remaining: 0
}

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

  function init_verses_select(chapter, select) {
    // input: selected chapter, start/stop
    // Init the verses select based on current start/stop book and chapter
    const book_index = search_book(window.settings[select].book);
    const verses = window.bible_cornilescu[book_index].chapters[chapter-1].length;

    if (select === "start") {
      $('select.select-start-verse').html("<option selected hidden>Versetul</option>");
      for (let verse = 1; verse <= verses; verse++) {
        $('select.select-start-verse').append($('<option>', {
          value: verse,
          text: "Versetul " + verse
        }));
      }
    }

    if (select === "stop") {
      $('select.select-stop-verse').html("<option selected hidden>Versetul</option>");
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

    if (select === "start") {
      $('select.select-start-chapter').html("<option selected hidden>Capitolul</option>");
      for (let chapter = 1; chapter <= book_chapters; chapter++) {
        $('select.select-start-chapter').append($('<option>', {
          value: chapter,
          text: "Capitolul " + chapter
        }));
      }
    }

    if (select === "stop") {
      $('select.select-stop-chapter').html("<option selected hidden>Capitolul</option>");
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

  function get_verses_from_chapter(book_index, chapter_index, verse_index, to) {
    // input: Book index, chapter index, verse index, to = "to end" or number
    // Return the verses in this chapter starting with verse index until the end or given verse number
    var result = [];
    chapter_index = parseInt(chapter_index);
    verse_index = parseInt(verse_index);
    if (to !== "to end") {
      to = parseInt(to);
    }

    var temp_verses = window.bible_cornilescu[book_index].chapters[chapter_index];

    var index = 0;
    for (var verse of temp_verses) {
      if (index >= verse_index) {
        if (to === "to end") {
          result.push({
            reference: window.books[book_index] + " " + (chapter_index + 1) + ":" + (index + 1),
            text: temp_verses[index],
            correct: false,
            tried: false,
          });
        } else {
          if (index <= to) {
            result.push({
              reference: window.books[book_index] + " " + (chapter_index + 1) + ":" + (index + 1),
              text: temp_verses[index],
              correct: false,
              tried: false,
            });
          }
        }
      }
      index++;
    }

    return result;
  }

  function init_verses() {
    // Generate the list of texts to be used in exercises, based on the settings
    if (window.settings.start.book === window.settings.stop.book) {
      if (window.settings.start.chapter === window.settings.stop.chapter) {
        // the same book and chapter
        var all_verses = [];
        var temp_verses = get_verses_from_chapter(
          search_book(window.settings.start.book),
          window.settings.start.chapter - 1,
          window.settings.start.verse - 1,
          window.settings.stop.verse - 1
        );
        window.settings.verses = temp_verses;
      } else {
        // the same book
        var start_book_index = search_book(window.settings.start.book);
        var start_chapter_index = window.settings.start.chapter - 1;
        var stop_chapter_index = window.settings.stop.chapter - 1;
        var start_verse_index = window.settings.start.verse - 1;
        var stop_verse_index = window.settings.stop.verse - 1;

        var all_verses = [];
        var temp_verses = get_verses_from_chapter(start_book_index, start_chapter_index, start_verse_index, "to end");

        for (let v of temp_verses) {
          all_verses.push(v);
        }

        var next_chapter = start_chapter_index + 1;
        while(next_chapter < stop_chapter_index) {
          temp_verses = get_verses_from_chapter(start_book_index, next_chapter, 0, "to end");
          for (let v of temp_verses) {
            all_verses.push(v);
          }
          next_chapter++;
        }

        temp_verses = get_verses_from_chapter(start_book_index, stop_chapter_index, 0, stop_verse_index);
        for (let v of temp_verses) {
          all_verses.push(v);
        }
        window.settings.verses = all_verses;
      }
    } else {
      // different books
      var all_verses = [];

      for (var book_index = search_book(window.settings.start.book); book_index <= search_book(window.settings.stop.book); book_index++) {
        var chapter_start_from = 0;
        var verse_start_from = 0;

        var book_chapters = window.bible_cornilescu[book_index].chapters.length;
        var chapter_stop = book_chapters - 1;
        var verse_stop = "to end";

        if (book_index === search_book(window.settings.start.book)) {
          chapter_start_from = window.settings.start.chapter - 1;
          verse_start_from = window.settings.start.verse - 1;
        }

        if (book_index === search_book(window.settings.stop.book)) {
          chapter_stop = window.settings.stop.chapter - 1;
          verse_stop = window.settings.stop.verse - 1;
        }

        for(var chapter_index = chapter_start_from; chapter_index <= chapter_stop; chapter_index++)  {
          var temp_verses = get_verses_from_chapter(book_index, chapter_index, verse_start_from, verse_stop);
          for (let v of temp_verses) {
            all_verses.push(v);
          }
        }
      }
      window.settings.verses = all_verses;
    }

    window.settings.title = window.settings.title + " (" + window.settings.verses.length + " versete)";
    $("p.verses-title").text(window.settings.title);
    window.stats.remaining = window.settings.verses.length;
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
    $("div.cards div.card div.back p.text").text(current_verse.text);
    $("div.cards div.card div.back p.reference").text(current_verse.reference);

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

    $("div.row.settings").hide();
    $("div.cards").show();

    next_exercise();
  }

  $("button.btn-next-verse").on('click', function() {
    next_exercise();
  });

  function verify_verse() {
    $("button.btn-next-verse").hide();
    $("div.cards div.card div.front").hide();
    $("div.cards div.card div.back").show();
    $("button.btn-verify-verse").hide();
    $("button.btn-verify-verse-correct").show();
    $("button.btn-verify-verse-incorrect").show();
  }

  $("button.btn-verify-verse").on('click', function() {
    verify_verse();
  });

  $("div.card div.front").on('click', function() {
    verify_verse();
  });

  function toFixedIfNecessary( value, dp ){
    return +parseFloat(value).toFixed( dp );
  }

  function refresh_statistics() {
    window.stats.score = toFixedIfNecessary(window.stats.success * 100 / window.stats.tried, 2)
    $("div.stats p span.score").text(window.stats.score);
    $("div.stats p span.success").text(window.stats.success);
    $("div.stats p span.tried").text(window.stats.tried);
    $("div.stats p span.remaining").text(window.stats.remaining);
    $("div.stats").show();
  }

  $("button.btn-verify-verse-correct").on('click', function() {
    window.settings.verses[window.settings.current_card].tried = true;
    window.settings.verses[window.settings.current_card].correct = true;
    window.stats.tried +=1;
    window.stats.success +=1;
    window.stats.remaining -=1;
    refresh_statistics();
    next_exercise();
  });

  $("button.btn-verify-verse-incorrect").on('click', function() {
    window.settings.verses[window.settings.current_card].tried = true;
    window.settings.verses[window.settings.current_card].correct = false;
    window.stats.tried +=1;
    window.stats.remaining -=1;
    refresh_statistics();
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
