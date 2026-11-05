/*
 * Patch Play Guide – interim "Stats check" window (statistics only, since 5 Nov 2026).
 *
 * Why: Google's consent platform (AdSense "Privacy & messaging", TCF 2.2) loads but currently shows no
 * message (displayStatus "hidden"), so no TCF decision arrives and Google Analytics never starts. While that
 * is the case this small window asks for statistics only. It never touches ad_storage, ad_user_data or
 * ad_personalization – they stay "denied" – and it does not change the ad or CMP code.
 *
 * Rules (tests/stats-window.test.js):
 *  - About 3 s after start the latest TCF data is checked (cmpState). The window takes charge only if there is
 *    no decision (no "useractioncomplete", no "tcloaded" with a non-empty tcString), no message on screen
 *    (displayStatus "visible", or cmpuishown not "hidden"/"disabled") and gdprApplies is not false – or if the CMP
 *    sent nothing at all (__tcfapi missing).
 *  - Google's CMP wins: a decision or gdprApplies === false (also later) retires the window for this page
 *    view and deletes the stored window choice; a visible CMP message retires it as well.
 *  - Global Privacy Control or a U.S. opt-out: the window is never shown by itself, no "yes" is stored,
 *    and opened via "Privacy settings" it only explains why statistics stay off.
 *  - Stored in localStorage "ppg-stats" as {v, choice: "yes"|"no", at}; asked again after 12 months,
 *    after a version change, or if the timestamp lies in the future. Blocked storage never throws.
 *  - "no" (now or stored at load) deletes the _ga / _ga_* cookies for every domain variant of the host.
 * The controller is DOM-free (createController(env)); the view below builds the window with textContent only.
 */
(function (root) {
  'use strict';
  var KEY = 'ppg-stats', VERSION = 1, WAIT_MS = 3000, MONTHS = 12;

  /** What Google's CMP has said: 'decided' | 'non-gdpr' | 'shown' | null (nothing usable). */
  function cmpState(tc) {
    if (!tc || typeof tc !== 'object') return null;
    if (tc.gdprApplies === false) return 'non-gdpr';
    if (tc.eventStatus === 'useractioncomplete') return 'decided';
    if (tc.eventStatus === 'tcloaded' && typeof tc.tcString === 'string' && tc.tcString !== '') return 'decided';
    // message on screen: displayStatus "visible", or cmpuishown whose displayStatus is neither "hidden" nor "disabled"
    if (tc.displayStatus === 'visible') return 'shown';
    if (tc.eventStatus === 'cmpuishown' && tc.displayStatus !== 'hidden' && tc.displayStatus !== 'disabled') return 'shown';
    return null;
  }

  /** Storage adapter: every access (including window.localStorage itself) inside try/catch. */
  function safeStorage(getStore) {
    function s() { try { return getStore() || null; } catch (e) { return null; } }
    return {
      get: function (k) { try { var x = s(); return x ? x.getItem(k) : null; } catch (e) { return null; } },
      set: function (k, v) { try { var x = s(); if (x) x.setItem(k, v); } catch (e) { /* blocked: holds for this page view */ } },
      remove: function (k) { try { var x = s(); if (x) x.removeItem(k); } catch (e) { /* blocked */ } }
    };
  }

  function expiry(at) { var d = new Date(at); d.setMonth(d.getMonth() + MONTHS); return d.getTime(); }

  /** Valid stored record or null; anything invalid, expired or dated in the future is removed. */
  function readChoice(store, now) {
    var raw = store.get(KEY);
    if (raw == null) return null;
    var rec = null;
    try { rec = JSON.parse(raw); } catch (e) { rec = null; }
    var ok = !!rec && typeof rec === 'object' && rec.v === VERSION && (rec.choice === 'yes' || rec.choice === 'no') &&
      typeof rec.at === 'number' && isFinite(rec.at) && rec.at <= now && now < expiry(rec.at);
    if (!ok) { store.remove(KEY); return null; }
    return { v: rec.v, choice: rec.choice, at: rec.at };
  }
  function saveChoice(store, choice, now) {
    var rec = { v: VERSION, choice: choice, at: now };
    store.set(KEY, JSON.stringify(rec));
    return rec;
  }

  /** Cookie strings that expire every _ga / _ga_* cookie for the host and each parent domain (not the TLD). */
  function gaCookieDeletes(cookieString, hostname) {
    var names = [];
    String(cookieString || '').split(';').forEach(function (c) {
      var n = c.split('=')[0].replace(/^\s+|\s+$/g, '');
      if (/^_ga($|_)/.test(n) && names.indexOf(n) === -1) names.push(n);
    });
    var parts = String(hostname || '').toLowerCase().split('.').filter(Boolean);
    var scopes = [''];
    if (!/^[\d.]+$/.test(hostname || '')) for (var i = 0; i < parts.length - 1; i++) scopes.push('; domain=.' + parts.slice(i).join('.'));
    var out = [];
    names.forEach(function (n) {
      scopes.forEach(function (d) { out.push(n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/' + d); });
    });
    return out;
  }

  /**
   * env: store (safeStorage), now(), later(fn, ms), gpc (bool), usOptOut() (U.S. opt-out known), scope ('auto' | 'settings'), tc() (latest TCF
   * data or null), changed() (re-apply consent), eraseGa(), view ({show(state, focus), hide(returnFocus), say(text)}).
   * phase: 'waiting' (first ~3 s) | 'active' (window decides analytics) | 'retired' (Google's CMP decides)
   *        | 'settings' (page without ads and analytics: the window only views/changes the stored choice).
   */
  function createController(env) {
    var phase = env.scope === 'settings' ? 'settings' : 'waiting';
    var choice = null;

    function call(fn) { try { fn(); } catch (e) { /* never break the page */ } }
    function changed() { call(env.changed); }
    function usOut() { try { return !!(env.usOptOut && env.usOptOut()); } catch (e) { return true; } }
    function blocked() { return !!env.gpc || usOut(); }   // GPC or U.S. opt-out: nothing can be allowed
    function state() { return { phase: phase, choice: choice, gpc: !!env.gpc, us: !env.gpc && usOut() }; }

    function retire(forget) {
      if (phase === 'settings') {   // Google's CMP loaded on request on a page without ads: its decision wins, GA stays off here
        if (forget) { env.store.remove(KEY); choice = null; call(function () { env.view.update(state()); }); }
        return;
      }
      if (forget) { env.store.remove(KEY); choice = null; }
      if (phase === 'retired') return;
      phase = 'retired';
      choice = null;
      call(function () { env.view.hide(false); });
      changed();
    }
    function check(manual) {
      if (phase !== 'waiting') return;
      var s = cmpState(env.tc());
      if (s) { retire(s !== 'shown'); return; }
      phase = 'active';
      choice = readChoice(env.store, env.now());
      changed();
      if (!manual && !choice && !blocked()) call(function () { env.view.show(state(), false); env.view.say('A question about visit statistics appeared at the bottom of the page.'); });
    }

    return {
      start: function () {
        var rec = readChoice(env.store, env.now());
        if ((rec && rec.choice === 'no') || env.gpc) call(env.eraseGa);   // declined earlier or GPC: no GA cookie may linger
        if (phase === 'settings') return;
        env.later(check, WAIT_MS);
      },
      /** Every TCF event: a decision, gdprApplies false or a visible CMP message ends the window (also later). */
      cmpUpdate: function (tc) {
        var s = cmpState(tc);
        if (s) retire(s !== 'shown');
      },
      inCharge: function () { return phase === 'active'; },
      granted: function () { return phase === 'active' && !blocked() && !!choice && choice.choice === 'yes'; },
      phase: function () { return phase; },
      /** "Privacy settings": true if the window opened, false if Google's CMP should be opened instead. */
      open: function () {
        if (phase === 'waiting') check(true);   // clicked within the first ~3 s: decide now, open once (no second automatic opening)
        if (phase === 'retired') return false;
        if (phase === 'settings') choice = readChoice(env.store, env.now());
        call(function () { env.view.show(state(), true); });
        return true;
      },
      choose: function (c) {
        if (c !== 'yes' && c !== 'no') return;
        if (phase === 'retired' || (c === 'yes' && blocked())) { call(function () { env.view.hide(true); }); return; }   // never store a "yes" that cannot apply
        var rec = saveChoice(env.store, c, env.now());
        if (phase === 'active' || phase === 'settings') choice = rec;
        if (c === 'no') call(env.eraseGa);
        changed();
        call(function () { env.view.hide(true); env.view.say(c === 'yes' ? 'Statistics allowed. You can change this under Privacy settings.' : 'Statistics declined. Google Analytics stays off.'); });
      },
      /** Re-render an open window (e.g. a U.S. opt-out arrived while it is on screen). */
      refresh: function () { call(function () { env.view.update(state()); }); },
      /** × / Escape / Close: nothing is stored, statistics stay off. */
      dismiss: function () { call(function () { env.view.hide(true); }); },
      state: state
    };
  }

  /* ---------------- view (browser only) ---------------- */
  function longDate(ms) {
    try { return new Date(ms).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); } catch (e) { return new Date(ms).toDateString(); }
  }
  function createView(doc, handlers) {
    var box = null, live = null, opener = null, parts = {}, manual = false;
    // Escape closes the open window from anywhere – unless another open dialog/menu or the page already handled it
    function onKey(e) {
      if ((e.key !== 'Escape' && e.key !== 'Esc') || e.defaultPrevented || !box || box.hidden) return;
      var a = doc.activeElement;
      if (a && !box.contains(a) && a.closest && a.closest('dialog[open], [role="dialog"], [role="menu"], [role="listbox"], [aria-expanded="true"]')) return;
      e.preventDefault();
      handlers.dismiss();
    }
    function el(tag, cls, text) { var n = doc.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
    function build() {
      box = el('section', 'statcheck');
      box.id = 'statcheck';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'false');
      box.setAttribute('aria-labelledby', 'statcheck-h');
      box.setAttribute('aria-describedby', 'statcheck-txt');
      box.hidden = true;
      var bar = el('div', 'statcheck-bar');
      bar.appendChild(el('span', 'statcheck-tag', 'Stats check'));
      bar.appendChild(el('span', 'statcheck-opt', 'optional · not for ads'));
      var x = el('button', 'statcheck-x', '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close without choosing – statistics stay off');
      x.setAttribute('data-stat-close', '');
      bar.appendChild(x);
      box.appendChild(bar);
      var inner = el('div', 'statcheck-in');
      parts.h = el('h2', 'statcheck-h', 'Count this visit?');
      parts.h.id = 'statcheck-h';
      parts.h.setAttribute('tabindex', '-1');
      inner.appendChild(parts.h);
      parts.txt = el('p', 'statcheck-txt');
      parts.txt.id = 'statcheck-txt';
      inner.appendChild(parts.txt);
      parts.now = el('p', 'statcheck-now');
      inner.appendChild(parts.now);
      parts.pick = el('div', 'statcheck-pick');
      [['yes', 'Allow'], ['no', 'Decline']].forEach(function (b) {
        var n = el('button', 'statcheck-btn', b[1]); n.type = 'button'; n.setAttribute('data-stat', b[0]); parts.pick.appendChild(n);
      });
      inner.appendChild(parts.pick);
      // pages without ads: Google's own choices (ad consent withdrawal, U.S. opt-out) are loaded only on request
      parts.g = el('p', 'statcheck-google');
      var gb = el('button', 'linklike statcheck-gbtn', 'Open Google’s ad & U.S. privacy choices');
      gb.type = 'button'; gb.setAttribute('data-stat-google', '');
      parts.g.appendChild(gb);
      parts.one = el('div', 'statcheck-pick statcheck-pick-one');
      var c = el('button', 'statcheck-btn', 'Close'); c.type = 'button'; c.setAttribute('data-stat-close', '');
      parts.one.appendChild(c);
      inner.appendChild(parts.one);
      inner.appendChild(parts.g);
      box.appendChild(inner);
      box.addEventListener('click', function (e) {
        var t = e.target && e.target.closest ? e.target : null;
        if (!t) return;
        var pick = t.closest('[data-stat]');
        if (pick) { handlers.choose(pick.getAttribute('data-stat')); return; }
        if (t.closest('[data-stat-google]')) { handlers.google(); return; }
        if (t.closest('[data-stat-close]')) handlers.dismiss();
      });
      live = el('p', 'sr');
      live.id = 'statcheck-live';
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      // early in the tab order (right after the masthead), shown fixed at the bottom
      var mast = doc.querySelector('.mast');
      if (mast && mast.parentNode) { mast.parentNode.insertBefore(box, mast.nextSibling); }
      else doc.body.insertBefore(box, doc.body.firstChild);
      doc.body.appendChild(live);
    }
    function fill(st) {
      var t = parts.txt;
      while (t.firstChild) t.removeChild(t.firstChild);
      var off = st.gpc || st.us;
      if (off) {
        parts.h.textContent = 'Statistics stay off';
        t.appendChild(doc.createTextNode(st.gpc ? 'Your browser sends a Global Privacy Control signal, so Google Analytics stays switched off on this site and we do not ask. '
          : 'You have opted out under a U.S. state privacy law, so Google Analytics stays switched off on this site and we do not ask. '));
        parts.now.textContent = '';
      } else {
        parts.h.textContent = 'Count this visit?';
        t.appendChild(doc.createTextNode('If you allow it, Google Analytics (Google Ireland Ltd.) counts which guides and tools are used and sets cookies (_ga) on your device; data may be processed in the USA. This is only about statistics – it is not consent to advertising. Your choice is kept for 12 months and can be changed under “Privacy settings”. '));
        var rec = st.choice;
        var now = rec ? 'Current choice: ' + (rec.choice === 'yes' ? 'allowed' : 'declined') + ' on ' + longDate(rec.at) + '.' : (st.phase === 'settings' ? 'No choice saved in this browser.' : '');
        if (st.phase === 'settings') now += ' This page loads no statistics and no ads; the choice applies on guide and tool pages. To withdraw consent to ads or to opt out under a U.S. state privacy law, use the button below – Google’s consent script loads only when you click it.';
        parts.now.textContent = now;
      }
      var a = el('a', null, 'Privacy policy'); a.href = '/privacy/#stats-window';
      t.appendChild(a);
      t.appendChild(doc.createTextNode('.'));
      parts.pick.hidden = !!off;
      parts.one.hidden = !off;
      parts.g.hidden = !manual;   // only in a window opened via "Privacy settings", never in the automatic one
    }
    return {
      show: function (st, focus) {
        if (!box) build();
        if (box.hidden) manual = !!focus; else if (focus) manual = true;
        fill(st);
        if (!box.contains(doc.activeElement)) opener = focus ? doc.activeElement : null;
        box.hidden = false;
        doc.body.classList.add('statcheck-open');
        doc.body.style.setProperty('--statcheck-h', box.offsetHeight + 'px');   // footer stays reachable
        if (focus) parts.h.focus();
        doc.addEventListener('keydown', onKey);
      },
      hide: function (returnFocus) {
        if (!box || box.hidden) return;
        var hadFocus = box.contains(doc.activeElement);
        box.hidden = true;
        doc.body.classList.remove('statcheck-open');
        doc.removeEventListener('keydown', onKey);
        if (hadFocus) {
          if (returnFocus && opener && opener.focus) opener.focus();
          else {   // no opener (automatic window): focus goes to the main content, never lost on <body>
            var m = doc.getElementById('main') || doc.querySelector('main');
            if (m) { if (!m.hasAttribute('tabindex')) m.setAttribute('tabindex', '-1'); m.focus(); }
          }
        }
        opener = null;
      },
      update: function (st) {
        if (!box || box.hidden) return;
        var hadFocus = box.contains(doc.activeElement);
        fill(st);
        doc.body.style.setProperty('--statcheck-h', box.offsetHeight + 'px');
        var a = doc.activeElement, n = a, gone = false;
        while (n && n !== box) { if (n.hidden) gone = true; n = n.parentNode; }
        if (hadFocus && gone) parts.h.focus();   // the focused Allow/Decline button was hidden
      },
      say: function (text) {
        if (!live) build();
        live.textContent = '';
        setTimeout(function () { live.textContent = text; }, 60);
      }
    };
  }

  var api = { cmpState: cmpState, safeStorage: safeStorage, readChoice: readChoice, saveChoice: saveChoice, gaCookieDeletes: gaCookieDeletes, createController: createController, createView: createView, KEY: KEY, VERSION: VERSION, WAIT_MS: WAIT_MS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGStats = api;
})(this);
