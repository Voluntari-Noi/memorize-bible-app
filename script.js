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
  all_texts: [],
  title: "Învățăm Geneza 1:1 - Exodul 2:2",
  current_card: -1,
  shuffle: true,
  retry: true,
};

window.texts = {
  shuffle_on: "Amestecate? (Da, vreau să primesc versetele pe sărite)",
  shuffle_off: "Amestecate? (Nu, vreau să primesc versetele în ordinea din Biblie)",
  retry_on: "Modul învățare? (Da, vreau să repet versetele până le știu pe toate)",
  retry_off: "Modul învățare? (Nu, modul testare - vreau să parcurg versetele o singură dată)"
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

  function update_labels() {
    var shuffle = window.settings.shuffle;
    var retry = window.settings.retry;
    var label_shuffle = "";
    var label_retry = "";
    if (shuffle) {
      label_shuffle = window.texts.shuffle_on;
    } else {
      label_shuffle = window.texts.shuffle_off;
    }
    if (retry) {
      label_retry = window.texts.retry_on;
    } else {
      label_retry = window.texts.retry_off;
    }
    $("label[for='shuffle-verses']").text(label_shuffle);
    $("label[for='retry-verses']").text(label_retry);
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
    update_labels();
    $("button.btn-show-settings").hide();
    $("div.text-intro").hide();
    $("div.row.settings").show();
    $("button.btn-set-game").show();
  });

  $("select.form-select").on("change", function() {
    if($(this).hasClass("select-start-book")) {
      window.settings.start.book = this.value;
      init_chapters_select(this.value, "start");
      init_verses_select(1, "start");
      if ($("select.select-stop-book").val() === "Cartea") {
        // Most expected book to be the same
        $("select.select-stop-book").val(this.value).change();
      }
    }
    if($(this).hasClass("select-start-chapter")) {
      window.settings.start.chapter = this.value;
      init_verses_select(this.value, "start");
      if ($("select.select-stop-chapter").val() === "Capitolul") {
        // Most expected chapter to be the same
        $("select.select-stop-chapter").val(this.value).change();
      }
    }
    if($(this).hasClass("select-start-verse")) {
      window.settings.start.verse = this.value;
      if ($("select.select-stop-verse").val() === "Versetul") {
        $("select.select-stop-verse").val(
          // Most expected verse to be the last in the selected chapter
          $("select.select-stop-verse option").last().val()
        ).change();
      }
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

    for (let a_verse of window.settings.verses) {
      // keep a copy, for correct order, used on read
      window.settings.all_texts.push(a_verse);
    }

    if ($("#shuffle-verses").is(':checked')) {
      window.settings.verses = shuffle(window.settings.verses);
      console.log("Shuffle");
    } else {
      console.log("Not shuffle");
    }

    window.settings.title = window.settings.title + " (" + window.settings.verses.length + " versete)";
    $("p.verses-title").text(window.settings.title);
    window.stats.remaining = window.settings.verses.length;
  }

  function validate_settings() {
    // Validation before generatind the cards with verses
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

    if (status === true) {
      if (search_book(start.book) > search_book(stop.book)) {
        status = false;
        message = "Ordine greșită a cărților";
      }
      if (search_book(start.book) === search_book(stop.book) &&
          parseInt(start.chapter) > parseInt(stop.chapter)) {
        status = false;
        message = "Ordine greșită a capitolelor";
      }
      if (search_book(start.book) === search_book(stop.book) &&
          parseInt(start.chapter) === parseInt(stop.chapter) &&
          parseInt(start.verse) > parseInt(stop.verse)) {
        status = false;
        message = "Ordine greșită a versetelor";
      }
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
    var ok = true;
    if (window.settings.current_card < window.settings.verses.length - 1) {
      window.settings.current_card += 1;
    } else {
      window.settings.current_card = 0;
    }

    if (window.settings.retry === true) {
      if (
        window.settings.verses[window.settings.current_card].tried &&
        window.settings.verses[window.settings.current_card].correct
      ) {
        ok = false;
      }
    } else {
      if (window.settings.verses[window.settings.current_card].tried) {
        ok = false;
      }
    }

    if(ok) {
      init_card();
    } else {
      next_exercise();
    }
  }

  function start_exercises() {
    // Prepare the board and the cards
    if ($("#retry-verses").is(':checked')) {
      window.settings.retry = true;
    } else {
      window.settings.retry = false;
    }

    $("div.row.settings").hide();
    $("div.cards").show();

    next_exercise();
  }

  $("button.btn-next-verse").on('click', function() {
    next_exercise();
  });

  function verify_verse() {
    $("button.btn-verify-verse").hide();
    $("button.btn-next-verse").hide();
    $("div.cards div.card div.front").fadeOut("fast", function() {
      $("div.cards div.card div.front").hide();
      $("div.cards div.card div.back").fadeIn("fast", function() {
        $("div.cards div.card div.back").show();
        $("button.btn-verify-verse-correct").show();
        $("button.btn-verify-verse-incorrect").show();
      });
    });
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

  function show_the_end_screen() {
    var star = "<i class='fas fa-star'></i>";
    var stars = "";
    var score = window.stats.score;
    if (score >= 100) {
      stars = star + star + star + star + star;
    } else {
      if (score >= 80) {
        stars = star + star + star + star;
      } else {
        if (score >= 60) {
          stars = star + star + star;
        } else {
          if (score >= 40) {
            stars = star + star;
          } else {
            if (score >= 20) {
              stars = star;
            }
          }
        }
      }
    }
    $("div.cards").html("<h3>Felicitări! <i class='fas fa-heart'></i></h3><p>Ai parcurs toate exercițiile. <a href='./'>Vrei să mai exersezi?</a></p><h2>Scor: " + window.stats.score + "%</h2><h3>" + stars + "</h3>");
    $("div.progress").hide();
  }

  function learned_verses() {
    var learned = 0;
    for (verse of window.settings.verses) {
      if (verse.correct === true) {
        learned++;
      }
    }

    return learned;
  }

  function refresh_statistics() {
    window.stats.score = toFixedIfNecessary(window.stats.success * 100 / window.stats.tried, 2)
    var total = window.settings.verses.length;

    var now = 0;
    if(window.settings.retry) {
      now = toFixedIfNecessary(learned_verses() * 100 / total, 2);
    } else {
      now = toFixedIfNecessary(window.stats.tried * 100 / total, 2);
    }
    var retry_mode = {
      true: 'învățat',
      false: 'verificat'
    };

    $('.progress-bar').css('width', now+'%').attr('aria-valuenow', now).attr('aria-valuemax', total);
    $("div.stats p span.score").text(window.stats.score);
    $("div.stats p span.success").text(window.stats.success);
    $("div.stats p span.tried").text(window.stats.tried);
    $("div.stats p span.remaining").text(window.stats.remaining);
    $("div.stats p span.retry-mode").text(retry_mode[window.settings.retry]);
    $("div.stats").show();
  }

  function need_retry() {
    // Return true if Retry feature is set
    // & still exist incorrect answered verses
    for (let verse of window.settings.verses) {
      if(window.settings.retry && (verse.correct === false && verse.tried === true)) {
        return true;
      }
    }
    return false;
  }

  $("button.btn-verify-verse-correct").on('click', function() {
    $("button.btn-verify-verse-incorrect").hide();
    $("button.btn-verify-verse-correct").hide();
    window.settings.verses[window.settings.current_card].tried = true;
    window.settings.verses[window.settings.current_card].correct = true;
    window.stats.tried +=1;
    window.stats.success +=1;
    window.stats.remaining -=1;
    refresh_statistics();
    $("div.cards").addClass("success").delay(1000).queue(function(){
      $(this).removeClass("success").dequeue();
      if (window.stats.remaining > 0 || need_retry()) {
        next_exercise();
      } else {
        show_the_end_screen();
      }
    });
  });

  $("button.btn-verify-verse-incorrect").on('click', function() {
    $("button.btn-verify-verse-incorrect").hide();
    $("button.btn-verify-verse-correct").hide();
    window.settings.verses[window.settings.current_card].tried = true;
    window.settings.verses[window.settings.current_card].correct = false;
    window.stats.tried +=1;
    if(!window.settings.retry) {
      window.stats.remaining -=1;
    }
    refresh_statistics();
    $("div.cards").addClass("danger").delay(1000).queue(function(){
      $(this).removeClass("danger").dequeue();
      if (window.stats.remaining > 0 || need_retry()) {
        next_exercise();
      } else {
        show_the_end_screen();
      }
    });
  });

  $("input#shuffle-verses").change(function() {
    window.settings.shuffle = $(this).is(':checked');
    update_labels();
  });

  $("input#retry-verses").change(function() {
    window.settings.retry = $(this).is(':checked');
    update_labels();
  });

  function init_text_for_reading() {
    $("div.all-texts").html("");
    for (let verse of window.settings.all_texts) {
      $("div.all-texts").append("<p>" + verse.reference + ": " + verse.text + "</p>");
    }
  }

  $("button.btn-read").on('click', function() {
    init_text_for_reading();
    $("button.btn-read").hide();
    $("button.btn-start-game").hide();
    $("div.row.settings").hide();
    $("div.row-board.read").show();
  });

  $("button.btn-done-read").on('click', function() {
    $("div.row-board.read").hide();
    $("button.btn-read").show();
    $("button.btn-start-game").show();
  });

  function ready_to_start() {
    $("button.btn-set-game").hide();
    $("button.btn-start-game").show();
    $("button.btn-read").show();
    init_verses();
  }

  $("button.btn-start-game").on('click', function() {
    $("button.btn-start-game").hide();
    $("button.btn-read").hide();
    $("div.row-board.read").hide();
    start_exercises();
  });

  $("button.btn-set-game").on('click', function() {
    var start = window.settings.start;
    var stop = window.settings.stop;
    var title = "Învățăm " + start.book + " " + start.chapter + ":" + start.verse
      + " - " + stop.book + " " + stop.chapter + ":" + stop.verse;
    var validation_result = validate_settings();
    if (validation_result.status === true) {
      window.settings.title = title;
      $(this).hide();
      ready_to_start();
    } else {
      alert(validation_result.message);
    }
  });
});
