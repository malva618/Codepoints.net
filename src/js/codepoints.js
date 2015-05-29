var $ = require('jquery');
var _ = require('components/gettext').gettext;
var representations = require('components/representations');
var load_font = require('components/load_font');

require('components/jquery.glossary');
require('jquery-ui/dialog');

representations();

load_font();

$(document).glossary();

/**
 * handle codepoint's toolbox
 */
var $embed = $('.button--embed[data-link]');
var markup = $($embed.data('link'));
if (markup.length) {
  $embed.on('click', function() {
    markup.dialog({
      title: _('Embed this codepoint'),
      width: Math.min($(window).width(), 600),
      open: function() {
        var range = document.createRange();
        range.selectNodeContents(markup.find('pre')[0]);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  });
}
