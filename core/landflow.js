/* core/landflow.js — the return leg to LandFlow. ONE PRODUCT, two renderers.
 *
 * When a module finishes here, the estate's brain must know within one message: the completion
 * writes the SAME tables a teaching moment writes (person_training + person_shown), and the
 * worker lands back in Telegram with what CHANGED because they watched — "agora estás mostrado
 * na máquina de soldar nova". Without that return message, the Academy is a place you get sent
 * and abandoned.
 *
 * Identity is Telegram-rooted, no second login ever: the bot's /codigo (6 digits, 10-min TTL)
 * exchanges here for a long-lived token via POST /pair — the exact pairing path the Mini App
 * uses. There is no password field in this file, by design.
 *
 * Offline-honest: completions queue in localStorage and flush when signal returns. A dead zone
 * may delay the record; it may never lose it.
 */
(function () {
  'use strict';
  /* the companion-app endpoint belongs to THIS instance. Hard-coded, every
     stamped academy called the founding tenant's worker. Absent = feature off. */
  var LF = (window.BRAND && window.BRAND.landflow) || '';
  if (!LF) return;
  var TKEY = 'lf_token', QKEY = 'lf_queue';

  function tok() { try { return localStorage.getItem(TKEY); } catch (e) { return null; } }
  function q() { try { return JSON.parse(localStorage.getItem(QKEY) || '[]'); } catch (e) { return []; } }
  function qset(a) { try { localStorage.setItem(QKEY, JSON.stringify(a.slice(-20))); } catch (e) {} }
  /* the app keeps the language in its state, not under a 'lang' key — read it there, EN otherwise */
  function pt() { try { return String((typeof S !== 'undefined' && S && S.lang) || 'en').indexOf('pt') === 0; } catch (e) { return false; } }

  /* ── the one entry point, called from app.js at module_complete ── */
  window.lfModuleComplete = function (courseId, mod) {
    var a = q(); a.push({ course_id: courseId, mod: mod, at: Date.now() }); qset(a);
    if (!tok()) { pairChip(); return; }
    flush(true);
  };

  function flush(showUi) {
    var a = q();
    if (!a.length || !tok()) return;
    var item = a[0];
    fetch(LF + '/miniapi/academy-complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-app-token': tok() },
      body: JSON.stringify({ course_id: item.course_id, mod: item.mod })
    }).then(function (r) {
      if (r.status === 401) { try { localStorage.removeItem(TKEY); } catch (e) {} pairChip(); throw new Error('token'); }
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (d) {
      qset(q().slice(1));
      if (showUi) doneBar(d, item);
      flush(false);                       /* drain the rest quietly */
    }).catch(function () { /* stays queued; next completion or next load retries */ });
  }

  /* ── the confirmation + Resolveu bar (S6) — same affordances the bot gives ── */
  function doneBar(d, item) {
    kill('lf-bar');
    var b = document.createElement('div');
    b.id = 'lf-bar';
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;background:#121714;' +
      'border:1px solid #2a332d;border-radius:12px;padding:14px 16px;color:#EDEAE3;' +
      'font:15px/1.45 -apple-system,system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.5)';
    var shown = (d.shown_on && d.shown_on.length)
      ? '<div style="margin-top:4px;color:#5FA88B">' +
        (pt() ? 'Agora estás mostrado em: ' : 'You are now shown on: ') + esc(d.shown_on.join(', ')) + '</div>'
      : '';
    b.innerHTML =
      '<div><b>✅ ' + (pt() ? 'Registado no LandFlow' : 'Recorded in LandFlow') + '</b>' + shown + '</div>' +
      '<div style="display:flex;gap:8px;margin-top:11px;flex-wrap:wrap">' +
      btn('✅ ' + (pt() ? 'Resolveu' : 'It helped'), 'lfFb(1)') +
      btn('❌ ' + (pt() ? 'Não resultou' : 'Did not help'), 'lfFb(0)') +
      (d.bot ? '<a href="' + d.bot + '" style="flex:1;text-align:center;padding:10px;border:1px solid #2a332d;' +
        'border-radius:8px;color:#D9A441;text-decoration:none">💬 ' + (pt() ? 'Perguntar' : 'Ask') + '</a>' : '') +
      '</div>';
    b.dataset.course = item.course_id; b.dataset.mod = item.mod;
    document.body.appendChild(b);
    setTimeout(function () { kill('lf-bar'); }, 45000);
  }

  window.lfFb = function (ok) {
    var b = document.getElementById('lf-bar');
    if (!b || !tok()) return kill('lf-bar');
    fetch(LF + '/miniapi/module-feedback', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-app-token': tok() },
      body: JSON.stringify({ course_id: b.dataset.course, mod: Number(b.dataset.mod), resolved: !!ok })
    }).catch(function () {});
    kill('lf-bar');
  };

  /* ── pairing: /codigo in the bot → 6 digits → token. Shown only when needed, never nags. ── */
  function pairChip(tries) {
    if (document.getElementById('lf-pair') || document.getElementById('lf-bar')) return;
    /* never on top of a check, the takeaways or onboarding — wait until the screen is free */
    if (document.querySelector('.ck-ov.on, .take-overlay.open, #onboard.open, #quizModal.open')) { if ((tries || 0) < 40) setTimeout(function () { pairChip((tries || 0) + 1); }, 3000); return; }
    try { if (Number(localStorage.getItem('lf_pair_snooze') || 0) > Date.now()) return; } catch (e) {}
    var b = document.createElement('div');
    b.id = 'lf-pair';
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;background:#121714;' +
      'border:1px solid #2a332d;border-radius:12px;padding:14px 16px;color:#EDEAE3;' +
      'font:15px/1.45 -apple-system,system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.5)';
    b.innerHTML =
      '<div><b>🔗 ' + (pt() ? 'Liga ao LandFlow' : 'Connect to LandFlow') + '</b><br>' +
      '<span style="color:#9DA69F">' + (pt()
        ? 'Escreve /codigo ao bot no Telegram e põe aqui os 6 dígitos — o teu progresso fica no registo da quinta.'
        : 'Send /codigo to the bot on Telegram and enter the 6 digits — your progress joins the estate record.') + '</span></div>' +
      '<div style="display:flex;gap:8px;margin-top:11px">' +
      '<input id="lf-code" inputmode="numeric" maxlength="6" placeholder="000000" style="flex:1;padding:10px;' +
      'border-radius:8px;border:1px solid #2a332d;background:#0C100E;color:#EDEAE3;font-size:18px;letter-spacing:.2em;text-align:center">' +
      btn('OK', 'lfPair()') + btn('✕', 'lfDismiss()') + '</div>';
    document.body.appendChild(b);
  }

  window.lfPair = function () {
    var code = (document.getElementById('lf-code') || {}).value || '';
    if (!/^\d{6}$/.test(code)) return;
    fetch(LF + '/pair', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code: code, device: 'academy' })
    }).then(function (r) { if (!r.ok) throw new Error('pair'); return r.json(); })
      .then(function (d) {
        try { localStorage.setItem(TKEY, d.token); } catch (e) {}
        kill('lf-pair');
        flush(true);
      })
      .catch(function () {
        var i = document.getElementById('lf-code');
        if (i) { i.value = ''; i.placeholder = pt() ? 'código inválido' : 'invalid code'; }
      });
  };
  window.lfDismiss = function () { kill('lf-pair'); try { localStorage.setItem('lf_pair_snooze', String(Date.now() + 7 * 864e5)); } catch (e) {} };

  function btn(label, call) {
    return '<button onclick="' + call + '" style="flex:1;padding:10px;border-radius:8px;border:1px solid #2a332d;' +
      'background:#1a201c;color:#EDEAE3;font:inherit;cursor:pointer">' + label + '</button>';
  }
  function kill(id) { var el = document.getElementById(id); if (el) el.remove(); }
  function esc(x) { var d = document.createElement('div'); d.textContent = x; return d.innerHTML; }

  /* completions queued in a dead zone (or before pairing) flush on the next load */
  if (tok()) setTimeout(function () { flush(false); }, 3000);
})();
