var $ = require('jquery');
var _ = require('components/gettext').gettext;
//var scratchpad = require('components/scratchpad');
var dyn_pagination = require('components/dyn_pagination');

require('components/jquery.tooltip');
require('components/jquery.glossary');

require('jquery-ui/dialog');
require('jquery-ui/position');

require('document-scroll-element')();

if (document.referrer.match(/^https?:\/\/translate.google(usercontent)?.[a-z.]+(?:\/|$)/)) {
  if (! document.cookie.match(/(^|;)\s*notrans=true;/)) {
    $('body').addClass('no-fixed').prepend($('<p class="note">Howdy! We noticed, that you visit '+
        'this site through Google Translate. There are efforts to translate '+
        'Codepoints.net, but we need your help. Please visit <a href="https://crowdin.net/project/codepoints">the '+
        'translators’ page</a>, if you want to join us. <span class="close">Hide this message.</span></p>').on('click', '.close', function() {
          document.cookie = 'notrans=true; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/';
          $(this).closest('.note').slideUp();
          $('body').removeClass('no-fixed');
        }));
  }
}

dyn_pagination();

//scratchpad.init();

$.getScript('https://stats.codepoints.net/piwik.js');

/** init tooltips */
$(document).tooltip().glossary();

/** init pagination enhancer */
$('body').enhancePagination();

/** let in-page links scroll smooth */
$(document).on('click tap', 'nav a[href^="#"], a[rel~="internal"]',
  function() {
    var a = $(this), t = a.attr("href");
    if (t.length > 1 && $(t).length) {
      $(document.scrollElement).animate({scrollTop: $(t).offset().top - 20}, 1000);
      return false;
    }
  });

/* display "to top" anchor under circumstances */
$(window).on("load", function() {
  if ($(window).height() + 50 < $(document).height()) {
    $('footer.ft nav ul:eq(0)').prepend(
      $('<li><a href="#top"><i class="icon-chevron-up"></i> '+_('top')+
      '</a></li>').find('a')
        .on('click', function() {
          $(document.scrollElement).animate({scrollTop: 0}, 500);
          return false;
        })
      .end());
  }
});

/* display search form */
$('nav a[rel="search"]').on('click', function() {
  var $this = $(this),
      el = $('#footer_search').show().position({
        my: 'left top',
        at: 'left bottom',
        of: $this,
        collision: 'fit'
      }).hide();
  if (! el.data('extended')) {
    el.data('extended',
      true).append($('<p></p>').append($('<a></a>').attr('href',
            $this.attr('href')).text(_('Extended Search'))))
            .append($('<p></p>').append($('<a></a>').attr('href',
            '/wizard').text(_('Find My Codepoint'))));
  }
  if (el.is(':hidden')) {
    el.slideDown('normal').find(':text:eq(0)').focus();
    $(document).one('tap click keydown', function __hideMe(e) {
      if (e.which === 27 || (el.find(e.target).length === 0 &&
          $.inArray(e.type, ['tap', 'click']) > -1)) {
        el.slideUp('normal');
      } else {
        $(document).one('tap click keydown', __hideMe);
      }
    });
  }
  return false;
});

/* keyboard navigation */
$(document).on('keydown', function(e) {
  if (e.target !== document.body) {
    return;
  }
  if (e.shiftKey && ! e.metaKey && ! e.ctrlKey && ! e.altKey) {
    var a = [], click = true;
    switch (e.which) {
      case 33: // PgDn: paginate back
        a = $('.pagination .prev a:eq(0)');
        break;
      case 34: // PgUp: paginate forth
        a = $('.pagination .next a:eq(0)');
        break;
      case 36: // Pos1: homepage
        a = $('a[rel="start"]:eq(0)');
        break;
      case 37: // ArrL: previous element
        a = $('a[rel="prev"]:eq(0)');
        break;
      case 38: // ArrU: containing block
        a = $('a[rel="up"]:eq(0)');
        break;
      case 39: // ArrR: next element
        a = $('a[rel="next"]:eq(0)');
        break;
      case 40: // ArrD: first child
        a = $('.data a:eq(0)');
        click = false;
        break;
      case 83: // S: search
        a = $('a[rel="search"]:eq(0)');
        break;
      case 65: // A: about
        a = $('nav .about a:eq(0)');
        break;
    }
    if (a.length) {
      a.trigger('focus');
      if (click) {
        window.location.href = a[0].href;
      }
      return false;
    }
  }
});


/**
  * make header floating, if window is higher than 500px
  */
if ($(window).height() >= 750) {
  var hd = $('header.hd:eq(0)').addClass('floating'),
      hd_scrolled = true,
      hd_shadow = 0,
      gt_threshold = false;
  hd.next().css({
    marginTop: hd.outerHeight()
  });
  $(window).on('scroll', function() { hd_scrolled = true; });
  window.setInterval(function() {
    if (! hd_scrolled) { return; }
    hd_scrolled = false;
    var t = $(document.scrollElement).scrollTop();
    if (gt_threshold && t > 105) { return; }
    gt_threshold = false;
    if (t <= 15) { hd_shadow = 0;
    } else if (t <= 30) { hd_shadow = 1;
    } else if (t <= 45) { hd_shadow = 2;
    } else if (t <= 60) { hd_shadow = 3;
    } else if (t <= 75) { hd_shadow = 4;
    } else if (t <= 90) { hd_shadow = 5;
    } else              { hd_shadow = 6;
                          gt_threshold = true;
    }
    hd.css({
      boxShadow: '0 '+(hd_shadow-1)+'px '+hd_shadow+'px rgba(0,0,0,.2)'
    });
  }, 50);
}

/**
  * handle the EU cookie law thingy
  */
var cook = $('.cookies');
if (cook.length) {
  cook.append(" ").append($('<a href="#">'+_('Hide this message.')+'</a>')
  .click(function() {
    cook.fadeOut('slow');
    var date = new Date();
    date.setTime(date.getTime()+(2*365*24*60*60*1000));
    var expires = date.toGMTString();
    document.cookie = "_eu=hide; expires="+expires+"; path=/";
    return false;
  }));
}
