/*
 * Patch Play Guide – consent decision (pure; unit-tested in tests/logic.test.js).
 * Input: the TCF data from Google's certified CMP, the Consent Mode values the CMP reports
 * (googlefc.getGoogleConsentModeValues) and the initial U.S. state opt-out status.
 * Rules:
 *  - GDPR applies or is unknown: TCF data must be loaded (tcloaded / useractioncomplete) with
 *    purpose 1 consent and vendor consent for Google (vendor id 755); then a purpose is granted only
 *    if its Consent Mode value is GRANTED (1).
 *  - gdprApplies === false: a purpose is granted if its value is GRANTED (1) or NOT_APPLICABLE (3),
 *    and only when the U.S. status is DOES_NOT_APPLY (1) or NOT_OPTED_OUT (2).
 *  - Everything else (missing, denied, errors, unknown enums) stays denied.
 */
(function (root) {
  'use strict';
  var CM_GRANTED = 1, CM_NOT_APPLICABLE = 3;
  var US_OK = [1, 2];
  var GOOGLE_VENDOR = 755;
  var KEYS = {
    ad_storage: 'adStoragePurposeConsentStatus',
    ad_user_data: 'adUserDataPurposeConsentStatus',
    ad_personalization: 'adPersonalizationPurposeConsentStatus',
    analytics_storage: 'analyticsStoragePurposeConsentStatus'
  };

  function allDenied() {
    var o = {};
    Object.keys(KEYS).forEach(function (k) { o[k] = 'denied'; });
    return o;
  }

  // 'gdpr-ok' | 'non-gdpr' | 'none'
  function region(tc) {
    if (!tc || typeof tc !== 'object') return 'none';
    if (tc.gdprApplies === false) return 'non-gdpr';
    var loaded = tc.eventStatus === 'tcloaded' || tc.eventStatus === 'useractioncomplete';
    if (!loaded) return 'none';
    var purpose1 = tc.purpose && tc.purpose.consents && tc.purpose.consents[1] === true;
    var google = tc.vendor && tc.vendor.consents && tc.vendor.consents[GOOGLE_VENDOR] === true;
    return purpose1 && google ? 'gdpr-ok' : 'none';
  }

  function decide(tc, cmValues, usStatus) {
    var out = allDenied();
    var r = region(tc);
    if (r === 'none' || !cmValues || typeof cmValues !== 'object') return out;
    if (r === 'non-gdpr' && US_OK.indexOf(usStatus) === -1) return out;
    Object.keys(KEYS).forEach(function (k) {
      var v = cmValues[KEYS[k]];
      var ok = r === 'gdpr-ok' ? v === CM_GRANTED : (v === CM_GRANTED || v === CM_NOT_APPLICABLE);
      out[k] = ok ? 'granted' : 'denied';
    });
    return out;
  }

  /**
   * "Privacy settings" button. fc = window.googlefc. If the CMP reports that a U.S. state regulation
   * applies (initial status not DOES_NOT_APPLY), open the U.S. opt-out dialog and call
   * done(userDidOptOut) when it closes; otherwise show the GDPR revocation message.
   * The U.S. dialog opens only for a known status NOT_OPTED_OUT (2) or OPTED_OUT (3) (enum values if present)
   * and only when the latest TCF data (tc) does not say gdprApplies === true; UNKNOWN (0) or an EU visitor
   * gets the revocation message so consent can always be withdrawn.
   * Returns 'us' | 'revocation' | 'none'. Never throws.
   */
  function openPrivacyChoices(fc, done, tc) {
    try {
      var u = fc && fc.usstatesoptout;
      if (u && typeof u.getInitialUsStatesOptOutStatus === 'function') {
        var en = u.InitialUsStatesOptOutStatusEnum;
        var notOptedOut = en && typeof en.NOT_OPTED_OUT === 'number' ? en.NOT_OPTED_OUT : 2;
        var optedOut = en && typeof en.OPTED_OUT === 'number' ? en.OPTED_OUT : 3;
        var gdpr = !!(tc && typeof tc === 'object' && tc.gdprApplies === true);
        var status = u.getInitialUsStatesOptOutStatus();
        if ((status === notOptedOut || status === optedOut) && !gdpr && typeof u.openConfirmationDialog === 'function') {
          u.openConfirmationDialog(function (userDidOptOut) { try { if (done) done(!!userDidOptOut); } catch (e) { /* ignore */ } });
          return 'us';
        }
      }
    } catch (e) { /* fall back to the revocation message */ }
    try {
      if (fc && typeof fc.showRevocationMessage === 'function') { fc.showRevocationMessage(); return 'revocation'; }
    } catch (e) { /* CMP unavailable */ }
    return 'none';
  }

  /**
   * Current U.S. opt-out state from the IAB GPP signal (pingData of __gpp 'addEventListener').
   * 3 = opted out (sale, sharing or targeted advertising opt-out = 1, or GPC), 2 = not opted out,
   * null = no usable U.S. section (stay denied).
   */
  function usFromGpp(pingData) {
    if (!pingData || typeof pingData !== 'object' || pingData.signalStatus === 'not ready') return null;
    var ps = pingData.parsedSections;
    if (!ps || typeof ps !== 'object') return null;
    var seen = false, opted = false;
    Object.keys(ps).forEach(function (k) {
      if (k.indexOf('us') !== 0) return;
      var segs = Object.prototype.toString.call(ps[k]) === '[object Array]' ? ps[k] : [ps[k]];
      segs.forEach(function (g) {
        if (!g || typeof g !== 'object') return;
        ['SaleOptOut', 'SharingOptOut', 'TargetedAdvertisingOptOut'].forEach(function (f) {
          if (g[f] === 1) opted = true; else if (g[f] === 0 || g[f] === 2) seen = true;
        });
        if (g.Gpc === true) opted = true;
      });
    });
    return opted ? 3 : (seen ? 2 : null);
  }

  /** U.S. status for decide(): 1 from the initial status, otherwise only the current GPP value. */
  function usEffective(initial, gpp) {
    if (initial === 1) return 1;
    return gpp === 2 || gpp === 3 ? gpp : null;
  }

  /** No Google script on local previews/tests: localhost, 127.0.0.1, ::1, file: or ?stats_test=1. */
  function noGoogle(hostname, protocol, search) {
    if (protocol === 'file:' || /[?&]stats_test=1(&|$)/.test(String(search || ''))) return true;
    var h = String(hostname || '').toLowerCase();
    return h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '[::1]';
  }

  var api = { region: region, decide: decide, allDenied: allDenied, openPrivacyChoices: openPrivacyChoices, usFromGpp: usFromGpp, usEffective: usEffective, noGoogle: noGoogle, US_OPTED_OUT: 3 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGConsent = api;
})(this);
