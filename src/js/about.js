/**
 * handle the "about" screen: let sections act like an accordion
 */
var $ = require('jquery');
var _ = require('components/gettext').gettext;
require('document-scroll-element')();

var about = $('.payload.about'),
    sect = about.find('>section'),
    n = 0,
    sel = [];

/* determine initially focused section (deep link) */
if (sect.filter(window.location.hash).length) {
  n = sect.filter(window.location.hash).index();
  window.scrollTo(0,0);
}

sect
  .filter(':not(:eq('+n+'))')
    .hide()
  .end()
  .each(function() {
    var $this = $(this), $next = $this.next('section');
    sel.push('#' + this.id);
    if ($next.length) {
      $this.append('<p><a href="#'+$next[0].id+'"><i>'+_('Read on:')+
                    '</i> “'+$next.find('h1').text()+'”</a></p>');
    }
  });

$(document).on('click tap', 'a[href^="#"]', function() {
  var t, h = this.hash;
  if ($.inArray(h, sel) > -1) {
    t = $(h);
    if (t.filter(':hidden').length) {
      sect.not(t).slideUp();
      window.location.hash = h;
      $(document.scrollElement).animate({scrollTop:0}, 300);
      t.slideDown();
    }
    return false;
  }
});
