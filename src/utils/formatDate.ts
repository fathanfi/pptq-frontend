// @ts-nocheck

function nc_get_date_i18N_wp(format, timestamp) {
  var that = this,
    jsdate,
    f,
    formatChr = /\\?(.?)/gi,
    formatChrCb = function (t, s) {
      return f[t] ? f[t]() : s;
    },
    _pad = function (n, c) {
      n = String(n);
      while (n.length < c) {
        n = "0" + n;
      }
      return n;
    };
  f = {
    // Day
    d: function () {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2);
    },
    D: function () {
      // Shorthand day name; Mon...Sun
      return DATE_I18N.day_names_short[f.w()];
    },
    j: function () {
      // Day of month; 1..31
      return jsdate.getDate();
    },
    l: function () {
      // Full day name; Monday...Sunday
      return DATE_I18N.day_names[f.w()];
    },
    N: function () {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7;
    },
    S: function () {
      // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j(),
        i = j % 10;
      if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
        i = 0;
      }
      return ["st", "nd", "rd"][i - 1] || "th";
    },
    w: function () {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay();
    },
    z: function () {
      // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j()),
        b = new Date(f.Y(), 0, 1);
      return Math.round((a - b) / 864e5);
    },

    // Week
    W: function () {
      // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
        b = new Date(a.getFullYear(), 0, 4);
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
    },

    // Month
    F: function () {
      // Full month name; January...December
      return DATE_I18N.month_names[f.n() - 1];
    },
    m: function () {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2);
    },
    M: function () {
      // Shorthand month name; Jan...Dec
      return DATE_I18N.month_names_short[f.n() - 1];
    },
    n: function () {
      // Month; 1...12
      return jsdate.getMonth() + 1;
    },
    t: function () {
      // Days in month; 28...31
      return new Date(f.Y(), f.n(), 0).getDate();
    },

    // Year
    L: function () {
      // Is leap year?; 0 or 1
      var j = f.Y();
      return ((j % 4 === 0) & (j % 100 !== 0)) | (j % 400 === 0);
    },
    o: function () {
      // ISO-8601 year
      var n = f.n(),
        W = f.W(),
        Y = f.Y();
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
    },
    Y: function () {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear();
    },
    y: function () {
      // Last two digits of year; 00...99
      return f.Y().toString().slice(-2);
    },

    // Time
    a: function () {
      // am or pm
      return jsdate.getHours() > 11 ? "pm" : "am";
    },
    A: function () {
      // AM or PM
      return f.a().toUpperCase();
    },
    B: function () {
      // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2,
        // Hours
        i = jsdate.getUTCMinutes() * 60,
        // Minutes
        s = jsdate.getUTCSeconds(); // Seconds
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
    },
    g: function () {
      // 12-Hours; 1..12
      return f.G() % 12 || 12;
    },
    G: function () {
      // 24-Hours; 0..23
      return jsdate.getHours();
    },
    h: function () {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2);
    },
    H: function () {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2);
    },
    i: function () {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2);
    },
    s: function () {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2);
    },
    u: function () {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6);
    },

    // Timezone
    e: function () {
      // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
      /*              return that.date_default_timezone_get();
       */
      throw "Not supported (see source code of date() for timezone on how to add support)";
    },
    I: function () {
      // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0),
        // Jan 1
        c = Date.UTC(f.Y(), 0),
        // Jan 1 UTC
        b = new Date(f.Y(), 6),
        // Jul 1
        d = Date.UTC(f.Y(), 6); // Jul 1 UTC
      return a - c !== b - d ? 1 : 0;
    },
    O: function () {
      // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset(),
        a = Math.abs(tzo);
      return (
        (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + (a % 60), 4)
      );
    },
    P: function () {
      // Difference to GMT w/colon; e.g. +02:00
      var O = f.O();
      return O.substr(0, 3) + ":" + O.substr(3, 2);
    },
    T: function () {
      // Timezone abbreviation; e.g. EST, MDT, ...
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
      /*              var abbr = '', i = 0, os = 0, default = 0;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if (that.php_js && that.php_js.default_timezone) {
        default = that.php_js.default_timezone;
        for (abbr in tal) {
          for (i=0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
*/
      return "UTC";
    },
    Z: function () {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60;
    },

    // Full Date/Time
    c: function () {
      // ISO-8601 date.
      return "Y-m-d\\TH:i:sP".replace(formatChr, formatChrCb);
    },
    r: function () {
      // RFC 2822
      return "D, d M Y H:i:s O".replace(formatChr, formatChrCb);
    },
    U: function () {
      // Seconds since UNIX epoch
      return (jsdate / 1000) | 0;
    },
  };
  const hhhhhhhh = function (format, timestamp) {
    that = this;
    jsdate =
      timestamp === undefined
        ? new Date() // Not provided
        : timestamp instanceof Date
        ? new Date(timestamp) // JS Date()
        : new Date(timestamp * 1000); // UNIX timestamp (auto-convert to int)
    return format.replace(formatChr, formatChrCb);
  };
  return hhhhhhhh(format, timestamp);
}

export default function ncFormatDate(date: string) {
  let d = new Date(date);
  // let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  // let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  // let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  // return `${mo} ${da}, ${ye}`;

  return nc_get_date_i18N_wp(
    frontendObject.allSettings?.generalSettingsDateFormat,
    d.getTime() / 1000
  );
}
