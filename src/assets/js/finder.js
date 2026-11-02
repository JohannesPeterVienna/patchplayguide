/* Bottleneck Finder – browser UI. The decision tree lives in finder-core.js. */
(function () {
  'use strict';
  var F = window.PPGFinder;
  var tool = document.getElementById('finder');
  if (!F || !tool) return;
  var $ = function (id) { return document.getElementById(id); };
  var TITLES = window.PPG_GUIDE_TITLES || {};
  var path = [];

  function render(focus) {
    var n = F.walk(path);
    if (!n) { path = []; n = F.walk(path); }
    var trail = [], id = F.START;
    path.forEach(function (i) {
      var q = F.QUESTIONS[id];
      trail.push('<li><span class="t-q">' + q.q + '</span> <b>' + q.a[i][0] + '</b></li>');
      id = q.a[i][1];
    });
    $('fd-trail').innerHTML = trail.join('');
    $('fd-trail').hidden = !trail.length;
    var html;
    if (n.kind === 'question') {
      html = '<p class="step">Step ' + (path.length + 1) + '</p><h3 id="fd-h" tabindex="-1">' + n.q + '</h3><div class="answers">' +
        n.answers.map(function (a, i) { return '<button type="button" class="answer" data-i="' + i + '">' + a.label + '</button>'; }).join('') + '</div>';
    } else {
      html = '<p class="step">Result</p><h3 id="fd-h" tabindex="-1">' + n.title + '</h3><p class="cause">' + n.cause + '</p><h4>What to do now</h4><ol class="steps">' +
        n.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol><h4>Read next</h4><ul class="glinks">' +
        n.guides.map(function (g) { return '<li><a href="/guides/' + g + '/">' + (TITLES[g] || g.replace(/-/g, ' ')) + '</a></li>'; }).join('') +
        (n.tool ? '<li><a href="/tools/settings-translator/">Settings Translator – lower-first list for ' + n.tool.toUpperCase() + '</a></li>' : '') + '</ul>';
      if (n.tool) { try { localStorage.setItem('ppg-translator-bottleneck', n.tool); } catch (e) { /* blocked */ } }
    }
    $('fd-stage').innerHTML = html;
    $('fd-back').disabled = !path.length;
    if (focus) $('fd-h').focus();
  }

  $('fd-stage').addEventListener('click', function (e) {
    var b = e.target.closest('button.answer');
    if (!b) return;
    path.push(Number(b.getAttribute('data-i')));
    render(true);
  });
  $('fd-back').addEventListener('click', function () { path.pop(); render(true); });
  $('fd-restart').addEventListener('click', function () { path = []; render(true); });
  render(false);
})();
