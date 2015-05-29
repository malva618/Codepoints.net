var $ = require('jquery');
var gettext = require('components/gettext');
var q = require('components/question');

var _= gettext.gettext;


/* jshint unused:false */
var q_swallow = new q.Question('swallow',
  _('What’s the airspeed velocity of an unladen swallow?'), {
    1: _('An African, or'),
    2: _('A European Swallow?')
});

var q_region = new q.Question('region',
  _('Where does the character appear usually?'), {
    'Africa': _('Africa <small>(without Arabic)</small>'),
    'America': _('America <small>(originally, <i>e. g.</i> Cherokee, not Latin)</small>'),
    'Europe': _('Europe <small>(Latin, Cyrillic, …)</small>'),
    'Middle_East': _('Middle East'),
    'Central_Asia': _('Central Asia'),
    'East_Asia': _('East Asia <small>(Chinese, Korean, Japanese, …)</small>'),
    'South_Asia': _('South Asia <small>(Indian)</small>'),
    'Southeast Asia': _('Southeast Asia <small>(Thai, Khmer, …)</small>'),
    'Philippines': _('Philippines, Indonesia, Oceania'),
    'n': _('Nowhere specific'),
    '': _('I don’t know')
});

var q_number = new q.Question('number',
  _('Is it a number of any kind?'), {
    1: _('Yes'),
    0: _('No'),
    '': _('I don’t know')
});

var q_case = new q.Question('case',
  _('Has the character a case (upper, lower, title)?'), {
    l: _('Yes, it’s lowercase'),
    u: _('Yes, it’s uppercase'),
    t: _('Yes, it’s titlecase'),
    y: _('Yes, but I don’t know the case'),
    n: _('No, it’s uncased'),
    '': _('I don’t know')
});

var q_symbol = new q.Question('symbol',
  _('Is the character some kind of symbol or dingbat?'), {
    s: _('Yes <small>(It isn’t part of usually written text)</small>'),
    c: _('No <small>(But it is some kind of control character)</small>'),
    t: _('No <small>(It may appear in text, like letters or punctuation)</small>'),
    '': _('I don’t know')
});

var q_punc = new q.Question('punctuation',
  _('Is the character some kind of punctuation?'), {
    1: _('Yes'),
    0: _('No'),
    '': _('I don’t know')
});

var q_incomplete = new q.Question('incomplete',
  _('Is the character incomplete on its own, like a diacritic sign?'), {
    1: _('Yes <small>(It’s usually found together with another character)</small>'),
    0: _('No <small>(It stands on its own)</small>'),
    '': _('I don’t know')
});

var q_composed = new q.Question('composed',
  _('Is the character composed of two others?'), {
    1: _('Yes <small>(It is based on two or more other characters)</small>'),
    2: _('Sort of <small>(It’s got some quiggly lines or dots, like “Ä” or “ٷ”)</small>'),
    0: _('No <small>(It is a genuine character)</small>'),
    '': _('I don’t know')
});

var q_confuse = new q.Question('confuse',
  _('Off the top of your head, can the character be confused with another one?'), {
    1: _('Yes <small>(Like latin “A” and greek “Α”, alpha)</small>'),
    '': _('No <small>(I have no such pair in mind)</small>')
});

var q_archaic = new q.Question('archaic',
  _('Is it an archaic character or is it in use today?'), {
    1: _('Yep, noone would use that anymore!'),
    0: _('Nah, seen it yesterday in the newspaper'),
    '': _('I don’t know')
});

var q_strokes = new q.Question('strokes',
  _('Do you know the number of strokes the character has?'), {
    _number: [_('This much'), 1, 64],
    '': _('Nope, never counted them')
});

var q_def = new q.Question('def',
  _('Do you happen to know the meaning of the character?'), {
    _text: _('This is (part of) what I’m looking for'),
    '': _('I don’t speak that language')
});


q_region.setNextForAnswer('Africa', q_number);
q_region.setNextForAnswer('America', q_number);
q_region.setNextForAnswer('Europe', q_number);
q_region.setNextForAnswer('Middle_East', q_number);
q_region.setNextForAnswer('Central_Asia', q_number);
q_region.setNextForAnswer('South_Asia', q_number);
q_region.setNextForAnswer('Southeast_Asia', q_number);
q_region.setNextForAnswer('Philippines', q_number);
q_region.setNextForAnswer('n', q_symbol);
q_region.setNextForAnswer('', q_symbol);

q_region.setNextForAnswer('East_Asia', q_def);
q_def.setNextForAnswer('_text', q_strokes);
q_def.setNextForAnswer('', q_strokes);

q_strokes.setNextForAnswer('_number', q_composed);
q_strokes.setNextForAnswer('', q_composed);

q_number.setNextForAnswer(0, q_symbol);
q_number.setNextForAnswer('', q_symbol);

q_symbol.setNextForAnswer('t', q_punc);
q_symbol.setNextForAnswer('', q_punc);

q_punc.setNextForAnswer(1, q_archaic);
q_punc.setNextForAnswer(0, q_case);
q_punc.setNextForAnswer('', q_case);

q_case.setNextForAnswer('l', q_composed);
q_case.setNextForAnswer('u', q_composed);
q_case.setNextForAnswer('t', q_composed);
q_case.setNextForAnswer('y', q_composed);
q_case.setNextForAnswer('n', q_composed);
q_case.setNextForAnswer('', q_composed);

q_composed.setNextForAnswer(1, q_archaic);
q_composed.setNextForAnswer(2, q_archaic);
q_composed.setNextForAnswer(0, q_incomplete);
q_composed.setNextForAnswer('', q_incomplete);

q_incomplete.setNextForAnswer(1, q_archaic);
q_incomplete.setNextForAnswer(0, q_archaic);
q_incomplete.setNextForAnswer('', q_archaic);

q_archaic.setNextForAnswer(1, q_confuse);
q_archaic.setNextForAnswer(0, q_confuse);
q_archaic.setNextForAnswer('', q_confuse);

q.init($('#wizard_container'), q_region);
