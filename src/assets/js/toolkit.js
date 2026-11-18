/* Small shared helpers for the tool pages: query-string state (shareable links), copy to clipboard, escaping. */
(function (root) {
  'use strict';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  // read ?a=1&b=2 into a plain map (own keys only, values as strings; "stats_test" is left alone)
  function read() {
    var out = Object.create(null);
    String(root.location.search || '').replace(/^\?/, '').split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('='), k = i === -1 ? kv : kv.slice(0, i), v = i === -1 ? '' : kv.slice(i + 1);
      try { out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' ')); } catch (e) { /* malformed pair ignored */ }
    });
    return out;
  }
  function query(map) {
    var keep = read().stats_test === '1' ? ['stats_test=1'] : [];
    Object.keys(map).forEach(function (k) { if (map[k] !== '' && map[k] != null) keep.push(encodeURIComponent(k) + '=' + encodeURIComponent(map[k])); });
    return keep.length ? '?' + keep.join('&') : '';
  }
  function url(map, hash) { return root.location.origin + root.location.pathname + query(map) + (hash || ''); }
  // keep the address bar in step with the tool state, without adding history entries
  function sync(map, hash) {
    try { root.history.replaceState(null, '', root.location.pathname + query(map) + (hash == null ? root.location.hash : hash)); } catch (e) { /* file: or blocked */ }
  }
  function copy(text, msg, okText) {
    function say(t) { if (msg) msg.textContent = t; }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'sr';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy') === true; } catch (e) { ok = false; }
      ta.remove();
      say(ok ? (okText || 'Copied.') : 'Could not copy automatically: ' + text);
    }
    if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) root.navigator.clipboard.writeText(text).then(function () { say(okText || 'Copied.'); }, fallback);
    else fallback();
  }
  function download(name, text, type) {
    var blob = new Blob([text], { type: type || 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  root.PPGKit = { esc: esc, read: read, query: query, url: url, sync: sync, copy: copy, download: download };
})(window);
