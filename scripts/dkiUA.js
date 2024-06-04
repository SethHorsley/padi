/*! -- File: dkiUA.js ( Input 0 ) -- */
var dkiUA = (function () {
  var B = !1,
    l = !1,
    m = 0,
    n = !1,
    d,
    C = !1,
    D = 0,
    c = !1,
    e = !1,
    E = !1,
    F = !1,
    G = !1,
    p = 0,
    q = 0,
    r = !1,
    f = !1,
    t = 0,
    b = !1,
    H = !1,
    u = 0,
    g = !1,
    h = !1,
    v = 0,
    w = !1,
    I = !1,
    x = !1,
    y = 0,
    J = !1,
    z = 0,
    V = /webOS/i,
    W = /iphone|ipad|ipod/i,
    K = /OS (\d\_?\d)/i,
    X = /iPad/i,
    A = /Version\/(\d*\.?\d)/i,
    Y = /BlackBerry/i,
    L = /Version\/(\d\.?\d)/i,
    Z = /Android/i,
    M = /Android (\d\.?\d)/i,
    aa = /Android (\d)/i,
    ba = /Android[\/|\d|\.]* *\((\d+\.*\d+)/i,
    ca = /CellCast[^|]*\|([\d.?]*)\|([^|]*)\|([^|]*)/,
    da = /Mobile/i,
    N = /Windows Phone OS|Windows Phone/i,
    ea = /NT (\d\.?\d)/i,
    fa = /OS X (\d\.?\d)/i,
    ga = /Linux\s(\S+)/i,
    O = /Chrome/i,
    ha = /Chrome\/([0-9\.]*)\s/,
    P = /Version\/([0-9]+)/,
    Q = /Edge\/([0-9]+)/,
    R = /Edg\/([0-9])/i,
    S = /Edg\/([0-9]+)/i,
    T = /(MSIE |rv:)([0-9]+)/,
    U = /Firefox\/([0-9]+)/,
    k = null,
    ia = /CrOs/i,
    ja = location.protocol,
    a = {
      os: "",
      osVersion: "",
      browser: "",
      browserVersion: "",
      platform: "",
      userAgent: navigator.userAgent,
    };
  /CellCast/i.test(navigator.userAgent) && (b = w = !0);
  N.test(navigator.userAgent)
    ? (b = c = !0)
    : V.test(navigator.userAgent)
      ? ((b = e = B = !0),
        (a.browser = "webkit"),
        (browserPoperties.os = "webOS"))
      : W.test(navigator.userAgent) ||
          "undefined" != typeof navigator.standalone
        ? ((l = !0),
          (m = K.test(navigator.userAgent)
            ? parseFloat(K.exec(navigator.userAgent)[1])
            : A.test(navigator.userAgent)
              ? parseFloat(A.exec(navigator.userAgent)[1])
              : 13),
          (b = e = !0),
          (a.browser = "safari"),
          (a.os = "ios"),
          (a.osVersion = m),
          (a.platform =
            X.test(navigator.userAgent) || A.test(navigator.userAgent)
              ? "tablet"
              : ""))
        : Y.test(navigator.userAgent)
          ? ((C = !0),
            L.test(navigator.userAgent) &&
              (D = parseFloat(L.exec(navigator.userAgent)[1])),
            (b = !0))
          : N.test(navigator.userAgent)
            ? ((b = c = !0), (a.browser = "ie"), (a.os = "windowsPhone"))
            : Z.test(navigator.userAgent) &&
              ((n = !0),
              (a.browser = "android"),
              (a.os = "android"),
              w
                ? (k = ba.exec(navigator.userAgent))
                  ? (d = parseFloat(k[1]))
                  : ((k = ca.exec(navigator.userAgent)), (d = parseFloat(k[3])))
                : (d = M.exec(navigator.userAgent)
                    ? parseFloat(M.exec(navigator.userAgent)[1])
                    : parseFloat(aa.exec(navigator.userAgent))),
              (a.osVersion = d),
              (a.platform = da.test(navigator.userAgent) ? "" : "tablet"),
              (b = !0));
  /Windows/i.test(navigator.userAgent) &&
    !c &&
    ((E = !0),
    (p = parseFloat(ea.exec(navigator.userAgent)[1])),
    (a.os = "windows"),
    (a.osVersion = p),
    (a.platform = "desktop"));
  !/Mac OS X/i.test(navigator.userAgent) ||
    l ||
    c ||
    ((F = !0),
    (q = parseFloat(fa.exec(navigator.userAgent)[1])),
    (a.os = "mac"),
    (a.osVersion = q),
    (a.platform = "desktop"));
  /Linux/i.test(navigator.userAgent) &&
    !b &&
    ((G = !0),
    (r = ga.exec(navigator.userAgent)[1]),
    (a.os = "linux"),
    (a.osVersion = r),
    (a.platform = "desktop"));
  !/Safari/i.test(navigator.userAgent) ||
    O.test(navigator.userAgent) ||
    n ||
    c ||
    ((f = !0),
    (a.browser = "safari"),
    P.test(navigator.userAgent) &&
      ((t = parseInt(P.exec(navigator.userAgent)[1], "10")),
      (a.browserVersion = t)));
  O.test(navigator.userAgent) &&
    !R.test(navigator.userAgent) &&
    ((g = !0),
    (a.browser = "chrome"),
    ia.test(navigator.userAgent) && (I = !0),
    (a.browserVersion = parseInt(ha.exec(navigator.userAgent)[1], "10")));
  /Internet Explorer|ie|IE|Trident/i.test(navigator.userAgent) &&
    !c &&
    ((H = !0),
    (a.browser = "ie"),
    T.test(navigator.userAgent) &&
      ((u = parseInt(T.exec(navigator.userAgent)[2], "10")),
      (a.browserVersion = u)));
  /WebKit/i.test(navigator.userAgent) && (e = !0);
  /Firefox/i.test(navigator.userAgent) &&
    ((h = !0),
    (a.browser = "firefox"),
    U.test(navigator.userAgent) &&
      ((v = parseInt(U.exec(navigator.userAgent)[1], "10")),
      (a.browserVersion = v)));
  /Edge/i.test(navigator.userAgent) &&
    ((x = !0),
    (f = h = g = !1),
    (a.browser = "edge"),
    Q.test(navigator.userAgent) &&
      ((y = parseInt(Q.exec(navigator.userAgent)[1], "10")),
      (a.browserVersion = y)));
  R.test(navigator.userAgent) &&
    ((f = h = g = x = !1),
    (J = !0),
    (a.browser = "Chromium Edge"),
    S.test(navigator.userAgent) &&
      ((z = parseInt(S.exec(navigator.userAgent)[1], "10")),
      (a.browserVersion = z)));
  a.platform =
    b && "tablet" != a.platform && "desktop" != !a.platform
      ? "smartphone"
      : a.platform;
  ja.match(/file:/) &&
    !b &&
    alert(
      "You are attempting to open a package locally that was meant to be hosted on a web server. Please contact your local server administrator to host the package and make it available to you.",
    );
  return {
    cellcast: w,
    webOS: B,
    iOS: l,
    iOSVersion: m,
    blackberry: C,
    blackberryVersion: D,
    android: n,
    androidVersion: d,
    winPhone: c,
    windows: E,
    windowsVersion: p,
    mac: F,
    macVersion: q,
    linux: G,
    linuxVersion: r,
    safari: f,
    safariVersion: t,
    ie: H,
    chrome: g,
    chromeBook: I,
    ieVersion: u,
    firefox: h,
    firefoxVersion: v,
    mobile: b,
    webKit: e,
    edge: x,
    edgeVersion: y,
    chromiumEdge: J,
    chromiumEdgeVersion: z,
    touchEnabled: "ontouchstart" in document.documentElement,
    isIE: function () {
      return (
        -1 !== navigator.appVersion.indexOf("MSIE") ||
        -1 !== navigator.appVersion.indexOf("Trident/")
      );
    },
    isIE8: function () {
      return -1 !== navigator.appVersion.indexOf("MSIE 8");
    },
    isIE7: function () {
      return -1 !== navigator.appVersion.indexOf("MSIE 7");
    },
    isIE6: function () {
      return -1 !== navigator.appVersion.indexOf("MSIE 6");
    },
    isIE9: function () {
      return -1 !== navigator.appVersion.indexOf("MSIE 9");
    },
    isIE10: function () {
      return -1 !== navigator.appVersion.indexOf("MSIE 10");
    },
    isIE11: function () {
      return (
        -1 == navigator.appVersion.indexOf("MSIE") &&
        0 < navigator.appVersion.indexOf("Trident/")
      );
    },
    getUAProperties: function () {
      return a;
    },
  };
})();
