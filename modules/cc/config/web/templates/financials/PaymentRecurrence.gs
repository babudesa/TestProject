<script>

function Recurrence() {
  this.isRecurring = false;
  this.isWeekly = true;
  this.isMonthAbs = false;
  this.isInAdvance = false;
  this.hiddenInput = null;
  this.grossAmount = null;
  this.grossClaimAmount = null;
  this.currency = null;
  this.claimCurrency = null;
  this.setCheckAmounts = null;
  this.setCheckClaimAmounts = null;
  this.dtCh= "/";
}

Recurrence.prototype.defaultFlags = {
  isRecurring:false,
  isWeekly:true,
  isMonthAbs:false,
  isInAdvance:false
}

Recurrence.prototype.ranges = {
  weekCount:[1, null],
  monthAbsDay:[1, 31],
  monthAbsCount:[1, null],
  monthRelCount:[1, null],
  advanceDays:[1, null],
  numChecks:[2, null]
};

var recDefaultsValue = <%=defaultValues%>;

Recurrence.prototype.initialize = function(hiddenInput, isEditing, isApproved, grossAmount, grossClaimAmount, setCheckAmounts, setCheckClaimAmounts, numUneditableChecks, currency, claimCurrency) {

  var useReflectedDefaults = false;
  if (<%=useDefaults%> && recDefaultsValue) {
    useReflectedDefaults = true;
    if (typeof recDefaultsValue == 'number') {
      //assume that only value passed in the hidden recurrenceDefaults field is a numChecks
      recDefaultsValue = "{numChecks:" + recDefaultsValue + ",isRecurring:true}";
    }
  }

  var state = null;

  // if we should use the default values (i.e., recurrence is new and default values exist), merge the
  // defaults with any other values passed by the item handler, otherwise just use the passed values
  // from the hiddenInput field
  if (useReflectedDefaults) {
    if (hiddenInput.value == null || hiddenInput.value == '') {
      state = mergeKeyValueMaps(this.defaultFlags, recDefaultsValue);
    } else {
      state = mergeKeyValueMaps(hiddenInput.value, recDefaultsValue);
    }
  } else {
    state = (hiddenInput.value == null || hiddenInput.value == '' ? this.defaultFlags : eval("(" + hiddenInput.value + ")"));
  }

  for (var field in state) {
    if (field == 'isValid') {
      // Ignore, recompute
    } else if (this.defaultFlags[field] != null) {
      this.setFlag(field, state[field]);
    } else {
      this.setInputValue(field, state[field]);
    }
  }
  if (isEditing && this.isRecurring) {
    // When editing, cannot change from recurring to non recurring
    this.enableInputs(['isRec', 'isNotRec'], false);
  }
  if (isApproved && this.isRecurring) {
    // Once approved, can only change payment count
    this.enableInputsWithinBlock('recurrencePatternExceptForPaymentCount', false);
    this.enableLabels('recurrencePatternExceptForPaymentCount', 'td', false);
  }

  this.hiddenInput = hiddenInput;
  this.grossAmount = grossAmount;
  this.grossClaimAmount = grossClaimAmount;
  this.currency = currency;
  this.claimCurrency = claimCurrency;
  this.setCheckAmounts = setCheckAmounts;
  this.setCheckClaimAmounts = setCheckClaimAmounts;
  if (numUneditableChecks > 2) {
    var range = this.ranges['numChecks'];
    range[0] = numUneditableChecks;
  }

  this.changed();
}

Recurrence.prototype.setRecurring = function(isRecurring) {
  this.isRecurring = isRecurring;
  this.setChecked('isRec', isRecurring);
  this.setChecked('isNotRec', !isRecurring);
  this.enableInputs(['nonRecDate'], !isRecurring);
  this.enableInputs(['isWeekly', 'isMonthly',
                     'isInAdvance',
                     'recDate', 'numChecks'], isRecurring);
  this.enableLabels('recurrencePattern', 'td', isRecurring);
  DHTML.getElementById('recurrenceTotal').disabled = !isRecurring;
  DHTML.getElementById('recurrenceTotalClaimAmount').disabled = !isRecurring;
  this.setWeekly(this.isWeekly);
  this.setInAdvance(this.isInAdvance);
  this.changed();
}

Recurrence.prototype.setWeekly = function(isWeekly) {
  this.isWeekly = isWeekly;
  this.setChecked('isWeekly', isWeekly);
  this.setChecked('isMonthly', !isWeekly);
  this.enableInputs(['weekCount','weekDay'], this.isRecurring && isWeekly);
  this.enableInputs(['isMonthAbs','isMonthRel'], this.isRecurring && !isWeekly );
  this.enableLabels('weekBody', 'div', isWeekly);
  this.enableLabels('monthBody', 'div', !isWeekly);
  this.setMonthAbs(this.isMonthAbs);
  this.changed();
}

Recurrence.prototype.setMonthAbs = function(isMonthAbs) {
  this.isMonthAbs = isMonthAbs;
  this.setChecked('isMonthAbs', isMonthAbs);
  this.setChecked('isMonthRel', !isMonthAbs);
  this.enableInputs(['monthAbsDay','monthAbsCount'], this.isRecurring && !this.isWeekly && isMonthAbs);
  this.enableInputs(['monthRelWeek','monthRelDay','monthRelCount'], this.isRecurring && !this.isWeekly && !isMonthAbs);
  this.changed();
}

Recurrence.prototype.setInAdvance = function(isInAdvance) {
  this.isInAdvance = isInAdvance;
  this.setChecked('isInAdvance', isInAdvance);
  this.enableInputs(['advanceDays'], isInAdvance);
  this.changed();
}

Recurrence.prototype.setNonRecDate = function(nonRecDate) {
  this.setInputValue('nonRecDate', nonRecDate);
  this.changed();
}

Recurrence.prototype.getNonRecDate = function() {
  return this.getInputValue('nonRecDate');
}

Recurrence.prototype.setRecDate = function(recDate) {
  this.setInputValue('recDate', recDate);
  this.changed();
}

Recurrence.prototype.getRecDate = function() {
  return this.getInputValue('recDate');
}

Recurrence.prototype.inputChanged = function(id) {
  this.setInputStyle(id);
  this.changed();
}

// Internal methods

Recurrence.prototype.setFlag = function(id, value) {
  var setter = "set" + id.substring(2, id.length);
  if (this[setter]) {
    this[setter](value);
  }
}

Recurrence.prototype.setInputValue = function(id, value) {
  var input = DHTML.getElementById(id);

  if (!input) {
    return;
  }

  if (input.value != value) {
    input.value = value;
  }
  this.setInputStyle(id);
}

Recurrence.prototype.getInputValue = function(id) {
  return DHTML.getElementById(id).value;
}

Recurrence.prototype.setChecked = function(id, on) {
  var input = DHTML.getElementById(id);
  if (on != input.checked) {
    input.checked = on;
  }
}

Recurrence.prototype.enableInputs = function(ids, enabled) {
  for (var i = 0; i < ids.length; i++) {
    var input = DHTML.getElementById(ids[i])
    if (input == null) {
      DHTML.alert("Could not find " + ids[i]);
    }
    this.enableInput(input, enabled);
    var requiredMarker = DHTML.getElementById(ids[i]+"_rm");
    if (requiredMarker != null) {
      this.showOrHideRequiredMarker(requiredMarker, enabled);
    }
  }
}

Recurrence.prototype.enableInputsWithinBlock = function(blockId, enabled) {
  var allInputs = [
    DHTML.getElementById(blockId).getElementsByTagName('input'),
    DHTML.getElementById(blockId).getElementsByTagName('select')
  ];
  for (var i = 0; i < allInputs.length; i++) {
    var inputs = allInputs[i];
    for (var j = 0; j < inputs.length; j++) {
      this.enableInput(inputs[j], enabled);
    }
  }
}

Recurrence.prototype.enableInput = function(input, enabled) {
  input.disabled = !enabled;
  this.setInputStyle(input.id);
}

Recurrence.prototype.showOrHideRequiredMarker = function(element, show) {
  if( show )
    element.src = "images/required.gif";
  else
    element.src = "images/notrequired.gif";
}

Recurrence.prototype.setInputStyle = function(id) {
  var input = DHTML.getElementById(id);
  var isText = input.type == 'text';
  var isSelect = input.type == 'select-one';
  if (isText || isSelect) {
    var style = isSelect ? null : 'textBox';
    if (!input.disabled && !this.isInputValid(id)) {
      style = isSelect ? 'select_error' : 'textBox textBox_error';
    }
    if (input.className != style) {
      input.className = style;
    }
  }
}

Recurrence.prototype.enableLabels = function(id, tagname, enable) {
  var cells = DHTML.getElementById(id).getElementsByTagName(tagname);

  for (var i=0; i<cells.length; i++) {
    var cell = cells[i];
    if( enable ) {
      if (cell.className == "disabled")
        cell.className = "";
      else if (cell.className == "inputLabel disabled")
        cell.className = "inputLabel";
      // else ???
    } else {
      if (cell.className == "")
        cell.className = "disabled";
      else if (cell.className == "inputLabel")
        cell.className = "inputLabel disabled";
      // else ???
    }
  }
}

Recurrence.prototype.isInputValid = function(id) {
  if (id == 'numChecks') {
    DHTML.getElementById('paymentCountErrorMessage').value = "";
  }

  var input = DHTML.getElementById(id);
  var inputValue = input.value;
  if (inputValue == null || inputValue == '') {
    return false;
  }

  if (id == 'nonRecDate' || id == 'recDate') {
    if (!this.isDate(inputValue, id)) {
      return false;
    }
  }
  var range = this.ranges[id];
  if (range == null) {
    return true;
  }
  var inputIntValue = this.convertToInteger(inputValue);
  if (inputIntValue == null) {
    return false;
  }

  var valid = (range[0] == null || range[0] <= inputIntValue)
    && (range[1] == null || range[1] >= inputIntValue);

  if (id == 'numChecks' && !valid && inputIntValue > 1) {
      DHTML.getElementById('paymentCountErrorMessage').value = '<%=javaScriptStringEscaper.escape(displaykey.Velocity.NewPayment.Recurrence.IllegalCheckDeletionAttempted)%>';
  }

  return valid;
}

Recurrence.prototype.convertToInteger = function(string) {
  if (string == null || string == '') {
    return null;
  }
  var result = 0;
  for (var i = 0; i < string.length; i++) {
    var digit = string.charAt(i);
    if ('0' <= digit && digit <= '9') {
      result = (result * 10) + (digit - '0');
    } else {
      return null;
    }
  }
  return result;
}

Recurrence.prototype.changed = function() {
  this.isValid = this.checkIfValid();
  if (this.hiddenInput) {
    this.hiddenInput.value = this.convertStateToString();
  }

  if (this.isRecurring && this.isValid) {
    var amount = 0.0;
    var claimAmount = 0.0;
    var numRecurrences = this.convertToInteger(DHTML.getElementById('numChecks').value);
    if (this.setCheckAmounts == null || this.setCheckAmounts.length == 0) {
      amount = this.grossAmount * numRecurrences;
      amount = (Math.round(amount * 100))/100.0;
      claimAmount = this.grossClaimAmount * numRecurrences;
      claimAmount = (Math.round(claimAmount * 100))/100.0;
    } else {
      for (var i = 0; i < numRecurrences; i++) {
        if (i < this.setCheckAmounts.length) {
          amount = amount + this.setCheckAmounts[i];
          claimAmount = claimAmount + this.setCheckClaimAmounts[i];
        } else {
          amount = amount + this.grossAmount;
          claimAmount = claimAmount + this.grossClaimAmount;
        }
        amount = (Math.round(amount * 100))/100.0;
        claimAmount = (Math.round(claimAmount * 100))/100.0;
      }
    }

    DHTML.getElementById('recurrenceTotal').value = NumberUtil.convertNumberToMulticurrency(amount, this.currency);
    if (this.currency != null && this.currency != this.claimCurrency) {
      DHTML.getElementById('recurrenceTotalClaimAmount').value = "= " + NumberUtil.convertNumberToMulticurrency(claimAmount, this.claimCurrency);
    } else {
      DHTML.getElementById('recurrenceTotalClaimAmount').value = "";
    }
    if (window.Recorder) {
      window.Recorder.changed(DHTML.getElementById('<%=inputId%>'));
    }
  } else {
    DHTML.getElementById('recurrenceTotal').value = "";
    DHTML.getElementById('recurrenceTotalClaimAmount').value = "";
  }
}

Recurrence.prototype.checkIfValid = function() {
  var idsToCheck = [];
  if (this.isRecurring) {
    idsToCheck[idsToCheck.length] = 'recDate';
    idsToCheck[idsToCheck.length] = 'numChecks';
    if (this.isWeekly) {
      idsToCheck[idsToCheck.length] = 'weekCount';
      idsToCheck[idsToCheck.length] = 'weekDay';
    } else if (this.isMonthAbs) {
      idsToCheck[idsToCheck.length] = 'monthAbsDay';
      idsToCheck[idsToCheck.length] = 'monthAbsCount';
    } else {
      idsToCheck[idsToCheck.length] = 'monthRelWeek';
      idsToCheck[idsToCheck.length] = 'monthRelDay';
      idsToCheck[idsToCheck.length] = 'monthRelCount';
    }
    if (this.isInAdvance) {
      idsToCheck[idsToCheck.length] = 'advanceDays';
    }
  } else {
    idsToCheck[idsToCheck.length] = 'nonRecDate';
  }
  for (var i = 0; i < idsToCheck.length; i++) {
    if (!this.isInputValid(idsToCheck[i])) {
      return false;
    }
  }
  return true;
}

Recurrence.prototype.convertStateToString = function() {
  var string = "{isValid:" + this.isValid;
  for (var field in this.defaultFlags) {
    string += ", " + field + ":" + (this[field] ? true : false);
  }
  var ids = [
    'nonRecDate',
    'weekCount', 'weekDay',
    'monthAbsDay', 'monthAbsCount',
    'monthRelWeek', 'monthRelDay', 'monthRelCount',
    'advanceDays', 'recDate', 'numChecks'
  ];
  for (var i = 0; i < ids.length; i++) {
    string += ", " + ids[i] + ":'"
      + this.escapeInputValue(this.getInputValue(ids[i])) + "'";
  }
  string += "}";
  return string;
}

Recurrence.prototype.escapeInputValue = function(value) {
  var result = value.replace(/\\/g, '\\' + '\\'); // + is workaround for replace bug
  result = result.replace(/'/g, "\\'");
  result = result.replace(/"/g, '\\"');
  result = result.replace(/\t/g, '\\t');
  result = result.replace(/\n/g, '\\n');
  result = result.replace(/\r/g, '\\r');
  return result;
}

Recurrence.prototype.stripCharsInBag = function(s, bag){
	var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++){
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

Recurrence.prototype.daysInFebruary = function(year){
	// February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}

Recurrence.prototype.DaysArray = function(n) {
	for (var i = 1; i <= n; i++) {
		this[i] = 31;
		if (i==4 || i==6 || i==9 || i==11) {
		  this[i] = 30;
		}
		if (i==2) {
		  this[i] = 29;
		}
   }
   return this;
}

Recurrence.prototype.isDate = function(dtStr, fieldID){
  return (DateTime.parse(dtStr, true, false) != null);
}

/* the next two functions are not members of the Recurrence object, since that didn't really seem to be appropriate placement.
In fact, we may eventually want to think about moving the first method to the DHTML library */

/*
Takes two maps as strings or as objects (e.g., {field1:val1,field2:val2,...}) and merges them.  If there
are any conflicts (i.e., same key in both maps) the value from the 2nd map takes priority.  Returns the
merged map as an associative array object.
*/
function mergeKeyValueMaps(map1, map2) {
  var finalKeyValueArray = new Array();

  var map1State = (typeof map1 == 'string' ? eval("(" + prepareKeyValueString(map1) + ")") : map1);
  for (field in map1State) {
    finalKeyValueArray[field] = map1State[field];
  }

  var map2State = (typeof map2 == 'string' ? eval("(" + prepareKeyValueString(map2) + ")") : map2);
  for (field in map2State) {
    finalKeyValueArray[field] = map2State[field];
  }

  return finalKeyValueArray;
}

function prepareKeyValueString(str) {
  if (str.charAt(0) != '{') {
    str = "{" + str;
  }

  if (str.charAt(str.length-1) != '}') {
    str += "}";
  }

  return str;
}

/* end non-Recurrence functions */

var recurrence = new Recurrence();
</script>
<table cellpadding="3" cellspacing="0" width="750" class="dv">
  <tr>
    <td>
      <input type="radio" name="rec" id="isNotRec" onclick="recurrence.setRecurring(!this.checked)" checked>
    </td>
    <td class="inputValue">
      <img id="nonRecDate_rm" src="images/required.gif" style="vertical-align: super" /><input value="<%=currDate%>"
             type="text"
             class="textBox"
             isDateTime="false"
             id="nonRecDate"
             helpText="__UseTitle__"
             delayOnChange="false"
             name="value(NVV_Financials_NewPaymentInstructions_check_WhenToPay)"
             size="0"
             isTimeOnly="false"
             onfocus="EventHandlers.onFocus(event)"
             onblur="EventHandlers.onBlur(event)"
             onkeyup="recurrence.inputChanged(this.id)"
             onchange="if (EventHandlers.valueChanged(event, this)==false) return false; recurrence.inputChanged(this.id)">
      <span id="nonRecDate_helper"><script>makeCalendarPicker(DHTML.getElementById('nonRecDate'), '<%=javaScriptStringEscaper.escape(displaykey.Velocity.DatePicker.Help)%>')</script></span>
    </td>
  </tr>
  <tr>
    <td>
      <input type="radio" name="rec" id="isRec" onclick="recurrence.setRecurring(this.checked)">
    </td>
    <td class="messageSubheader inputLabel"><%=displaykey.Velocity.NewPayment.Recurrence.Recurring%></td>
  </tr>
  <tr>
    <td></td>
    <td>
      <table cellpadding="3" cellspacing="0" id="recurrencePattern">
        <tbody id="recurrencePatternExceptForPaymentCount">
        <tr>
          <td class="inputLabel"><%=displaykey.Velocity.NewPayment.Recurrence.Pattern%></td>
          <td>
            <table cellpadding="3" cellspacing="0">
              <tr valign="top">
                <td style="padding-top: 5px;" nowrap>
                  <input type="radio" name="recw" id="isWeekly" onclick="recurrence.setWeekly(this.checked)"><%=displaykey.Velocity.NewPayment.Recurrence.Weekly%>:
                </td>
                <td id="weekBody" style="padding-bottom: 6px;" nowrap>
                  <div>
                    <%=displaykey.Velocity.NewPayment.Recurrence.Pattern.Every%> <img id="weekCount_rm" style="vertical-align: super" src="images/required.gif"/><input type="text" id="weekCount" class="textBox" size="4" onkeyup="recurrence.inputChanged(this.id)"> <%=displaykey.Velocity.NewPayment.Recurrence.Pattern.Week%> <select id="weekDay" onchange="recurrence.inputChanged(this.id)"><%printContent(weekDayOptions,false)%></select>
                  </div>
                </td>
              </tr>
              <tr valign="top">
                <td style="padding-top: 3px;" nowrap>
                  <input type="radio" name="recw" id="isMonthly" onclick="recurrence.setWeekly(!this.checked)"><%=displaykey.Velocity.NewPayment.Recurrence.Monthly%>:
                </td>
                <td id="monthBody" style="padding-bottom: 6px;" nowrap>
                  <div>
                    <input type="radio" name="recmt" id="isMonthAbs" onclick="recurrence.setMonthAbs(this.checked)"> <%=displaykey.Velocity.NewPayment.Recurrence.Pattern.Day%> <img id="monthAbsDay_rm" style="vertical-align: super" src="images/required.gif"/><input type="text" id="monthAbsDay" class="textBox" size="4" onkeyup="recurrence.inputChanged(this.id)"> <%=displaykey.Velocity.NewPayment.Recurrence.Pattern.OfEvery%> <img id="monthAbsCount_rm" style="vertical-align: super" src="images/required.gif"/><input type="text" id="monthAbsCount" class="textBox" size="4" onkeyup="recurrence.inputChanged(this.id)"> <%=displaykey.Velocity.NewPayment.Recurrence.Pattern.Month%><br />
                  </div>
                  <div style="padding-top: 4px;">
                    <input type="radio" name="recmt" id="isMonthRel" onclick="recurrence.setMonthAbs(!this.checked)"> <%=displaykey.Velocity.NewPayment.Recurrence.Pattern.The%> <select id="monthRelWeek" onchange="recurrence.inputChanged(this.id)"><%printContent(monthWeekOptions, false)%></select><select id="monthRelDay" onchange="recurrence.inputChanged(this.id)"><%printContent(monthDayOptions, false)%></select> <%=displaykey.Velocity.NewPayment.Recurrence.Pattern.OfEvery%> <img id="monthRelCount_rm" style="vertical-align: super" src="images/required.gif"/><input type="text" id="monthRelCount" class="textBox" size="4" onkeyup="recurrence.inputChanged(this.id)"> <%=displaykey.Velocity.NewPayment.Recurrence.Pattern.Month%>
                  </div>
                </td>
              </tr>
              <tr id="inAdvanceRow" valign="top">
                <td colspan="2" nowrap>
                  <input type="checkbox" id="isInAdvance" onclick="recurrence.setInAdvance(this.checked)"> <%=displaykey.Velocity.NewPayment.Recurrence.IssueCheck%> <img id="advanceDays_rm" style="vertical-align: super" src="images/required.gif"/><input type="text" id="advanceDays" class="textBox" size="4" onkeyup="recurrence.inputChanged(this.id)"> <%=displaykey.Velocity.NewPayment.Recurrence.IssueCheck2%>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td><%=displaykey.Velocity.NewPayment.Recurrence.FirstDueDate%></td>
          <td class="inputValue">
            <img id="recDate_rm" style="vertical-align: super" src="images/required.gif"/><input type="text" id="recDate" class="textBox" size="12" onkeyup="recurrence.inputChanged(this.id)" onchange="recurrence.inputChanged(this.id)">
            <span id="recDate_helper"><script>makeCalendarPicker(DHTML.getElementById('recDate'), '<%=javaScriptStringEscaper.escape(displaykey.Velocity.DatePicker.Help)%>')</script></span>
          </td>
        </tr>
        </tbody>
        <tr>
          <td><%=displaykey.Velocity.NewPayment.Recurrence.NumChecks%></td>
          <td class="inputValue"><img id="numChecks_rm" style="vertical-align: super" src="images/required.gif"/><input type="text" id="numChecks" class="textBox" size="4" onkeyup="recurrence.inputChanged(this.id)"><input type="text" id="paymentCountErrorMessage" style="border: 0; background-color: transparent;" size="70" readonly></td>
        </tr>
        <tr>
          <td class="inputLabel"><%=displaykey.Velocity.NewPayment.Recurrence.RecurrenceTotal%></td>
          <td class="inputValue">
            <input type="text" id="recurrenceTotal" size="30" readonly style="border: 0; background-color: transparent;"><br>
            <input type="text" id="recurrenceTotalClaimAmount" size="32" class="altVal" readonly style="border: 0; background-color: transparent;">
          </td>
        </tr>
        <tr>
          <td colspan="2"><b><%=displaykey.Velocity.NewPayment.Recurrence.Tip%></b></td>
        </tr>
      </table>
    </td>
  </tr>
</table>
