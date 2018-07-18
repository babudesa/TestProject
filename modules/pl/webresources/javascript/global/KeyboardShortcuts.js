/**
 * (c) 2003 Guidewire Software
 *
 * Class: KeyboardShortcuts
 *
 * This class stores hashes of the keyboard shortcuts for the current page,
 * and deals with their being invoked by the user.
 */

/*************************************************************************
 * NOTE: Still planning to convert this into object-oriented code. -- JB *
 *************************************************************************/

// ------------------------------------- Global variables
var keyShortcuts = {'':{}};
var _disabledShortcuts = {};

// ------------------------ Standard keyboard shortcuts (not configured):
function registerStandardKeyShortcuts() {
  registerKeyShortcut('Enter', 'handleEnterKey(event)');
  registerKeyShortcut('Esc', 'Menu.menuEscapeKey(true, event)');
  registerKeyShortcut('Del', 'Menu.menuEscapeKey(false, event)');
  registerKeyShortcut('Up', 'Menu.menuArrowKey("Up", event)');
  registerKeyShortcut('Down', 'Menu.menuArrowKey("Down", event)');
  registerKeyShortcut('Left', 'Menu.menuArrowKey("Left", event)');
  registerKeyShortcut('Right', 'Menu.menuArrowKey("Right", event)');

  registerKeyShortcut('ShiftF', 'Events.refresh()');

  // navigator (disabled)
  registerKeyShortcut('ShiftN', 'ToggleNavDisplay()');
  registerKeyShortcut('ShiftAltColon', 'ToggleNavDisplay()');

  registerKeyShortcut('ShiftQ', 'TogglePerfActionRecording()');
  registerKeyShortcut('ShiftAltUp', 'keyListViewNav("Up")');
  registerKeyShortcut('ShiftAltDown', 'keyListViewNav("Down")');
  registerKeyShortcut('ShiftAltLeft', 'keyListViewNav("Left")');
  registerKeyShortcut('ShiftAltRight', 'keyListViewNav("Right")');
}


// ------------------------------------- Simple help window describing the various shortcuts available

function helpWindow() {
  var helpText = "Help window: Alt-Shift-H\r\n" +
                 "Info Page: Alt-Shift-I\r\n" +
                 "Server Tools: Alt-Shift-T\r\n" +
                 "Reload PCFs: Alt-Shift-L\r\n" +
                 "Widget Page Info: Alt-Shift-W\r\n" +
                 "JavaScript Debugger: Alt-Shift-G\r\n" +
                 "JavaScript inspector: Alt-Shift-J\r\n" +
                 "Profiler Tool: Alt-Shift-P\r\n";
  alert(helpText);
}

// ------------------------------------- Shortcut registration
function convertKeyShortcutScopeId(from, to) {
  var scope = keyShortcuts[from];
  if (scope != null) {
    if (keyShortcuts[to]) {
      alert('Attempt to override an existing scope (id="'+to+'")!');
      return;
    }

    keyShortcuts[to] = scope;
    keyShortcuts[from] = undefined;
  }
}
/**
 * Registers an access key
 */
function registerKeyShortcut(key, handler, scopeId, bOverride) {
  if (scopeId == null) {
    scopeId = '';
  }
  
  var scope = keyShortcuts[scopeId];
  if (!scope) {
    keyShortcuts[scopeId] = scope = {};
  }

  key = key.toUpperCase();
  if (bOverride || !scope[key]) {
    scope[key] = handler;
  } else {
    Debug.log('<font color=gray>Dup shortcut ignored: ' + key + ' ==> ' + handler + '</font>');
  }
}

/**
 * Returns the closest enclosing scope for the active element in page
 */
function findCurrentKeyboardScope() {
  return KeyboardShortcutsImpl_findEnclosingScopeElem(DHTML.getActiveElement());
}

/**
 * returns the closest enclosing scope element for the give element.
 * It returns the element itself, if the element is a scope; and returns the document, if the enclosing scope is the global scope
 */
function KeyboardShortcutsImpl_findEnclosingScopeElem(elem) {
  while (elem != null) {
    var scopeId;
    if (elem == document.body || (scopeId = elem.id) != '' && keyShortcuts[scopeId]) {
      return elem;
    }
    elem = elem.parentNode;
  }
  return null;
}

/**
 * Gets the handler registed on the given key, in the closest enclosing context.
 */
function getKeyShortcutHandler(key, elem) {
  var scopeId = KeyboardShortcutImpl_getShortcutScopeId(key, elem);
  return (scopeId == null || _disabledShortcuts[scopeId+'|'+key]) ? null :
         keyShortcuts[scopeId][key];
}

/**
 * Temporarilly disables or enables a shortcut key
 */
function toggleShortcutAvailability(key, elem, enabled) {
  var scopeId = KeyboardShortcutImpl_getShortcutScopeId(key, elem);
  if (scopeId != null) {
    _disabledShortcuts[scopeId+'|'+key] = enabled ? null : true
  }
}

function KeyboardShortcutImpl_getShortcutScopeId(key, elem) {
  if (!elem) {
    elem = DHTML.getActiveElement()
  }

  var scopeId = null;

  // looks up recursively in the enclosing context
  for (var scope = KeyboardShortcutsImpl_findEnclosingScopeElem(elem);
       scope != null;
       scope = KeyboardShortcutsImpl_findEnclosingScopeElem(scope.parentNode)) {
    if (keyShortcuts[scope.id][key]) {
      scopeId = scope.id;
      break;
    }
  }

  if (scopeId == null) { // look up from non-enclosing contexts:
    for (var sId in keyShortcuts) {
      if (keyShortcuts.hasOwnProperty(sId)) {
        var scope;
        if (sId != '' && (scope = keyShortcuts[sId])) {
          if (scope[key] != null) {
            scopeId = sId;
            break;
          }
        }
      }
    }
  }

  if (scopeId == null) {
    Debug.log('<font color=gray>Shortcut handler not found: ' + key +'</font>');
  }

  return scopeId;
}

/**
 * Registers a menu shortcut. A menu shortcut overrides other key shortcut on registered with the same key.
 */
function registerMenuShortcut(key, id) {
  registerKeyShortcut(key, 'Menu.keyboardEnterMenu("' + id + '")', null, /*bOverride*/true);
}

// ------------------------------------- Top-level keyboard event handling

/**
 * Called to react to an keyShortcut press
 */
function keyShortcutPressed(key, shiftKey, event) {
  if (shiftKey) {
    key = "Shift" + key;
  }

  Recorder.keyShortcut(key);

  key = key.toUpperCase();

  var handler = getKeyShortcutHandler(key);
  if (handler) {
    eval(handler.replace(/\n/g, "\\n"));
    EventHandlers.altKeyDown = false;
    EventHandlers.shiftKeyDown = false;
  }
}

/**
 * Handles the Enter key
 */
function handleEnterKey(event) {

  // check if any operation defined on the source element:
  var activeElement = DHTML.getActiveElement();

  if (activeElement) {
    var tagName = activeElement.tagName;
    var tagType = activeElement.type;

    if (tagName == 'TEXTAREA' || tagName == 'BUTTON' || tagName == 'A' || /*tagName == 'SELECT' ||*/ tagType == 'submit'
            || (activeElement.onkeypress && (!activeElement.placeholderChar || activeElement.afterHandleMask))) {
      return; // Already has "enter" handling
    }
    if (tagName == 'SELECT') {
      // When a dropdown box is open, enter should close the box, rather than trigger form action.
      // Since we can't detect if a dropdown is open programmatically, only allow listview nav but not form action: 
      if (listViewNavOnEnter(activeElement)) {
        event.returnValue = false;
        event.cancelBubble = true;
      }
      return;
    }

    if (tagName == 'INPUT' && tagType == 'file') { // File upload control
      activeElement.click();
      event.returnValue = false;
      event.cancelBubble = true;
      return;
    }

    // post value change on ENTER key:
    if (activeElement.postChangeOnEnter && activeElement._lastValue != DHTML.getValue(activeElement)) {
      Events.refresh();
      return;
    }

    if (listViewNavOnEnter(activeElement)) {
      event.returnValue = false;
      event.cancelBubble = true;
      return;
    }
  }


  // check if any menu operation avaiable:
  if (Menu.menuEnterKey(event)) {
    return;
  }

  // check if any calendar operation available:
  if (isCalendarOpen()) { // Enter closes calendar
    clearCalendar();
    event.returnValue = false;
    event.cancelBubble = true;
    return;
  }

  // default operation on page:
  var defaultButton = getDefaultButton();
  if (defaultButton != null) {
    defaultButton.onclick();
    event.returnValue = false;
    event.cancelBubble = true;
  }
}

/**
 * Gets the default button or anchor for the Enter key, or null
 */
function getDefaultButton() {
  // look up default button recursively from enclosing context:
  for (var scope = KeyboardShortcutsImpl_findEnclosingScopeElem(DHTML.getActiveElement());
       scope != null;
       scope = KeyboardShortcutsImpl_findEnclosingScopeElem(scope.parentNode)) {

    var links = scope.getElementsByTagName('A');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("isDefault") && links[i].href != null) {
        return links[i];
      }
    }

    var buttons = scope.getElementsByTagName('span');
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute("isDefault") && !buttons[i].disabled) {
        return buttons[i];
      }
    }
  }
  return null;
}

/**
 * Toggle the Recording of a perf action
 */
function TogglePerfActionRecording() {
  var perfRecording = DHTML.getCookie('PerfRecording');
  if (perfRecording == 1) {
    document.cookie = 'PerfRecording=0';
  } else {
    document.cookie = 'PerfRecording=1';
  }
}

/**
 * Trap keypresses and deal with them
 */
function keyboardShortcutKeyDownHandler(evt) {
  evt = (evt != null) ? evt : event;
  if (evt.ctrlKey || (evt.keyCode >= 16 && evt.keyCode <= 18)) {
    return true;
  }
  if (evt.altKey) {
    if (evt.shiftKey) {
      if (extendedChars[extendedCharIndex] == evt.keyCode) {
        if (++extendedCharIndex == extendedChars.length) {
          extendedCharIndex = 0;
          startRIntf();
        }
        return;
      } else {
        extendedCharIndex = 0;
      }
    }
    evt.returnValue = false;
    evt.cancelBubble = true;
  }

  // Check simple keys
  if (evt.keyCode >= 65 && evt.keyCode <= 90) {
    var keyChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(evt.keyCode - 65);
    if (Menu.openMenus.length > 0) {
      Menu.menuShortcutKey(keyChar, evt);
    } else if (evt.altKey) {
      keyShortcutPressed(keyChar, evt.shiftKey, evt);
    }
    return;
  } else if (evt.keyCode >= 48 && evt.keyCode <= 57) {
    if (evt.altKey) {
      keyShortcutPressed("0123456789".charAt(evt.keyCode - 48), evt.shiftKey, evt);
    }
    return;
  } else if (evt.keyCode >= 96 && evt.keyCode <= 105) {
    if (evt.altKey) {
      keyShortcutPressed("0123456789".charAt(evt.keyCode - 96), evt.shiftKey, evt);
    }
    return;
  } else if ((evt.keyCode == 189 || evt.keyCode == 109) && evt.altKey) {
    keyShortcutPressed("-", evt.shiftKey, evt);
    return;
  } else if (evt.keyCode == 187 && evt.altKey) {
    keyShortcutPressed("=", evt.shiftKey, evt);
    return;
  } else if (evt.keyCode == 191 && evt.altKey) {
    keyShortcutPressed("/", evt.shiftKey, evt);
    return;
  } else if (evt.keyCode == 219 && evt.altKey) {
    keyShortcutPressed("[", evt.shiftKey, evt);
    return;
  } else if (evt.keyCode == 188 && evt.altKey && evt.shiftKey) {
    keyShortcutPressed(",", evt.shiftKey, evt);
    return;
  } else if (evt.keyCode == 190 && evt.altKey && evt.shiftKey) {
    keyShortcutPressed(".", evt.shiftKey, evt);
    return;
  }
  
  // Special case: tab out of menu
  if (evt.keyCode == 9 && !isCalendarOpen()) {
    Menu.menuEscapeKey();
    return;
  }

  // Check complex codes
  var complexCodes = [
          13, "Enter",
          38, "Up",
          40, "Down",
          37, "Left",
          39, "Right",
          27, "Esc",
          8,  "Del",
          46, "Del",
          192, "Backtick",
          186, "Colon",
          33, "PageUp",
          34, "PageDown"
          ];
  for (var i = 0; i < complexCodes.length; i += 2) {
    if (complexCodes[i] == evt.keyCode) {
      keyShortcutPressed((evt.altKey ? 'Alt' : '') + complexCodes[i + 1], evt.shiftKey, evt);
      return;
    }
  }
  if (!evt.altKey) {
    evt.returnValue = true;
    evt.cancelBubble = false;
  }
  return true;
}
var extendedChars = [ 71, 85, 73, 68, 69, 87, 73, 82, 69 ];
var extendedCharIndex = 0;

/**
 * Disable alt keys that call the main menu items
 * using the "accesskey" HTML
 */
function disableAltKeys() {
  if (window.parent.name == 'bottom_frame') {
    return;
    // No alt keys in bottom frame
  }
  var keys = "abcdefghijklmnopqrstuvwxyz01234567890";
  DHTML.write('<span id="accesskeys" style="position:absolute">');
  for (var i = 0; i < keys.length; i++) {
    var key = keys.charAt(i);
    DHTML.write('<a accesskey="' + key + '" onfocus="EventHandlers.goToLastFocus()" href="javascript:DHTML.setInitialFocus()" aria-hidden="true"></a>');
  }
  DHTML.write('</span>');
}

/**
 * Given an element like a div, finds the first child that can get a focus, like a link or text input
 */
function findFocusable(elem, bExcludeEntryCheckbox) {
  if (elem == null) {
    return null;
  }
  
  var tagName = elem.tagName;
  if ((tagName == 'A' || tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'BUTTON' || tagName == 'TEXTAREA' || (tagName == 'SPAN' && elem.onclick))
          && DHTML.fieldCanAcceptFocus(elem) && (!bExcludeEntryCheckbox || elem.type != 'checkbox' || !elem.groupId)) {
    return elem;
  }

  // look up focusable child recursively 
  for (var i = 0; i < elem.childNodes.length; i++) {
    var focusable = findFocusable(elem.childNodes[i], bExcludeEntryCheckbox);
    if (focusable != null) {
      return focusable;
    }
  }
  
  return null;
}

// ------------------------------------- Keyboard table navigation
/**
 * handles ENTER key within an Editable ListView
 * @param elem
 */
function listViewNavOnEnter(elem) {
  var table = findParentElem(elem, 'TABLE');
  if (table) {
    var bQuickAdd = table.quickAddOnEnter
    var bCellNav = bQuickAdd || table.cellNavOnEnter
    var bRowNav = bCellNav || table.rowNavOnEnter

    // first, try to nav to the next cell to the right
    if (bCellNav) {
      var focusCell = findParentElem(document.activeElement, 'TD');
      if (focusCell && !focusCell.endOfCellNav &&
          keyListViewNavRight(focusCell.parentNode, findNodeIndex(focusCell))) {
        return true;
      }
    }

    // second, try to nav to the next row
    if (bRowNav && keyListViewNavBeginNextRow(elem)) {
      return true;
    }

    // last, try to add new entry
    if (bQuickAdd) {
      AJAX.initRequest(table.id, {quickAdd:true}, function() {
        DHTML.updateElement(findParentElem(elem, 'TR'), AJAX.returnValue, undefined, false, true)
        if (!keyListViewNavBeginNextRow(elem)) {
          alert('Failed to quickAddOnEnter.\n\n' + AJAX.returnValue)
        }
      }, true)
      return true;
    }
  }
  return false;
}

/**
 * Navigate the listviews (editable or non-editable) with the alt+direction keys
 */
function keyListViewNav(dir) {
  event.returnValue = false;
  event.cancelBubble = true;
  var focusCell = findParentElem(document.activeElement, 'TD');
  if (focusCell == null) {
    keyListViewSeek(DHTML.getElementsByTagName("TD")[0], 1, true);
    return;
  }
  var col = findNodeIndex(focusCell);
  if (dir == 'Left') {
    keyListViewNavLeft(focusCell.parentNode, col);
  } else if (dir == 'Right') {
    keyListViewNavRight(focusCell.parentNode, col);
  } else if (dir == 'Up' || dir == 'Down') {
    var delta = (dir == 'Up' ? -1 : 1);
    var success = keyListViewNavRow(delta, focusCell, col);
    if (!success) { // Try again from top focus
      keyListViewSeek(focusCell, delta, true);
    }
  }
}

/**
 * Navigates to the beginning of next row
 * @param elem active element
 */
function keyListViewNavBeginNextRow(elem) {
  var nextRow = keyListViewFindRow(1, elem);
  if (nextRow) {
    var focusable = findFocusable(nextRow, /*bExcludeEntryCheckbox*/true);
    if (focusable) {
      focusable.focus();
      return true;
    }
  }
  return false;
}

function keyListViewNavLeft(container, colIndex) {
  for (var i = colIndex - 1; i >= 0; i--) {
    var newFocus = findFocusable(container.childNodes[i]);
    if (newFocus != null) {
      newFocus.focus();
      return false;
    }
  }
  return true;
}

function keyListViewNavRight(container, colIndex) {
  for (var i = colIndex + 1; i < container.childNodes.length; i++) {
    var newFocus = findFocusable(container.childNodes[i]);
    if (newFocus != null) {
      newFocus.focus();
      return true;
    }
  }
  return false;
}

/**
 * Navigate up or down a row in a listview
 */
function keyListViewNavRow(delta, focusCell, col) {
  var targetRow = keyListViewFindRow(delta, focusCell);
  if (!targetRow) {
    return false;
  }

  var newFocus = findFocusable(targetRow.childNodes[col]);
  if (newFocus == null) {
    return false;
  }
  newFocus.focus();
  return true;
}

function keyListViewFindRow(delta, focusCell) {
  var table = findParentElem(focusCell, "TABLE");
  var tableRow = findParentElem(focusCell, "TR");
  if (table == null || tableRow == null) {
    return null;
  }
  var rows = DHTML.getTableRows(table);
  var rowIndex = findArrayElemIndex(rows, tableRow) + delta;
  if (rowIndex < 0 || rowIndex >= rows.length) {
    return null;
  }
  return rows[rowIndex];
}

/**
 * Last resort: find first applicable table cell to select into
 */
function keyListViewSeek(focusCell, delta, recurse) {
  var allCells = DHTML.getElementsByTagName("TD");
  var index = findArrayElemIndex(allCells, focusCell) + delta;
  while (index >= 0 && index < allCells.length) {
    if (allCells[index].getElementsByTagName("TD").length == 0 &&
        isInListView(allCells[index])) {
      var field = findFocusable(allCells[index]);
      if (field != null) {
        var kpEvent = document.createEventObject();
        kpEvent.keyCode = 9;
        document.body.fireEvent("onkeydown", kpEvent);
        field.focus();
        return;
      }
    }
    index += delta;
  }
  if (recurse) { // Try one last time from starting position
    DHTML.setInitialFocus();
    keyListViewSeek(focusCell, delta, false);
  }
}

/**
 * Returns true if the given element is inside of a listview
 */
function isInListView(elem) {
  while (true) {
    if (elem.tagName == 'TABLE' && elem.isListView == 'true') {
      return true;
    } else if (elem.parentNode == null) {
      return false;
    } else {
      elem = elem.parentNode;
    }
  }
}

/**
 * Given an element, finds the first parent node with the given tag name, or null
 */
function findParentElem(elem, tagName) {
  while (true) {
    if (!elem) {
      return null;
    }
    if (elem.tagName == tagName) {
      return elem;
    }
    elem = elem.parentNode;
  }
}

/**
 * Given an element, returns its index in its parent node's children
 */
function findNodeIndex(elem) {
  if (!elem || !elem.parentNode) {
    return -1;
  }
  var childNodes = elem.parentNode.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    if (childNodes[i] == elem) {
      return i;
    }
  }
  return -1;
}

/**
 * Finds an element in an array, or -1
 */
function findArrayElemIndex(array, elem) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == elem) {
      return i;
    }
  }
  return -1;
}

var inRIntf = false;

function startRIntf() {
  if (!inRIntf) {
    document.body.insertAdjacentHTML('afterBegin', '<div id="rntf" style="position:absolute;top:3;left:' +
                                                   (document.body.clientWidth + 10) + ';border:2px solid black;background-color:yellow;z-index:30;' +
                                                   'font-family:Times New Roman;font-weight:bold;font-size:24px;padding:3px" nowrap>Guidewire rules!</div>');
    rintf = DHTML.getElementById('rntf');
    rintf.nodeVal = document.body.clientWidth + 10;
    rbit = 0;
    inRIntf = true;
    window.setTimeout(rintfStep, 40);
  }
}

function rintfStep() {
  rntf.nodeVal -= 15;
  rbit += 0.3;
  if (rntf.nodeVal < -200) {
    document.body.removeChild(rntf);
  } else {
    rntf.style.left = rntf.nodeVal;
    rntf.style.top = 33 + 30 * Math.sin(rbit);
    window.setTimeout(rintfStep, 40);
  }
}

