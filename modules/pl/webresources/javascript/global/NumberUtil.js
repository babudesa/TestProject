/**
 * (c) 2003 Guidewire Software
 *
 * Class: NumberUtil
 *
 * Contains global helper functions for manipluating number data.
 * Feel free to add your own helper functions here.
 */

/**
 * Register the NumberUtil class as a global library
 */
window.NumberUtil = new NumberUtilImpl();

/**
 * Constructor
 */
function NumberUtilImpl() {
  this.thousandsSymbol = ',';
  this.decimalSymbol = '.';
//  this.currencyPattern = '$#';
//  this.negativeCurrencyPattern = '($#)';

  this.multiCurrencyMode = false;
  this.defaultCurrency = null;
  this.positivePatternPrefixes = {"null":"$"};
  this.positivePatternSuffixes = {"null":""};
  this.negativePatternPrefixes = {"null":"($"};
  this.negativePatternSuffixes = {"null":")"};
  this.storageScales = {"null":"2"};
}

/**
 * Records locale settings from the current locale
 */
NumberUtilImpl.prototype.setLocale = function(thousandsSymbol, decimalSymbol,
                                              currencyPattern, negativeCurrencyPattern) {
  this.thousandsSymbol = thousandsSymbol;
  this.decimalSymbol = decimalSymbol;
//  this.currencyPattern = currencyPattern;
//  this.negativeCurrencyPattern = negativeCurrencyPattern;
}

/**
 * Sets the currency formatting patterns for each Currency in the system.
 */
NumberUtilImpl.prototype.setCurrencyPatterns = function(jsonArg) {
  this.positivePatternPrefixes = jsonArg.positivePatternPrefixes;
  this.positivePatternSuffixes = jsonArg.positivePatternSuffixes;
  this.negativePatternPrefixes = jsonArg.negativePatternPrefixes;
  this.negativePatternSuffixes = jsonArg.negativePatternSuffixes;
  this.storageScales = jsonArg.storageScales;
  this.multiCurrencyMode = jsonArg.multiCurrencyMode;
  this.defaultCurrency = jsonArg.defaultCurrency;
}

NumberUtilImpl.prototype.getDefaultCurrency = function() {
  return this.defaultCurrency;
}

/**
 * Returns true if at least one character of the value is a digit, OR if the value is blank
 */
NumberUtilImpl.prototype.canBeNumber = function(value) {
  if(!value) {
    return true;
  }
  value = '' + value;
  for(var i = 0; i < value.length; i++) {
    var ch = value.charAt(i);
    if('0123456789'.indexOf(ch) != -1) {
      return true;
    }
  }
  return false;
}

/**
 * Safely converts the value to a number, removing extraneous currency signs and taking
 * localization into account
 */
NumberUtilImpl.prototype.safeConvertToNumber = function(value) {
  if(!value) {
    return 0;
  }
  // Filters all wicked characters out of the value
  var newValue = '';
  var multiplier = 1;
  var decimal = false;
  value = "" + value;
  for(var i = 0; i < value.length; i++) {
    var ch = value.charAt(i);
    if('0123456789'.indexOf(ch) != -1) {
      newValue += ch;
    } else if(ch == this.decimalSymbol) {
      if(!decimal) {
        newValue += '.';
        decimal = true;
      }
    } else if(ch == '-') {
      multiplier = -1;
    } else if(ch == '(') { //For negative currency pattern
      multiplier = -1;
    }
  }
  return (newValue.length > 0) ? Number(newValue) * multiplier : 0;
}

/**
 * Converts value to an integer x where lowerBound >= x <= upperBound.  Guaranteed
 * to return an in-bounds x even if "value" is not a number.
 */
NumberUtilImpl.prototype.toBoundedInt = function(value, lowerBound, upperBound) {
  var x = Math.floor(value);
  if (isNaN(x)) {
    x = 0;
  }
  if (x > upperBound) {
    x = upperBound;
  }
  if (x < lowerBound) {
    x = lowerBound;
  }
  return x;
}

/**
 * Renders the number to an internationalized string
 */
NumberUtilImpl.prototype.convertNumberToString = function(value) {
  var value = value + '';
  var newValue = '';
  var isNegative = '';
  for (var i = 0; i < value.length; i++) {
    var c = value.charAt(i);
    if ('0123456789'.indexOf(c) != -1) {
      newValue += c;
    } else if (c == '.') {
      newValue += this.decimalSymbol;
    } else if (c == '-') {
      isNegative = '-';
    }
  }
  while (newValue.charAt(0) == '0') { // Remove preceding 0s
    newValue = newValue.substring(1);
  }
  if (newValue == '') {
    newValue = '0';
    isNegative = '';
  }
  if (isNegative == '-' && newValue.charAt(0) == this.decimalSymbol) {
    newValue = '0' + newValue;
  }
  var pointIndex = newValue.indexOf(this.decimalSymbol);
  if (pointIndex == -1) {
    return isNegative + this.addThousandsSymbols(newValue);
  } else {
    return isNegative + this.addThousandsSymbols(newValue.substring(0, pointIndex)) + newValue.substring(pointIndex);
  }
}

/**
 * Ensures a number has the given number of digits after the decimal point;
 * Round, then internationalize the number.
 */
NumberUtilImpl.prototype.convertNumberToFixed = function(value, digitsAfterPoint) {
  // rewritten for CC-48075 - incorrect rounding when digit to round up is 9

  // backwards compatibility: if incoming value is a string
  value = this.safeConvertToNumber(this.convertNumberToString(value));

  var roundedValue = value.toFixed(digitsAfterPoint);
  var strValue = this.convertNumberToString(roundedValue);
  // for backwards compatibility
  var pointIndex = strValue.indexOf(this.decimalSymbol);
  if (pointIndex == 0) {
    strValue = "0" + strValue;
  }
  return strValue;
}

/**
 * Converts a number to a currency in the form of $99,999.99
 */
NumberUtilImpl.prototype.convertNumberToCurrency = function(value) {
  return NumberUtil.convertNumberToMulticurrency(value, null);
}

/**
 * Converts a number to a currency in the form of $99,999.99
 */
NumberUtilImpl.prototype.convertNumberToMulticurrency = function(value, currency) {
  if (currency == undefined || currency == null) {
    currency = "null";
  }
  value = NumberUtil.convertNumberToFixed(value, this.storageScales[currency]);
  var patternPrefix = this.positivePatternPrefixes[currency];
  var patternSuffix = this.positivePatternSuffixes[currency];
  if (value.charAt(0) == '-') {
    value = value.substring(1);
    patternPrefix = this.negativePatternPrefixes[currency];
    patternSuffix = this.negativePatternSuffixes[currency];
  }
  return patternPrefix + value + patternSuffix;
  }

/**
 * Left-pads 0s to an integer number up to the given string length
 */
NumberUtilImpl.prototype.zeroFill = function(number, length) {
  var result = '' + number;
  while (result.length < length) {
    result = '0' + result;
  }
  return result;
}

/**
 * Private: adds commas to a series of digits.
 */
NumberUtilImpl.prototype.addThousandsSymbols = function(value) {
  var numDigits = value.length;
  if (value.charAt(0) == '-') {
    numDigits--;
  }
  var index = value.length;
  for (var i = 3; i < numDigits; i += 3) {
    index -= 3;
    value = value.substring(0, index) + this.thousandsSymbol + value.substring(index);
  }
  return value;
}
