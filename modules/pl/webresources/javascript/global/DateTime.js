/**
 * (c) 2004 Guidewire Software
 *
 * Class: DateTime
 *
 * Provides date/time formatting, parsing and related constants (e.g. week
 * names).  Instead of parsing into JavaScript Dates (which have implementation-
 * dependent issues), uses a simplified SimpleDate class.
 *
 * Includes a subset of Java SimpleDateFormat date formatting/parsing.
 *
 * Supports the following format characters:
 * - y, year
 * - M, month
 * - d, day in month
 * - a, am/pm marker
 * - H, hour in day (0-23)
 * - k, hour in day (1-24)
 * - K, hour in am/pm (0-11)
 * - h, hour in am/pm (1-12)
 * - m, minute in hour
 *
 * Does NOT support the following format characters:
 * - E, day in week
 * - G, era
 * - w/W, week in year/month
 * - D, day in year
 * - F, day of week in month
 * - z/Z, time zone
 * - s, second in minute
 * - S, millisecond
 */

// ------------------------------------- HELPER CLASS: SimpleDate

/**
 * Constructor for Class: SimpleDate
 *
 * Simplified version of the JavaScript "Date" object.
 * Has five fields:
 *
 * year:   4 digits
 * month:  from 0 - 11
 * day:    from 1 - 31
 * hour:   from 0 - 23
 * minute: from 0 - 59
 *
 * eraYear: an optional array in the form of [<era>, <year>] (used for Japanese imperial era)
 *
 * If no arguments are passed, then uses the current date
 */
function SimpleDate(year, month, day, hour, minute, second, eraYear) {
  if (year != null) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.eraYear = eraYear;
  } else {
    // current date:
    var jsDate = new Date();
    this.year = jsDate.getYear();
    this.month = jsDate.getMonth();
    this.day = jsDate.getDate();
    this.hour = jsDate.getHours();
    this.minute = jsDate.getMinutes();
    this.second = jsDate.getSeconds();
  }
}

// ------------------------------------- CLASS: DATETIME

/**
 * Register the DateTime class as a global library
 */
window.DateTime = new DateTimeImpl();

/**
 * Constructor
 */
function DateTimeImpl() {

  // Default locale values
  this.monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  this.shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  this.weekdayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  this.shortWeekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  this.amOrPM = ['AM', 'PM'];
  this.dateFormat = 'MM/dd/yyyy';
  this.timeFormat = 'hh:mm aa';
  this.use12HourClock = true;
  this.dateString = "Date";
  this.timeString = "Time";
  this.todayString = "Today";
  this.dateChars = "0123456789AMPMampm :/";
  this.okString = "OK";
}

// ------------------------------------- PUBLIC METHODS

/**
 * Records locale settings from the current locale
 */
DateTimeImpl.prototype.setLocale = function(monthNames, shortMonthNames,
                                            weekdayNames, shortWeekdayNames,
                                            amOrPM, dateFormat, timeFormat,
                                            use12HourClock, dateString, timeString,
                                            todayString, dateChars, twoDigitYearThreshold, okString,
                                            jpCalendarInfo) {
  this.monthNames = monthNames;
  this.shortMonthNames = shortMonthNames;
  this.weekdayNames = weekdayNames;
  this.shortWeekdayNames = shortWeekdayNames;
  this.amOrPM = amOrPM;
  this.dateFormat = dateFormat;
  this.timeFormat = timeFormat;
  this.use12HourClock = use12HourClock;
  this.dateString = dateString;
  this.timeString = timeString;
  this.todayString = todayString;
  this.dateChars = dateChars;
  this.twoDigitYearThreshold = twoDigitYearThreshold;
  this.okString = okString;
  if (jpCalendarInfo) {
    this.jpCalendarInfo = jpCalendarInfo; // Japanese Imperial Calendar info
  }
}

/**
 * Formats a date from the given string.
 *
 * @param date a SimpleDate object
 */
DateTimeImpl.prototype.format = function(date, hasDateComponent, hasTimeComponent, isJpImperial) {
  var result = "";
  var format = this.getDateTimeFormat(hasDateComponent, hasTimeComponent, isJpImperial);
  for (var i = 0; i < format.length; i++) {
    var ch = format.charAt(i);
    if (this.isFormatChar(ch)) {
      var length = this.repeatCount(format, i);
      i += length - 1;
      result += this['format_' + ch](date, length);
    } else {
      result += ch;
    }
  }
  return result;
}

/**
 * Parse a date string according to the given format. Returns a SimpleDate if parsing
 * is successful, null if it isn't.
 */
DateTimeImpl.prototype.parse = function(dateString, hasDateComponent, hasTimeComponent) {
  var result = new SimpleDate(0, 0, 0, 0, 0, 0);
  var dateIndex = 0;
  var format = this.getDateTimeFormat(hasDateComponent, hasTimeComponent);
  for (var formatIndex = 0; formatIndex < format.length; formatIndex++) {
    var formatCh = format.charAt(formatIndex);
    if (dateIndex >= dateString.length) {
      return null;
    }
    if (this.isFormatChar(formatCh)) {
      var length = this.repeatCount(format, formatIndex);
      formatIndex += length - 1;
      var parseCount
        = this['parse_' + formatCh](result, dateString, dateIndex, length);
      if (parseCount <= 0) {
        return null;
      }
      dateIndex += parseCount;
    } else if (dateString.charAt(dateIndex) == formatCh) {
      dateIndex++;
    } else {
      return null;
    }
  }
  return result;
}

/**
 * Makes a four-digit year out of a two-digit year
 */
DateTimeImpl.prototype.makeFourDigitYear = function(year) {
  var numDigits = (Math.floor(year) + "").length;
  year = Math.floor(year);
  if (isNaN(year)) { // Bad year format, use today's year
    return (new Date()).getYear();
  }
  if (numDigits <= 2) {
    if (year < this.twoDigitYearThreshold) {
      year += 2000;
    } else {
      year += 1900;
    }
  } else if (numDigits == 3) {
    year = '1' + year;
  } else if (numDigits > 4) {
    year = '9999';
  }
  return year;
}

/**
 * Calculates the number of days in a given month
 */
DateTimeImpl.prototype.calcDaysInMonth = function(month, year) {
  if (month == '02' && this.isLeapYear(year)) {
    return DAYS_IN_FEB_ON_LEAP_YEAR;
  }
  return DAYS_IN_MONTHS[month - 1];
}

/**
 * Calculates whether a given year is leap year
 */
DateTimeImpl.prototype.isLeapYear = function(year) {
  if ((year / 4)   != Math.floor(year / 4))   return false;
  if ((year / 100) != Math.floor(year / 100)) return true;
  if ((year / 400) != Math.floor(year / 400)) return false;
  return true;
}

// ------------------------------------- PRIVATE FORMATTING METHODS

DateTimeImpl.prototype.getDateTimeFormat = function(hasDateComponent, hasTimeComponent, isJpImperial) {
  var dateFormat = isJpImperial ? this.jpCalendarInfo.dateFormat : this.dateFormat;
  if (hasDateComponent && hasTimeComponent) {
    return dateFormat + ' ' + this.timeFormat;
  } else if (hasTimeComponent) {
    return this.timeFormat;
  } else {
    return dateFormat;
  }
}

/**
 * Is the given character one of the special ones used for formatting dates
 * and times (H,Y etc.)
 */
DateTimeImpl.prototype.isFormatChar = function(ch) {
  return this['format_' + ch] ? true : false;
}

DateTimeImpl.prototype.repeatCount = function(string, index) {
  var start = index;
  var ch = string.charAt(index++);
  while (index < string.length && string.charAt(index) == ch) {
    index++;
  }
  return index - start;
}

/**
 * Formats era
 */
DateTimeImpl.prototype.format_G = function(date, length) {
  return date.eraYear[0]; // no fixed-length for era
}

DateTimeImpl.prototype.format_y = function(date, length) {
  var year = date.eraYear ? date.eraYear[1] : date.year;
  switch (length) {
    case 1:  return '' + date.year;
    case 2:  return NumberUtil.zeroFill(year % 100, 2);
    default: return NumberUtil.zeroFill(year, length);
  }
}

DateTimeImpl.prototype.format_M = function(date, length) {
  if (length == 3) {
    return this.shortMonthNames[date.month];
  } else if (length < 3) {
    return NumberUtil.zeroFill(date.month + 1, length);
  } else {
    return this.monthNames[date.month];
  }
}

DateTimeImpl.prototype.format_d = function(date, length) {
  return NumberUtil.zeroFill(date.day, length);
}

DateTimeImpl.prototype.format_a = function(date, length) {
  return date.hour < 12 ? this.amOrPM[0] : this.amOrPM[1];
}

DateTimeImpl.prototype.format_H = function(date, length) {
  return NumberUtil.zeroFill(date.hour, length);
}

DateTimeImpl.prototype.format_k = function(date, length) {
  return NumberUtil.zeroFill(date.hour == 0 ? 24 : date.hour, length);
}

DateTimeImpl.prototype.format_K = function(date, length) {
  return NumberUtil.zeroFill(date.hour % 12, length);
}

DateTimeImpl.prototype.format_h = function(date, length) {
  var hour = date.hour % 12;
  return NumberUtil.zeroFill(hour == 0 ? 12 : hour, length);
}

DateTimeImpl.prototype.format_m = function(date, length) {
  return NumberUtil.zeroFill(date.minute, length);
}

DateTimeImpl.prototype.format_s = function(date, length) {
  return NumberUtil.zeroFill(date.second, length);
}

// ------------------------------------- PRIVATE PARSING METHODS

/**
 * Starting at the given index in the string, find as many digits as possible
 * and return a string containing all the digits
 */
DateTimeImpl.prototype.parseDigits = function(string, index) {
  var digits = "0123456789";
  var start = index;
  while (index < string.length && digits.indexOf(string.charAt(index)) >= 0) {
    index++;
  }
  return string.substring(start, index);
}

/**
 * Starting at the given index in the string, look for the longest string that
 * matches any element of array
 */
DateTimeImpl.prototype.findMatch = function(string, index, possibilities) {
  var matchIndex = 0;
  var lastMatch = -1;
  for (var i = 0; i < possibilities.length; i++) {
    var possibility = possibilities[i];
    if (index + possibility.length <= string.length) {
      var isMatch = true;
      for (var j = 0; j < possibility.length; j++) {
        if (possibility.charAt(j).toUpperCase() != string.charAt(index + j).toUpperCase()) {
          isMatch = false;
          break;
        }
      }
      if (isMatch && (lastMatch < 0 || possibilities[lastMatch].length < possibility.length)) {
        lastMatch = i;
      }
    }
  }
  return lastMatch;
}

/**
 * SimpleDateFormat compatible two digit year parsing. From JavaDoc:
 * SimpleDateFormat adjusts dates to be within 80 years before and 20 years
 * after the time the SimpleDateFormat  instance is created. For example, using
 * a pattern of "MM/dd/yy" and a SimpleDateFormat instance created on Jan 1,
 * 1997, the string "01/11/12" would be interpreted as Jan 11, 2012 while the
 * string "05/04/64" would be interpreted as May 4, 1964.
 */
DateTimeImpl.prototype.parse_y = function(date, dateString, dateIndex, length) {
  var digits = this.parseDigits(dateString, dateIndex);
  if (digits.length > 0) {
    var value = NumberUtil.safeConvertToNumber(digits);
    if (value < 100) {
      var now = new Date();
      var nowFullYear = now.getFullYear();
      var nowYear = nowFullYear % 100;
      var nowCentury = nowFullYear - nowYear;
      if (nowYear - 80 < 0 && value >= 100 + (nowYear - 80)) {
        value = (nowCentury - 100) + value;
      } else if (nowYear + 20 > 100 && value < (nowYear + 20) - 100) {
        value = (nowCentury + 100) + value;
      } else {
        value = nowCentury + value;
      }
    }
    date.year = value;
  }
  return digits.length;
}

DateTimeImpl.prototype.parse_M = function(date, dateString, dateIndex, length) {
  if (length >= 3) {
    var names = (length == 3) ? this.shortMonthNames : this.monthNames;
    var month = this.findMatch(dateString, dateIndex, names);
    if (month < 0) {
      return 0;
    }
    date.month = month;
    return names[month].length;
  } else if (length < 3) {
    var digits = this.parseDigits(dateString, dateIndex);
    date.month = Math.max(0, NumberUtil.safeConvertToNumber(digits) - 1);
    return digits.length;
  }
}

DateTimeImpl.prototype.parse_d = function(date, dateString, dateIndex, length) {
  var digits = this.parseDigits(dateString, dateIndex);
  if (digits.length > 0) {
    date.day = NumberUtil.safeConvertToNumber(digits);
  }
  return digits.length;
}

DateTimeImpl.prototype.parse_E = function(date, dateString, dateIndex, length) {
  var names = (length < 4) ? this.shortWeekdayNames : this.weekdayNames;
  var day = this.findMatch(dateString, dateIndex, names);
  if (day < 0) {
    return 0;
  }
  return names[day].length;
}

DateTimeImpl.prototype.parse_a = function(date, dateString, dateIndex, length) {
  var amOrPM = this.findMatch(dateString, dateIndex, this.amOrPM);
  if (amOrPM < 0) {
    return null;
  }
  if (amOrPM != 0) {
    date.hour = date.hour + 12;
  }
  return this.amOrPM[amOrPM].length;
}

DateTimeImpl.prototype.parse_H = function(date, dateString, dateIndex, length) {
  var digits = this.parseDigits(dateString, dateIndex);
  if (digits.length > 0) {
    date.hour = NumberUtil.safeConvertToNumber(digits);
  }
  return digits.length;
}

DateTimeImpl.prototype.parse_k = function(date, dateString, dateIndex, length) {
  var digits = this.parseDigits(dateString, dateIndex);
  if (digits.length > 0) {
    date.hour = (digits == 24 ? 0 : NumberUtil.safeConvertToNumber(digits));
  }
  return digits.length;
}

DateTimeImpl.prototype.parse_K = function(date, dateString, dateIndex, length) {
  var digits = this.parseDigits(dateString, dateIndex);
  if (digits.length > 0) {
    date.hour = NumberUtil.safeConvertToNumber(digits);
  }
  return digits.length;
}

DateTimeImpl.prototype.parse_h = function(date, dateString, dateIndex, length) {
  var digits = this.parseDigits(dateString, dateIndex);
  if (digits.length > 0) {
    date.hour = (digits == 12 ? 0 : NumberUtil.safeConvertToNumber(digits));
  }
  return digits.length;
}

DateTimeImpl.prototype.parse_m = function(date, dateString, dateIndex, length) {
  var digits = this.parseDigits(dateString, dateIndex);
  if (digits.length > 0) {
    date.minute = (NumberUtil.safeConvertToNumber(digits));
  }
  return digits.length;
}

DateTimeImpl.prototype.parse_s = function(date, dateString, dateIndex, length) {
  var digits = this.parseDigits(dateString, dateIndex);
  if (digits.length > 0) {
    date.second = (NumberUtil.safeConvertToNumber(digits));
  }
  return digits.length;
}
