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

  var api = { region: region, decide: decide, allDenied: allDenied };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PPGConsent = api;
})(this);
