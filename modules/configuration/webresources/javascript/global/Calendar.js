/**
 * (c) 2003 Guidewire Software
 *
 * Class: Calendar
 *
 * Defines a "calendar widget" used to help the user fill out date & time values.
 */

// ------------------------------------- CALENDAR CONSTANTS

var DAYS_IN_MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DAYS_IN_FEB_ON_LEAP_YEAR = 29;

var CALENDAR_PICKER_ICON = 'images/calendar_icon.gif';
var CALENDAR_IMAGE_UP = 'images/calendar_up.png';
var CALENDAR_IMAGE_DOWN = 'images/calendar_down.png';
var CALENDAR_IMAGE_CLOSE = 'images/calendar_close.png';
var CALENDAR_IMAGE_COLON = 'images/calendar_colon.png';
var CALENDAR_TRANS_PIXEL = 'images/trans_pixel.gif';
var CALENDAR_IMAGES_TO_LOAD = [CALENDAR_IMAGE_UP,CALENDAR_IMAGE_DOWN,CALENDAR_IMAGE_CLOSE,CALENDAR_IMAGE_COLON];

var CALENDAR_OFFSET_X = -1;
var CALENDAR_OFFSET_Y = 18;
var CALENDAR_ICON_WIDTH = 16;

var NUM_DATE_CONTENT_ROWS = 6;

// ------------------------------------- GLOBAL CALENDAR DATA

/**
 * Currently open calendar, or null
 */
var calendar = null;

/**
 * List of all fields which have calendar pickers
 */
var calendarFields = [];

/**
 * Ascending ID numbers of calendar pickers
 */
var calendarPickerId = 0;

var Calendar_eraNames = []; // an array of localized <era-name>
var Calendar_eraDetails = {}; // key: <era-name>; value: [<start-year(full)>, <max-year(short)>]

// ------------------------------------- TOP-LEVEL CALENDAR FUNCTIONS

/**
 * Create the calendar picker on a given field.  To be called within generated HTML
 */
function makeCalendarPicker(field, tooltip) {
  FieldValidation.setDateFieldValidator(field);
  var calendarFieldIndex = calendarFields.length;
  calendarFields[calendarFieldIndex] = field; 
  var helper = document.getElementById(field.id + '_helper');
  var link = DHTML.createElement('a',
          'id', field.id + '_calendar',
          'onfocus', 'EventHandlers.onFocus(event)',
          'onblur', 'EventHandlers.onBlur(event)');
  helper.insertBefore(link, helper.firstChild);
  var image = document.createElement("img");
  link.appendChild(image);

  link.href = 'javascript:DHTML.getElementById("calendarPicker' + calendarPickerId + '", true).showCalendar()';
  image.calendarField = field;
  DHTML.setFieldToClosure(image, "showCalendar", function() { showCalendar(this.calendarField, this); });
  image.id = 'calendarPicker' + (calendarPickerId++);
  image.alt = tooltip;
  image.src = Events.getResourceURL(CALENDAR_PICKER_ICON);
  image.width = CALENDAR_ICON_WIDTH;
  image.height = 16;
  image.border = 0;
  image.className = 'picker_icon';
}

function toggleCalendarType(elemId, calType) {
  var field = DHTML.getElementById(elemId, true);
  var rawValue = field.tagName == 'INPUT' ? FieldValidation.getUnmaskedInputValue(field) : ''; // retrieve client value if editable
  field.isJpImperial = !field.isJpImperial;
  AJAX.initRequest(field.id, {toggleCalType:calType, value:rawValue}, true)
}

// update imperial date field with new data:
function updateJPImperialCalendar(eId, newValue) {
  var field = document.getElementById(eId);
  if (field.tagName == 'INPUT') {
    FieldValidation.setInputFieldValidator(field.id, ''); // clear old mask before set new value
    field.value = newValue;
    FieldValidation.setDateFieldValidator(field); // set new mask
  } else {
    if (field.value) {
      field.value = newValue;
    }
    field.innerText = newValue;
  }
}

/**
 * Show the calendar on a given field
 */
function showCalendar(field, pickerImage) {
  var oldCalendarField = (calendar == null) ? null : calendar.field;
  var calendarField = field;
  if (calendarField == null) {
    return;
  }
  EventHandlers.doOnFocus(calendarField);
  clearCalendar();
  if (calendarField != oldCalendarField) {
    var left = DHTML.getElementLeft(pickerImage) + CALENDAR_OFFSET_X;
    var top = DHTML.getElementTop(pickerImage) + CALENDAR_OFFSET_Y;
    if (calendarField.isJpImperial) {
      // process date info at server before show calendar:
      parseJPImpDate(
          calendarField.id,
          calendarField.value,
          Calendar_eraNames.length == 0,
          function(){ calendar = new CCCalendar(calendarField, pickerImage, left, top, AJAX.returnValue); })
    } else {
      calendar = new CCCalendar(calendarField, pickerImage, left, top);
    }
  }
}

/**
 * parse jp date info at server
 * @param id
 * @param rawValue
 * @param bGetEras
 * @param callback
 */
function parseJPImpDate (id, rawValue, bGetEras, callback) {
  var params = {'parseJPImpDate':rawValue};
  if (bGetEras) {
    params['getAllEras'] = 'y'; // retrieve all era info, if needed
  }
  AJAX.initRequest(id, params, callback, true)
}

/**
 * Clear the calendar.  If returnFocusToField = true, keyboard focus moves
 * back into the text field.
 */
function clearCalendar(returnFocusToField) {
  if (calendar != null) {
    var calendarField = calendar.field;
    var oldValue = calendar.oldFieldValue;
    calendar.remove();
    calendar = null;
    if (returnFocusToField) {
      calendarField.focus();
    }
    if (calendarField.onchange && oldValue != calendarField.value) {
      calendarField.maskFieldChanged = true;
      calendarField.onchange();
    }
    if (window.event) {
      window.event.returnValue = false;
      window.event.cancelBubble = true;
    }
  }
}

/**
 * True if the calendar is open
 */
function isCalendarOpen() {
  return calendar != null && calendar.mainElement != null;
}

/**
 * Gets the main "div" element of the calendar
 */
function getCalendarElement() {
  return (calendar == null) ? null : calendar.mainElement;
}

// ------------------------------------- MAIN CALENDAR CLASS

/**
 * Constructor
 */
function CCCalendar(field, pickerImage, left, top, jpImpDateInfo) {
  this.field = field;
  this.pickerImage = pickerImage;
  this.field.style.oldFontWeight = this.field.style.fontWeight;
  this.field.style.oldBorderColor = this.field.style.borderColor;
  this.field.style.fontWeight = 'bold';
  this.field.style.borderColor = 'black';
  DHTML.appendToEventHandler(this.field, "onfocus", clearCalendar);
  this.left = left;
  this.top = top;
  if (jpImpDateInfo) {
    if (jpImpDateInfo.eraNames) {
      Calendar_eraNames = jpImpDateInfo.eraNames;
      Calendar_eraDetails = jpImpDateInfo.eraDetails;
    }
    this.jpImpDate = jpImpDateInfo.jpImpDate;
  }
  this.hasDateComponent = !(this.field.isTimeOnly == "true");
  this.hasTimeComponent = (this.field.isTimeOnly == "true") || (this.field.isDateTime == "true");
  this.buildCalendar();
  this.moveFieldToCalendar();
  this.moveCalendarToField();
  this.keepCalendarInWindow();
  DHTML.shimElement(this.mainElement);
}

// ------------------------------------- CALENDAR CREATION / DELETION

/**
 * Build the physical Calendar widget
 */
CCCalendar.prototype.buildCalendar = function() {

  // Make sure all dynamic calendar images get loaded
  this.images = [];
  for (var i = 0; i < CALENDAR_IMAGES_TO_LOAD.length; i++) {
    this.images[i] = new Image();
    this.images[i].src = Events.getResourceURL(CALENDAR_IMAGES_TO_LOAD[i]);
  }

  // Create the calendar from its HTML
  document.body.insertAdjacentHTML('afterBegin', this.getHTML());

  // Find and save the important elements
  this.mainElement = DHTML.getElementById('ccCalendarMain', true);
  this.fieldEchoElement = DHTML.getElementById('calendarFieldEcho', true);
  if (this.hasDateComponent) {
    this.monthElement = DHTML.getElementById('calendarMonth', true);
    this.yearElement = DHTML.getElementById('calendarYear', true);
    this.dayElements = [];
    for (var i = 0; i < (NUM_DATE_CONTENT_ROWS * DateTime.shortWeekdayNames.length); i++) {
      this.dayElements[i] = DHTML.getElementById('calendarDay' + i, true);
    }
    if (this.jpImpDate) {
      this.eraElement = DHTML.getElementById('calendarEra', true);
      for (var ii = 0; ii < Calendar_eraNames.length; ii ++) {
        var eraName = Calendar_eraNames[ii];
        this.eraElement.options[ii] = new Option(eraName,eraName);
      }
    }
  }
  if (this.hasTimeComponent) {
    this.hourElement = DHTML.getElementById('calendarHour', true);
    this.minuteElement = DHTML.getElementById('calendarMinute', true);
    this.AMorPMElement = DHTML.getElementById('calendarAMorPM', true);
  }

  // Put the keyboard focus on the top element
  (this.hasTimeComponent ? this.hourElement : this.eraElement ? this.eraElement : this.monthElement).focus();

}

/**
 * Tear down the DHTML of the Calendadr
 */
CCCalendar.prototype.remove = function() {
  document.body.removeChild(this.mainElement);
  DHTML.unshimElement(this.mainElement);
  this.mainElement = null;
  this.field.style.fontWeight = this.field.style.oldFontWeight;
  this.field.style.borderColor = this.field.style.oldBorderColor;
  this.pickerImage.parentElement.focus();
}

/**
 * Calculates the HTML of the Calendar
 */
CCCalendar.prototype.getHTML = function() {
  var i;

  // Header
  var html = '<div class="calendarMain"' +
             ' style="left:' + this.left + ';top:' + this.top + ';z-index:100"' +
             ' id="ccCalendarMain"' +
             // Don't record onclick within Calender Picker, by canceling event bubble:
             ' onclick="event.cancelBubble=true;" onmousedown="event.cancelBubble=true;">';
  html += '<table border="0" cellspacing="3" cellpadding="0" style="font-size:100%">';
  html += '<tr><td colspan="2" class="calendarTitle">';
  html += '<a href="javascript:clearCalendar()">';
  html += '<img src="' + Events.getResourceURL(CALENDAR_IMAGE_CLOSE) + '" class="calendarCloseBox" border="0" ' +
          'onrecordclick="void(null)" width="11" height="11" alt="Done" align="right">';
  html += '</a>';
  if (!this.hasTimeComponent) {
    html += DateTime.dateString + ':';
  } else if (!this.hasDateComponent) {
    html += DateTime.timeString + ':';
  } else {
    html += DateTime.dateString + ' / ' + DateTime.timeString + ':';
  }
  html += '</td></tr>';

  // Time fields, if we have a time component
  if (this.hasTimeComponent) {
    html += '<tr><td colspan="2" nowrap="true" align="left">';
    html += '<table border="0" cellspacing="0" cellpadding="0" style="font-size:100%"><tr>';
    html += this.getAdjustArrowsHTML('adjustHour', 'mouseWheelHour');
    html += '<td><input class="calendarTextField" id="calendarHour" size="2" maxlength="2"';
    html += ' onchange="calendar.changeTime()" onmousewheel="calendar.mouseWheelHour();return false" style="width:20px"></td>';
    html += '<td width="6" align="center"><img src="' + Events.getResourceURL(CALENDAR_IMAGE_COLON) + '" width="4" height="8" border="0"></td>';
    html += '<td><input class="calendarTextField" id="calendarMinute" size="2" maxlength="2"';
    html += ' onchange="calendar.changeTime()" onmousewheel="calendar.mouseWheelMinute();return false" style="width:20px"></td>';
    html += this.getAdjustArrowsHTML('adjustMinute', 'mouseWheelMinute');
    html += '<td><img src="' + Events.getResourceURL(CALENDAR_TRANS_PIXEL) + '" width="3" height="2"></td>';
    if (DateTime.use12HourClock) {
      html += '<td><select class="calendarSelect" id="calendarAMOrPM" onchange="calendar.changeTime()" onmousewheel="calendar.mouseWheelAMPM();return false" onkeydown="if(window.event.keyCode == 13) clearCalendar()">';
      for (i = 0; i < DateTime.amOrPM.length; i++) {
        html += '<option value="' + DateTime.amOrPM[i] + '">' + DateTime.amOrPM[i] + '</option>';
      }
      html += '</select></td>';
    }
    html += '</tr></table>';
    html += '</td></tr>';
  }

  // Month and year selector, if we have a date component
  if (this.hasDateComponent) {
    var spacerHTML = '<td><img src="' + Events.getResourceURL(CALENDAR_TRANS_PIXEL) + '" width="4" height="2"></td>';
    var monthHTML = '<td><select id="calendarMonth" class="calendarSelect" onchange="calendar.changeMonthOrYear()" onmousewheel="calendar.mouseWheelMonth();return false" onkeydown="if(window.event.keyCode == 13) clearCalendar()">';
    for (i = 1; i <= DateTime.monthNames.length; i++) {
      var monthId = i < 10 ? "0" + i : i;
      monthHTML += '<option value="' + monthId + '">' + DateTime.monthNames[i - 1] + '</option>';
    }
    monthHTML += '</select></td>';

    html += '<tr><td colspan="2">';
    html += '<table border="0" cellspacing="0" cellpadding="0" style="font-size:100%"><tr>';
    if (this.jpImpDate) {
      html += '<td><select id="calendarEra" class="calendarSelect" onchange="calendar.changeEra()"/></td>';
      html += spacerHTML;
      html += '<td><select id="calendarYear" class="calendarSelect" onchange="calendar.changeMonthOrYear()"/></td>';
      html += spacerHTML;
      html += monthHTML;
    } else {
      html += monthHTML;
      html += spacerHTML;
      html += '<td><input class="calendarTextField" style="width:40px" id="calendarYear" size="4" maxlength="4" ' +
              'onchange="calendar.changeMonthOrYear()" onmousewheel="calendar.mouseWheelYear();return false"></td>';
      html += this.getAdjustArrowsHTML('adjustYear', 'mouseWheelYear');
    }
    html += '</tr></table>';
    html += '</td></tr>';
  }

  // Date content table, if we have a date component
  if (this.hasDateComponent) {
    html += '<tr><td colspan="2">';
    html += '<table border="0" cellspacing="3" cellpadding="1" style="font-size:100%" class="calendarDays">';
    html += '<tr>';
    for (i = 0; i < DateTime.shortWeekdayNames.length; i++) {
      html += '<th class="calendarDays" width="14">' + this.shortWeekdayName(i) + '</th>';
    }
    html += '</tr>';
    for (var row = 0; row < NUM_DATE_CONTENT_ROWS; row++) {
      html += '<tr>';
      for (var col = 0; col < DateTime.shortWeekdayNames.length; col++) {
        var dayID = (row * DateTime.shortWeekdayNames.length) + col;
        html += '<td align="center">';
        html += '<a class="calendarDays" href="javascript:calendar.clickDay(' + dayID + ')" ' +
                'id="calendarDay' + dayID + '"></a>';
        html += '</td>';
      }
      html += '</tr>';
    }
    html += '</table>';
    html += '</td></tr>';
  }

  html += '<tr>';
  html += '<td>';
  // "Today" link, if we have a date component
  if (this.hasDateComponent){
    html += '<span class="calendarToday" onClick="calendar.clickToday()">' + DateTime.todayString + "</span>";
  }
  html += '</td>';
  // "OK" button
  html += '<td align="right"><input type="button" style="font-size:8pt" value="' + DateTime.okString + '" onClick="calendar.clickOK()"></td>';
  html += '</tr>';

  // Footer and field echo row
  html += '<tr>';
  html += '<td colspan="2" align="center" id="calendarFieldEcho" class="calendarFieldEcho"></td>';
  html += '</tr>';
  html += '</table></div>';
  return html;
}

/**
 * Calculates the HTML for a table cell of up / down adjustment arrows
 */
CCCalendar.prototype.getAdjustArrowsHTML = function(adjustFunction, mouseWheelFunction) {
  var html = '<td nowrap="true">';
  var tooltip = 'You can also use the mouse wheel to adjust this value';
  html += '<a href="javascript:void(null)">';
  html += '<img src="' + Events.getResourceURL(CALENDAR_IMAGE_UP) + '" width="11" height="8" border="0" alt="' + tooltip + '"';
  html += ' onmousedown="calendar.' + adjustFunction + '(1)" onmousewheel="calendar.' + mouseWheelFunction + '();return false">';
  html += '</a><br>';
  html += '<a href="javascript:void(null)">';
  html += '<img src="' + Events.getResourceURL(CALENDAR_IMAGE_DOWN) + '" width="11" height="8" border="0" alt="' + tooltip + '"';
  html += ' onmousedown="calendar.' + adjustFunction + '(-1)" onmousewheel="calendar.' + mouseWheelFunction + '();return false">';
  html += '</a>';
  html += '</td>';
  return html;
}

/**
 * Makes sure calendar is in the client area
 */
CCCalendar.prototype.keepCalendarInWindow = function() {
  var left = this.left;
  var top = this.top;
  var width = this.width = DHTML.getElementWidth(this.mainElement);
  var height = this.height = DHTML.getElementHeight(this.mainElement);
  var windowRight = document.body.scrollLeft + document.body.clientWidth;
  var windowBottom = document.body.scrollTop + document.body.clientHeight;
  if (left + width > windowRight) {
    left = windowRight - width;
  }
  if (top + height > windowBottom) {
    top = windowBottom - height;
  }
  if (left < document.body.scrollLeft) {
    left = document.body.scrollLeft;
  }
  if (top < document.body.scrollTop) {
    top = document.body.scrollTop;
  }
  if (left != this.left) {
    this.mainElement.style.left = this.left = left;
  }
  if (top != this.top) {
    this.mainElement.style.top = this.top = top;
  }
}

// ------------------------------------- CALENDAR EVENTS

/**
 * Called when the user changes the era
 */
CCCalendar.prototype.changeEra = function() {
  var oldYear = this.yearElement.value;

  this.yearElement.options.length = null;
  var eraName = this.eraElement.value;
  var eraDetail = Calendar_eraDetails[eraName];
  for (var i = 1; i <= eraDetail[1]; i++) {
    var fullYear = eraDetail[0]+i-1;
    var yearSymbol = DateTime.jpCalendarInfo.yearSymbol || '';
    this.yearElement.options[i-1] = new Option(i + yearSymbol, fullYear, oldYear == fullYear)
  }
  this.refreshCalendar();
}

/**
 * Called when the user changes the month or year
 */
CCCalendar.prototype.changeMonthOrYear = function() {
  this.yearElement.value = DateTime.makeFourDigitYear(this.yearElement.value);
  this.refreshCalendar();
}

CCCalendar.prototype.refreshCalendar = function() {
  this.refreshDaysTable();
  this.clearCurrentDay();
  var simpleDate = this.getFieldDate();
  if(this.yearElement.value == simpleDate.year && this.monthElement.value == simpleDate.month){
    this.setCurrentDay(simpleDate.day);
  }
}

/**
 * Called when an arrow button is pressed to adjust the month
 */
CCCalendar.prototype.adjustMonth = function(delta) {
  var newValue = Math.floor(this.monthElement.value) - delta;
  while (newValue > 12) {
    newValue -= 12;
    this.yearElement.value++;
  }
  while (newValue < 1) {
    newValue += 12;
    this.yearElement.value--;
  }
  if (newValue < 10) newValue = "0" + newValue;
  this.monthElement.value = newValue;
  this.changeMonthOrYear();
}

/**
 * Called when an arrow button is pressed to adjust the year
 */
CCCalendar.prototype.adjustYear = function(delta) {
  this.yearElement.value = Math.floor(this.yearElement.value) + delta;
  this.changeMonthOrYear();
}

/**
 * Called when an arrow button is pressed to adjust the hour
 */
CCCalendar.prototype.adjustHour = function(delta) {
  var hour = Math.floor(this.hourElement.value) + delta;
  if (DateTime.use12HourClock) { // Adjust to 12-hour clock
    var am = DateTime.amOrPM[0];
    var pm = DateTime.amOrPM[1];
    if ((hour == 12 && delta == 1) || (hour == 11 && delta == -1)) {
      this.AMorPMElement.value = (this.AMorPMElement.value == am) ? pm : am;
    }
    if (hour < 1) {
      hour = 12;
    } else if (hour > 12) {
      hour = 1;
    }
  } else { // Adjust to 24-hour clock
    if (hour < 0) {
      hour = 23;
    } else if (hour > 23) {
      hour = 0;
    }
  }
  this.hourElement.value = hour;
  this.changeTime();
}

/**
 * Called when an arrow button is pressed to adjust the minute
 */
CCCalendar.prototype.adjustMinute = function(delta) {
  var minute = Math.floor(this.minuteElement.value) + delta;
  if (minute < 0) {
    minute = 59;
  } else if (minute > 59) {
    minute = 0;
  }
  this.minuteElement.value = minute;
  this.changeTime();
}

/**
 * Called when the mouse wheel is used to adjust the AM/PM
 */
CCCalendar.prototype.adjustAMPM = function(delta) {
  if (delta == 1) {
    ampm = DateTime.amOrPM[1];
  } else if (delta == -1) {
    ampm = DateTime.amOrPM[0];
  }
  this.AMorPMElement.value = ampm;
  this.changeTime();
}

/**
 * Called when the user spins the mouse wheel within the month selector
 */
CCCalendar.prototype.mouseWheelMonth = function() {
  if (event.wheelDelta >= 120) {
    this.adjustMonth(1);
  } else if (event.wheelDelta <= -120) {
    this.adjustMonth(-1);
  }
}

/**
 * Called when the user spins the mouse wheel within the year selector
 */
CCCalendar.prototype.mouseWheelYear = function() {
  if (event.wheelDelta >= 120) {
    this.adjustYear(1);
  } else if (event.wheelDelta <= -120) {
    this.adjustYear(-1);
  }
}

/**
 * Called when the user spins the mouse wheel within the hour selector
 */
CCCalendar.prototype.mouseWheelHour = function() {
  if (event.wheelDelta >= 120) {
    this.adjustHour(1);
  } else if (event.wheelDelta <= -120) {
    this.adjustHour(-1);
  }
}

/**
 * Called when the user spins the mouse wheel within the minute selector
 */
CCCalendar.prototype.mouseWheelMinute = function() {
  if (event.wheelDelta >= 120) {
    this.adjustMinute(1);
  } else if (event.wheelDelta <= -120) {
    this.adjustMinute(-1);
  }
}

/**
 * Called when the user spins the mouse wheel within the AM/PM selector
 */
CCCalendar.prototype.mouseWheelAMPM = function() {
  if (event.wheelDelta >= 120) {
    this.adjustAMPM(1);
  } else if (event.wheelDelta <= -120) {
    this.adjustAMPM(-1);
  }
}

/**
 * Called when the user clicks on a day element in the days table
 */
CCCalendar.prototype.clickDay = function(dayId) {
  var firstDayId = this.calcFirstDayId(this.monthElement.value, this.yearElement.value);
  this.setCurrentDay((dayId - firstDayId) + 1);
  this.moveCalendarToField();
  clearCalendar();
}

/**
 * Called when the user clicks on the "today" button
 */
CCCalendar.prototype.clickToday = function() {
  // Get today's date
  var today = new Date();
  var todaysYear = today.getFullYear();
  var todaysMonth = today.getMonth() + 1;
  var todaysDay = today.getDate();
  this.yearElement.value = todaysYear;
  this.changeMonthOrYear();
  if(todaysMonth < 10){
    this.monthElement.value = "0" + todaysMonth;
  } else{
    this.monthElement.value = todaysMonth;
  }
  this.changeMonthOrYear();
  this.setCurrentDay(todaysDay);
  clearCalendar();
}

/**
 * Called when the user clicks the "OK" button
 */
CCCalendar.prototype.clickOK = function() {
  this.moveCalendarToField();
  clearCalendar();
}


/**
 * Called when one of the time elements has changed
 */
CCCalendar.prototype.changeTime = function() {
  var hour = Math.floor(this.hourElement.value);
  var minute = Math.floor(this.minuteElement.value);
  var minHour = DateTime.use12HourClock ? 1 : 0;
  var maxHour = DateTime.use12HourClock ? 12 : 23;
  if (isNaN(hour) || hour > maxHour) {
    hour = maxHour;
  } else if (hour < minHour) {
    hour = minHour;
  }
  if (isNaN(minute) || minute < 0) {
    minute = 0;
  } else if (minute > 59) {
    minute = 59;
  }
  this.hourElement.value = (hour < 10) ? "0" + hour : hour;
  this.minuteElement.value = (minute < 10) ? "0" + minute : minute;
  this.updateEcho();
}

/**
 * Generic mouse down handler: closes the calendar if click is outside its area
 */
CCCalendar.prototype.mouseDownHandler = function() {
  if (DHTML.mouseX < this.left || DHTML.mouseX > this.left + this.width ||
      DHTML.mouseY < this.top  || DHTML.mouseY > this.top + this.height) {
    if (!DHTML.mouseInElement(this.pickerImage, 0)) {
      clearCalendar();
    }
  }
}

/**
 * Called to update the list of days in the table
 */
CCCalendar.prototype.refreshDaysTable = function() {

  // Get selected values
  var month = this.monthElement.value;
  var year = this.yearElement.value;
  var firstDayId = this.calcFirstDayId(month, year);
  var numDays = DateTime.calcDaysInMonth(month, year);

  // Get today's date
  var today = new Date();
  var todaysYear = today.getFullYear();
  var todaysMonth = today.getMonth() + 1;
  var todaysDay = today.getDate();

  // Fill in table
  for (var dayId = 0; dayId < this.dayElements.length; dayId++) {
    var day = (dayId - firstDayId) + 1;
    if (day >= 1 && day <= numDays) {
      var isToday = (day == todaysDay && month == todaysMonth && year == todaysYear);
      this.setDayElementText(dayId, day, isToday);
    } else {
      this.setDayElementText(dayId, null, '');
    }
  }
}

/**
 * Sets the current day both internally and graphically.
 * If out of bounds, goes to nearest in-bounds day
 */
CCCalendar.prototype.setCurrentDay = function(day) {
  var month = this.monthElement.value;
  var year = this.yearElement.value;
  var firstDayId = this.calcFirstDayId(month, year);
  var numDays = DateTime.calcDaysInMonth(month, year);
  day = Math.floor(day);
  if (day < 1) {
    day = 1;
  } else if (day > numDays) {
    day = numDays;
  }
  this.currentDay = day;
  this.currentMonth = parseInt(month,10) - 1;
  this.currentYear = parseInt(year,10);
  this.clearCurrentDay();
  this.currentSelectedDayId = (this.currentDay + firstDayId) - 1;
  this.dayElements[this.currentSelectedDayId].parentElement.className = 'calendarSelectedDay';
  this.updateEcho();
}

CCCalendar.prototype.clearCurrentDay = function() {
  if (this.currentSelectedDayId != null) {
    this.dayElements[this.currentSelectedDayId].parentElement.className = '';
  }
  this.currentSelectedDayId = null;
}

/**
 * Sets the text content of a day element in the days table, also if the day is today
 */
CCCalendar.prototype.setDayElementText = function(dayId, text, isToday) {
  var dayElement = this.dayElements[dayId];
  while (dayElement.firstChild) {
    dayElement.firstChild.removeNode(true);
  }
  if (text != null) {
    dayElement.appendChild(document.createTextNode(text));
  }
  if (isToday) {
    DHTML.addStyleSuffix(dayElement.parentElement, 'calendarDateToday', ' ')
  } else {
    DHTML.removeStyleSuffix(dayElement.parentElement, 'calendarDateToday')
  }
}

function getSimpleDateFromJpImpDate(jpImpDate) {
  var jsDate = new Date(jpImpDate.milliseconds);
  return new SimpleDate(jsDate.getFullYear(), jsDate.getMonth(), jsDate.getDate(),
          jsDate.getHours(), jsDate.getMinutes(), jsDate.getSeconds(), [jpImpDate.era, jpImpDate.yearInEra]);
}

// ------------------------------------- DATE CALCULATION

CCCalendar.prototype.getFieldDate = function() {
  var simpleDate;
  if (this.jpImpDate) { // Japanese Imperial Date info has already been parsed at server side
    simpleDate = getSimpleDateFromJpImpDate(this.jpImpDate);
  } else {
    var date = this.field.value;
    var dateString = '';
    for (var i = 0; i < date.length; i++) { // Filter characters
      var dateChar = date.substr(i, 1);
      if (DateTime.dateChars.indexOf(dateChar) != -1) {
        dateString += dateChar;
      }
    }
    simpleDate = DateTime.parse(dateString, this.hasDateComponent, this.hasTimeComponent);
    if (simpleDate == null && this.hasDateComponent && this.hasTimeComponent) { // Try without time
      simpleDate = DateTime.parse(dateString, true, false);
    }
    if (simpleDate == null) {
      simpleDate = new SimpleDate();
    }
  }

  simpleDate.month = NumberUtil.zeroFill(simpleDate.month + 1, 2);
  return simpleDate;  
}

/**
 * Move the date from the text field (which may have a bad format) to the Calendar widget
 */
CCCalendar.prototype.moveFieldToCalendar = function() {
  this.oldFieldValue = this.field.value; // remember the old field value
  var simpleDate = this.getFieldDate();
  if (this.hasDateComponent) {
    var needsRefresh = (this.yearElement.value != simpleDate.year || this.monthElement.value != simpleDate.month);
    if (simpleDate.eraYear) {
      var oldEra = this.eraElement.value;
      this.eraElement.value = simpleDate.eraYear[0];
      if (this.yearElement.options.length == 0 || oldEra != simpleDate.eraYear[0]) {
        this.changeEra();
      }
    }
    this.yearElement.value = simpleDate.year;
    this.monthElement.value = simpleDate.month;
    if(!this.monthElement.value) {
      this.monthElement.value = "01";
    }
    if (needsRefresh) {
      this.refreshDaysTable();
    }
    this.setCurrentDay(simpleDate.day);
  }
  if (this.hasTimeComponent) {
    this.minuteElement.value = NumberUtil.zeroFill(simpleDate.minute, 2);
    if (DateTime.use12HourClock) {
      var hour = simpleDate.hour % 12;
      this.hourElement.value = NumberUtil.zeroFill(hour == 0 ? 12 : hour, 2);
      this.AMorPMElement.value = simpleDate.hour < 12 ? DateTime.amOrPM[0] : DateTime.amOrPM[1];
    } else {
      this.hourElement.value = NumberUtil.zeroFill(simpleDate.hour, 2);
    }
  }
  this.updateEcho();
}

CCCalendar.prototype.updateEcho = function(dateString) {
  if (this.fieldEchoElement) {
    dateString = dateString || this.getCurrentDateAsString();
    while (this.fieldEchoElement.firstChild) {
      this.fieldEchoElement.firstChild.removeNode(true);
    }
    this.fieldEchoElement.appendChild(document.createTextNode(dateString));
  }
}

/**
 * Move the date from the Calendar widget to the text field
 * @param bValidated if true, the current date string if already validated (only applicable to JP Imperial date)
 */
CCCalendar.prototype.moveCalendarToField = function(bValidated) {
  var oldValue = this.field.value;
  var dateString = this.getCurrentDateAsString();
  this.field.value = dateString;
  this.updateEcho(dateString);

  // validate new JIC date from server, if needed
  if (!bValidated && this.field.isJpImperial && dateString != oldValue) { // a new JIC value that is not yet validated
    var calendarField = this.field;
    var bHasDate = this.hasDateComponent, bHaseTime = this.hasTimeComponent;
    parseJPImpDate(
        calendarField.id,
        dateString,
        false,
        function() {
          var simpleDate = getSimpleDateFromJpImpDate(AJAX.returnValue.jpImpDate)
          calendarField.value = DateTime.format(simpleDate, bHasDate, bHaseTime, calendarField.isJpImperial)
        })
  }
}

CCCalendar.prototype.getCurrentDateAsString = function() {
  var simpleDate = new SimpleDate(0, 0, 0, 0, 0, 0);
  if (this.hasDateComponent) {
    simpleDate.year = this.yearElement.value;
    simpleDate.month = this.monthElement.value - 1;
    simpleDate.day = this.currentDay;
    if (this.eraElement) {
      simpleDate.eraYear = [this.eraElement.value, parseInt(DHTML.getText(this.yearElement),10)];
    }
  }
  if (this.hasTimeComponent) {
    simpleDate.hour = this.hourElement.value;
    simpleDate.minute = this.minuteElement.value;
    if (DateTime.use12HourClock) {
      if (simpleDate.hour == 12) {
        simpleDate.hour = 0;
      }
      if (this.AMorPMElement.value == DateTime.amOrPM[1]) {
        simpleDate.hour = Math.floor(simpleDate.hour) + 12;
      }
    }
  }
  return DateTime.format(simpleDate, this.hasDateComponent, this.hasTimeComponent, this.field.isJpImperial);
}

/**
 * Calculates the table ID of the first day in a given month / year
 */
CCCalendar.prototype.calcFirstDayId = function(month, year) {
  var firstDateOfMonth = new Date(year, month - 1, 1);
  var dayOfWeekOfFirstDate = firstDateOfMonth.getDay();
  return dayOfWeekOfFirstDate;
}

/**
 * Makes sure short weekday is no more than 2 characters
 */
CCCalendar.prototype.shortWeekdayName = function(index) {
  var name = DateTime.shortWeekdayNames[index];
  if (name.length > 2) {
    name = name.substring(0, 2);
  }
  return name;
}
