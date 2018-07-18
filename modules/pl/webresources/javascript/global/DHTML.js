/**
 * (c) 2003 Guidewire Software
 *
 * Class: DHTML
 *
 * Contains global helper functions for manipluating dynamic HTML.
 */

// ------------------------------------- Class DHTML

/**
 * Register the DHTML class as a global library
 */
window.DHTML = new DHTMLImpl();

/**
 * Constructor
 */
function DHTMLImpl() {

  // Hashtable of cached calls to DHTML.getElementById, by element ID
  this.elementsById = new Object();

  // Horizontal mouse position
  this.mouseX = 0;

  // Vertical mouse position
  this.mouseY = 0;

  // List of all open pop-up windows
  this.popups = new Array();

  // Currently open modal window, if any
  this.winModalWindow = null;

  // List of all open pop-up windows
  this.popups = new Array();

  // List of all registered checkbox flags
  this.checkboxFlags = new Array();

  // Currently depressed button
  this.currentButton = null;

  // List of all fields set to closures - potential memory leaks
  this.closures = null;

  // Whether we are in Firefox (we do some minor changes to make Firefox minimally compatible)
  this.isFirefox = false;

  // Whether we are in IE 9 or above (we do some minor changes to make IE 9 or above minimally compatible)
  this.isIE9Up = false;

  this.cancelEventFunction = function(event) { if (!event) { event = window.event; } event.cancelBubble = true; }

  this.busyDiv = null;

  this.voidFunction = function(){};

  this.lastCheckbox = null;
}

// ------------------------------------- Alert Functions

/**
 * Smoke test safe version of window.alert
 */
DHTMLImpl.prototype.alert = function(message) {
  if (!window.smokeTest) {
    window.alert(message);
  }
}

/**
 * Smoke test safe version of window.confirm
 */
DHTMLImpl.prototype.confirm = function(message) {
  if (window.smokeTest) {
    SmokeTest.setConfirmMessage(message);
    if(!top.confirmDialogResult) {
      top.confirmDialogResult = true;
      return false;
    }
    return true;
  } else {
    return window.confirm(message);
  }
}

/**
 * Smoke test safe version of window.prompt
 */
DHTMLImpl.prototype.prompt = function(message, defaultAnswer) {
  if (window.smokeTest) {
    return defaultAnswer;
  } else {
    return window.prompt(message, defaultAnswer);
  }
}

// ------------------------------------- Button & Checkbox Functions

/**
 * Sets all buttons with flags on them to be enabled or disabled,
 * depending on the checkbox flags.
 */
DHTMLImpl.prototype.refreshButtonAvailability = function() {
  var allButtons = DHTML.getElementsByTagNameAndClass("a",
          ["button", "button_disabled", "toolbar_menu_button", "toolbar_menu_button_disabled",
           "button_hover", "button_disabled_hover", "toolbar_menu_button_hover", "toolbar_menu_button_disabled_hover"]);
  for (var i = 0; i < allButtons.length; i++) {
    var flags = allButtons[i].getAttribute("buttonFlags");
    if (flags) {
      var disabled = !DHTML.evalCheckboxFlags(flags);
      DHTML.setButtonEnabled(allButtons[i], !disabled);
    }
  }
}

DHTMLImpl.prototype.setButtonEnabled = function(button, enabled) {
  button.disabled = !enabled;
  if (button.shortcut != null) {
    toggleShortcutAvailability(button.shortcut, button, enabled)
  }
  DHTML.buttonLeave(button);
  if(StringUtil.endsWith(button.className, "_disabled")){
    if(enabled) {
      button.className = button.className.substring(0, button.className.length - 9);
    }
  } else {
    if(!enabled) {
      button.className += "_disabled";
    }
  }
}

/**
 * Evaluates the checkbox "flags" expression, returning true if the
 * button using those flags should be available.
 */
DHTMLImpl.prototype.evalCheckboxFlags = function(flags) {
  var conditions = flags.split(',');
  for (var i = 0; i < conditions.length; i++) {
    var condition = conditions[i];
    while (condition.substr(0, 1) == ' ') { // Remove initial space
      condition = condition.substr(1);
    }
    var parts = condition.split(' ');
    var countFlags = DHTML.countCheckedFlags(parts[1], parts[0] == 'exists');
    var totalFlags = DHTML.countCheckedCheckboxes();
    if (parts[0] == 'one'  && (countFlags != 1 || totalFlags != 1) ||
        parts[0] == 'two'  && (countFlags != 2 || totalFlags != 2) ||
        parts[0] == 'any'  && countFlags == 0 ||
        parts[0] == 'no' && countFlags > 0 ||
        parts[0] == 'all' && (countFlags != totalFlags || countFlags == 0) ||
        parts[0] == 'exists' && countFlags == 0) {
      return false;
    }
  }
  return true;
}

/**
 * Counts how many checkbox flags with the given name have their
 * checkboxes checked (or that exist at all if includeUnchecked == true).
 */
DHTMLImpl.prototype.countCheckedFlags = function(flagName, includeUnchecked) {
  var count = 0;
  for (var i = 0; i < this.checkboxFlags.length; i++) {
    var flag = this.checkboxFlags[i];
    if (flag.checkbox && flag.checkbox != DHTML.getElementById(flag.checkbox.id, true)) {
      flag.checkbox = null;
      continue;
    }
    if (flag.name == flagName && flag.checkbox && (flag.checkbox.checked || includeUnchecked)) {
      count++;
    }
  }
  return count;
}

/**
* Counts how many checkboxes with *any* flag have their
* checkboxes checked.
*/
DHTMLImpl.prototype.countCheckedCheckboxes = function() {
  var checkedCheckboxes = new Array();
  for (var i = 0; i < this.checkboxFlags.length; i++) {
    var flag = this.checkboxFlags[i];
    if (flag.checkbox && flag.checkbox != DHTML.getElementById(flag.checkbox.id, true)) {
      flag.checkbox = null;
      continue;
    }
    if (flag.checkbox && flag.checkbox.checked && !ArrayUtil.inArray(flag.checkbox, checkedCheckboxes)) {
      ArrayUtil.appendElement(checkedCheckboxes, flag.checkbox);
    }
  }
  return checkedCheckboxes.length;
}

/**
 * Register a checkbox "Flag", which is active if the checkbox is clicked
 */
DHTMLImpl.prototype.addCBFlag = function(checkboxId, flagName) {
  var flag = new Object();
  flag.checkbox = DHTML.getElementById(checkboxId, true);
  flag.name = flagName;
  this.checkboxFlags.push(flag);
}

/**
 * Selects a given index in a set of radio buttons
 */
DHTMLImpl.prototype.selectRadio = function(formName, radioName, selIndex) {
  window.document.forms[formName].elements[radioName][selIndex].click();
}

// ------------------------------------- Cookie functions

/**
 * Gets the string value of the named cookie, or null
 */
DHTMLImpl.prototype.getCookie = function(name) {
  name += '=';
  var cookie = document.cookie;
  var start = cookie.indexOf(name);
  if (start < 0) {
    return null;
  }
  start += name.length;
  var end = cookie.indexOf(";", start);
  if (end < 0) {
    end = cookie.length;
  }
  return cookie.substring(start, end);
}

// ------------------------------------- Document writing functions

/**
 * Writes HTML directly to the document; should be called only while
 * the page is loading.
 */
DHTMLImpl.prototype.write = function(html) {
  window.document.write(html);
}

/**
 * Like DHTML.write but appends a newline.
 */
DHTMLImpl.prototype.writeln = function(html) {
  window.document.writeln(html);
}

// ------------------------------------- Element Functions

/**
 * Gets a single element by its ID.  Preferred to document.getElementById
 * because it caches the element.  Returns null if no element found.  If nocache = true,
 * does not look in the cache.
 */
DHTMLImpl.prototype.getElementById = function(id, nocache) {
  if (nocache) {
    return document.getElementById(id);
  }
  var element = this.elementsById[id];
  if (element == null) {
    this.elementsById[id] = element = document.getElementById(id);
  }
  return element;
}

DHTMLImpl.prototype.findOriginalElementId = function(elt) {
  var id = elt.id;
  if(id.indexOf("__dup_") != -1){
    id = id.substring(0, id.indexOf("__dup_"));
  }
  return id;
}

DHTMLImpl.prototype.findDuplicateElements = function(elt) {
  var id = DHTML.findOriginalElementId(elt);
  var elts = new Array();
  var i = 0;
  var eltToAdd = document.getElementById(id);
  while(eltToAdd) {
    elts.push(eltToAdd);
    if(i == 0){
      id += "__dup_";
    }
    i++;
    id = id.substring(0, id.indexOf("__dup_")) + "__dup_" + i;
    eltToAdd = document.getElementById(id);
  }
  return elts;
}

/**
 * Gets all elements with a particular tag name and class.
 */
DHTMLImpl.prototype.getElementsByTagNameAndClass = function(tagName, classNames) {
  var elts = DHTML.getElementsByTagName(tagName);
  var classElts = new Array();
  for(var i = 0; i < elts.length; i++) {
    if(ArrayUtil.inArray(elts[i].className, classNames)) {
      classElts.push(elts[i]);
    }
  }
  return classElts;
}

/**
 * Gets all elements by tag name, such as "A" or "BUTTON".  Not cached.
 */
DHTMLImpl.prototype.getElementsByTagName = function(tagName) {
  return document.body.getElementsByTagName(tagName);
}

/**
 * Shows or hides an element depending on whether "showOrHide" is true or false.
 */
DHTMLImpl.prototype.showOrHideElement = function(id, showOrHide) {
    var el = DHTML.getElementById(id);
    if (el != null) {
        el.style.display = showOrHide ? '' : 'none';
    }
}

/**
 * Clears the specified input value.
 */
DHTMLImpl.prototype.clearInput = function(id) {
  var el = DHTML.getElementById(id);
  if(el != null) {
    DHTML.setValue(el, '');
  }
}

/**
 * Gets the left position of an element relative to the left side of the
 * document, in pixels
 */
DHTMLImpl.prototype.getElementLeft = function(element) {
  var left = 0;
  while (element && (element != document.body)) {
    left += element.offsetLeft;
    element = element.offsetParent;
    if (element.tagName == 'DIV') {
      left -= element.scrollLeft;
    }
  }
  return left;
}

/**
 * Gets the top position of an element relative to the top of the
 * document, in pixels
 */
DHTMLImpl.prototype.getElementTop = function(element) {
  var top = 0;
  while (element && (element != document.body)) {
    top += element.offsetTop;
    element = element.offsetParent;
    if (element && element.tagName == 'DIV') {
      top -= element.scrollTop;
    }
  }
  return top;
}

/**
 * Gets the left position of an element relative to the left side of the
 * current DIV, in pixels
 */
DHTMLImpl.prototype.getElementDivLeft = function(element) {
  var left = 0;
  while (element && (element != document.body) && (element.nodeName != "DIV")) {
    left += element.offsetLeft;
    element = element.offsetParent;
  }
  return left;
}

/**
 * Gets the top position of an element relative to the top of the
 * current DIV, in pixels
 */
DHTMLImpl.prototype.getElementDivTop = function(element) {
  var top = 0;
  while (element && (element != document.body) && (element.nodeName != "DIV")) {
    top += element.offsetTop;
    element = element.offsetParent;
  }
  return top;
}

/**
 * Gets the width of an element in pixels
 */
DHTMLImpl.prototype.getElementWidth = function(element) {
  if ((element.currentStyle || element.style).display == 'none') {
    Debug.log('<font color=orange>WARN: Try to get width of an invisible element: ' + element.id + '</font>');
  }
  return Math.max(element.clientWidth, element.offsetWidth);
}

/**
 * Gets the height of an element in pixels
 */
DHTMLImpl.prototype.getElementHeight = function(element) {
  if ((element.currentStyle || element.style).display == 'none') {
    Debug.log('<font color=orange>WARN: Try to get height of an invisible element: ' + element.id + '</font>');
  }
  return Math.max(element.clientHeight, element.offsetHeight);
}

// ------------------------------------- Form Functions

/******************************************************************************
 * NOTE: Nobody seems to be using these functions -- can I remove them?  - JB *
 ******************************************************************************/

/**
 * Returns true if any input in the form has changed
 */
DHTMLImpl.prototype.isFormChanged = function(form) {
  for (i = 0; i < form.elements.length; i++) {
    var input = form.elements[i];
    if (ArrayUtil.isArray(input) && typeof(input.type) == "undefined") {
      if (this.isArrayInputChanged(input)) {
        return true;
      }
    } else if (this.isInputChanged(input)) {
      return true;
    }
  }
  return false;
}

/**
 * True if any input in the array of passed-in inputs has changed
 */
DHTMLImpl.prototype.isArrayInputChanged = function(array) {
  for (var i = 0; i < array.length; i++) {
    if (this.isInputChanged(array[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Returns true if a given input has had its value changed
 */
DHTMLImpl.prototype.isInputChanged = function(input) {
  switch (input.type) {
  case 'radio':
  case 'checkbox':
    return input.defaultChecked != input.checked;
  case 'text':
  case 'textarea':
  case 'hidden':
  case 'password':
    return input.defaultValue != input.value;
  case 'select-one':
  case 'select-multiple':
    var isFirstSelected = false;
    for (var i = 0; i < input.options.length; i++) {
      var option = input.options[i];
      if (option.defaultSelected != option.selected) {
        if (i == 0 && !option.defaultSelected) {
          isFirstSelected = true;
        } else {
          return true;
        }
      }
      if (option.defaultSelected && isFirstSelected) {
        return true;
      }
    }
    return false;
  default:
    return false;
  }
}

/**
 * Adds a field to a form
 */
DHTMLImpl.prototype.addField = function(form, fieldType, fieldName, fieldValue) {
  var input = document.createElement('INPUT');
  input.type = fieldType;
  input.name = fieldName;
  input.value = fieldValue;
  form.appendChild(input);
}

// ------------------------------------- Scrollbar Functions
function DHTMLImpl_addScrollPosition (elem, posList) {
  var pos = [elem.scrollTop, elem.scrollLeft];
  if (!ArrayUtil.contentsEqual(pos, [0,0])) {
    posList[posList.length] = '"' + elem.tagName+' '+elem.id + '" : [' + pos + ']';
  }
}

/**
 * Stores the list of all scrollbar positions as JSON format in a special hidden input
 */
DHTMLImpl.prototype.storeScrollPositions = function() {
  var scrollPositions = [];
  DHTMLImpl_addScrollPosition(document.body, scrollPositions);

  var allDivs = document.body.getElementsByTagName('DIV');
  for (var i = 0; i < allDivs.length; i++) {
    var div = allDivs[i];
    DHTMLImpl_addScrollPosition(div, scrollPositions);
  }

  document.mainForm.scrollPositions.value = scrollPositions.length == 0 ? '' : '{'+scrollPositions+'}';
  Debug.log('storeScrollPositions as - '+ document.mainForm.scrollPositions.value);
}

/**
 * Restores the list of all scrollbar positions from a special hidden input.
 */
DHTMLImpl.prototype.restoreScrollPositions = function() {
  if (window.__restoreScrollPosition) {
    var strValue = document.mainForm.scrollPositions.value;
    if (strValue != null && strValue.length > 0) {
      var scrollPos = strValue.parseJSON();
      for (var key in scrollPos) {
        if (scrollPos.hasOwnProperty(key)) {
          var info = key.split(' ');
          var elem = info[1].length > 0 ? document.getElementById(info[1]) : document.getElementsByTagName(info[0])[0];
          if (elem != null) {
            elem.scrollTop = scrollPos[key][0];
            elem.scrollLeft = scrollPos[key][1];
          }
        }
      }
      Debug.log('restored ScrollPositions to - '+ strValue);
    }
  }

}

/**
 * Scroll to an element, if it's not currently in view
 * @param toBottom if true, scroll the element to bottom of the window rather than the top
 */
/*DHTMLImpl.prototype.scrollTo = function(eId, toBottom) {
  // scroll to the target element, if it's not in view yet (should not happen in most cases)
  var elem = document.getElementById(eId);
  var logStr = 'ScrollTo - '+ eId + ' (' + (elem == null ? null : elem.tagName) + ')';
  if (elem != null) {
    if (Debug.isOn()) {
      elem.style.border = "1px solid red";
    }

    if (!DHTML.isInView(elem)) {
      elem.scrollIntoView(!toBottom);
      logStr += ' SCROLLED';
    }
  }
  Debug.log('<font color=gray>'+logStr+'</font>');
}
*/

/**
 * Returns true, if the element's upper-left corner is in view - does not work when the html body scrolls
 */
/*DHTMLImpl.prototype.isInView = function(e) {
   var rp = e.offsetParent;
   if (rp == null)
      return false;
   var pleft = e.offsetLeft;
   var ptop = e.offsetTop;
   while (true) {
      if (!((pleft >= rp.scrollLeft) &&
            (pleft <= rp.scrollLeft + rp.clientWidth) &&
            (ptop >= rp.scrollTop) &&
            (ptop <= rp.scrollTop + rp.clientHeight)))
         return false;
      pleft += rp.offsetLeft - rp.scrollLeft ;
      ptop += rp.offsetTop - rp.scrollTop;
      rp = rp.offsetParent;
      if (rp == null)
         return true;
   }
}
*/
// ------------------------------------- Keyboard focus Functions

/**
 * Returns true if "innerE" is contained within "outerE". (True, if these two elements are the same.)
 * Works for Firefox
 */
DHTMLImpl.prototype.contains = function(outerE, innerE) {
  if (outerE.contains) {
    return outerE.contains(innerE); // supported by IE
  } else {
    for (var e = innerE; e != null; e = e.parentNode) {
      if (e == outerE) {
        return true;
      }
    }
    return false;
  }
}

/**
 * Moves focus to first appropriate form element, if it exists.
 * Rules are:
 * - if "firstFocusId" is non-null, try to find an element with that ID first
 * - focus in the first non-tabbar form, unless there are no non-tabbar forms
 *   in which case focus in the tab form.
 * - focus on the first editable element in the form if there are any,
 *   otherwise focus in the first element.
 */
DHTMLImpl.prototype.setInitialFocus = function(firstFocusId) {
  var scopeElem = null;
  if (window.__activeScopeId) {
    DHTML.setActiveElementId(window.__activeScopeId);
    scopeElem = DHTML.getActiveElement();
    Debug.log('Initial activeScope set to: ' + (scopeElem==null ? null : scopeElem.tagName+'[id="'+scopeElem.id+'"]'));
  }

  var i;
  if( firstFocusId) {
    var firstFocus = DHTML.getElementById(firstFocusId);
    if ((scopeElem == null || DHTML.contains(scopeElem, firstFocus)) && this.tryToFocus(firstFocus, true)) {
      Debug.log('Initial focus specified from the server: ' + firstFocusId);
      return;
    }
  } else if (window.__restoreScrollPosition) { // do not focus on first element, if the page needs to be scrolled:
    return;
  }
  if (document.forms.length == 0) {
    return;
  }

  // try first element in the active scope:
  var topFocusForm = null;
  for (i = 0; i < document.forms.length; i++) {
    if(document.forms[i].method == "post" && document.forms[i].elements.length > 0) {
      var focusForm = document.forms[i];
      if (topFocusForm == null) {
        topFocusForm = focusForm;
      }
      var firstField = null;
      for(i = 0; i < focusForm.elements.length; i++) {
        var field = focusForm.elements[i];
        if((scopeElem == null || DHTML.contains(scopeElem, field)) && this.fieldCanAcceptFocus(field)) {
          if(firstField == null) {
            firstField = field;
          }
          if(!field.readOnly && this.tryToFocus(field)) {
            Debug.log('Initial focus set to 1st Editable form element: ' + field.id);
            return;
          }
        }
      }
      if(firstField != null && this.tryToFocus(firstField)) {
        Debug.log('Initial focus set to 1st Readonly form element: ' + firstField.id);
        return;
      }
    }
  }
  // Try default button
  var button = getDefaultButton();
  if (button != null && !button.disabled && !(button.style && button.style.display == 'none')) {
    try {
      button.focus();
      Debug.log('Initial focus set to defaultButton: ' + button.id);
    } catch (err) { }
  }
}

/**
 * True if you can call focus() on the given field without it causing an error
 */
DHTMLImpl.prototype.fieldCanAcceptFocus = function(field) {
  return field.type != "hidden" && field.type != "button" && field.type != "image" && field.type != "submit"
    && !field.disabled && !(field.style && field.style.display == 'none') && (field.getAttribute("tabIndex") == null || field.tabIndex != -1);
}

/**
 * Tries to put the keyboard focus in the field; returns true if successful
 */
DHTMLImpl.prototype.tryToFocus = function(field, isDropDownOK) {
  if (!field || !this.fieldCanAcceptFocus(field) ||
      (!isDropDownOK && field.type == 'select-one') ||
      field.id == 'QuickJump') {
    return false;
  }
  try {
    field.focus();
    return true;
  } catch (err) {
    return false;
  }
}

// ------------------------------------- Mouse & Cursor Functions

/**
 * Called by the mousemove event handler to record where the mouse is
 */
DHTMLImpl.prototype.recordMousePosition = function() {
  if(window.event != null) {
    this.mouseX = window.event.clientX + document.body.scrollLeft;
    this.mouseY = window.event.clientY + document.body.scrollTop;
  }
}

/**
 * True if the mouse is over a given element.  Padding is the extra amount of
 * pixels by which the mouse can be outside the element and still count as "within" it.
 */
DHTMLImpl.prototype.mouseInElement = function(element, padding) {
  var left = DHTML.getElementLeft(element);
  var top = DHTML.getElementTop(element);
  var width = DHTML.getElementWidth(element);
  var height = DHTML.getElementHeight(element);
  return this.mouseX >= left - padding &&
         this.mouseX < left + width + padding &&
         this.mouseY >= top - padding &&
         this.mouseY < top + height + padding;
}

DHTMLImpl.prototype.addStyleSuffix = function(elt, suffix, separator) {
  var oldClass = elt.getAttribute('className');
  if(!StringUtil.endsWith(oldClass, suffix)){
    if (oldClass == null || oldClass.length == 0) {
      elt.setAttribute('className', suffix);
    } else {
      if (!separator || separator.length != 1) {
        separator = '_';
      }
      elt.setAttribute('className', oldClass + separator + suffix);
    }
  }
}

DHTMLImpl.prototype.removeStyleSuffix = function(elt, suffix) {
  var oldClass = elt.getAttribute('className');
  if(StringUtil.endsWith(oldClass, suffix)) {
    var numCharsLeft = oldClass.length - suffix.length;
    if (numCharsLeft > 0) {
      numCharsLeft --; // remove the separator char
    }
    elt.setAttribute('className', oldClass.substring(0, numCharsLeft));
  }
}

DHTMLImpl.prototype.buttonEnter = function(elt) {
  if(DHTML.currentButton != elt) {
    DHTML.addStyleSuffix(elt, "hover");
  } else {
    DHTML.addStyleSuffix(elt, "down");
  }
}


DHTMLImpl.prototype.buttonLeave = function(elt) {
  if(DHTML.currentButton != elt) {
    DHTML.removeStyleSuffix(elt, "hover");
  } else {
    DHTML.removeStyleSuffix(elt, "down");
  }
}

DHTMLImpl.prototype.buttonPress = function(elt) {
  DHTML.removeStyleSuffix(elt, "hover");
  DHTML.addStyleSuffix(elt, "down");
  DHTML.currentButton = elt;
}

DHTMLImpl.prototype.buttonRelease = function(elt) {
  DHTML.removeStyleSuffix(elt, "down");
  DHTML.addStyleSuffix(elt, "hover");
}

DHTMLImpl.prototype.resizeBusyDiv = function() {
  if (this.busyDiv) {
    this.busyDiv.style.width = document.body.scrollWidth;
    this.busyDiv.style.height = document.body.scrollHeight;
    this.shimElement(this.busyDiv);
  }
}

/**
 * Disables cursor until the next page loads or the state is reset.
 */
DHTMLImpl.prototype.hourglass = function() {
  if (this.busyDiv == null) {
    // create busy div
    this.busyDiv = document.createElement('div');
    this.busyDiv.style.cssText = 'position:absolute;z-index:900;left:0;top:0;border:0;cursor:wait;';
    this.busyDiv.onclick = this.cancelEventFunction;
    this.busyDiv.onmousedown = this.cancelEventFunction;
    document.body.appendChild(this.busyDiv);
  } else {
    this.busyDiv.style.display = '';
  }

  Events.queueEvent(function() { // Steal focus after timeout, to wait for focus gets settled after tabbing
    if (DHTML.busyDiv) {
      var oldFocus = DHTML.getActiveElement()
      if (oldFocus) {
        //Debug.log('Hourglass: stealing focus from: ' + oldFocus.id)
        DHTML.busyDiv.oldFocus = oldFocus;
      }
      try {
        DHTML.busyDiv.focus();
      } catch(ignore) {
        // When file upload dialog is open, focusing on the busyDiv will throw an exception
      }
    }
  })

  this.resizeBusyDiv();
}

/**
 * Enables the cursor and navigations.
 */
DHTMLImpl.prototype.unhourglass = function() {
  // make sure navigation is enable.
  // (We only need to enable navigation manually when a form submission does not result in page fresh, e.g., file download)
  Events.enableNavigation();

  if (this.busyDiv) {
    this.busyDiv.style.display = 'none';
    this.unshimElement(this.busyDiv);
    var oldFocus = this.busyDiv.oldFocus;
    this.busyDiv.oldFocus = null;
    if (oldFocus) {
      Events.queueEvent(function(){ // restore focus after timeout, for SELECT element to be ready to accept focus
        try {
          //Debug.log('Hourglass: restoring focus to ' + oldFocus.id);
          oldFocus.focus();
        } catch (ignore) {
          Debug.log(ignore);
        }
      });
    }
  }
}

// ------------------------------------- Popup window functions

/**
 * Pops up the About window
 */
DHTMLImpl.prototype.popupAboutWindow = function() {
  this.closePopups();
  this.createPopup('About.do?inFrame=about', 476, 266, false, false);
}

/**
 * Pops up the Help window
 */
DHTMLImpl.prototype.popupHelpWindow = function() {
  this.closePopups();
  this.createPopup('resources/help/index.html', 412, 631, false, false);
}

/**
 * Called to create a popup window.  Also registered as the
 * global function "createPopup"
 */
DHTMLImpl.prototype.createPopup = function(action, params, width, height, showToolbars, showScrollbars) {
  createPopup(action, params, width, height, showToolbars, showScrollbars);
}
function createPopup(url, width, height, showToolbars, showScrollbars) {
  var left = (screen.width - width) / 2;
  var top = (screen.height - height) / 2;
  var features =  'width   =' + width +
                 ',height  =' + height +
                 ',left    =' + left +
                 ',top     =' + top +
                 (showToolbars
                 ? ',location=yes, menubar=yes, status=yes, toolbar=yes'
                 : ',location=no,  menubar=no,  status=no,  toolbar=no') +
                 (showScrollbars
                 ? ', scrollbars=yes, resizable=yes'
                 : ',  scrollbars=no, resizable=yes');
  DHTML.basicCreatePopup(url, '_blank', features);
}

DHTMLImpl.prototype.openWindow = function(url, name, features) {
  var actionUrl = Nav.getActionURL(url);
  if(features == null) {
    features = "directories=yes,location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=yes"
  }
  var newWindow = window.open(actionUrl, name, features);
  newWindow.focus();
}

/**
 * Called to create a basic popup window
 */
DHTMLImpl.prototype.basicCreatePopup = function(url, name, features) {
  this.closePopups();
  var newWindow = window.open(url, name, features);
  this.popups[this.popups.length] = newWindow;
  newWindow.focus();
  return newWindow;
}

/**
 * Detaches a newly-created popup so it won't close when we move to a new page
 */
DHTMLImpl.prototype.detachPopup = function() {
  this.popups.length--;
}

/**
 * Closes all open pop-ups
 */
DHTMLImpl.prototype.closePopups = function() {
  for (var i = 0; i < this.popups.length; i++) {
    if (!this.popups[i].closed) {
      this.popups[i].close();
    }
  }
}

/**
 * Called to create a model pop-up window
 */
DHTMLImpl.prototype.showModalPopup = function(action, params, width, height, showToolbars) {
  var url = Nav.getActionURL( action );
  url = Nav.appendURLParameters( url, params );
  var features =  'dialogWidth   =' + width + 'px' +
                 ',dialogHeight  =' + height + 'px' +
                 ',center        = yes' +
                 ',edge          = raised' +
                 ',help          = no' +
                 (showToolbars
                 ? ',location=no, menubar=yes, status=no, toolbar=yes, scrollbars=yes, resizable=yes'
                 : ',location=no, menubar=no,  status=no, toolbar=no,  scrollbars=no,  resizable=yes');
  return this.basicShowModalDialog( url, '_blank', features );
}

/**
 * Inner implementaiton for showing a modal dialog pop-up
 */
DHTMLImpl.prototype.basicShowModalDialog = function(url, name, features) {
  if( window.showModalDialog ) {
    return window.showModalDialog( url, name, features );
  } else {
    window.top.captureEvents( Event.CLICK | Event.FOCUS );
    window.top.onclick = function() {
      return false;
    }
    window.top.onfocus = ModalDialogFocusHandler;
    this.winModalWindow = window.open( url, "ModalChild", "dependent=yes, " + features );
    this.winModalWindow.focus();
    return window.returnValue;
  }
}

/**
 * Focus event handler for modal dialog pop-ups.
 * Also registered as global function ModalDialogFocusHandler
 */
function ModalDialogFocusHandler() {
  DHTML.modalDialogHandleFocus();
}
DHTMLImpl.prototype.modalDialogHandleFocus = function() {
  if( this.winModalWindow ) {
    if( !this.winModalWindow.closed ) {
      this.winModalWindow.focus();
    } else {
      this.window.top.releaseEvents( Event.CLICK | Event.FOCUS );
    }
  }
  return false;
}

DHTMLImpl.prototype.closeDialogOnError = function(errorPage) {
   var windowToClose = window;
   for (;;) {
     if (windowToClose.dialogArguments) {
      //we're in a modal dialog; all we can do is set the return value to the error destination (in case we're called from a dialog) and close
      windowToClose.returnValue="error:" + errorPage;
      windowToClose.close();
      return true;
    } else if (windowToClose.opener && windowToClose.opener.go) {
      //we're in a regular dialog; assume that dialogs don't spawn dialogs
      windowToClose.opener.go(errorPage);
      windowToClose.close();
      return true;
    } else if (windowToClose.parent && windowToClose.parent != windowToClose) {
      // In a frame, go up to our parent frameset and retry
      windowToClose = windowToClose.parent;
    } else {
      // Not in a dialog at all, don't close anything
      return false;
    }
  }
}

// ------------------------------------- Select input functions

/**
 * Adds a new option to a select input's option list
 */
DHTMLImpl.prototype.addToOptions = function(box, newOptionDisp, newOptionValue) {
  var newOption = new Option(newOptionDisp, newOptionValue);
  for (var i = 0; i < box.options.length; i++) {
    var oldOption = box.options[i];
    if(oldOption.value == newOption.value) {
      // update the old one and select it
      box.options[i] = newOption;
      box.selectedIndex = i;
      return;
    }
  }
  box.options[box.options.length] = newOption;
  box.selectedIndex = box.options.length - 1;
}

// ------------------------------------------------- Closure handling functions

/**
 * JavaScript closures (anonymous functions) are neat but they have a nasty
 * side effect; they often create circular references that the JavaScript
 * garbage collector can't clean up. In particular the closure contains a
 * reference to anything in scope at the time the closure is created so, for
 * example:
 *   input.onChange = function() { doStuff }
 * creates a circular reference between input and the closure. To avoid this
 * you can use the DHTML.setFieldToClosure method:
 *   DHTML.setFieldToClosure(input, "onChange", function () { doStuff });
 * this sets the field to the closure and also squirrels it away so that it
 * can be nulled out when the page is unloaded
 */
DHTMLImpl.prototype.setFieldToClosure = function(owner, field, closure) {
  var newClosure = new Object();
  newClosure.owner = owner;
  newClosure.field = field;
  newClosure.next = this.closures;
  this.closures = newClosure;
  owner[field] = closure;
}

/**
 * Called from the page unload handler; cleans up all circular references
 * created by setFieldToClosure by nulling out the the closure fields in all
 * the owner objects
 */
DHTMLImpl.prototype.cleanUpClosures = function() {
  while (this.closures != null) {
    var closure = this.closures;
    this.closures = closure.next;
    closure.owner[closure.field] = null;
  }
}

// ------------------------------------------------ More DOM helper functions

/**
 * Returns all Input elements that have the same type and the matching attribute (default to "name" attribute)
 * as the specified Input in the FORM.
 * @Returns an array
 */
DHTMLImpl.prototype.getInputGroup = function (elem, attr) {
  var form = elem.form;
  if (attr == null) {
    attr = "name";
  }
  var attrValue = elem.getAttribute(attr);
  var type = elem.type;
  var group = [];

  for (var i=0; i<form.length; i++) {
    var e = form[i];
    if (e.getAttribute(attr) == attrValue && e.tagName=='INPUT' && e.type==type) {
      ArrayUtil.appendElement(group, e);
    }
  }

  return group;
}

DHTMLImpl.prototype.getGroupSync = function (elem, attr) {
  var form = elem.form;
  if (attr == null) {
    attr = "id";
  }
  var attrValue = elem[attr];
  var type = elem.type;
  var group = new Array();

  for (var i=0; i<form.length; i++) {
    var e = form[i];
    if (e[attr] == attrValue && e.tagName=='INPUT' && e.type==type) {
      if(e.className.indexOf("syncGroup") != -1) {
        return e;
      }
    }
  }

  return null;
}

/**
 * Given one radio button, returns the radio button in the same group which is checked.
 */
DHTMLImpl.prototype.getCheckedRadio = function (radio) {
  var checkedRadio = null;
  if (radio.tagName == 'INPUT' && radio.type == 'radio') {
    var group = this.getInputGroup(radio)
    for (var i=0; i < group.length; i++) {
      var r = group[i]
      if (r.checked) {
        checkedRadio = r;
        break;
      }
    }
  }
  return checkedRadio;
}

/**
 * Gets the inner text for an element. Works for IE and Firefox
 */
DHTMLImpl.prototype.getInnerText = function(e) {
  return StringUtil.trim(e.innerText != undefined ? e.innerText : e.textContent);
}

/**
* Gets the value of an element
*/
DHTMLImpl.prototype.getValue = function (e) {
  var val = "";

  switch (e.tagName) {
    case 'INPUT':

      // radio button group:
      if (e.type=='radio') {
        var checkedRadio = this.getCheckedRadio(e);
        if (checkedRadio != null) {
          val = checkedRadio.value;
        }
      // check box:
      } else if (e.type=='checkbox') {
        var group = this.getInputGroup(e)
        if (group.length == 1) { // single value
          val = e.checked ? e.value : '';
        } else { // multi values
          val = [];
          for (var i=0; i<group.length; i++) {
            if (group[i].checked) {
              ArrayUtil.appendElement(val, group[i].value);
            }
          }
        }
      // other INPUTs:
      } else {
        val = e.value;
      }
      break;

    case 'SELECT':
      if(e.type == 'select-one') {
        val = e.value;
      } else { // select-multiple
        val = [];
        for(var i = 0; i < e.options.length; i++) {
          if(e.options[i].selected) {
            ArrayUtil.appendElement(val, e.options[i].value)
          }
        }
      }
      break;

    case 'SPAN':

      if(e.value) {
        val = e.value;
      } else {
        val = DHTML.getInnerText(e);
      }
      break;

    case 'TEXTAREA':
    case 'A':
    case 'BUTTON':

      val = DHTML.getInnerText(e);
      break;

    default:
      alert('Unsupported element: ' + e.tagName);
      break;
  }

  // unmask the input value if needed:
  var validator = FieldValidation.getValidatorForInput(e);
  if (validator != null) {
    val = FieldValidation.unmaskFieldValue(val, validator.mask, e.placeholderChar);
  }

  return val;
}

/**
* get value by element id
*/
DHTMLImpl.prototype.getValueById = function (id) {
  var e = this.getElementById(id);
  if(e){
  return this.getValue(e);
  } else {
    return '';
  }
}

/**
 * Get values by multiple element ids
 */
DHTMLImpl.prototype.getValueByIds = function (ids) {
  var vals = new Array()
  for (var i = 0; i < ids.length; i++) {
    ArrayUtil.appendElement(vals, this.getValueById(ids[i]))
  }
  return vals
}

/**
* gets display text by element id
*/
DHTMLImpl.prototype.getTextById = function (id) {
  var e = this.getElementById(id);
  return this.getText(e);
}

/**
* gets display text for an element
*/
DHTMLImpl.prototype.getText = function (e) {
  var text = "";
  switch (e.tagName) {
    case 'SELECT':
      if(e.type == 'select-one') {
        text = e.selectedIndex >=0 ? e.options[e.selectedIndex].text : '';
      } else { // select-multiple
        text = [];
        for(var i = 0; i < e.options.length; i++) {
          if(e.disabled || e.options[i].selected) {
            ArrayUtil.appendElement(text, e.options[i].text)
          }
        }
      }
      break;
    case 'INPUT':
      if (e.type=='radio') {
        var checkedRadio = this.getCheckedRadio(e);
        if (checkedRadio != null) {
          text = DHTML.getInnerText(checkedRadio.parentElement);
        }
      } else {
        text = this.getValue(e);
      }
      break;
    default:
      text = DHTML.getInnerText(e);
  }
  return text;
}

DHTMLImpl.prototype.getOptionLabel = function (e) {
  if(e.tagName == "OPTION") {
    return e.text;
  } else if (e.type == 'radio' || e.type == 'checkbox') {
    return DHTML.getInnerText(e.parentElement);
  }
  return null;
}

DHTMLImpl.prototype.getIcon = function (e) {
  if(e.tagName != "IMG") {
    var children = e.childNodes;
    for(var i = 0; i < children.length; i++) {
      var icon = DHTML.getIcon(children[i]);
      if(icon) {
        return icon;
      }
    }
    return null;
  } else {
    var src = e.src;
    var lastSlash = src.lastIndexOf("/");
    if(lastSlash > -1) {
      src = src.substring(lastSlash + 1);
    }
    return src;
  }
}

/**
 * Formats the value based on the given format
 */
DHTMLImpl.prototype.formatValue = function (val, format) {
  switch (format) {
    case 'currency':
      val = NumberUtil.convertNumberToCurrency(val);
      break;

    default:
      break;
  }
  return val;
}

/**
 * Updates element style after value change
 * @param element HTML element
 */
DHTMLImpl.prototype.updateStyle = function(element) {
  var currencyPrefix = 'currency_';
  var posCurrencyClass = currencyPrefix + 'positive';
  var negCurrencyClass = currencyPrefix + 'negative';

  var styleClass = element.className;
  var num;
  if (styleClass.indexOf(posCurrencyClass) >= 0) {
    num = NumberUtil.safeConvertToNumber(DHTML.getValue(element));
    if (num < 0) {
      element.className = styleClass.replace(posCurrencyClass, negCurrencyClass)
    }
  } else if (styleClass.indexOf(negCurrencyClass) >= 0) {
    num = NumberUtil.safeConvertToNumber(DHTML.getValue(element));
    if (num >= 0) {
      element.className = styleClass.replace(negCurrencyClass, posCurrencyClass)
    }
  }
}

DHTMLImpl.prototype.updateAltValue = function(element) {
  var footerId = element.id + EventHandlers.FOOTER_SUFFIX;
  var altFooter = document.getElementById(footerId);
  if (altFooter) {
    AJAX.initRequest(element.id, {'calcAltModelValue' : DHTML.getValue(element)},
            function() {
              altFooter.innerHTML = AJAX.returnValue.t;
              altFooter.value = AJAX.returnValue.v;
              DHTML.updateStyle(altFooter)
            }, true);
  }  
}

/**
 * Updates sum values or returns the ajax requests that need to be send to fetch the new sum value
 * @return an array of ajax requests to send, or null
 */
DHTMLImpl.prototype.updateSumValues = function(elemArray) {
  var sumIdToElemIdMap = {}
  for (var i = 0; i < elemArray.length; i++) {
    var elem = elemArray[i]
    var sumId = elem.getAttribute('sumId');
    if (!sumIdToElemIdMap[sumId]) {
      sumIdToElemIdMap[sumId] = [];
    }
    ArrayUtil.appendElement(sumIdToElemIdMap[sumId], elem.id);
  }

  var pendingReqs = []
  for (var sumId in sumIdToElemIdMap) {
    var req = DHTMLImpl_updateSumValue(sumId, sumIdToElemIdMap[sumId]);
    if (req) {
      pendingReqs.push(req)
    }
  }
  return (pendingReqs.length > 0) ? pendingReqs : null;
}

function DHTMLImpl_updateSumValue(sumId, changedElemIds) {
  if (sumId) {
    var sumSpan = document.getElementById(sumId);
    var altSumSpan = document.getElementById(sumId + EventHandlers.FOOTER_SUFFIX);

    if (sumSpan && sumSpan.innerHTML) {
      sumSpan.innerHTML = '';
    }
    if (altSumSpan && altSumSpan.innerHTML) {
      altSumSpan.innerHTML = '';
    }

    var firstSpan = sumSpan || altSumSpan;
    if (firstSpan) {
      
      var bReflect = firstSpan.getAttribute('sumReflection');
      if (bReflect) { // calculate sum value right away:

        if (!firstSpan._updCellId) {
          firstSpan._updCellId = []
        }
        for (var i = 0; i < changedElemIds.length; i++) {
          var eId = changedElemIds[i];
          if (!ArrayUtil.inArray(eId, firstSpan._updCellId)) {
            ArrayUtil.appendElement(firstSpan._updCellId, eId)
          }
        }
        var params = {}
        for (var i = 0; i < firstSpan._updCellId.length; i++) {
          var inputId = firstSpan._updCellId[i];
          params[inputId] = DHTML.getValueById(inputId);
        }
        Debug.log('Update sum value: ' + sumId + '  (changes:' +changedElemIds.length+ ')')
        return AJAX.buildSingleRequest(sumId, {'calSum' : params}, function() {
          if (AJAX.returnValue.sum) { sumSpan.innerHTML = AJAX.returnValue.sum; DHTML.updateStyle(sumSpan) }
          if (AJAX.returnValue.altSum) {altSumSpan.innerHTML = AJAX.returnValue.altSum; DHTML.updateStyle(altSumSpan) }
        })
      } else { // change old sum vlaue into a link:
        
        var getSumLabel = firstSpan.getAttribute('getSumLabel');
        var href = 'javascript:Events.refresh()';
        firstSpan.innerHTML =
        '<a class=miniButton href=\"'+href+'\" onmouseenter=\"if (DHTML) {DHTML.buttonEnter(this)}\" onmouseleave=\"if (DHTML) {DHTML.buttonLeave(this)}\">' +
        '<span class=miniButton_left></span><span class=miniButton_link>' + getSumLabel + '</span><span class=miniButton_right></span>' +
        '</a>';
      }

    }
  }
  return null;
}

/**
* Sets value for an element by id
*/
DHTMLImpl.prototype.setValueById = function (id, val) {
  var e = this.getElementById(id);
  if(e) {
  return this.setValue(e, val);
}
}

DHTMLImpl.prototype.clearValueIfEqual = function(id, valToClear) {
  var e = this.getElementById(id);
  if(e && e.value == valToClear){
    e.value = '';
    e.style.color = "black";
  }
}

DHTMLImpl.prototype.setValueIfEmpty = function(id, valToSet) {
  var e = this.getElementById(id);
  if(e && (!e.value || e.value.length == 0 || e.value == valToSet)){
    e.value = valToSet;
    e.style.color = "gray";
  }
}

/**
 * Sets value of an element, and invokes onchange handler on the element if needed.
 * @return old value
*/
DHTMLImpl.prototype.setValue = function (e, val, bDoNotInvokeOnChange) {
  var oldVal = this.getValue(e);

  // format the new value:
  val = DHTML.formatValue(val, e.getAttribute("format"));

  // pre setValue
  EncryptedField.preSetValue(e);

  switch (e.tagName) {
    case 'INPUT':

      // radio button group:
      if (e.type == 'radio' || e.type == 'checkbox') {
        var group = this.getInputGroup(e)
        var vals = typeof(val)==typeof('') ? [val] : val; // handle multi or single value
        for (var i=0; i < group.length; i++) {
          var r = group[i]
          r.checked = ArrayUtil.inArray(r.value, vals);
        }
      } else { // other INPUTs:
        e.value = val;
      }
      break;

    case 'SELECT':
      if(e.type == 'select-one') {
        //verify value exists in the options:
        var newIndex = -1;
        for (var i = 0; i < e.options.length; i++) {
          if (e.options[i].value == val) {
            newIndex = i;
            break;
          }
        }

        if (newIndex >= 0) {
          var oldIndex = e.selectedIndex;
          try {
          e.options[newIndex].selected = true;
          } catch (IE6BugWithSelect) {
            // even though IE6 threw an exception, the newIndex had been selected, we only have to unselect the oldIndex:
            if (oldIndex != newIndex && oldIndex >= 0) {
              try {
                e.options[oldIndex].selected = false;
              } catch (IE6BugWithSelect) {
                // even though IE6 threw an exception again, the oldIndex had been unselected, we should be able to set the value now:
                e.selectedIndex = newIndex
              }
            }
          }
          if (val != e.value) {
            alert('failed to update value of SELECT to "'+val+'": ' + e.id)
          }
        } else if (val == '') {
          // add an empty option:
          e.options[e.length] = new Option('', '', false, true);
        } else {
          alert('Invalid value for SELECT: ' + val);
        }
      } else { // select-multiple
        for(var i = 0; i < e.options.length; i++) {
          e.options[i].selected = false;
        }
        if(val) {
          var vals = typeof(val)==typeof('') ? [val] : val;
          for(var i = 0; i < vals.length; i++) {
            var found = false;
            for(var j = 0; j < e.options.length; j++) {
              if(e.options[j].value == vals[i]) {
                e.options[j].selected = true;
                found = true;
              }
            }
            if(!found) {
              alert('Invalid value for SELECT: ' + vals[i]);
            }
          }
        }
      }
      break;

    case 'SPAN':
      if(e.innerText != undefined) {
        e.innerText = val;
      } else {
        e.textContent = val;
      }
      e.value = val;
      break;

    case 'TEXTAREA':
      if(e.innerText != undefined) {
        e.innerText = val;
      } else {
        e.textContent = val;
      }
      break;

    case 'A':
      if (e.format == 'email') {
        e.href = 'mailto:' + val;
      }
      if(e.innerText != undefined) {
        e.innerText = val;
      } else {
        e.textContent = val;
      }
      break;

    default:
      alert('Unsupported element type: ' + e.tagName);
      break;
  }

  // apply field mask if needed:
  FieldValidation.applyFieldMask(e);

  if (!bDoNotInvokeOnChange) {
    this.invokeOnChangeIfNeeded (oldVal, e);
  }
  return oldVal;
}

DHTMLImpl.prototype.getSelectionRange = function(e) {
 var caret = new Object();
 if(document.selection){  //IE
   var sel = document.selection.createRange();
   var dup = sel.duplicate();
   dup.expand('textedit');
   dup.setEndPoint('EndToEnd', sel);
   caret.start = dup.text.length - sel.text.length;
   caret.end = caret.start + sel.text.length;
 } else if(e.selectionStart || e.selectionStart == '0') {  //Firefox
   caret.start = e.selectionStart;
   caret.end = e.selectionEnd;
 }
 return caret;
}

DHTMLImpl.prototype.getSelectedText = function(e) {
  var range = DHTML.getSelectionRange(e);
  return e.value.substring(range.start, range.end);
}

DHTMLImpl.prototype.setSelectionRange = function(e, start, end) {
 if (document.selection){  //IE
  var sel = document.selection.createRange();
  sel.moveStart('character', -e.value.length);
  sel.moveEnd('character', -e.value.length);
  if(end != null){
   sel.moveEnd('character', end);
  } else {
   sel.moveEnd('character', start);
  }
  sel.moveStart('character', start);

  sel.select();
 } else if(e.selectionStart || e.selectionStart == '0'){  //Firefox
  e.selectionStart = start;
  if(end != null) {
   e.selectionEnd = end;
  } else {
   e.selectionEnd = start;
  }
 }
}

DHTMLImpl.prototype.selectAllText = function(id) {
  var e = DHTML.getElementById(id);
    if (e.value.length != 0) {
        DHTML.setSelectionRange(e, 0, e.value.length);
    }
}

DHTMLImpl.prototype.insertSelectOptionBefore = function (select, optionToInsert, optionToInsertBefore) {
  try{
    select.add(optionToInsert, optionToInsertBefore); // DOM standard
  } catch(ex) {
    for(var i = 0; i < select.options.length; i++) {
      if(select.options[i] == optionToInsertBefore) {
        select.add(optionToInsert, i); // IE version
        return;
      }
    }
    select.add(optionToInsert);
  }
}

DHTMLImpl.prototype.getSelectOptionAfter = function (select, orderNumber) {
  for(var i = 0; i < select.options.length; i++) {
    if(select.options[i].getAttribute("order") > orderNumber) {
      return select.options[i];
    }
  }
  return null;
}

DHTMLImpl.prototype.propagateChangeToDuplicates = function (e) {
  // "pause" recorder
  var recorderStarted = top.recorderStarted;
  top.recorderStarted = false;
  var elts = this.findDuplicateElements(e);
  var val = this.getValue(e);
  for (var i = 0; i < elts.length; i++) {
    var dup = elts[i];
    if (dup != e) {
      this.setValue(dup, val);
    }
  }
  // "unpause" recorder
  top.recorderStarted = recorderStarted;
}

/**
 * Set availability for an element
 * TODO: Do we need to change style?
 */

DHTMLImpl.prototype.setAvailability = function (e, val) {
  var disabled;
  if (val == true || val == 1 || val == "true" || val == "1") {
    disabled = false;
  } else {
    disabled = true;
  }

  if (e.tagName == 'INPUT' && e.type == 'radio') {
    var group = this.getInputGroup(e)
    for (var i=0; i < group.length; i++) {
      var r = group[i];
      r.disabled = disabled;
    }
  } else {
    e.disabled = disabled;

    // toggle style class:
    var cssClass = e.className;
    if (cssClass != "" && cssClass.indexOf(' ') < 0) { // has a single style class
      if(StringUtil.endsWith(cssClass, "_disabled")){
        if(!disabled) {
          e.className = cssClass.substring(0, cssClass.length - 9);
        }
      } else {
        if(disabled) {
          e.className += "_disabled";
        }
      }
    }
  }

  // show or hide helper icons:
  hE = DHTML.getElementById(e.id+"_helper");
  if (hE != null) {
    // Use "visibility" instead of "display", so that it will not shift the page layout:
    hE.style.visibility= disabled ? 'hidden' : 'visible';
  }
  
  EncryptedField.postSetAvailability(e);
}

DHTMLImpl.prototype.isDisabled = function(e) {
  return EncryptedField.isDisabled(e);
}

/**
 * Set options for an select element
 */
DHTMLImpl.prototype.setOptions = function (e, options) {
  var oldVal = this.getValue(e)

  // clear selected item and options
  e.selectedIndex = -1;
  e.length = 0;
  DHTML.removeChildren(e); // remove optGroups, if any

  for (var i = 0; i < options.length; i++) {
    var opDef = options[i]
    var op = DHTML.createElement("option");
    op.value = opDef[0];
    op.innerHTML = opDef[1];
    op.text = opDef[1];
    if (opDef[0]==oldVal) {
      op.selected = true;
    }

    //group label
    if (opDef.length > 2) {
      var grpLabel = opDef[2];
      var optGroup = DHTML.findOrCreateOptGroup(e, grpLabel);
      optGroup.appendChild(op);
    } else {
      e.appendChild(op);
    }

  }
  
  // toggle visibility of the select, to workaournd an IE6 painting problem:
  var oldVisibility = e.style.visibility; 
  e.style.visibility = 'hidden';
  e.style.visibility = oldVisibility;

  var newVal = e.value;
  if (oldVal != newVal && newVal != '') {
    alert('Invalid value for SELECT: ' + oldVal + '. Default to the first OPTION: ' + newVal);
  }

  this.invokeOnChangeIfNeeded(oldVal, e);
}

/**
 * Returns the child optGroup element with the specified label.
 * This method creates the optGroup, if one does not exist yet.
 */
DHTMLImpl.prototype.findOrCreateOptGroup = function (e, grpLabel) {
  for (var i = 0; i < e.childNodes.length; i++) {
    var child = e.childNodes[i];
    if (child.tagName == "OPTGROUP" && child.label == grpLabel) {
      return child;
    }
  }
  var grp = DHTML.createElement("optgroup", "label", grpLabel);
  e.appendChild(grp);
  return grp;
}

/**
 * Invokes onchange handler on an element, if value changed.
 *
 * The onchange handler will be invoked after a brief timeout, to allow other events in queue to be executed first.
 * This method should NOT fire real window event, because it's invoked due to reflection rather than direct user action.
 */
DHTMLImpl.prototype.invokeOnChangeIfNeeded = function (oldVal, e) {
  if (oldVal != this.getValue(e)) {
    var id = e.id;
    if (id == '') {
      alert('Id missing for: ' + e.outerHTML);
      return;
    }
    Events.queueEvent(function() {
      DHTML.executeOnChangeById(e.id);
    });
  }
  if (e == DHTML.getActiveElement() &&
      window.event && window.event.srcElement != e) {
    // select the text when the value is changed programmatically, to avoid "missing cursor" issue in IE
    try { e.select() } catch (ignored) {}
  }
}

/**
 * Executes onchange handler of an element by id
 */
DHTMLImpl.prototype.executeOnChangeById = function (id) {
  var e = this.getElementById(id);

  // radio button or checkbox:
  if (e.tagName=='INPUT' && (e.type=='radio' || e.type == 'checkbox')) {
    if (e.onclick != null) {
      e.onclick()
    }
  }
  // other type
  else if (e.onchange != null) {
    e.onchange();
  }
  // at least try to reflect it
  // TODO: make it more generic
  else {
    Reflection.reflect(e);
  }
}


/**
* Sync up the "checked" state of all checkboxes with the the name as the specified one.
*/
DHTMLImpl.prototype.updateCheckboxGroup = function (checkbox) {
  var group = this.getInputGroup(checkbox, "groupId");
  for (var i = 0; i < group.length; i++) {
    group[i].checked = checkbox.checked
  }
}

/**
* Check for a shift-click to check multiple checkboxes.
*/
DHTMLImpl.prototype.checkCheckboxShiftClick = function (checkbox, evt) {
  if(!evt) {
    evt = window.event;
  }
  if(evt.shiftKey && this.lastCheckbox != null && this.lastCheckbox != checkbox) {
    var group = this.getInputGroup(checkbox, "groupId");
    var between = false;
    checkbox.checked = false;
    for (var i = 0; i<group.length; i++) {
      if(between) {
//        if(group[i] != checkbox) {
          group[i].checked = true;
//        }
        if(group[i] == this.lastCheckbox || group[i] == checkbox) {
          between = false;
        }
      } else {
        if(group[i] == this.lastCheckbox || group[i] == checkbox) {
          between = true;
//          if(group[i] != checkbox) {
            group[i].checked = true;
//          }
        }
      }
    }
  }
  this.lastCheckbox = checkbox;
}

/**
 * Hides the check-all checkbox, if no checkbox in the group.
 * @param headerCBId id of the check-all checkbox
 */
DHTMLImpl.prototype.updateCheckAllCheckbox = function (headerCBId) {
  var checkbox = document.getElementById(headerCBId);
  var group = this.getInputGroup(checkbox, "groupId");
  for (var i = 0; i<group.length; i++) {
    if (group[i] != checkbox) {
      return; // found a checkbox in group
    }
  }
  checkbox.style.display = 'none';
}

DHTMLImpl.prototype.refreshSelectAllCheckbox = function (checkbox) {
  if(!checkbox.checked) {
    var selectAll = this.getGroupSync(checkbox, "groupId");
    if(selectAll) {
      selectAll.checked = false;
    }
  }
}

/**
 * Displays help text for an element
 */
DHTMLImpl.prototype.showHelpText = function(elem) {

  var helpText = DHTML.getHelpText(elem);
  if (!helpText) { //no-op, for element without title
    return;
  }

  ScrollingPanel.showText(elem, helpText, 'helpTxt');
  elem.title = ''; // hide title/mouse-over-tooltip if help text is on
}


/**
 * Hides the help text for an element:
 */
DHTMLImpl.prototype.hideHelpText = function(elem) {
  var helpText = ScrollingPanel.hideText(elem);
  if (helpText != null) {
    DHTML.restoreHelpTextToTitle(elem, helpText); // restore title for the element
  }
}


/**
 * Returns the help text for an element
 */
DHTMLImpl.prototype.getHelpText = function(elem) {
  var text = elem.getAttribute("helpText");
  if (text == '__UseTitle__') {
    text = elem.title;
  }
  return text;
}

/**
 * Restores the title of an element, if needed:
 */
DHTMLImpl.prototype.restoreHelpTextToTitle = function(elem, text) {
  if (elem.getAttribute("helpText") == '__UseTitle__') {
    elem.title = text;
  }
}

/**
 * Opens a popup panel and gets its content from the server
 * @param elemId renderId of the source widget
 * @param paramMap additional paramerters for the AJAX cmd
 * @param styleclass style class for the popup panel
 */
DHTMLImpl.prototype.openPopupPanel = function(elemId, paramMap, styleClass, cacheContent) {
  var elem = document.getElementById(elemId);
  var panelContent = elem.popupPanelContent;
  ScrollingPanel.showText(elem, panelContent == null ? AJAX.getLoadingHTML() : panelContent, styleClass, true, 500, 800, true);

  // load content from server
  if (panelContent == null) {
    AJAX.initRequest(elemId, paramMap, function() {
      if (cacheContent) {
        elem.popupPanelContent = AJAX.returnValue;
      }
      ScrollingPanel.showText(elem, AJAX.returnValue, styleClass, true, 500, 800, true);
    }, true);
  }
}

DHTMLImpl.prototype.closePopupPanel = function() {
  ScrollingPanel.hideText();
}

/**
 * Removes element with the give id fromthe cur
 */
DHTMLImpl.prototype.removeElement = function(elemId) {
  var container = document.getElementById(elemId + '_container');
  var elem = container != null ? container : document.getElementById(elemId);
  elem.parentNode.removeChild(elem);
}

/**
 * Removes all children elements
 */
DHTMLImpl.prototype.removeChildren = function(elem) {
  while (elem.childNodes.length > 0) {
    elem.removeChild(elem.childNodes[0]);
  }
}
/**
 * Updates the element with the new content
 * @param elemId id of the HTML element to update (or the element itself)
 * @param content new HTML content
 * @param scripts extra JS scripts to execute
 * @param refreshChildrenOnly if true, only replace child elements but not the element itself
 * @param bAppend if ture, appends the new content after the element
 */
DHTMLImpl.prototype.updateElement = function(elemId, content, scripts, refreshChildrenOnly, bAppend) {
  var oldNode = typeof(elemId) == typeof('') ? DHTML.getElementById(elemId, true) : elemId;
  var parentNode, anchorNode;
  if (bAppend) {
    parentNode = oldNode.parentNode;
    anchorNode = oldNode.nextSibling; // to insert before the next sibling
  } else if (refreshChildrenOnly) {
    parentNode = oldNode;
    anchorNode = null;
    // remove old children
    DHTML.removeChildren(parentNode);
  } else {
    parentNode = oldNode.parentNode;
    anchorNode = oldNode;
  }

  var tempSpan = document.createElement('span');
  var tempPlaceHolder = document.body.appendChild(tempSpan);
  if (parentNode.tagName == 'TR') {
    DHTML.setInnerHTML(tempPlaceHolder, '<TABLE><TBODY><TR>' + content + '</TR></TBODY></TABLE>');
    tempPlaceHolder = tempPlaceHolder.childNodes[0].childNodes[0].childNodes[0]; // the TR element
  } else if (parentNode.tagName == 'TBODY') {
    DHTML.setInnerHTML(tempPlaceHolder, '<TABLE><TBODY>' + content + '</TBODY></TABLE>');
    tempPlaceHolder = tempPlaceHolder.childNodes[0].childNodes[0]; // the TBody element
  } else if (parentNode.tagName == 'TABLE') {
    DHTML.setInnerHTML(tempPlaceHolder, '<TABLE>' + content + '</TABLE>');
    tempPlaceHolder = tempPlaceHolder.childNodes[0]; // the Table element
  } else {
    DHTML.setInnerHTML(tempPlaceHolder, content);
  }
  while (tempPlaceHolder.childNodes.length > 0) {
    parentNode.insertBefore(tempPlaceHolder.removeChild(tempPlaceHolder.childNodes[0]), anchorNode);
  }
  document.body.removeChild(tempSpan);
  if (anchorNode != null && !bAppend) {
    parentNode.removeChild(anchorNode);
  }

  // execute the scripts, by appending them to the end of the document:
  if (scripts != null && scripts != '') {
    var js = document.createElement('script');
    js.text = scripts;
    document.body.appendChild(js);
  }

  EventHandlers.partialLoadHandler();
}

// copied from 3.1
DHTMLImpl.prototype.getTableRows = function(table) {
  var result = new Array();
  if (table.childNodes[0].tagName == 'FORM') {
    table = table.childNodes[0];
  }
  for (var i = 0; i < table.childNodes.length; i++) {
    var node = table.childNodes[i];
    if (node.tagName == 'TR') {
      result[result.length] = node;
    } else if (node.tagName == 'TBODY') {
      for (var j = 0; j < node.childNodes.length; j++) {
        var subNode = node.childNodes[j];
        if (subNode.tagName == 'TR') {
          result[result.length] = subNode;
        }
      }
    }
  }
  return result;
}

/**
 * Simulates focus and click on the radio button, so that confirmation and reflection of radio value change would work.
 */
DHTMLImpl.prototype.clickRadio = function(elem) {
  elem.fireEvent("onfocus"); // fire onfocus so that it can record the old value
  elem.click();
}

/**
 * Invokes event on the specified element
 */
DHTMLImpl.prototype.invokeElement = function(elem) {
  switch (elem.tagName) {
    case 'A':
    case 'SPAN':
      elem.click();
      // mark the original event as handled, for the click to go thru
      if (event) {
        event.cancelBubble = true;
        event.returnValue = false;
      }
      break;
    default:
      Debug.log('Failed to click element: ' + elem.tagName);
      break;
  }

}

/**
 * Sets innerHTML for the specifed element.
 * This method is created to work around an IE bug, which ignores HTML that only contains <Script>.
 */
DHTMLImpl.prototype.setInnerHTML = function(elem, html) {
  html = '<span id="removeMe" style="display:none">a<\/span>' + html;
  elem.innerHTML = html;
  var firstChild = elem.firstChild;
  if (firstChild && firstChild.id == "removeMe") {
    elem.removeChild(firstChild);
  }
}


/**
 * Works around the IE limitation that cuts off option text exceeding the specified width of the SELECT.
 */
DHTMLImpl.prototype.fixSelectWidth = function() {
  if (DHTML.isFirefox || DHTML.isIE9Up) {
    return;
  }
  
  var ss = document.getElementsByTagName("SELECT");
  for (var i=0; i < ss.length; i++) {
    var elem = ss[i];

    if (elem.tabIndex < 0 || elem.oldWidth != null || elem.currentStyle.display == 'none') {
      continue; // no need to fix width, or it has been fixed already
    }

    var w = elem.offsetWidth;
    var oldWidthStr = elem.style.width;
    elem.style.width = 'auto';
    if (elem.offsetWidth <= w) {
      elem.style.width = oldWidthStr;
      continue; // the specified length does not cut off any option
    }

    elem.wDiff = elem.offsetWidth - w;

    // wrap the SELECT inside a SPAN to prevent layout shifts when the width of the SELECT changes
    var span = DHTML.createElement('span', 'style', 'overflow:hidden;white-space:nowrap;');
    span = elem.parentElement.insertBefore(span, elem);
    elem = elem.parentElement.removeChild(elem);
    elem = span.appendChild(elem);
    span.style.width = elem.oldWidth = elem.style.width = w; // make sure to convert % width to pixel width

    if (!window.XMLHttpRequest) {
      // For IE6, we have to cover the invisible part of the SELECT using an IFRAME
      var shim = DHTML.createElement('iframe', 'frameBorder', '0', 'scrolling', 'no', 'tabindex', '-1',
              'style', 'position:absolute;bottom:0;right:-' +
                       (elem.wDiff-1) + 'px;width:' + elem.wDiff + 'px;height:1px;');
      elem.shim = span.appendChild(shim);
    }

    // create a "fake" dropdown icon when the select is only partially visible:
    var iconWidth = elem.offsetHeight - 2; // just enough width to show the icon only:
    var dropIcon = span.appendChild(DHTML.createElement('span',
            'style', 'overflow:hidden;white-space:nowrap;position:absolute;left:' +(w-iconWidth)+ 'px;width:'+iconWidth+'px'));
    if (!window.XMLHttpRequest) {
      dropIcon.style.height = 1; // Don't hide dropdown completely to workaround IE 6 painting problem
    } else {
      dropIcon.style.height = iconWidth + 2;
      dropIcon.style.display = 'none';
    }
    var selectIcon = dropIcon.appendChild(DHTML.createElement('select',
            'style', 'position:absolute;right:0;width:' +(iconWidth+2)+ 'px', // make the select slightly wider to hide left border
            'tabindex', '-1',
            'onbeforeactivate', 'if(!window.XMLHttpRequest){event.fromElement.blur()} return false'));
    selectIcon.appendChild(DHTML.createElement('option')); // create a single option in menu, otherwise browser will default to a long menu
    selectIcon.className = elem.className;
    elem.dropIcon = dropIcon;

    // register events to toggle width of the select:
    elem.onbeforeactivate = DHTMLImpl_beforeActivateSelect;
    elem.onbeforedeactivate = DHTMLImpl_beforeDeactivateSelect;
  }
}

/**
 * Disables width limitation when the select gets focus, so that its option menu can be fully displayed:
 * @param elem the select element
 */
function DHTMLImpl_beforeActivateSelect(elem) {
  elem = elem || window.event.srcElement;

  if (elem.dropIcon.offsetHeight == 1) {
    elem.dropIcon.style.height = elem.dropIcon.offsetWidth + 2
  }
  elem.dropIcon.style.display = '';

  elem.style.width = 'auto';
  if (elem.shim) {
    elem.shim.style.width = elem.wDiff;
    // For IE6, we have to make sure the menu is still open after SELECT width change
    elem.focus();
  }
}

/**
 * Enables width limitation when the select loses focus
 * @param elem the select element
 */
function DHTMLImpl_beforeDeactivateSelect(elem) {
  elem = elem || window.event.srcElement;
  elem.style.width = elem.oldWidth;

  if (elem.shim) {
    elem.shim.style.width = "0";
  }
  elem.dropIcon.style.display = 'none';
}

DHTMLImpl.prototype.cancelBubbleIfNoAltKeyOrEnter = function() {
  if (window.event && !window.event.altKey && window.event.keyCode != 13) {
    window.event.cancelBubble = true;
  }
}

DHTMLImpl.prototype.createElement = function(tag) {
  var toCreate = "<" + tag;
  for(var i = 1; i < arguments.length - 1; i+=2) {
    if(arguments[i] && arguments[i].length > 0) {
      toCreate += " " + arguments[i] + "=\"" + arguments[i+1] + "\"";
    }
  }
  toCreate += "></" + tag + ">";
  var element;
  try{
    element = document.createElement(toCreate);
  } catch(err) {
    element = document.createElement(tag);
    for(var i = 1; i < arguments.length - 1; i+=2) {
      if(arguments[i] && arguments[i].length > 0) {
        element.setAttribute(arguments[i], arguments[i+1]);
      }
    }
  }
  return element;
}

DHTMLImpl.prototype.cancelBubbleIfNoAltKey = function(event) {
  if (event && !event.altKey) {
    event.cancelBubble = true;
  }
}

DHTMLImpl.prototype.getActiveElement = function() {
  if(document.activeElement){
    return document.activeElement;
  } 
  if (document.activeElementId) {
    return document.getElementById(document.activeElementId);
  }
  var focusedElem = DHTML.getElementById(document.mainForm.objFocusId.value);
  if (focusedElem != null) {
    return focusedElem;
  }
  return document.body;
}

DHTMLImpl.prototype.setActiveElementId = function(id) {
  var activeElem = document.activeElement;
  if (!activeElem) {
    EventHandlers.beforeDeactivateHandler(document.getElementById(id)); // manually invoke handler for firefox
    var oldId = document.activeElementId;
    document.activeElementId = id; // firefox does not support active element
    EventHandlers.activateHandler(oldId); // manually invoke handler for firefox
  } else if (activeElem.id != id) {
    // activate the specified element or its nearest enclosing element that can be set to active:
    for (var e = document.getElementById(id); e != null; e = e.parentNode) {
      if (e.id != id) {
        //Debug.log('<font color=red>Failed to activate id="'+id+ '". Try enclosing '+e.tagName+'(id="'+e.id+'")</font>');
        convertKeyShortcutScopeId(id, e.id); // fix invalid scope ID which can not be activated
      }
      if (e.setActive) {
        e.setActive();
      }
      if (e == document.activeElement) {
        break;
      }
    }
  }
}

DHTMLImpl.prototype.getStyle = function(elt, strCssRule){
	var strValue = "";
	if(document.defaultView && document.defaultView.getComputedStyle){
		strValue = document.defaultView.getComputedStyle(elt, "").getPropertyValue(strCssRule);
	}
	else if(elt.currentStyle){
		strCssRule = strCssRule.replace(/-(w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
		strValue = elt.currentStyle[strCssRule];
	}
	return strValue;
}

/**
 * Create an IFrame to shim an element, so that it can cover windows controls (e.g. Select) on page.
 */
DHTMLImpl.prototype.shimElement = function(elem){
  var shim = elem._shim;

  if (shim == null) {
    // create shim:
    shim = document.createElement('iframe');
    shim.src = 'javascript:false;';
    shim.scrolling = 'no';
    shim.frameborder = 0;
    shim.style.cssText = 'position:absolute;filter:alpha(opacity=1);border:0;';
    document.body.appendChild(shim);

    elem._shim = shim;
  }
  
  shim.style.display = 'block';
  shim.style.width = elem.offsetWidth;
  shim.style.height = elem.offsetHeight;
  shim.style.top = DHTML.getElementTop(elem);
  shim.style.left = DHTML.getElementLeft(elem);
  shim.style.zIndex = elem.style.zIndex - 1;
  return shim;
}

DHTMLImpl.prototype.unshimElement = function(elem){
  if (elem._shim != null) {
    elem._shim.style.display = 'none';
  }
}

DHTMLImpl.prototype.flash = function(id, times) {
  var elt = DHTML.getElementById(id);
  if(!times) times = 10;
  if(elt) {
    elt.flash_oldBorder = elt.style.border ? elt.style.border : "none";
    elt.style.border = "2px solid red";
    setTimeout("DHTML.doFlash(\"" + id + "\", " + (times * 2) + ")", 500);
  }
}

DHTMLImpl.prototype.doFlash = function(id, times) {
  var elt = DHTML.getElementById(id);
  if(elt) {
    if(elt.flash_oldBorder) {
      elt.style.border = elt.flash_oldBorder;
      elt.flash_oldBorder = null;
    } else if(times > 0) {
      elt.flash_oldBorder = elt.style.border ? elt.style.border : "none";
      elt.style.border = "2px solid red";
    }
    if(times > 0) {
      setTimeout("DHTML.doFlash(\"" + id + "\", " + (times - 1) + ")", 500);
    }
  }
}

/**
 * Sets up the header to collapse/expand the section
 */
DHTMLImpl.prototype.setupToggleSection = function (headerId, sectionId) {
  var header = document.getElementById(headerId);
  header._section = document.getElementById(sectionId);
  if (DHTML.getValueById(header.id + '_clpsd') == 'true') {
    DHTMLImpl_updateSection(header, header._section, true);
  }
}
/**
 * Invokes the header to toggle section collapse/expand state
 */
DHTMLImpl.prototype.toggleSection = function(header) {
  var toCollapse = !(DHTML.getValueById(header.id + '_clpsd') == 'true');
  DHTML.setValueById(header.id + '_clpsd', toCollapse ? 'true' : 'false');
  DHTMLImpl_updateSection(header, header._section, toCollapse);
}
/**
 * Updates collapse/expand state for the section
 */
function DHTMLImpl_updateSection(header, section, collapsed, recursed) {
  if (!recursed) {
    if (collapsed) {
      DHTML.addStyleSuffix(header, 'closed');
    } else {
      DHTML.removeStyleSuffix(header, 'closed');
    }
  }
  for (var i = 0; i < section.childNodes.length; i++) {
    var e = section.childNodes[i];
    if (!DHTML.contains(e, header)) {
      e.style.display = collapsed ? 'none' : '';
    } else if (e != header) {
      DHTMLImpl_updateSection(header, e, collapsed, true);
    }
  }
}

/**
 * Appends a handler to the specified event of the object.
 * This method does nothing if this handler has been added already.
 * @param e  the DOM element
 * @param eventName  name of the event
 * @param callback  the callback action to append to the event
 */
DHTMLImpl.prototype.appendToEventHandler = function(e, eventName, callback) {
  DHTMLImpl_addToEventHandler(e, eventName,  callback, /*bInsert*/false)
}

/**
 * Insert a handler to the beginning of specified event of the object.
 * This method does nothing if this handler has been added already.
 * @param e  the DOM element
 * @param eventName  name of the event
 * @param callback  the callback action to append to the event
 */
DHTMLImpl.prototype.insertToEventHandler = function(e, eventName, callback) {
  DHTMLImpl_addToEventHandler(e, eventName,  callback, /*bInsert*/true)
}

function DHTMLImpl_addToEventHandler(e, eventName, callback, bInsert) {
  var lst = e[eventName+'_list'];
  if (!lst){
    lst = e[eventName+'_list'] = [];

    var origHandler = e[eventName]
    if (origHandler) {
      lst.push(origHandler);
    }

    DHTML.setFieldToClosure(e, eventName, function(event) {DHTMLImpl_executeEventHandlers(e, eventName, event)});
  } else {
    if (DHTMLImpl_findEventHandler(e, eventName, callback) >= 0) {
      return; // do nothing, since handler already attached
    }
  }

  if (bInsert) {
    for (var i = lst.length-1; i >= 0; i--) {
      lst[i+1] = lst[i]
    }
    lst[0] = callback;
  } else {
    lst.push(callback)
  }
}

/**
 * A helper function to executed all handlers registered thru {@link #appendToEventHandler}
 * @param e the DOM element
 * @param eventName name of the event
 */
function DHTMLImpl_executeEventHandlers(e, eventName, event) {
  var lst = e[eventName+'_list'];
  for (var i=0; i<lst.length; i++) {
    var callback = lst[i]
    if (typeof(callback)==typeof('')) {
      eval(callback);
    } else if (callback) {
      // invoke the function from the element context:
      e.temp = callback;
      e.temp(event);
    }
  }
}

/**
 * Rolls back the handler that was appended thru {@link #appendToEventHandler}
 * @param e the DOM element
 * @param eventName name of the event
 * @param callback the event handler to be detached
 */
DHTMLImpl.prototype.rollbackEventHandler = function(e, eventName, callback) {
  var i = DHTMLImpl_findEventHandler(e, eventName, callback)
  if (i < 0) {
    Debug.log('No matching "'+eventName+'" handler found for ' + e.id)
  } else {
    e[eventName+'_list'][i] = undefined
  }
}

/**
 * A helper function to find a handler that was appended thru {@link #appendToEventHandler}
 * @param e
 * @param eventName
 * @param callback
 */
function DHTMLImpl_findEventHandler(e, eventName, callback) {
  var lst = e[eventName+'_list'];
  if (lst) {
    for (var i=0; i<lst.length; i++) {
      if (lst[i] == callback) {
        return i
      }
    }
  }
  return -1
}

DHTMLImpl.prototype.getSmokeTestAlertMsg = function() {
  if(smokeTestAlertMsg) {
    return smokeTestAlertMsg;
  }
  var smokeTestResultsElt = DHTML.getElementById("SmokeTests:SmokeTestsScreen:SmokeTestResults");
  if(smokeTestResultsElt) {
    return DHTML.getValue(smokeTestResultsElt);
  }
  return null;
}

// ----------------------------------------------------- IE9 and up compatibility
/**
 * Returns version extracted from user-agent using the given pattern or -1
 * @param pattern pattern of substring that contains the version. The first matching group must contain
 *                the number itself.
 */
function DHTMLImpl_getUAVersion (pattern) {
  var ua = navigator.userAgent;
  var re  = new RegExp(pattern);
  if (re.exec(ua) != null)
    return parseFloat( RegExp.$1 );
  return -1; // Return value assumes failure.
}

/**
 * Checks if version extracted from user-agent is greater or equal to specified.
 * @param minVersion minimal expected version
 * @param pattern pattern to extract actual version from user-agent
 */
function DHTMLImpl_checkUAVersion (minVersion, pattern) {
  var actualVer = DHTMLImpl_getUAVersion (pattern);
  return ( actualVer >= minVersion );
}

// functions to detect Internet Explorer version
// reference: http://msdn.microsoft.com/en-us/library/ms537509%28v=vs.85%29.aspx
function DHTMLImpl_checkInternetExplorerVersion (version) {
  return DHTMLImpl_checkUAVersion(version, "MSIE ([0-9]{1,}[\.0-9]{0,})");
}

// check Trident token version that allows detecting actual IE version even when it runs in compatibility mode,
// see http://blogs.msdn.com/b/ie/archive/2010/03/23/introducing-ie9-s-user-agent-string.aspx
function DHTMLImpl_checkInternetExplorerTridentVersion (version) {
  return DHTMLImpl_checkUAVersion(version, "Trident/([0-9]{1,}[\.0-9]{0,})");
}

// Checks if we are in IE 9 or above
if (navigator.appName == 'Microsoft Internet Explorer') {
  DHTML.isIE9Up = DHTMLImpl_checkInternetExplorerVersion (9.0)
    || DHTMLImpl_checkInternetExplorerTridentVersion (5.0);
}

// ----------------------------------------------------- Firefox compatibility

// Checks if we're in Firefox, and if so prepares for it
if(typeof HTMLElement!="undefined" && ! HTMLElement.prototype.insertAdjacentElement) {
  DHTML.isFirefox = true;

	HTMLElement.prototype.insertAdjacentElement = function(where,parsedNode) {
		switch (where) {
		case 'beforeBegin':
			this.parentNode.insertBefore(parsedNode,this)
			break;
		case 'afterBegin':
			this.insertBefore(parsedNode,this.firstChild);
			break;
		case 'beforeEnd':
			this.appendChild(parsedNode);
			break;
		case 'afterEnd':
			if (this.nextSibling) {
        this.parentNode.insertBefore(parsedNode,this.nextSibling);
      }
			else {
			  this.parentNode.appendChild(parsedNode);
			}
			break;
		}
	}

	HTMLElement.prototype.insertAdjacentHTML = function(where,htmlStr) {
		var r = this.ownerDocument.createRange();
		r.setStartBefore(this);
		var parsedHTML = r.createContextualFragment(htmlStr);
		this.insertAdjacentElement(where,parsedHTML)
	}

	HTMLElement.prototype.insertAdjacentText = function(where,txtStr) {
		var parsedText = document.createTextNode(txtStr)
		this.insertAdjacentElement(where,parsedText)
	}

}
