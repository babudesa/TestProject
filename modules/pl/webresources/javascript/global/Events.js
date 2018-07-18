/**
 * (c) 2004 Guidewire Software
 *
 * Class: Events
 *
 * Contains global helper functions for event handling.
 */

// ------------------------------------- Class Nav

/**
 * Register the Events class as a global library
 */
window.Events = new EventsImpl();

/**
 * Minimum delay between events, in MS
 */
var EVENT_DELAY_MS = 3000;

/**
 * Constructor
 */
function EventsImpl() {

  this.eventInvoked = false;
  this.eventQueue = [];
  this.eventQueue_low = [];

}

// ------------------------------------- Event callback functions

/**
 * Pre-submit event: executed before the form is submitted to the server.
 * This is the appropriate place to put any pre-processing of input data.
 */
EventsImpl.prototype.preSubmit = function() {
  FieldValidation.unmaskInputFields();
  EncryptedField.preSubmit();
  DHTML.storeScrollPositions();
}

/**
 * Marks an event was called on a given ID
 */
EventsImpl.prototype.invokeEvent = function(sourceId, hourglass, param) {
  Debug.log('Invoking event: ' + sourceId);
  if (this.eventInvoked == false // not in the middle of another event
          && !EventHandlers.isAltShiftClick) {

    if (document.mainForm.reqMon) { // start monitoring request time, if needed
      window.parent.__reqMon = [sourceId, new Date().getTime()]
    }

    Debug.log('Event invoked: ' + sourceId);
    DHTML.hourglass();
    if(!hourglass){
      setTimeout("DHTML.unhourglass()", EVENT_DELAY_MS);
    }
    this.disableNavigation();
    document.mainForm.eventSource.value = sourceId;
    if (param != null) {
      document.mainForm.eventParam.value = param;
    }
    if (window.event) {
      window.event.returnValue = false;
    }
    if (window.event && window.event.shiftKey) {
      document.mainForm.eventShift.value = "true";
    }
    // Execute any "pre-submit" logic, including removing input masks if necessary
    this.preSubmit();

    // This is the only place where we should do a "Submit".
    Debug.log('Submit form to server');
    document.mainForm.submit();
  } else {
    Debug.log('<font color=orange>Event disallowed: ' + sourceId + '</font>');
  }
}



/**
 * Special "refresh" non-event
 * @param eId the id of postOnChange widget that triggers the refresh
 */
EventsImpl.prototype.refresh = function(eId) {
  this.invokeEvent('_refresh_', true, eId);
}

/**
 * True if event navigation is currently allowed
 */
EventsImpl.prototype.isNavigationAllowed = function() {
  return this.eventInvoked == false && !this.hasEventInQueue();
}

/**
 * Disables Naviation.
 * The navigation will be enabled again after the form page is refreshed.
 */
EventsImpl.prototype.disableNavigation = function() {
  Debug.log("<b>Disable navigation</b>");
  this.eventInvoked = true;
}

/**
 * Enables Naviation. (DO NOT USE. ONLY used when manually disable hourglass for special cases.)
 */
EventsImpl.prototype.enableNavigation = function() {
  Debug.log("<b>Enable navigation</b>");
  this.eventInvoked = false;
}

/**
 * Invokes an event so that its result renders in the hidden frame (useful for running scripts
 */
EventsImpl.prototype.invokeSpecialEventInHiddenFrame = function(sourceId, param) {
  var oldInFrameValue = document.mainForm.inFrame.value;
  document.mainForm.target = "utility_frame";
  document.mainForm.inFrame.value = "special";
  this.invokeEvent(sourceId, false, param);
  document.mainForm.target = "";
  document.mainForm.inFrame.value = oldInFrameValue;
}

/**
 * Invokes an event so that its result appears in a pop-up window
 */
EventsImpl.prototype.invokeSpecialEventInNewWindow = function(sourceId, param) {
  var oldInFrameValue = document.mainForm.inFrame.value;
  document.mainForm.target = "_blank";
  document.mainForm.inFrame.value = "special";
  this.invokeEvent(sourceId, true, param);
  document.mainForm.target = "";
  document.mainForm.inFrame.value = oldInFrameValue;
}

/**
 * Sets the value of one form field and performs a refresh
 */
EventsImpl.prototype.setAndRefresh = function(fieldId, fieldValue) {
  document.getElementById(fieldId).value = fieldValue;
  // record after the value change but before refresh
  Recorder.setAndRefresh(fieldId, fieldValue);
  this.refresh();
}

// ------------------------------------- URL functions

/**
 * Returns an absolute image URL reference from a potential relative URI path
 */
EventsImpl.prototype.getResourceURL = function(relativeURI) {
  if (relativeURI.substring(0, 1) == "/") {
    return relativeURI;
  } else {
    var base = this.getBase() + "";
    base = base.substr(0, base.lastIndexOf('/') + 1);
    return base + relativeURI;
  }
}

/**
 * Returns the base URL of the current page
 */
EventsImpl.prototype.getBase = function() {
  var baseTags = document.getElementsByTagName("base");
  if (baseTags && baseTags.length == 1 && baseTags[0].href) {
    return baseTags[0].href;
  }
  var basePath = window.location.protocol + "//" + window.location.host + window.location.pathname;
  basePath = basePath.substr(0, basePath.lastIndexOf('/') + 1);
  return basePath + 'resources/gw';
}

/**
 * Puts an operation in queue
 * @param operation the operation to run once it's at the top of the queue
 * @param bLow if true, the operation is low priority and will run after events with higher priority even if they were queued after this one
 */
EventsImpl.prototype.queueEvent = function(operation, bLow) {
  (bLow ? this.eventQueue_low : this.eventQueue).push(operation)
  window.setTimeout(EventsImpl_exeQueuedEvent, 10);
  Debug.log('Event queued: ' + operation);
}

function EventsImpl_exeQueuedEvent() {
  var operation = (Events.eventQueue.length > 0 ? Events.eventQueue : Events.eventQueue_low).shift();
  Debug.log('Event DEqueued: ' + operation + '  (' + (Events.eventQueue.length + Events.eventQueue_low.length) + ' remaining)');
  if (typeof(operation) == typeof('')) {
    eval(operation);
  } else {
    operation();
  }
}

EventsImpl.prototype.hasEventInQueue = function() {
  return Events.eventQueue.length > 0 ||  Events.eventQueue_low.length > 0;
}

// ----------------------------------- Back button support

/**
 * Checks if the user pressed the "back" button by comparing the
 * server-generated hidden input "requestCounter" against the
 * server-generated *cookie* "requestCounter".  If the user did
 * press back, send a special "back" event to the server.
 */
EventsImpl.prototype.checkBackButton = function() {
  if (document.mainForm.inFrame.value != 'mainframe') {
    return;
  }
  var rc = DHTML.getCookie('rcounter');
  if (rc != null && Math.floor(rc) > Math.floor(document.mainForm.rcounter.value)) {
    this.invokeEvent('_back_');
  }
}

/**
 * Registers an item to be processed by the handler at the end of the current operation.
 * All unique items will passed to the handler at the end of the current operation.
 * @param item an item to process
 * @param handler a function that takes an array of unique items
 */
EventsImpl.prototype.queueUniqueItem = function(item, handler) {
  // when add the first item, register the handler in event queue
  if (!handler._itemArray) {
    handler._itemArray = [];
    var callback = function() { handler(handler._itemArray); handler._itemArray = undefined; };
    callback._low = true;
    Events.queueEvent(callback, /*bLow*/true);
  }

  if (!ArrayUtil.inArray(item, handler._itemArray)) { // do not add duplicate item
    ArrayUtil.appendElement(handler._itemArray, item);
  }
}
