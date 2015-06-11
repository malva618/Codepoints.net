var $ = require('jquery');


/* scale the front headline text */
var headline = $('.front h1'),
    // with hat tip to fittext.js
    resizer = function () {
      headline.css('font-size', Math.max(Math.min(headline.width() / 7.5,
                                                160), 20));
    };
resizer();
$(window).on("load resize", resizer);


/* display latest blog post */
$('.blog-preview').load('/blog-preview');


/* display favorite CPs */
var favorites = $('.favorites');
var fav_ul = $('<ul class="data"></ul>').appendTo(favorites);
$.ajax({
  url: 'https://stats.codepoints.net/popular.php',
  dataType: 'jsonp'
}).then(function(data) {
  favorites.find('.wait').remove();
  $.each(data, function() {
    if (this.label.substr(0, 2) !== "U ") {
      return; // a.k.a. continue
    }
    var label = this.label.replace(/U /, ""),
        cp = $('<li><a class="cp" href="'+this.url+'">'+
              label+'<img alt="" src="/api/v1/glyph/'+label+'">'+
              '</a></li>');
    cp.one('mouseenter', function() {
      $.getJSON('/api/v1/codepoint/'+label+'?property=na').then(function(data) {
        cp.attr('title', data.na).tooltip();
      });
    });
    fav_ul.append(cp);
  });
});
