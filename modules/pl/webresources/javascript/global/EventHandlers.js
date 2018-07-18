/**
 * (c) 2003 Guidewire Software
 *
 * Class: EventHandlers
 *
 * Registers the main event handlers of the document.
 */

/**
 * Register the EventHandlers class as a global library
 */
window.EventHandlers = new EventHandlersImpl();

/**
 * Set up a fake recorder if none exists
 */
function doNothing() {}
window.Recorder = new Object();
window.Recorder.start =
  window.Recorder.step =
  window.Recorder.click =
  window.Recorder.changed =
  window.Recorder.keyShortcut =
  window.Recorder.toggleMenu =
  window.Recorder.menuItem =
  window.Recorder.calendar =
  window.Recorder.tvFolder =
  window.Recorder.tvElement =
  window.Recorder.setAndRefresh =
  window.Recorder.bindInputFields =
  window.Recorder.record = doNothing;

function getEmptyTop() {return new Object();}
window.Recorder.getTop = getEmptyTop;

/**
 * Constructor
 */
function EventHandlersImpl() {

  // Whether to close the window when unloading
  this.closeOnUnload = false;

  // Whether the alt key is held down
  this.altKeyDown = false;

  // Whether the shift key is held down
  this.shiftKeyDown = false;

  // suffix for alt value:
  this.FOOTER_SUFFIX = '_altFooter';
}

/**
 * Marks that we should close this window when unloading the current page.
 * Also registered as the global function "setCloseOnUnload"
 */
EventHandlersImpl.prototype.setCloseOnUnload = function() {
  setCloseOnUnload();
}
function setCloseOnUnload() {
  EventHandlers.closeOnUnload = true;
}

/**
 * Main function: called when the document is loaded.  This method sets up
 * the other event handlers then prepares the document as needed.  Also registered
 * as the global handler "loadHandler", referenced by Header.jsp
 */
EventHandlersImpl.prototype.loadHandler = function(enableTools) {
  Debug.log('<b>onload handler</b>')

  registerStandardKeyShortcuts();
  this.enableTools = enableTools;
  if (enableTools) {
    registerKeyShortcut('ShiftH', 'helpWindow()');
    registerKeyShortcut('ShiftJ', 'inspector()');
    registerKeyShortcut('ShiftI', 'locationInfo()');
    registerKeyShortcut('ShiftV', 'pcfLens()');
    registerKeyShortcut('ShiftW', 'widgetPageInfo()');
    registerKeyShortcut('ShiftL', 'Events.invokeEvent(\'_reloadPCF_\', true)');
    registerKeyShortcut('ShiftE', 'Events.invokeEvent(\'_editCurrentPage_\')');
    registerKeyShortcut('ShiftG', 'Debug.start()');
  }

  // Prepare other event handlers
  document.body.onunload = this.unloadHandler;
  document.body.onmouseover = this.mouseOverHandler;
  document.body.onmousedown = this.mouseDownHandler;
  document.body.onmouseup = this.mouseUpHandler;
  document.body.onmouseout = this.mouseOutHandler;
  document.body.onmousemove = this.mouseMoveHandler;
  document.body.onclick = this.clickHandler;
  document.body.ondblclick = this.dblClickHandler;
  document.onkeydown = this.keyDownHandler;
  document.body.onkeyup = this.keyUpHandler;
  document.body.onfocusout = this.focusOutHandler;
  // commented out following, because changing styleClass may take half a second:
  //document.body.onactivate = this.activateHandler;
  //document.body.onbeforedeactivate  = this.beforeDeactivateHandler;
  window.onresize = this.resizeHandler;

  // Create the overflow tab
  Menu.createMoreTab();

  // Make sure the initial focus is set correctly
  var initialFocusId = document.mainForm.objFocusId.value;
  // clear this id in case it does not exist on page. If it does exist, setting focus to the element will restore this id
  document.mainForm.objFocusId.value = '';
  DHTML.setInitialFocus(initialFocusId);

  // Invoke the page "onafterload" handler, if one exists
  if (window.onafterload) {
    window.onafterload();
  }

  // Open any exit points, if defined
  if (window.exitPoint) {
    setTimeout(window.exitPoint, 100);
  }

  // Register any "refreshPageDelay" call
  if (window.onRefreshPage && window.refreshPageDelay > 0) {
    window.setTimeout(window.onRefreshPage, window.refreshPageDelay * 1000);
  }

  // Invoke the smoke test, if one is running
  if (window.smokeTest) {
    window.setTimeout(window.smokeTest, SmokeTest.delay);
  }

  resizeLeftNavOnload(document.getElementById('leftnav'));

  // restore initial scrolling if needed, at resize left nav
  DHTML.restoreScrollPositions();

  if (window.actPageLink != null) {
    var pos = document.getElementById('fourthLevelNav_pos');
    var x = window.actPageLink.offsetLeft + window.actPageLink.offsetWidth / 2;
    var y = pos.parentNode.offsetWidth / 2;
    if (x > y) { 
      pos.style.width = (x - y) + "px";
    } else if (x < y) {
      document.getElementById('thirdLevelNav_pos').style.width = (y - x) + "px";
    }
  }

  EventHandlers.partialLoadHandler();

  // Make sure this document's title is reflected in the top window title
  window.top.document.title = window.document.title;

  // workaround IE bug of never-stopping progress bar:
  if (document.parentWindow) {
    var dummyFrame = document.parentWindow.parent.utility_frame;
    dummyFrame.document.write('');
    dummyFrame.document.close();
  }

  workspaceOnLoad(document.getElementById('workspaceDivision'));

  var reqMon = window.parent.__reqMon
  if (reqMon) {
    var sourceId = reqMon[0]
    var clientTime = new Date().getTime() - reqMon[1]
    var serverTime = window.__serverTime
    var pageId = document.getElementById("mainContent").childNodes[0].id
    document.mainForm.reqMon.value = [sourceId, pageId, clientTime, serverTime].toJSONString()

    window.parent.__reqMon = undefined
  }
  //Debug.log('end onload handler');
}

/**
 * Invoked when the page or part of the page is (re)loaded
 */
EventHandlersImpl.prototype.partialLoadHandler = function() {
  // Set the state of any checkbox flag dependent buttons
  DHTML.refreshButtonAvailability();

  // Work around option cut-off problem of IE
  DHTML.fixSelectWidth();

  // Invoke the recorder
  Recorder.bindInputFields();
}

/**
 * Sets the warning message when unload the app
 * @param msg If not blank, will show up as waring before unload app; if blank, no warning when unload app.
 */
EventHandlersImpl.prototype.setWarnUnsavedWorkBeforeUnload = function(msg) {
  this._warnUnsavedWorkBeforeUnload = msg;
}

/**
 * Handlers before leaving the entire app (i.e., parent frameset)
 */
EventHandlersImpl.prototype.beforeUnloadAppHandler = function() {
  if (EventHandlers._warnUnsavedWorkBeforeUnload) {
    return EventHandlers._warnUnsavedWorkBeforeUnload;
  }
}

  /**
 * Handles leaving the document by closing pop-ups and possibly the current window
 */
EventHandlersImpl.prototype.unloadHandler = function() {
  DHTML.closePopups();
  DHTML.cleanUpClosures();
  // Use EventHandlers, not this; handler is called as function not method
  if (window == top.lastFocusWindow) {
    EventHandlers.clearLastFocus();
  }
  if (EventHandlers.closeOnUnload) {
    window.close();
  }
}

/**
 * Handles mouse over events by updating the info bar at the bottom of the window
 */
EventHandlersImpl.prototype.mouseOverHandler = function() {
  var infoText = '';
  if (self.status != infoText) {
    self.status = infoText;
  }
  return true;
}

/**
 * Handles mouse downs:
 * <li>remembers mousedown state
 * <li>report to the calendar, if one is open
 */
EventHandlersImpl.prototype.mouseDownHandler = function() {
  EventHandlers.mouseDown = true;
  if (calendar) {
    calendar.mouseDownHandler();
  }
  if (EventHandlers.enableTools && EventHandlers.altKeyDown && EventHandlers.shiftKeyDown) {
    if(window.clipboardData && window.event && window.event.srcElement) {
      var e = window.event.srcElement;
      while(e != null && !e.id) {
        e = e.parentNode;
      }
      if(e) {
        var text = e.id;
        text = text.replace(/:[0-9]+:/g, "._Entries[].");
        text = text.replace(/:/g, ".");
        window.clipboardData.setData("Text", text);
      }
    }
    EventHandlers.isAltShiftClick = true;
  }
  ScrollingPanel.mouseDownHandler();
  Resize.onDown();
}

/**
 * Registers an action string to be evaluated when the mouse is released (up or out).
 * No op, if the mouse is not down when this method is called.
 * @return true, if the mouse is down when the method is called
 */
EventHandlersImpl.prototype.setMouseReleaseActionString = function(str) {
  if (this.mouseDown) {
    if (this.mouseReleaseActionStr != null) {
      this.mouseReleaseActionStr += str;
    } else {
      this.mouseReleaseActionStr = str;
    }
    return true;
  }
  return false;
}

/**
 * A private helper function to be called when mouse is released (up or out).
 * This method clears "mouse is down" state, and executes action registered with mouse release.
 */
function EventHandlersImpl_handleMouseRelease() {
  if (EventHandlers.mouseDown) {
    EventHandlers.mouseDown = false;
    if (EventHandlers.mouseReleaseActionStr != null) {
      eval(EventHandlers.mouseReleaseActionStr);
      EventHandlers.mouseReleaseActionStr = null;
    }
  }
}

/**
 * Handles mouse up event
 */
EventHandlersImpl.prototype.mouseUpHandler = function() {
  DHTML.currentButton = null;
  EventHandlersImpl_handleMouseRelease();
}

/**
 * Handles mouse out event
 */
EventHandlersImpl.prototype.mouseOutHandler = function() {
  EventHandlersImpl_handleMouseRelease();
}

/**
 * Handle mouse motion by recording the cursor's position
 */
EventHandlersImpl.prototype.mouseMoveHandler = function() {
  DHTML.recordMousePosition();
  Resize.onMove();
}

EventHandlersImpl.prototype.dblClickHandler = function() {
  Resize.onDblClick();
}

/**
 * Handle mouse clicks by possibly closing any open DHTML menus.
 * Also, disable shift-clicks.
 */
EventHandlersImpl.prototype.clickHandler = function(evt, dontReturnFalseOnShift) {
  Menu.menuClickAway();
  if (evt == null) {
    evt = window.event;
  } else if(evt.target) {
    DHTML.setActiveElementId(evt.target.id); // manually set activeElement for Firefox
  }
  if (evt.shiftKey) {
    if(!dontReturnFalseOnShift || (EventHandlers.enableTools && EventHandlers.altKeyDown)) {
      evt.returnValue = false;
    }
    evt.cancelBubble = true;
  } else {
    Recorder.click(evt.srcElement || evt.target);
  }
}

/**
 * Report key down events to the keyboard shortcuts
 */
EventHandlersImpl.prototype.keyDownHandler = function(evt) {
  if(evt == null) {
    evt = window.event;
  }
  if (evt.keyCode == 18) {
    EventHandlers.altKeyDown = true;
  } else if (evt.keyCode == 16) {
    EventHandlers.shiftKeyDown = true;
  }
  
  keyboardShortcutKeyDownHandler(evt);
}

/**
 * Check key up events
 */
EventHandlersImpl.prototype.keyUpHandler = function(evt) {
  if(evt == null) {
    evt = window.event;
  }
  if (evt.keyCode == 18) {
    EventHandlers.altKeyDown = false;
  } else if (evt.keyCode == 16) {
    EventHandlers.shiftKeyDown = false;
  }
  EventHandlers.isAltShiftClick = false;
}

/**
 * Fires before the active element gets deactivated
 * @param toElem the element that is going to have the focus
 */
/*
EventHandlersImpl.prototype.beforeDeactivateHandler = function(toElem) {
  var oldScope = findCurrentKeyboardScope();
  var newScope = KeyboardShortcutsImpl_findEnclosingScopeElem(window.event ? window.event.toElement : toElem);
  if (oldScope != newScope) {
    if (oldScope) {
      Debug.log('... START remove old actScope style');
      DHTML.removeStyleSuffix(oldScope, 'actScope');
      Debug.log('--- END remove old actScope style');
    }
  }
}
*/

/**
 * Fires after the active element changes
 * @param fromElem the element that used to to have the focus
 */
/*
EventHandlersImpl.prototype.activateHandler = function(fromElem) {
  var oldScope = KeyboardShortcutsImpl_findEnclosingScopeElem(window.event ? window.event.fromElement : fromElem);
  var newScope = findCurrentKeyboardScope();
  if (oldScope != newScope) {
    if (newScope) {
      Debug.log('... START add new actScope style');
      DHTML.addStyleSuffix(newScope, 'actScope', ' ');
      Debug.log('--- END add new actScope style');
    }
  }
}
*/

  /**
 * Handle focus out events by recording the last element that had the keyboard focus.
 */
EventHandlersImpl.prototype.focusOutHandler = function() {
  if (window.disableFocusHandler) {
    return;
  }
  if(window.event != null) {
    top.lastFocus = window.event.srcElement;
    top.lastFocusWindow = window;
    if (top.lastFocus != null && top.lastFocus.accessKey) {
      // Use EventHandlers, not this; handler is called as function not method
      EventHandlers.clearLastFocus();
    }
  }
}

EventHandlersImpl.prototype.resizeHandler = function() {
  DHTML.resizeBusyDiv();
}

/**
 * Go to the last element that had the keyboard focus. Does nothing if the
 * last element was never set or has been cleared
 */
EventHandlersImpl.prototype.goToLastFocus = function() {
  if (top.lastFocus) {
    // Occasionally last focus may no longer be available (e.g. deleted ELV field)
    try { top.lastFocus.focus(); } catch (e) {}
    EventHandlers.clearLastFocus();
  }
}

/**
 * Clear out the variables that store information about the last element that
 * had keyboard focus
 */
EventHandlersImpl.prototype.clearLastFocus = function() {
  top.lastFocus = null;
  top.lastFocusWindow = null;
}

/**
 * Invoked from "onchange" handler of a HTML element.
 * Only gets invoked on editable elements.
 */
EventHandlersImpl.prototype.valueChanged = function(e, element, confirmMsg) {

  var event = e || window.event;
  var srcElement = event ? (event.srcElement || event.target) : undefined;

  // Things to do when user changes the value directly from the UI (i.e. not thru reflection):
  // (by checking if the element is the source element of the event)
  var bDirectChange = (srcElement == element || element.maskFieldChanged);
  if (bDirectChange || window.smokeTest) {

    // remember "_lastValue", because it may change due on onfocus gets invoked after confirm dialog dismisses:
    var oldValue = element._lastValue;

    // Return "false" to disallow value change, if the user doesn't confirm.
    // (Cannot disallow value change, when the element does not have focus.)
    if (confirmMsg != null && !DHTML.confirm(confirmMsg)) {

      // workaround for <SELECT> - rollback to "last value":
      if (element.tagName == 'SELECT') {
        element.selectedIndex = element._lastIndex;
      } else {
        DHTML.setValue(element, oldValue, true);
      }

      return false; // cancel onChange
    } else {
      // workaround for <SELECT> - remember the new "last value"
      if (element.tagName == 'SELECT') {
        element._lastIndex = element.selectedIndex;
      } else {
        element._lastValue = DHTML.getValue(element);
      }
    }

    // Spell check, if required
    if (window.checkSpellOnChange == true && ArrayUtil.inArray(element.id, spellCheckInfo)) {
      parent.spellcheck_frame.checkSpelling(new Array(element));
    }

    if(!(element.type == 'select-multiple')) {
      DHTML.propagateChangeToDuplicates(element);
    }

  }

  // Things to do, no matter the value is changed directly or thru reflection:
  Recorder.changed(element);
  Reflection.reflect(element, bDirectChange);
  if (element.maskFieldChanged) {
    element.maskFieldChanged = false;
  }
}

/**
 * Hanlder for onKeyPress event.
 * This method enforces "maxLength" for TEXTAREA
 */
EventHandlersImpl.prototype.onKeyPress = function() {
  var elem = event.srcElement;
  var maxLength = elem.getAttribute("maxLength"); //case-insensitive lookup
  if (maxLength && typeof(maxLength) != "number") { // attribute not supported by browser
    maxLength = parseInt(maxLength,10)
    var selection = elem.document.selection.createRange();
    return(elem.value.length - selection.text.length < maxLength);
  }
}

/**
 * Hanlder for onPaste event
 * This method enforces "maxLength" for TEXTAREA
 */
EventHandlersImpl.prototype.onPaste = function() {
  var elem = event.srcElement;
  var maxLength = elem.getAttribute("maxLength"); //case-insensitive lookup
  if (maxLength && typeof(maxLength) != "number") { // attribute not supported by browser
     maxLength = parseInt(maxLength,10)
     var selection = elem.document.selection.createRange();
     var iInsertLength = maxLength - elem.value.length + selection.text.length;
     var sData = window.clipboardData.getData("Text").substr(0,iInsertLength);
     selection.text = sData
     return false;
  }
  return true;
}

/**
 * Handler for onFocus event.
 *
 * This method remembers the current value as "lastValue", if the source element is a SELECT.
 *
 * This method display help text for entering data into the focused item, if any.
 *
 * This method updates the value of a hidden input with the render ID of the newly
 * focused item. We use this hidden input to restore client focus after
 * a server refresh.
 */
EventHandlersImpl.prototype.onFocus = function(e) {
  e = e || window.event;
  var elem = e.srcElement || e.target;
  if(!elem.tagName) {
    return;
  }

  DHTML.setActiveElementId(elem.id); // manually set activeElement for Firefox
  this.doOnFocus(elem);
}

EventHandlersImpl.prototype.doOnFocus = function(elem) {
  if (elem.tagName == 'SELECT') {
    elem._lastIndex = elem.selectedIndex;
  } else {
    elem._lastValue = DHTML.getValue(elem);
  }

  if (DHTML.getActiveElement() == elem) {
    DHTML.showHelpText(elem);
  }

  document.mainForm.objFocusId.value = elem.id;
  elem.maskFieldChanged = false;
}

/**
 * Handler for onBlur event
 */
EventHandlersImpl.prototype.onBlur = function(e) {
  e = e || window.event;
  var elem = e.srcElement || e.target;
  DHTML.hideHelpText(elem);
  document.mainForm.objFocusId.value = '';
}

/**
* Called when a [Check Spelling] button is clicked
*/
EventHandlersImpl.prototype.checkSpelling = function() {
  var fields = new Array();
  for (var index = 0; index < spellCheckInfo.length; index++) {
    var elem = DHTML.getElementById(spellCheckInfo[index]);
    if (elem.disabled != true) {
      ArrayUtil.appendElement(fields, elem)
    }
  }
  parent.spellcheck_frame.checkSpelling(fields);
}

/**
 * Turns on or off an InputGroup
 * @param checkbox the checkbox element in the group header
 * @param groupId id of this group
 */
EventHandlersImpl.prototype.toggleInputGroup = function(checkbox, groupId) {
  var groupElem = document.getElementById(groupId);
  var numChildrenInGroup = groupElem.childNodes.length;
  var infoOnServer = (numChildrenInGroup == 1) // only one row in group
          && (groupElem.childNodes[0].childNodes.length < 5 || groupElem.childNodes[0].childNodes[4].childNodes.length == 0);
  var cbValue = DHTML.getValue(checkbox);

  if (infoOnServer) {
    var params = {};
    params[checkbox.id] = cbValue;
    AJAX.initRequest(groupId, params, function(){eval(AJAX.returnValue)}, true);
  } else {
    var bShowContent = ("true"==cbValue);
    // toggle visibility of all rows after the header row:
    for (var i = 1; i < numChildrenInGroup; i++) {
      try {
        groupElem.childNodes[i].style.display = bShowContent ? '' : 'none';
      } catch (e) {
        // workaround for Firefox
      }
    }
    // toggle group style:
    if (bShowContent) {
      DHTML.removeStyleSuffix(groupElem, "unchecked");
    } else {
      DHTML.addStyleSuffix(groupElem, "unchecked");
    }
  }
}