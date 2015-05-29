var $ = require('jquery');
var gettext = require('components/gettext');

var _= gettext.gettext;


/**
  * a single question for the wizard
  */
function Question(id, text, answers) {
  var q = this;
  q.id = id;
  q.text = text;
  q.prev = null;
  q.next = {};
  q.answers = answers || {};
  q.selected = null;
  q.html = null;
}


/**
  * shared methods for all wizard questions
  */
var QuestionPrototype = {
  current: null,
  addAnswer: function(id, label, next) {
    this.answers[id] = label || id;
    this.next[id] = next;
  },
  setNextForAnswer: function(id, next) {
    this.next[id] = next;
  },
  render: function() {
    if (! this.html) {
      var q = this, i = 0;
      q.html = $('<fieldset id="'+q.id+'" class="question"></fieldset>')
                .append('<legend>'+q.text+'</legend>')
                .data('q', q);
      $.each(q.answers, function(id, label) {
        i += 1;
        if (id === '_number') {
          var counter = $('<input type="number"/>').val(label[1]||0),
              slider = $('<div></div>').slider({
                min: label[1]||0,
                max: label[2]||100,
                change: function() {
                  counter.val($(this).slider('value'));
                },
                slide: function() {
                  counter.val($(this).slider('value'));
                }
              });
          q.html.append($('<div class="number"><p></p><p><button type="button"></button></p></div>')
            .addClass('answer answer_'+i)
            .find('button')
              .html(label[0])
              .on('click tap', function() { q.select(slider.slider('value'),
                                                      q.next[id]); })
            .end().find('p:eq(0)')
              .append(counter)
              .append(slider)
            .end());
        } else if (id === '_text') {
          var txt = $('<input type="text"/>').on('keypress', function(e) {
            if (e.which === 13) {
              $(this).next().click();
              return false;
            }
          });
          q.html.append($('<p class="text"><button type="button"></button></p>')
            .find('button')
              .html(label)
              .before(txt)
              .on('click tap', function() { q.select(txt.val(), q.next[id]); })
            .end().addClass('answer answer_'+i));
        } else {
          q.html.append($('<p><button type="button"></button></p>')
            .find('button')
              .html(label)
              .on('click tap', function() { q.select(id, q.next[id]); })
            .end().addClass('answer answer_'+i));
        }
      });
    }
    return this.html;
  },
  select: function(id, next) {
    var q = this;
    q.selected = id;
    q.html.trigger('question.answered', q);
    if (next) {
      // if there is a next question, show this
      q.html.fadeOut('fast', function() {
        var next_html = next.render();
        QuestionPrototype.current = next;
        next_html.trigger('question.next', {prev:q, next:next});
        next_html.hide().insertAfter(q.html).fadeIn('fast');
        q.html.detach();
      });
      next.prev = q;
    } else {
      finishAsking(q);
    }
  }
};
Question.prototype = QuestionPrototype;


/**
 * finish asking, either by user request or when no next question exists
 */
/* jshint latedef:false */
function finishAsking(q) {
  // collect given answers and make request
  q.html.trigger('question.finish', q);
  var answers = {'_wizard': 1}, q2 = q, i = 0,
      html = $('<fieldset id="wizard_finish">' +
                  '<legend>'+_('Finished!')+'</legend>' +
                '</fieldset>');
  if (q.selected !== null) {
    answers[q.id] = q.selected;
    i += 1;
  }
  while (q2.prev) {
    q2 = q2.prev;
    answers[q2.id] = q2.selected;
    i += 1;
  }
  QuestionPrototype.container.addClass('finished');
  html.append($('<p></p>')
      .text(_('Please wait a second, we’re making those %s answers productive.', i))
      .prepend('<img src="/static/images/ajax.gif" alt="" width="16" height="16"/> '));
  $('#wizard_now').fadeOut('fast');
  q.html.fadeOut('fast', function() {
    html.hide().insertAfter(q.html).fadeIn('fast');
    q.html.detach();
  });
  window.location.href = '?' + $.param(answers);
}


/**
 * initialize the markup
 */
function prepareContainer(container, q1) {
  var ol = $('<ol class="wizcount"/>');
  QuestionPrototype.current = q1;
  QuestionPrototype.container = container;
  container.empty()
      .append(ol)
      .append(q1.render())
      .one('question.answered', function() {
        $(this).after($('<p class="buttonset" id="wizard_now">' +
            '<button type="button">'+_('Enough questions! Search now.')+
            '</button>' +
          '</p>').find('button').on('click', function() {
          finishAsking(QuestionPrototype.current);
        }).end().hide().slideDown());
      })
      .on('question.answered', function(e, q) {
        ol.append(
            $('<li></li>').attr('title', q.text).tooltip()
                .html(q.answers[q.selected])
                .hide().slideDown().on('click', function() {
                  if (container.is('.finished')) {
                    return false; // don't change the set, if there is
                                  // already a request going
                  }
                  var cur = QuestionPrototype.current, li = $(this);
                  li.add(li.nextAll('li')).remove();
                  QuestionPrototype.current = q;
                  q.render().hide().insertAfter(cur.html).fadeIn('fast');
                  cur.html.detach();
                })
        );
      });
}


module.exports.Question = Question;
module.exports.init = prepareContainer;
