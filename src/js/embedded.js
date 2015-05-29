var $ = require('jquery');
var load_font = require('components/load_font');

$(load_font);
var scr = document.createElement('script');
scr.src = 'https://stats.codepoints.net/piwik.js';
scr.async = true;
document.body.appendChild(scr);
