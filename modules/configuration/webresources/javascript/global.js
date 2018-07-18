///////////////////////////////////////////////////////////
// BEGIN AJAX.js



window.AJAX = new AJAXImpl();

function AJAXImpl() {
  this.request = AJAXImpl_createXMLHttpRequest();
  this.returnValue = null;
  this.queueRequests = [];
  this.hourglassTimeout = null;
  this._loadingHtml = '';
  this._errMsgs = []; 
  this.ERROR = {}; 
}

AJAXImpl.prototype.initRequest = AJAXImpl_initRequest;
AJAXImpl.prototype.buildSingleRequest = AJAXImpl_buildSingleRequest;
AJAXImpl.prototype.initRequestEx = AJAXImpl_initRequestEx;
AJAXImpl.prototype.getLoadingHTML = AJAXImpl_getLoadingHTML;




function AJAXImpl_initRequest(viewRootId, paramMap, callback, sync, postMainForm) {
  return this.initRequestEx([AJAX.buildSingleRequest(viewRootId, paramMap, callback)], sync, postMainForm);
}


function AJAXImpl_filterAttributes(object, attrList) {
  var filtered = {};
  for (var attr in object) {
    if (object.hasOwnProperty(attr) && (!attrList || ArrayUtil.inArray(attr, attrList))) {
      var value = object[attr];
      if (value) {
        filtered[attr] = value;
      }
    }
  }
  return filtered;
}

function AJAXImpl_buildSingleRequest(viewRootId, paramMap, callback) {
  return {'viewRootId':viewRootId, 'paramMap':paramMap, 'callback':callback};
}


function AJAXImpl_initRequestEx(requestList, sync, postMainForm, callbackEx) {
  if (this.request.readyState != 0 && this.request.readyState != 4) {
    if (sync) {
      ArrayUtil.appendElement(this.queueRequests,
              function(){
                Debug.log('Process queued AJAX reqest');
                AJAX.initRequestEx(requestList, sync, postMainForm, callbackEx);
              });
      Debug.log('AJAX request in queue');
    }
    return false; 
  }

  var formAction = window.document.forms[0].action;
  var params;
  
  if (postMainForm) {
    alert("Post all form values to server is not yet supported");
    return false;
  } else {
    params = "renderViewRootOnly=true"; 
  }

  if (requestList) {
    var filtered = [];
    for (var i=0; i<requestList.length; i++) {
      filtered[i] = AJAXImpl_filterAttributes(requestList[i], ['viewRootId', 'paramMap']);
    }
    var encodedComp = encodeURIComponent(filtered.toJSONString());
    params = params + '&ajaxRequestInfo=' + encodedComp;
  }

  params = params + '&__navigator_index=' + window.document.forms[0].elements['__navigator_index'].value

  if (sync) {
    Events.disableNavigation();
    this.hourglassTimeout = window.setTimeout(AJAXImpl_hourglass, 500); 
  }

  this.request.open("POST", formAction, true);
  this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  this.request.onreadystatechange = function() { AJAXImpl_processRequest(sync, requestList, callbackEx) };

  Debug.log('Send AJAX request');
  this.request.send(params);
  return true;
}

function AJAXImpl_hourglass() {
  Debug.log("Enable hourglass - synced AJAX call takes too long")
  DHTML.hourglass();
}


function AJAXImpl_processRequest(sync, reqInfoList, callbackEx) {
  with (AJAX) {
    if (request.readyState == 4) {
      Debug.log('AJAX request completed');
      if (sync) {
        window.clearTimeout(hourglassTimeout);
        hourglassTimeout = null;
        DHTML.unhourglass();
      }
      
      if (request.status == 200) {
        
        
        var numResponses = reqInfoList.length;
        var respValues = AJAXImpl_getReturnValueFromResponse(request.responseText, numResponses);
        if (respValues != undefined && respValues != null) {  
          for (var i = 0; i < numResponses; i++) {
            returnValue = numResponses > 1 ? respValues[i] : respValues;
            if (returnValue != ERROR) {
              var callback = reqInfoList[i].callback;
              if (callback != null) {
                callback();
              }
            }
            returnValue = undefined; 
          }
        }
        if (callbackEx) { 
          callbackEx();
        }
      }

      AJAXImpl_initNextRequestInQueue();
    }
  }
}


function AJAXImpl_decodeStringResponse(text) {
  try {
    var decoded = null;
    eval('decoded = ' + text);
    return decoded;
  } catch (ignore) {
    
    return text;
  }
}


function AJAXImpl_getReturnValueFromResponse(responseText, numResponses) {
  if (responseText != null && responseText.length > 1 && responseText.charAt(0) == '{'
          || numResponses > 1) {

    var responseInfo = AJAXImpl_decodeStringResponse(responseText);
    if (numResponses > 1) {
      if (typeof(responseInfo) == typeof('')) {
        alert('Expected formatted response for multiple concurrent AJAX requests!');
        return null;
      } else if (responseInfo.length != numResponses) {
        alert('Expected ' +numResponses+ ' AJAX responses, but got ' + responseInfo.length);
        return null;
      }
    }

    var values = [];
    for (var i=0; i<numResponses; i++) {
      var item = numResponses > 1 ? AJAXImpl_decodeStringResponse(responseInfo[i]) : responseInfo;
      values[i] = AJAX.ERROR;

      if (item.__formatted == true) { 

        
        if (item.__eval != null) {
          try {
            eval(item.__eval);
          } catch (e) {
            if (item.__errorMsgs == null) {
              item.__errorMsgs = [];
            }
            ArrayUtil.appendElement(item.__errorMsgs, e.message);
          }
        }

        
        if (item.__errorMsgs != null) {
          AJAXImpl_addErrorMsgs(item.__errorMsgs);
          continue;
        }

        values[i] = item.__returnValue;
      } else { 
        values[i] = typeof(item)==typeof('') ? item : item.toJSONString();
      }
    }

    
    return numResponses > 1 ? values : values[0];
  }
  return responseText;
}


function AJAXImpl_addErrorMsgs(msgs) {
  if (typeof(msgs) == typeof('')) {
    msgs = [msgs];
  }

  for (var i = 0; i < msgs.length; i++) {
    Events.queueUniqueItem(msgs[i], AJAXImpl_displayErrorMsgs)
  }
}


function AJAXImpl_displayErrorMsgs(msgs) {
  if (msgs.length > 0) {
    var msg = '';
    for (var i = 0; i < msgs.length; i++) {
      if (i>0) {
        msg += '\n';
      }
      msg += (msgs[i])
    }
    alert(msg);
  }
}


function AJAXImpl_initNextRequestInQueue() {
  with (AJAX) {
    if (queueRequests.length > 0) {
      var nextReq = queueRequests[0];
      ArrayUtil.removeElement(queueRequests, 0);
      nextReq();
    }
  }
}


function AJAXImpl_createXMLHttpRequest() {
  var request;
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return request;
}


function AJAXImpl_getLoadingHTML() {
  if (!this._loadingHtml) {
    this._loadingHtml = '<img src="'+Events.getResourceURL('images/loading.gif') + '" border=0/>';
  }
  return this._loadingHtml;
}
///////////////////////////////////////////////////////////
// BEGIN ArrayUtil.js



window.ArrayUtil = new ArrayUtilImpl();


function ArrayUtilImpl() {
  
}


ArrayUtilImpl.prototype.isArray = function(obj) { 
  return typeof(obj.length) != 'undefined'; 
}


ArrayUtilImpl.prototype.inArray = function(needle, haystack) {
  if (haystack == null) {
    return false;
  }
  for (var i = 0; i < haystack.length; i++) {
    if (haystack[i] == needle) {
      return true;
    }
  }
  return false;
}

ArrayUtilImpl.prototype.indexOf = function(needle, haystack) {
  if (haystack == null) {
    return -1;
  }
  for (var i = 0; i < haystack.length; i++) {
    if (haystack[i] == needle) {
      return i;
    }
  }
  return -1;
}


ArrayUtilImpl.prototype.removeElement = function(array, index) {
  if (index >= array.length || index < 0) {
    DHTML.alert("Bug: attempting to remove element " + index + " from array " + array);
    return;
  }
  for (var i = index + 1; i < array.length; i++) {
    array[i - 1] = array[i];
  }
  array.length--;
}


ArrayUtilImpl.prototype.appendElement = function(array, element) {
  array[array.length] = element;
  return array;
}


ArrayUtilImpl.prototype.contentsEqual = function(a1, a2) {
  if (a1 == a2) {
    return true;
  }
  if (!a1 || !a2) {
    return (!a1 && !a2);
  }
  if (a1.length != a2.length) {
    return false;
  }
  for (var i=0;i<a1.length;i++) {
    if (a1[i] != a2[i]) {
      return false;
    }
  }
  return true;
}


ArrayUtilImpl.prototype.removeMissingValues = function(needles, haystack) {
  
  var validValueCount = 0;
  for (var i=0; i < needles.length ; i++) {
    if (ArrayUtil.inArray(needles[i], haystack)) {
      if (i != validValueCount) {
        needles[validValueCount] = needles[i];
      }
      validValueCount++;
    }
  }
  needles.length = validValueCount;  
}

///////////////////////////////////////////////////////////
// BEGIN Autocomplete.js
function AJAXAutoCompleter(){
  this.hasCompleteSuggestionList = false;
  this.completeAsOf = 0;
  this.pendingKeyPresses = 0;
}





AJAXAutoCompleter.prototype.ESC = 27;
AJAXAutoCompleter.prototype.LEFT = 37;
AJAXAutoCompleter.prototype.UP = 38;
AJAXAutoCompleter.prototype.RIGHT = 39;
AJAXAutoCompleter.prototype.DOWN = 40;
AJAXAutoCompleter.prototype.TAB = 9;
AJAXAutoCompleter.prototype.BACKSPACE = 8;
AJAXAutoCompleter.prototype.ENTER = 13;
AJAXAutoCompleter.prototype.ALT = 18;
AJAXAutoCompleter.prototype.SPACEBAR = 32;
AJAXAutoCompleter.prototype.SHIFT = 16;

AJAXAutoCompleter.prototype.setSelectedStyle = function(elt){
  elt.className = "autocompleteSelected";
}

AJAXAutoCompleter.prototype.findChildIndex = function(parent, child){
  for(var i = 0; i < parent.childNodes.length; i++){
    if(child == parent.childNodes[i]) return i;
  }
  return -1;
}

AJAXAutoCompleter.prototype.clearResults = function (){
  while (this.dropdown.hasChildNodes())
  this.dropdown.removeChild(this.dropdown.firstChild);
}

AJAXAutoCompleter.prototype.mergeSuggestion = function (){
  var currentVal = this.autoCompletingText;
  var currentSuggestion = FieldValidation.maskValueForInput(this.dropdown.childNodes[this.selectedIndex].result.text, this.input);
  if(currentSuggestion.toUpperCase().indexOf(currentVal.toUpperCase()) != 0){
    if(!this.isCommandMode || currentVal.toUpperCase().indexOf(currentSuggestion.toUpperCase()) != 0) {
      DHTML.setValue(this.input, currentSuggestion);
      currentVal = currentSuggestion;
    } else {
      var extra = currentVal.substring(currentSuggestion.length, currentVal.length);
      DHTML.setValue(this.input, currentSuggestion + extra);
      currentVal = currentSuggestion + extra;
    }
  } else {
    DHTML.setValue(this.input, currentSuggestion, true);
  }

  
  if(this.input.createTextRange) {
    var selectionRange = this.input.createTextRange();
    selectionRange.moveStart("character", currentVal.length);
    selectionRange.moveEnd("character", DHTML.getValue(this.input).length);
    selectionRange.select();
  } else {
    this.input.setSelectionRange(currentVal.length, DHTML.getValue(this.input).length);
  }
}

AJAXAutoCompleter.prototype.setUnselectedStyle = function(elt, index){
  if(index % 2 == 0){
    elt.className = "autocompleteEven";
  } else {
    elt.className = "autocompleteOdd";
  }
}

AJAXAutoCompleter.prototype.changeSelection = function (newSelectionIndex, mergeSuggestion){

  
  this.didAutoComplete = true;

  
  if(this.selectedIndex >= 0){
    this.setUnselectedStyle(this.dropdown.childNodes[this.selectedIndex], this.selectedIndex);
  }
  this.selectedIndex = newSelectionIndex;
  
  if(this.selectedIndex >= this.dropdown.childNodes.length){
    this.selectedIndex = 0;
  } else if(this.selectedIndex < 0){
    this.selectedIndex = this.dropdown.childNodes.length-1;
  }
  this.setSelectedStyle(this.dropdown.childNodes[this.selectedIndex]);
  if(mergeSuggestion) {
    this.mergeSuggestion();
  }
}

AJAXAutoCompleter.prototype.selectDown = function(){
  
  this.changeSelection(this.selectedIndex + 1, true);
}
AJAXAutoCompleter.prototype.selectUp = function(){
  this.changeSelection(this.selectedIndex - 1, true);
}

AJAXAutoCompleter.prototype.clearAutoComplete = function (){
  DHTML.unshimElement(this.dropdown);
  this.dropdown.style.visibility = "hidden";
  this.autocompleting = false;
  this.selectedIndex = -1;
}

AJAXAutoCompleter.prototype.handleKeyDown = function (event) {
  if(!event) {
    event = window.event;
  }
  event.cancelBubble = true;
  
  var keyPressed = event.keyCode;
  if(keyPressed != this.SHIFT) {
    this.pendingKeyPresses++;
  }
  if(this.selectedIndex == -2) {
    this.selectedIndex = -1;
  }
  if(this.isCommandMode) {
    if(keyPressed == this.SPACEBAR) {
      
      
      this.hasCompleteSuggestionList = false;
      DHTML.setSelectionRange(this.input, DHTML.getValue(this.input).length);
    } else if(keyPressed == this.BACKSPACE) {
      this.selectedIndex = -2;
    }
  }
  if(this.dropdown.style.visibility != "visible"){
    if(keyPressed == this.DOWN) {
      this.doAutoComplete();
    }
    return;
  }
  switch(keyPressed){
    case this.DOWN:
    this.selectDown();
    break;
    case this.UP:
    this.selectUp();
    break;
    case this.TAB:
    if(this.didAutoComplete && this.input.onchange){
      
      this.input.onchange();
    } else {
      
    }
    case this.ESC:
    this.didAutoComplete = false;
    var selection = DHTML.getSelectionRange(this.input);
    DHTML.setValue(this.input, DHTML.getValue(this.input).substring(0, selection.start));
    DHTML.setSelectionRange(this.input, DHTML.getValue(this.input).length);
    case this.LEFT:
    case this.RIGHT:
    this.clearAutoComplete();
    break;
    default:
    break;
  }
}

AJAXAutoCompleter.prototype.handleKeyUp = function (event) {
  if(!event) {
    event = window.event;
  }
  var keyPressed = event.keyCode;
  if(keyPressed != this.SHIFT) {
    this.pendingKeyPresses--;
    if(this.pendingKeyPresses < 0) {
      this.pendingKeyPresses = 0;
    }
  }
  switch(keyPressed){
    case this.ESC:
    case this.UP:
    
    
    case this.SHIFT:
    
    break;
    case this.TAB:
    
    break;
    case this.DOWN:
      if(!this.autocompleting) {
        this.doAutoComplete();
      }
    break;
    case this.ENTER:
      
      if(event.altKey){
        
        this.doAutoComplete();
      } else {
        this.clearAutoComplete();
      }
    break;
    default:

      this.doAutoComplete();



    break;
  }
}


AJAXAutoCompleter.prototype.handleBlur = function () {
  this.didAutoComplete = false;
  this.clearAutoComplete();
  if(this.input.onchange && (this.oldInputValue != DHTML.getValue(this.input) || this.input.maskFieldChanged)) {
    this.input.onchange();
  }
}

AJAXAutoCompleter.prototype.handleFocus = function () {
  this.oldInputValue = DHTML.getValue(this.input);
  if(this.suggestsOnEmpty) {
    this.autoCompletingText = null;
    this.doAutoComplete();
  }
}

AJAXAutoCompleter.prototype.handleMouseOver = function (event){
  if(!event) {
    event = window.event;
  }
  var source;
  if(event.srcElement) {
    source = event.srcElement;
  } else {
    source = event.target;
  }
  while(source.className.indexOf("autocomplete") == -1 && source.parentNode) {
    source = source.parentNode;
  }
  var index = this.findChildIndex(this.dropdown, source);
  this.changeSelection(index, true);
}

AJAXAutoCompleter.prototype.handleClick = function (event){
  if(!event) {
    event = window.event;
  }
  event.cancelBubble = true;
  var source;
  if(event.srcElement) {
    source = event.srcElement;
  } else {
    source = event.target;
  }
}

AJAXAutoCompleter.prototype.createAutoCompleteList = function (responseText, requestInputText){

  
  if(this.selectedIndex >= 0) {
    this.selectedIndex = -1;
  }

  if(DHTML.getValue(this.input) != requestInputText){
    
    this.doAutoComplete();
    return;
  }

  if(DHTML.getValue(this.input) != this.autoCompletingText){
    
    this.clearAutoComplete();
  } else {
    

    
    var me = this;

    
    this.clearResults();

    
    if(responseText.length < 1){
      
      this.clearAutoComplete();
      return;
    }

    eval("var results = " + responseText);
    var currentSelection;
    if(this.selectedIndex >= 0) {
      var currentSelectionNode = this.dropdown.childNodes[this.selectedIndex];
      if(currentSelectionNode) {
        currentSelection = currentSelectionNode.result.text;
      }
    }
    this.currentResults = results.results;
    this.hasCompleteSuggestionList = results.isComplete;
    if(results.isComplete) {
      this.completeAsOf = DHTML.getValue(this.input).length;
    }

    this.populateResults(results.results, currentSelection);
  }
}

AJAXAutoCompleter.prototype.populateResults = function (results, oldSelection) {
  
  var me = this;
  var resultCount = 0;
  
  for(var i = 0; i < results.length; i++){
    if(results[i].text.length < 1) continue;
    var suggestion = document.createElement("div");
    suggestion.id = this.input.id + "_autocomplete_" + i;
    suggestion.result = results[i];

    suggestion.innerHTML = FieldValidation.maskValueForInput(results[i].listText, this.input);
    suggestion.style.paddingLeft = "5px";
    DHTML.setFieldToClosure(suggestion, 'onmousedown', function(event) {
      me.handleClick(event);
      if(me.dropdown.childNodes[me.selectedIndex].result.isFinal && me.isCommandMode) {
        Events.invokeEvent(me.input.id, true, DHTML.getValue(me.input));
      }
    });
    DHTML.setFieldToClosure(suggestion, 'onmouseover', function(event) {
      me.handleMouseOver(event);
    });
    this.setUnselectedStyle(suggestion, i);
    this.dropdown.appendChild(suggestion);
    resultCount++;
  }

  if(resultCount > 0 && this.isCommandMode){
    if(this.selectedIndex == -1 && DHTML.getValue(this.input).length > 0) {
      this.changeSelection(0, this.pendingKeyPresses == 0);
    } else if(oldSelection) {
      var foundOld = false;
      for(var i = 0; i < this.dropdown.childNodes.length; i++) {
        if(this.dropdown.childNodes[i].result.text == oldSelection) {
          this.changeSelection(i, this.pendingKeyPresses == 0);
          foundOld = true;
          break;
        }
      }
      if(!foundOld) {
        this.changeSelection(0, this.pendingKeyPresses == 0);
      }
    }
  }

  this.dropdown.style.left = 0;
  this.dropdown.style.width = "";
  this.dropdown.style.height = "";
  if(this.dropdown.offsetWidth < this.input.offsetWidth) {
    this.dropdown.style.width = this.input.offsetWidth + "px";
  }
  this.positionElement(this.dropdown, 0, 0);
  this.dropdown.style.visibility = "visible";
  DHTML.shimElement(this.dropdown);
}

AJAXAutoCompleter.prototype.doAutoComplete = function (){
  
  var inputText = DHTML.getValue(this.input);
  if(inputText.length < this.charsToWaitFor) {
    return;
  }
  this.autocompleting = true;
  this.autoCompletingText = inputText;
  if(this.autoCompletingText.length < this.completeAsOf) {
    this.hasCompleteSuggestionList = false;
  }

  if (!this.hasCompleteSuggestionList) {
    
    var me = this;

    var paraMap = {"textSoFar" : this.autoCompletingText};
    var argIdsStr = this.input.getAttribute('acArgIds');
    if (argIdsStr != null) {
      var ids = argIdsStr.split(',');
      var values = '[';
      for (var i = 0; i < ids.length; i++) {
        if (i>0) { values += ','; }
        values += '"' +DHTML.getValueById(ids[i])+ '"';
      }
      values += ']';
      paraMap['additionalArgs'] = values;
    }

    AJAX.initRequest(this.rootId, paraMap, function() {me.createAutoCompleteList(AJAX.returnValue, inputText);});
  } else {
    
    var currentSelection;
    if(this.selectedIndex >= 0) {
      var currentSelectionNode = this.dropdown.childNodes[this.selectedIndex];
      if(currentSelectionNode) {
        currentSelection = currentSelectionNode.result.text;
      }
    }
    this.clearResults();
    var filteredResults = new Array();
    for(var i = 0; i < this.currentResults.length; i++) {
      if(this.currentResults[i].text.substring(0, inputText.length).toUpperCase() == inputText.toUpperCase()) {
        filteredResults.push(this.currentResults[i]);
      }
    }
    this.populateResults(filteredResults, currentSelection);
  }
}

AJAXAutoCompleter.prototype.positionElement = function (elt, xOffset, yOffset){

  
  
  
  var el = this.input;
  var x = DHTML.getElementLeft(el);
  var topY = DHTML.getElementTop(el);
  var bottomY = topY + el.offsetHeight;

  var width = elt.offsetWidth;
  var height = elt.offsetHeight;
  if(x + xOffset + width > document.body.clientWidth + document.body.scrollLeft) {
    elt.style.left = document.body.clientWidth + document.body.scrollLeft - width;
  } else {
    elt.style.left = x + xOffset;
  }
  if(bottomY + yOffset + height > document.body.clientHeight + document.body.scrollTop &&
          topY - height >= 0) {
    elt.style.top = topY - height;
  } else {
    elt.style.top = bottomY + yOffset;
  }

}

AJAXAutoCompleter.prototype.init = function(input, rootId, isCommandMode, suggestsOnEmpty, charsToWaitFor){

  if (arguments.length == 0)
    return;

  
  
  

  
  var me = this;

  
  this.input = input;
  this.oldInputValue = DHTML.getValue(this.input);
  this.rootId = rootId;
  this.selectedIndex = -1;

  this.autocompleting = false;
  this.isCommandMode = isCommandMode;
  this.suggestsOnEmpty = suggestsOnEmpty;
  this.charsToWaitFor = charsToWaitFor;

  
  
  
  this.dropdown = DHTML.createElement('div');
  this.dropdown.id = input.id + "_autocomplete";
  this.dropdown.style.position="absolute";
  this.dropdown.style.top = 0;
  this.dropdown.style.left = 0;
  this.dropdown.style.zIndex= this.input.style.zIndex + 3;
  this.dropdown.style.height="0px";
  this.dropdown.style.visibility = "hidden";
  this.dropdown.className = "autocomplete";

  
  document.body.appendChild(this.dropdown);

  
  
  
  DHTML.insertToEventHandler(input, "onkeydown", function(event) {me.handleKeyDown(event)})
  DHTML.insertToEventHandler(input, "onkeyup", function(event) {me.handleKeyUp(event)})
  DHTML.insertToEventHandler(input, "onkeypress", function(event) {(event || window.event).cancelBubble = true;})

  DHTML.appendToEventHandler(input, "onfocus", function() {me.handleFocus()})
  DHTML.appendToEventHandler(input, "onblur", function() {me.handleBlur()})
  
  
  var argIdsStr = this.input.getAttribute('acArgIds');
  if (argIdsStr != null) {
    var ids = argIdsStr.split(',');
    for (var i = 0; i < ids.length; i++) {
      var elt = DHTML.getElementById(ids[i]);
      if(elt) {
        if (!elt.completers) {
          elt.completers = [];
        }
        elt.completers[elt.completers.length] = me;

        
        registerACOnChangeIfHasNot(elt);
      }
    }
  }
}

function registerACOnChangeIfHasNot(element) {
  DHTML.appendToEventHandler(element, "onchange", function() {
    for (var i = 0; i < element.completers.length; i++) {
      element.completers[i].hasCompleteSuggestionList = false;
    }
  })
}

function MakeAutoCompleter(input, rootId, isCommandMode, suggestsOnEmpty, charsToWaitFor){

  
  input = (typeof input == 'object') ? input : DHTML.getElementById(input, true);

  
  
  
  
  
  if(input.hasAutoCompleter == true) {
    return;
  }
  
  input.hasAutoCompleter = true;
  input.autoCompleter = new AJAXAutoCompleter();
  input.autoCompleter.init(input, rootId, isCommandMode, suggestsOnEmpty, charsToWaitFor);
  if(suggestsOnEmpty) {
    input.autoCompleter.doAutoComplete();
  } else {
    input.autoCompleter.clearAutoComplete();
  }
}

///////////////////////////////////////////////////////////
// BEGIN Calendar.js




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




var calendar = null;


var calendarFields = [];


var calendarPickerId = 0;

var Calendar_eraNames = []; 
var Calendar_eraDetails = {}; 




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
  var rawValue = field.tagName == 'INPUT' ? FieldValidation.getUnmaskedInputValue(field) : ''; 
  field.isJpImperial = !field.isJpImperial;
  AJAX.initRequest(field.id, {toggleCalType:calType, value:rawValue}, true)
}


function updateJPImperialCalendar(eId, newValue) {
  var field = document.getElementById(eId);
  if (field.tagName == 'INPUT') {
    FieldValidation.setInputFieldValidator(field.id, ''); 
    field.value = newValue;
    FieldValidation.setDateFieldValidator(field); 
  } else {
    if (field.value) {
      field.value = newValue;
    }
    field.innerText = newValue;
  }
}


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


function parseJPImpDate (id, rawValue, bGetEras, callback) {
  var params = {'parseJPImpDate':rawValue};
  if (bGetEras) {
    params['getAllEras'] = 'y'; 
  }
  AJAX.initRequest(id, params, callback, true)
}


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


function isCalendarOpen() {
  return calendar != null && calendar.mainElement != null;
}


function getCalendarElement() {
  return (calendar == null) ? null : calendar.mainElement;
}




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




CCCalendar.prototype.buildCalendar = function() {

  
  this.images = [];
  for (var i = 0; i < CALENDAR_IMAGES_TO_LOAD.length; i++) {
    this.images[i] = new Image();
    this.images[i].src = Events.getResourceURL(CALENDAR_IMAGES_TO_LOAD[i]);
  }

  
  document.body.insertAdjacentHTML('afterBegin', this.getHTML());

  
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

  
  (this.hasTimeComponent ? this.hourElement : this.eraElement ? this.eraElement : this.monthElement).focus();

}


CCCalendar.prototype.remove = function() {
  document.body.removeChild(this.mainElement);
  DHTML.unshimElement(this.mainElement);
  this.mainElement = null;
  this.field.style.fontWeight = this.field.style.oldFontWeight;
  this.field.style.borderColor = this.field.style.oldBorderColor;
  this.pickerImage.parentElement.focus();
}


CCCalendar.prototype.getHTML = function() {
  var i;

  
  var html = '<div class="calendarMain"' +
             ' style="left:' + this.left + ';top:' + this.top + ';z-index:100"' +
             ' id="ccCalendarMain"' +
             
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
  
  if (this.hasDateComponent){
    html += '<span class="calendarToday" onClick="calendar.clickToday()">' + DateTime.todayString + "</span>";
  }
  html += '</td>';
  
  html += '<td align="right"><input type="button" style="font-size:8pt" value="' + DateTime.okString + '" onClick="calendar.clickOK()"></td>';
  html += '</tr>';

  
  html += '<tr>';
  html += '<td colspan="2" align="center" id="calendarFieldEcho" class="calendarFieldEcho"></td>';
  html += '</tr>';
  html += '</table></div>';
  return html;
}


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


CCCalendar.prototype.adjustYear = function(delta) {
  this.yearElement.value = Math.floor(this.yearElement.value) + delta;
  this.changeMonthOrYear();
}


CCCalendar.prototype.adjustHour = function(delta) {
  var hour = Math.floor(this.hourElement.value) + delta;
  if (DateTime.use12HourClock) { 
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
  } else { 
    if (hour < 0) {
      hour = 23;
    } else if (hour > 23) {
      hour = 0;
    }
  }
  this.hourElement.value = hour;
  this.changeTime();
}


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


CCCalendar.prototype.adjustAMPM = function(delta) {
  if (delta == 1) {
    ampm = DateTime.amOrPM[1];
  } else if (delta == -1) {
    ampm = DateTime.amOrPM[0];
  }
  this.AMorPMElement.value = ampm;
  this.changeTime();
}


CCCalendar.prototype.mouseWheelMonth = function() {
  if (event.wheelDelta >= 120) {
    this.adjustMonth(1);
  } else if (event.wheelDelta <= -120) {
    this.adjustMonth(-1);
  }
}


CCCalendar.prototype.mouseWheelYear = function() {
  if (event.wheelDelta >= 120) {
    this.adjustYear(1);
  } else if (event.wheelDelta <= -120) {
    this.adjustYear(-1);
  }
}


CCCalendar.prototype.mouseWheelHour = function() {
  if (event.wheelDelta >= 120) {
    this.adjustHour(1);
  } else if (event.wheelDelta <= -120) {
    this.adjustHour(-1);
  }
}


CCCalendar.prototype.mouseWheelMinute = function() {
  if (event.wheelDelta >= 120) {
    this.adjustMinute(1);
  } else if (event.wheelDelta <= -120) {
    this.adjustMinute(-1);
  }
}


CCCalendar.prototype.mouseWheelAMPM = function() {
  if (event.wheelDelta >= 120) {
    this.adjustAMPM(1);
  } else if (event.wheelDelta <= -120) {
    this.adjustAMPM(-1);
  }
}


CCCalendar.prototype.clickDay = function(dayId) {
  var firstDayId = this.calcFirstDayId(this.monthElement.value, this.yearElement.value);
  this.setCurrentDay((dayId - firstDayId) + 1);
  this.moveCalendarToField();
  clearCalendar();
}


CCCalendar.prototype.clickToday = function() {
  
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
  this.moveCalendarToField();
  clearCalendar();
}


CCCalendar.prototype.clickOK = function() {
  this.moveCalendarToField();
  clearCalendar();
}



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


CCCalendar.prototype.mouseDownHandler = function() {
  if (DHTML.mouseX < this.left || DHTML.mouseX > this.left + this.width ||
      DHTML.mouseY < this.top  || DHTML.mouseY > this.top + this.height) {
    if (!DHTML.mouseInElement(this.pickerImage, 0)) {
      clearCalendar();
    }
  }
}


CCCalendar.prototype.refreshDaysTable = function() {

  
  var month = this.monthElement.value;
  var year = this.yearElement.value;
  var firstDayId = this.calcFirstDayId(month, year);
  var numDays = DateTime.calcDaysInMonth(month, year);

  
  var today = new Date();
  var todaysYear = today.getFullYear();
  var todaysMonth = today.getMonth() + 1;
  var todaysDay = today.getDate();

  
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



CCCalendar.prototype.getFieldDate = function() {
  var simpleDate;
  if (this.jpImpDate) { 
    simpleDate = getSimpleDateFromJpImpDate(this.jpImpDate);
  } else {
    var date = this.field.value;
    var dateString = '';
    for (var i = 0; i < date.length; i++) { 
      var dateChar = date.substr(i, 1);
      if (DateTime.dateChars.indexOf(dateChar) != -1) {
        dateString += dateChar;
      }
    }
    simpleDate = DateTime.parse(dateString, this.hasDateComponent, this.hasTimeComponent);
    if (simpleDate == null && this.hasDateComponent && this.hasTimeComponent) { 
      simpleDate = DateTime.parse(dateString, true, false);
    }
    if (simpleDate == null) {
      simpleDate = new SimpleDate();
    }
  }

  simpleDate.month = NumberUtil.zeroFill(simpleDate.month + 1, 2);
  return simpleDate;  
}


CCCalendar.prototype.moveFieldToCalendar = function() {
  this.oldFieldValue = this.field.value; 
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


CCCalendar.prototype.moveCalendarToField = function(bValidated) {
  var oldValue = this.field.value;
  var dateString = this.getCurrentDateAsString();
  this.field.value = dateString;
  this.updateEcho(dateString);

  
  if (!bValidated && this.field.isJpImperial && dateString != oldValue) { 
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


CCCalendar.prototype.calcFirstDayId = function(month, year) {
  var firstDateOfMonth = new Date(year, month - 1, 1);
  var dayOfWeekOfFirstDate = firstDateOfMonth.getDay();
  return dayOfWeekOfFirstDate;
}


CCCalendar.prototype.shortWeekdayName = function(index) {
  var name = DateTime.shortWeekdayNames[index];
  if (name.length > 2) {
    name = name.substring(0, 2);
  }
  return name;
}

///////////////////////////////////////////////////////////
// BEGIN ContactUtil.js

function getNewPrimaryPhoneValue(primaryPhoneValue, triggerValues, primaryPhoneValues) {
  var blank = "";
  var noChange = "<NOCHANGE>";
  var newPrimaryPhoneValue = noChange;
  if (primaryPhoneValue == blank) {
    var numNonBlankTriggerValues = 0;
    for (var i = 0; i < triggerValues.length; i++) {
      if (triggerValues[i] != blank) {
        numNonBlankTriggerValues++;
        newPrimaryPhoneValue = primaryPhoneValues[i];
      }
    }
    if (numNonBlankTriggerValues > 1) {
      newPrimaryPhoneValue = noChange;
    }
  }
  return newPrimaryPhoneValue;
}
///////////////////////////////////////////////////////////
// BEGIN DateTime.js





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
    
    var jsDate = new Date();
    this.year = jsDate.getYear();
    this.month = jsDate.getMonth();
    this.day = jsDate.getDate();
    this.hour = jsDate.getHours();
    this.minute = jsDate.getMinutes();
    this.second = jsDate.getSeconds();
  }
}




window.DateTime = new DateTimeImpl();


function DateTimeImpl() {

  
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
    this.jpCalendarInfo = jpCalendarInfo; 
  }
}


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


DateTimeImpl.prototype.makeFourDigitYear = function(year) {
  var numDigits = (Math.floor(year) + "").length;
  year = Math.floor(year);
  if (isNaN(year)) { 
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


DateTimeImpl.prototype.calcDaysInMonth = function(month, year) {
  if (month == '02' && this.isLeapYear(year)) {
    return DAYS_IN_FEB_ON_LEAP_YEAR;
  }
  return DAYS_IN_MONTHS[month - 1];
}


DateTimeImpl.prototype.isLeapYear = function(year) {
  if ((year / 4)   != Math.floor(year / 4))   return false;
  if ((year / 100) != Math.floor(year / 100)) return true;
  if ((year / 400) != Math.floor(year / 400)) return false;
  return true;
}



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


DateTimeImpl.prototype.format_G = function(date, length) {
  return date.eraYear[0]; 
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




DateTimeImpl.prototype.parseDigits = function(string, index) {
  var digits = "0123456789";
  var start = index;
  while (index < string.length && digits.indexOf(string.charAt(index)) >= 0) {
    index++;
  }
  return string.substring(start, index);
}


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

///////////////////////////////////////////////////////////
// BEGIN Debug.js
var Debug = {
  
  getDbgWin: function() {
    if (window.parent._dbgWin != null && window.parent._dbgWin.closed) {
      window.parent._dbgWin = undefined;
    }
    return window.parent._dbgWin;
  },

  start: function() {
    if (!this.isOn()) {
      window.parent._dbgWin = window.open('about:blank', '__DBGWIN__', 'width=400,height=600,resizable=yes,scrollbars=yes');
      window.parent._dbgWin.document.writeln('<title>DEBUG</title>\n' +
              '<script>var _newContent = ""</script>\n' +
              '<Input type="Button" value="Clear" onClick="log.innerHTML = \'\'"/>\n' +
              '<Input type="Button" id="flush" value="Flush" onClick="window.opener.Debug.flush()" style="display:none"/>\n' +
              '<Input type="checkbox" id="realTime" name="realTime" value="true" onClick="flush.style.display = this.checked ? \'none\' : \'\'" checked />Real time\n' +
              '<DIV id="log" style="width:95%;height:90%;overflow:auto"></DIV>');
    }
    window.parent._dbgWin.focus();
  },

  isRealtime : function() {
    return this.getDbgWin().realTime.checked;
  },

  log: function(msg, bFlush) {
    if (this.isOn()) {
      var str = ('<li>['+this.getCurrTime()+'] ' +msg+ '<br>');
      if (bFlush || this.isRealtime()) {
        var logtxt = this.getDbgWin().document.getElementById('log');
        logtxt.innerHTML = logtxt.innerHTML + str;
        logtxt.scrollTop = logtxt.scrollHeight;
      } else {
        this.getDbgWin()._newContent += str;
      }
    }
  },

  flush: function() {
    var str = this.getDbgWin()._newContent;
    if (str) {
      this.log(str, true);
      this.getDbgWin()._newContent = '';
    }
  },

  getCurrTime: function() {
    var t = new Date();
    return t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+'.'+t.getMilliseconds();
  },

  isOn: function() {
    var win = this.getDbgWin();
    return win != null && !win.closed;
  },

    dumpObj: function(msg, obj) {
      var temp = msg;
      var column = 0;
      for (x in obj) {
        var val = obj[x];
        if (val != null && val != "") {
          temp += x + ": " + val;
          if (column == 3) {
            temp += "\n";
            column = 0;
          }
          else {
            temp += "\t  ";
            column++;
          }
        }
      }
    return temp;
  }

};


///////////////////////////////////////////////////////////
// BEGIN DHTML.js





window.DHTML = new DHTMLImpl();


function DHTMLImpl() {

  
  this.elementsById = new Object();

  
  this.mouseX = 0;

  
  this.mouseY = 0;

  
  this.popups = new Array();

  
  this.winModalWindow = null;

  
  this.popups = new Array();

  
  this.checkboxFlags = new Array();

  
  this.currentButton = null;

  
  this.closures = null;

  
  this.isFirefox = false;

  this.cancelEventFunction = function(event) { if (!event) { event = window.event; } event.cancelBubble = true; }

  this.busyDiv = null;

  this.voidFunction = function(){};

  this.lastCheckbox = null;
}




DHTMLImpl.prototype.alert = function(message) {
  if (!window.smokeTest) {
    window.alert(message);
  }
}


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


DHTMLImpl.prototype.prompt = function(message, defaultAnswer) {
  if (window.smokeTest) {
    return defaultAnswer;
  } else {
    return window.prompt(message, defaultAnswer);
  }
}




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


DHTMLImpl.prototype.evalCheckboxFlags = function(flags) {
  var conditions = flags.split(',');
  for (var i = 0; i < conditions.length; i++) {
    var condition = conditions[i];
    while (condition.substr(0, 1) == ' ') { 
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


DHTMLImpl.prototype.addCBFlag = function(checkboxId, flagName) {
  var flag = new Object();
  flag.checkbox = DHTML.getElementById(checkboxId, true);
  flag.name = flagName;
  this.checkboxFlags.push(flag);
}


DHTMLImpl.prototype.selectRadio = function(formName, radioName, selIndex) {
  window.document.forms[formName].elements[radioName][selIndex].click();
}




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




DHTMLImpl.prototype.write = function(html) {
  window.document.write(html);
}


DHTMLImpl.prototype.writeln = function(html) {
  window.document.writeln(html);
}




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


DHTMLImpl.prototype.getElementsByTagName = function(tagName) {
  return document.body.getElementsByTagName(tagName);
}


DHTMLImpl.prototype.showOrHideElement = function(id, showOrHide) {
    var el = DHTML.getElementById(id);
    if (el != null) {
        el.style.display = showOrHide ? '' : 'none';
    }
}


DHTMLImpl.prototype.clearInput = function(id) {
  var el = DHTML.getElementById(id);
  if(el != null) {
    DHTML.setValue(el, '');
  }
}


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


DHTMLImpl.prototype.getElementDivLeft = function(element) {
  var left = 0;
  while (element && (element != document.body) && (element.nodeName != "DIV")) {
    left += element.offsetLeft;
    element = element.offsetParent;
  }
  return left;
}


DHTMLImpl.prototype.getElementDivTop = function(element) {
  var top = 0;
  while (element && (element != document.body) && (element.nodeName != "DIV")) {
    top += element.offsetTop;
    element = element.offsetParent;
  }
  return top;
}


DHTMLImpl.prototype.getElementWidth = function(element) {
  if ((element.currentStyle || element.style).display == 'none') {
    Debug.log('<font color=orange>WARN: Try to get width of an invisible element: ' + element.id + '</font>');
  }
  return Math.max(element.clientWidth, element.offsetWidth);
}


DHTMLImpl.prototype.getElementHeight = function(element) {
  if ((element.currentStyle || element.style).display == 'none') {
    Debug.log('<font color=orange>WARN: Try to get height of an invisible element: ' + element.id + '</font>');
  }
  return Math.max(element.clientHeight, element.offsetHeight);
}






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


DHTMLImpl.prototype.isArrayInputChanged = function(array) {
  for (var i = 0; i < array.length; i++) {
    if (this.isInputChanged(array[i])) {
      return true;
    }
  }
  return false;
}


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


DHTMLImpl.prototype.addField = function(form, fieldType, fieldName, fieldValue) {
  var input = document.createElement('INPUT');
  input.type = fieldType;
  input.name = fieldName;
  input.value = fieldValue;
  form.appendChild(input);
}


function DHTMLImpl_addScrollPosition (elem, posList) {
  var pos = [elem.scrollTop, elem.scrollLeft];
  if (!ArrayUtil.contentsEqual(pos, [0,0])) {
    posList[posList.length] = '"' + elem.tagName+' '+elem.id + '" : [' + pos + ']';
  }
}


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









DHTMLImpl.prototype.contains = function(outerE, innerE) {
  if (outerE.contains) {
    return outerE.contains(innerE); 
  } else {
    for (var e = innerE; e != null; e = e.parentNode) {
      if (e == outerE) {
        return true;
      }
    }
    return false;
  }
}


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
  } else if (window.__restoreScrollPosition) { 
    return;
  }
  if (document.forms.length == 0) {
    return;
  }

  
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
  
  var button = getDefaultButton();
  if (button != null && !button.disabled && !(button.style && button.style.display == 'none')) {
    try {
      button.focus();
      Debug.log('Initial focus set to defaultButton: ' + button.id);
    } catch (err) { }
  }
}


DHTMLImpl.prototype.fieldCanAcceptFocus = function(field) {
  return field.type != "hidden" && field.type != "button" && field.type != "image" && field.type != "submit"
    && !field.disabled && !(field.style && field.style.display == 'none') && (field.getAttribute("tabIndex") == null || field.tabIndex != -1);
}


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




DHTMLImpl.prototype.recordMousePosition = function() {
  if(window.event != null) {
    this.mouseX = window.event.clientX + document.body.scrollLeft;
    this.mouseY = window.event.clientY + document.body.scrollTop;
  }
}


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
      numCharsLeft --; 
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


DHTMLImpl.prototype.hourglass = function() {
  if (this.busyDiv == null) {
    
    this.busyDiv = document.createElement('div');
    this.busyDiv.style.cssText = 'position:absolute;z-index:900;left:0;top:0;border:0;cursor:wait;';
    this.busyDiv.onclick = this.cancelEventFunction;
    this.busyDiv.onmousedown = this.cancelEventFunction;
    document.body.appendChild(this.busyDiv);
  } else {
    this.busyDiv.style.display = '';
  }

  Events.queueEvent(function() { 
    if (DHTML.busyDiv) {
      var oldFocus = DHTML.getActiveElement()
      if (oldFocus) {
        
        DHTML.busyDiv.oldFocus = oldFocus;
      }
      try {
        DHTML.busyDiv.focus();
      } catch(ignore) {
        
      }
    }
  })

  this.resizeBusyDiv();
}


DHTMLImpl.prototype.unhourglass = function() {
  
  
  Events.enableNavigation();

  if (this.busyDiv) {
    this.busyDiv.style.display = 'none';
    this.unshimElement(this.busyDiv);
    var oldFocus = this.busyDiv.oldFocus;
    this.busyDiv.oldFocus = null;
    if (oldFocus) {
      Events.queueEvent(function(){ 
        try {
          
          oldFocus.focus();
        } catch (ignore) {
          Debug.log(ignore);
        }
      });
    }
  }
}




DHTMLImpl.prototype.popupAboutWindow = function() {
  this.closePopups();
  this.createPopup('About.do?inFrame=about', 476, 266, false, false);
}


DHTMLImpl.prototype.popupHelpWindow = function() {
  this.closePopups();
  this.createPopup('resources/help/index.html', 412, 631, false, false);
}


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


DHTMLImpl.prototype.basicCreatePopup = function(url, name, features) {
  this.closePopups();
  var newWindow = window.open(url, name, features);
  this.popups[this.popups.length] = newWindow;
  newWindow.focus();
  return newWindow;
}


DHTMLImpl.prototype.detachPopup = function() {
  this.popups.length--;
}


DHTMLImpl.prototype.closePopups = function() {
  for (var i = 0; i < this.popups.length; i++) {
    if (!this.popups[i].closed) {
      this.popups[i].close();
    }
  }
}


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
      
      windowToClose.returnValue="error:" + errorPage;
      windowToClose.close();
      return true;
    } else if (windowToClose.opener && windowToClose.opener.go) {
      
      windowToClose.opener.go(errorPage);
      windowToClose.close();
      return true;
    } else if (windowToClose.parent && windowToClose.parent != windowToClose) {
      
      windowToClose = windowToClose.parent;
    } else {
      
      return false;
    }
  }
}




DHTMLImpl.prototype.addToOptions = function(box, newOptionDisp, newOptionValue) {
  var newOption = new Option(newOptionDisp, newOptionValue);
  for (var i = 0; i < box.options.length; i++) {
    var oldOption = box.options[i];
    if(oldOption.value == newOption.value) {
      
      box.options[i] = newOption;
      box.selectedIndex = i;
      return;
    }
  }
  box.options[box.options.length] = newOption;
  box.selectedIndex = box.options.length - 1;
}




DHTMLImpl.prototype.setFieldToClosure = function(owner, field, closure) {
  var newClosure = new Object();
  newClosure.owner = owner;
  newClosure.field = field;
  newClosure.next = this.closures;
  this.closures = newClosure;
  owner[field] = closure;
}


DHTMLImpl.prototype.cleanUpClosures = function() {
  while (this.closures != null) {
    var closure = this.closures;
    this.closures = closure.next;
    closure.owner[closure.field] = null;
  }
}




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


DHTMLImpl.prototype.getInnerText = function(e) {
  return StringUtil.trim(e.innerText != undefined ? e.innerText : e.textContent);
}


DHTMLImpl.prototype.getValue = function (e) {
  var val = "";

  switch (e.tagName) {
    case 'INPUT':

      
      if (e.type=='radio') {
        var checkedRadio = this.getCheckedRadio(e);
        if (checkedRadio != null) {
          val = checkedRadio.value;
        }
      
      } else if (e.type=='checkbox') {
        var group = this.getInputGroup(e)
        if (group.length == 1) { 
          val = e.checked ? e.value : '';
        } else { 
          val = [];
          for (var i=0; i<group.length; i++) {
            if (group[i].checked) {
              ArrayUtil.appendElement(val, group[i].value);
            }
          }
        }
      
      } else {
        val = e.value;
      }
      break;

    case 'SELECT':
      if(e.type == 'select-one') {
        val = e.value;
      } else { 
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

  
  var validator = FieldValidation.getValidatorForInput(e);
  if (validator != null) {
    val = FieldValidation.unmaskFieldValue(val, validator.mask, e.placeholderChar);
  }

  return val;
}


DHTMLImpl.prototype.getValueById = function (id) {
  var e = this.getElementById(id);
  if(e){
  return this.getValue(e);
  } else {
    return '';
  }
}


DHTMLImpl.prototype.getValueByIds = function (ids) {
  var vals = new Array()
  for (var i = 0; i < ids.length; i++) {
    ArrayUtil.appendElement(vals, this.getValueById(ids[i]))
  }
  return vals
}


DHTMLImpl.prototype.getTextById = function (id) {
  var e = this.getElementById(id);
  return this.getText(e);
}


DHTMLImpl.prototype.getText = function (e) {
  var text = "";
  switch (e.tagName) {
    case 'SELECT':
      if(e.type == 'select-one') {
        text = e.selectedIndex >=0 ? e.options[e.selectedIndex].text : '';
      } else { 
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
      var icon = DHTML.getIcon(e);
      if(icon != null) {
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
      if (bReflect) { 

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
      } else { 
        
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


DHTMLImpl.prototype.setValue = function (e, val, bDoNotInvokeOnChange) {
  var oldVal = this.getValue(e);

  
  val = DHTML.formatValue(val, e.getAttribute("format"));

  
  EncryptedField.preSetValue(e);

  switch (e.tagName) {
    case 'INPUT':

      
      if (e.type == 'radio' || e.type == 'checkbox') {
        var group = this.getInputGroup(e)
        var vals = typeof(val)==typeof('') ? [val] : val; 
        for (var i=0; i < group.length; i++) {
          var r = group[i]
          r.checked = ArrayUtil.inArray(r.value, vals);
        }
      } else { 
        e.value = val;
      }
      break;

    case 'SELECT':
      if(e.type == 'select-one') {
        
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
            
            if (oldIndex != newIndex && oldIndex >= 0) {
              try {
                e.options[oldIndex].selected = false;
              } catch (IE6BugWithSelect) {
                
                e.selectedIndex = newIndex
              }
            }
          }
          if (val != e.value) {
            alert('failed to update value of SELECT to "'+val+'": ' + e.id)
          }
        } else if (val == '') {
          
          e.options[e.length] = new Option('', '', false, true);
        } else {
          alert('Invalid value for SELECT: ' + val);
        }
      } else { 
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

  
  FieldValidation.applyFieldMask(e);

  if (!bDoNotInvokeOnChange) {
    this.invokeOnChangeIfNeeded (oldVal, e);
  }
  return oldVal;
}

DHTMLImpl.prototype.getSelectionRange = function(e) {
 var caret = new Object();
 if(document.selection){  
   var sel = document.selection.createRange();
   var dup = sel.duplicate();
   dup.expand('textedit');
   dup.setEndPoint('EndToEnd', sel);
   caret.start = dup.text.length - sel.text.length;
   caret.end = caret.start + sel.text.length;
 } else if(e.selectionStart || e.selectionStart == '0') {  
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
 if (document.selection){  
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
 } else if(e.selectionStart || e.selectionStart == '0'){  
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
    select.add(optionToInsert, optionToInsertBefore); 
  } catch(ex) {
    for(var i = 0; i < select.options.length; i++) {
      if(select.options[i] == optionToInsertBefore) {
        select.add(optionToInsert, i); 
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
  
  top.recorderStarted = recorderStarted;
}



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

    
    var cssClass = e.className;
    if (cssClass != "" && cssClass.indexOf(' ') < 0) { 
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

  
  hE = DHTML.getElementById(e.id+"_helper");
  if (hE != null) {
    
    hE.style.visibility= disabled ? 'hidden' : 'visible';
  }
  
  EncryptedField.postSetAvailability(e);
}

DHTMLImpl.prototype.isDisabled = function(e) {
  return EncryptedField.isDisabled(e);
}


DHTMLImpl.prototype.setOptions = function (e, options) {
  var oldVal = this.getValue(e)

  
  e.selectedIndex = -1;
  e.length = 0;
  DHTML.removeChildren(e); 

  for (var i = 0; i < options.length; i++) {
    var opDef = options[i]
    var op = DHTML.createElement("option");
    op.value = opDef[0];
    op.innerHTML = opDef[1];
    op.text = opDef[1];
    if (opDef[0]==oldVal) {
      op.selected = true;
    }

    
    if (opDef.length > 2) {
      var grpLabel = opDef[2];
      var optGroup = DHTML.findOrCreateOptGroup(e, grpLabel);
      optGroup.appendChild(op);
    } else {
      e.appendChild(op);
    }

  }
  
  
  var oldVisibility = e.style.visibility; 
  e.style.visibility = 'hidden';
  e.style.visibility = oldVisibility;

  var newVal = e.value;
  if (oldVal != newVal && newVal != '') {
    alert('Invalid value for SELECT: ' + oldVal + '. Default to the first OPTION: ' + newVal);
  }

  this.invokeOnChangeIfNeeded(oldVal, e);
}


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
    
    try { e.select() } catch (ignored) {}
  }
}


DHTMLImpl.prototype.executeOnChangeById = function (id) {
  var e = this.getElementById(id);

  
  if (e.tagName=='INPUT' && (e.type=='radio' || e.type == 'checkbox')) {
    if (e.onclick != null) {
      e.onclick()
    }
  }
  
  else if (e.onchange != null) {
    e.onchange();
  }
  
  
  else {
    Reflection.reflect(e);
  }
}



DHTMLImpl.prototype.updateCheckboxGroup = function (checkbox) {
  var group = this.getInputGroup(checkbox, "groupId");
  for (var i = 0; i < group.length; i++) {
    group[i].checked = checkbox.checked
  }
}


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

          group[i].checked = true;

        if(group[i] == this.lastCheckbox || group[i] == checkbox) {
          between = false;
        }
      } else {
        if(group[i] == this.lastCheckbox || group[i] == checkbox) {
          between = true;

            group[i].checked = true;

        }
      }
    }
  }
  this.lastCheckbox = checkbox;
}


DHTMLImpl.prototype.updateCheckAllCheckbox = function (headerCBId) {
  var checkbox = document.getElementById(headerCBId);
  var group = this.getInputGroup(checkbox, "groupId");
  for (var i = 0; i<group.length; i++) {
    if (group[i] != checkbox) {
      return; 
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


DHTMLImpl.prototype.showHelpText = function(elem) {

  var helpText = DHTML.getHelpText(elem);
  if (!helpText) { 
    return;
  }

  ScrollingPanel.showText(elem, helpText, 'helpTxt');
  elem.title = ''; 
}



DHTMLImpl.prototype.hideHelpText = function(elem) {
  var helpText = ScrollingPanel.hideText(elem);
  if (helpText != null) {
    DHTML.restoreHelpTextToTitle(elem, helpText); 
  }
}



DHTMLImpl.prototype.getHelpText = function(elem) {
  var text = elem.getAttribute("helpText");
  if (text == '__UseTitle__') {
    text = elem.title;
  }
  return text;
}


DHTMLImpl.prototype.restoreHelpTextToTitle = function(elem, text) {
  if (elem.getAttribute("helpText") == '__UseTitle__') {
    elem.title = text;
  }
}


DHTMLImpl.prototype.openPopupPanel = function(elemId, paramMap, styleClass, cacheContent) {
  var elem = document.getElementById(elemId);
  var panelContent = elem.popupPanelContent;
  ScrollingPanel.showText(elem, panelContent == null ? AJAX.getLoadingHTML() : panelContent, styleClass, true, 500, 800, true);

  
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


DHTMLImpl.prototype.removeElement = function(elemId) {
  var container = document.getElementById(elemId + '_container');
  var elem = container != null ? container : document.getElementById(elemId);
  elem.parentNode.removeChild(elem);
}


DHTMLImpl.prototype.removeChildren = function(elem) {
  while (elem.childNodes.length > 0) {
    elem.removeChild(elem.childNodes[0]);
  }
}

DHTMLImpl.prototype.updateElement = function(elemId, content, scripts, refreshChildrenOnly, bAppend) {
  var oldNode = typeof(elemId) == typeof('') ? DHTML.getElementById(elemId, true) : elemId;
  var parentNode, anchorNode;
  if(oldNode!=null){
  if (bAppend) {
    parentNode = oldNode.parentNode;
    anchorNode = oldNode.nextSibling; 
  } else if (refreshChildrenOnly) {
    parentNode = oldNode;
    anchorNode = null;
    
    DHTML.removeChildren(parentNode);
  } else {
    parentNode = oldNode.parentNode;
    anchorNode = oldNode;
}
  var tempSpan = document.createElement('span');
  var tempPlaceHolder = document.body.appendChild(tempSpan);
  if (parentNode.tagName == 'TR') {
    DHTML.setInnerHTML(tempPlaceHolder, '<TABLE><TBODY><TR>' + content + '</TR></TBODY></TABLE>');
    tempPlaceHolder = tempPlaceHolder.childNodes[0].childNodes[0].childNodes[0]; 
  } else if (parentNode.tagName == 'TBODY') {
    DHTML.setInnerHTML(tempPlaceHolder, '<TABLE><TBODY>' + content + '</TBODY></TABLE>');
    tempPlaceHolder = tempPlaceHolder.childNodes[0].childNodes[0]; 
  } else if (parentNode.tagName == 'TABLE') {
    DHTML.setInnerHTML(tempPlaceHolder, '<TABLE>' + content + '</TABLE>');
    tempPlaceHolder = tempPlaceHolder.childNodes[0]; 
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

  
  if (scripts != null && scripts != '') {
    var js = document.createElement('script');
    js.text = scripts;
    document.body.appendChild(js);
  }

  EventHandlers.partialLoadHandler();
}
}

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


DHTMLImpl.prototype.clickRadio = function(elem) {
  elem.fireEvent("onfocus"); 
  elem.click();
}


DHTMLImpl.prototype.invokeElement = function(elem) {
  switch (elem.tagName) {
    case 'A':
    case 'SPAN':
      elem.click();
      
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


DHTMLImpl.prototype.setInnerHTML = function(elem, html) {
  html = '<span id="removeMe" style="display:none">a<\/span>' + html;
  elem.innerHTML = html;
  var firstChild = elem.firstChild;
  if (firstChild && firstChild.id == "removeMe") {
    elem.removeChild(firstChild);
  }
}



DHTMLImpl.prototype.fixSelectWidth = function() {
  if (DHTML.isFirefox) {
    return;
  }
  
  var ss = document.getElementsByTagName("SELECT");
  for (var i=0; i < ss.length; i++) {
    var elem = ss[i];

    if (elem.tabIndex < 0 || elem.oldWidth != null) {
      continue; 
    }

    var w = elem.offsetWidth;
    var oldWidthStr = elem.style.width;
    elem.style.width = 'auto';
    if (elem.offsetWidth <= w) {
      elem.style.width = oldWidthStr;
      continue; 
    }

    elem.wDiff = elem.offsetWidth - w;

    
    var span = DHTML.createElement('span', 'style', 'overflow:hidden;white-space:nowrap;');
    span = elem.parentElement.insertBefore(span, elem);
    elem = elem.parentElement.removeChild(elem);
    elem = span.appendChild(elem);
    span.style.width = elem.oldWidth = elem.style.width = w; 

    if (!window.XMLHttpRequest) {
      
      var shim = DHTML.createElement('iframe', 'frameBorder', '0', 'scrolling', 'no', 'tabindex', '-1',
              'style', 'position:absolute;bottom:0;right:-' +
                       (elem.wDiff-1) + 'px;width:' + elem.wDiff + 'px;height:1px;');
      elem.shim = span.appendChild(shim);
    }

    
    var iconWidth = elem.offsetHeight - 2; 
    var dropIcon = span.appendChild(DHTML.createElement('span',
            'style', 'overflow:hidden;white-space:nowrap;position:absolute;left:' +(w-iconWidth)+ 'px;width:'+iconWidth+'px'));
    if (!window.XMLHttpRequest) {
      dropIcon.style.height = 1; 
    } else {
      dropIcon.style.height = iconWidth + 2;
      dropIcon.style.display = 'none';
    }
    var selectIcon = dropIcon.appendChild(DHTML.createElement('select',
            'style', 'position:absolute;right:0;width:' +(iconWidth+2)+ 'px', 
            'tabindex', '-1',
            'onbeforeactivate', 'if(!window.XMLHttpRequest){event.fromElement.blur()} return false'));
    selectIcon.appendChild(DHTML.createElement('option')); 
    selectIcon.className = elem.className;
    elem.dropIcon = dropIcon;

    
    elem.onbeforeactivate = DHTMLImpl_beforeActivateSelect;
    elem.onbeforedeactivate = DHTMLImpl_beforeDeactivateSelect;
  }
}


function DHTMLImpl_beforeActivateSelect(elem) {
  elem = elem || window.event.srcElement;

  if (elem.dropIcon.offsetHeight == 1) {
    elem.dropIcon.style.height = elem.dropIcon.offsetWidth + 2
  }
  elem.dropIcon.style.display = '';

  elem.style.width = 'auto';
  if (elem.shim) {
    elem.shim.style.width = elem.wDiff;
    
    elem.focus();
  }
}


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
    EventHandlers.beforeDeactivateHandler(document.getElementById(id)); 
    var oldId = document.activeElementId;
    document.activeElementId = id; 
    EventHandlers.activateHandler(oldId); 
  } else if (activeElem.id != id) {
    
    for (var e = document.getElementById(id); e != null; e = e.parentNode) {
      if (e.id != id) {
        
        convertKeyShortcutScopeId(id, e.id); 
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


DHTMLImpl.prototype.shimElement = function(elem){
  var shim = elem._shim;

  if (shim == null) {
    
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


DHTMLImpl.prototype.setupToggleSection = function (headerId, sectionId) {
  var header = document.getElementById(headerId);
  header._section = document.getElementById(sectionId);
  if (DHTML.getValueById(header.id + '_clpsd') == 'true') {
    DHTMLImpl_updateSection(header, header._section, true);
  }
}

DHTMLImpl.prototype.toggleSection = function(header) {
  var toCollapse = !(DHTML.getValueById(header.id + '_clpsd') == 'true');
  DHTML.setValueById(header.id + '_clpsd', toCollapse ? 'true' : 'false');
  DHTMLImpl_updateSection(header, header._section, toCollapse);
}

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


DHTMLImpl.prototype.appendToEventHandler = function(e, eventName, callback) {
  DHTMLImpl_addToEventHandler(e, eventName,  callback, false)
}


DHTMLImpl.prototype.insertToEventHandler = function(e, eventName, callback) {
  DHTMLImpl_addToEventHandler(e, eventName,  callback, true)
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
      return; 
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


function DHTMLImpl_executeEventHandlers(e, eventName, event) {
  var lst = e[eventName+'_list'];
  for (var i=0; i<lst.length; i++) {
    var callback = lst[i]
    if (typeof(callback)==typeof('')) {
      eval(callback);
    } else if (callback) {
      
      e.temp = callback;
      e.temp(event);
    }
  }
}


DHTMLImpl.prototype.rollbackEventHandler = function(e, eventName, callback) {
  var i = DHTMLImpl_findEventHandler(e, eventName, callback)
  if (i < 0) {
    Debug.log('No matching "'+eventName+'" handler found for ' + e.id)
  } else {
    e[eventName+'_list'][i] = undefined
  }
}


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

///////////////////////////////////////////////////////////
// BEGIN DocumentUtil.js


window.DocumentUtil = new DocumentUtilImpl();

function getBaseDocUtilPath() {
  var result = window.location.protocol + "//" + window.location.host + window.location.pathname;
  result = result.substr(0, result.lastIndexOf('/') + 1);
  return result;
}

function DocumentUtilImpl() {
  this.documentOperationsSuspended = false;
  this.baseDocUtilPath = getBaseDocUtilPath();
}

DocumentUtilImpl.prototype.suspendDocumentOperations = function() {
  this.documentOperationsSuspended = true;
}

DocumentUtilImpl.prototype.initDocumentOperations = function(localizedErrorMessage) {
  var windowTop = window.DocumentUtil.getWindowTop ()
  var templateRunner = windowTop.document_frame.document.templateRunner;
  var url = window.DocumentUtil.baseDocUtilPath;
  
  try {
    var rtn = templateRunner.initialize(url);
  
  } catch (e) {
    
    windowTop.top_frame.document.body.innerHTML = '<div style="position:absolute">' + localizedErrorMessage + "</div>" + windowTop.top_frame.document.body.innerHTML;
  }

  this.documentOperationsSuspended = false;
}

DocumentUtilImpl.prototype.resumeDocumentOperations = function() {
  this.documentOperationsSuspended = false;
}

DocumentUtilImpl.prototype.areDocumentOperationsSuspended = function() {
  return this.documentOperationsSuspended;
}

DocumentUtilImpl.prototype.displayDocument = function(widgetId, docId) {
  window.DHTML.hourglass();
  if (docId) {
    window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'displayDocument', 'docId':docId}, window.DocumentUtil.handleDisplayDocumentResponse, true);
  } else {
    window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'displayDocument'}, window.DocumentUtil.handleDisplayDocumentResponse, true);
  }

}

DocumentUtilImpl.prototype.clearCachedDocumentLocation = function(widgetId, baseSpanName) {
  window.DHTML.hourglass();
  window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'clearCachedDocumentLocation', 'baseSpanName':baseSpanName}, window.DocumentUtil.maybeClearTempDirectory);

}

DocumentUtilImpl.prototype.uploadChangedDocument = function(widgetId, baseSpanName) {
  window.DHTML.hourglass();
  window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'uploadChangedDocument', 'baseSpanName':baseSpanName}, window.DocumentUtil.uploadLocalDocument);

}

DocumentUtilImpl.prototype.displayDocumentAndCacheLocation = function(widgetId, baseSpanName) {
  window.DHTML.hourglass();
  window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'displayDocument', 'baseSpanName':baseSpanName}, window.DocumentUtil.sendContentsToDocumentControlAndCacheLocation);

}

DocumentUtilImpl.prototype.displayDownloadedDocument = function(widgetId) {
  window.DHTML.hourglass();
  window.AJAX.initRequest(widgetId, {'widgetId':widgetId,'action':'displayDownloadedDocument'}, window.DocumentUtil.sendContentsToDocumentControl);

}

DocumentUtilImpl.prototype.getWindowTop = function() {
  if (window.top.selenium_myiframe ) {
    return window.top.selenium_myiframe;
  } else {
      return window.top;
  }
}

DocumentUtilImpl.prototype.handleDisplayDocumentResponse = function() {
  var docResponse;
  eval("docResponse = " + window.AJAX.returnValue);
  
  if (docResponse["errorMsg"]) {
    window.DHTML.alert(docResponse["errorMsg"]);
    window.DHTML.unhourglass();
  } else {
    var fileExt = docResponse["fileExt"];
    if (fileExt == null) {
      fileExt = '';
    }
    if (docResponse["script"]) {
      window.DocumentUtil.sendContentsToDocumentControl(docResponse);
    } else {
      var targetHiddenFrame = docResponse["targetHiddenFrame"];
      if (docResponse["url"]) {
        var urlString = docResponse["url"];
        if (targetHiddenFrame) {
          window.DocumentUtil.getWindowTop ().utility_frame.location.href = urlString;
        } else {
          var gaiFrameTarget = "DocumentContentWindow";
          var gaiParams = null;
          if (urlString.indexOf("//ecf") != -1) {
        	  gaiFrameTarget = "ecfMainWindow";
        	  gaiParams = ",resizable=yes,scrollbars=yes"
          }
          window.open(urlString, gaiFrameTarget, gaiParams);
        }
      } else if (docResponse["html"]) {
        var htmlString = docResponse["html"];
        if (targetHiddenFrame) {
          window.DocumentUtil.getWindowTop ().utility_frame.document.write(htmlString);
          window.DocumentUtil.getWindowTop ().utility_frame.document.close();
        } else {
          var newWindow = window.open("", "DocumentContentWindow");
          newWindow.document.write(htmlString);
          newWindow.document.close();
        }
      } else {
        
        var templateRunner = window.DocumentUtil.getWindowTop ().document_frame.document.templateRunner;
        var filePath = templateRunner.createTempFileLocation(fileExt);
        var url = window.DocumentUtil.baseDocUtilPath + "FileContents.do?widgetID=" + docResponse["widgetId"];
        if (docResponse["docId"]) {
          url = url + "&docID=" + docResponse["docId"];
        }
        var msg = "handleDisplayDocumentResponse templateRunner " + templateRunner + " url=" + url + " filePath=" + filePath;
        
        Debug.log(msg);
        templateRunner.loadContentIntoSpecifiedFile(url, filePath);
      }
      window.DHTML.unhourglass();
    }
  }
}


DocumentUtilImpl.prototype.sendContentsToDocumentControl = function() {
  var docResponse;
  eval("docResponse = " + window.AJAX.returnValue);

  var script = docResponse["script"];
  var fileExt = docResponse["fileExt"];
  if (fileExt == null) {
    fileExt = '';
  }

  var templateRunner = window.DocumentUtil.getWindowTop ().document_frame.document.templateRunner;
  var filePath = templateRunner.createTempFileLocation(fileExt);
  Debug.log("sendContentsToDocumentControl templateRunner " + templateRunner == null + " fileExt=" + fileExt);

  templateRunner.createFileFromScript(script, filePath);
  window.DHTML.unhourglass();
}

DocumentUtilImpl.prototype.displayNewDocument = function(url, filePath) {
  var templateRunner = window.DocumentUtil.getWindowTop ().document_frame.document.templateRunner;

  filePath = filePath.split("\\").join("\\\\"); 
  Debug.log("displayNewDocument from URL:" + url);
  Debug.log("displayNewDocument to file:" + filePath);
  
  window.setTimeout( function() {
    templateRunner.loadContentIntoSpecifiedFile(url, filePath);
  }, 500);

}

DocumentUtilImpl.prototype.uploadLocalDocument = function() {
  var docResponse;
  eval("docResponse = " + window.AJAX.returnValue);
  var widgetId = docResponse["widgetId"];
  var fileLocation = docResponse["fileLocation"];
  var baseSpanName = docResponse["baseSpanName"];

  window.DocumentUtil.suspendDocumentOperations();

  try {
    var newBody = window.DocumentUtil.getWindowTop ().document_frame.document.all.templateRunner.uploadFileContents(fileLocation, 'fileContent', getBaseDocUtilPath() + "UploadDocumentContents.do", 'widgetId', widgetId);

    window.AJAX.initRequest(widgetId, {'action':'clearCachedDocumentLocation','widgetId':widgetId}, window.DocumentUtil.maybeClearTempDirectory);

    window.DocumentUtil.getWindowTop ().document_frame.document.write(newBody);
    window.DocumentUtil.getWindowTop ().document_frame.document.close();

    if (baseSpanName) {
      window.DocumentUtil.showBaseActionLinks(baseSpanName)
    }
    
  } catch (e) {
    window.alert(docResponse["fileAccessError"]);
    window.DocumentUtil.resumeDocumentOperations();
  }
  
  window.DHTML.unhourglass();
}


DocumentUtilImpl.prototype.sendContentsToDocumentControlAndCacheLocation = function() {
  var docResponse;
  eval("docResponse = " + window.AJAX.returnValue);
  if (docResponse["errorMsg"]) {
    window.DHTML.alert(docResponse["errorMsg"]);
    window.DHTML.unhourglass();
  } else {

    var script = docResponse["script"];
    var fileExt = docResponse["fileExt"];
    var widgetId = docResponse["widgetId"];
    var baseSpanName = docResponse["baseSpanName"];
    if (fileExt == null) {
      fileExt = '';
    }

    var templateRunner = window.DocumentUtil.getWindowTop ().document_frame.document.templateRunner;
    var filePath = templateRunner.createTempFileLocation(fileExt);

    if (script) {
      templateRunner.createFileFromScript(script, filePath);
    } else {
      var url = window.DocumentUtil.baseDocUtilPath + "FileContents.do?widgetID=" + docResponse["widgetId"];
      templateRunner.loadContentIntoSpecifiedFile(url, filePath);
    }
    
    window.AJAX.initRequest(widgetId, {'action':'cacheDocumentLocation','widgetId':widgetId,'fileLocation':filePath}, window.DocumentUtil.doNothing);

    if (baseSpanName) {
      window.DocumentUtil.showEditActionLinks(baseSpanName);
    }
    window.DHTML.unhourglass();
  }
}

DocumentUtilImpl.prototype.maybeClearTempDirectory = function() {
  var docResponse;
  eval("docResponse = " + window.AJAX.returnValue);

  var numCachedDocs = docResponse["numCachedDocs"];
  var baseSpanName = docResponse["baseSpanName"]

  
  
  if (numCachedDocs == 0) {
    window.DocumentUtil.clearTempDirectory();  
  }

  if (baseSpanName) {
    window.DocumentUtil.showBaseActionLinks(baseSpanName)
  }

  window.DHTML.unhourglass();
}

DocumentUtilImpl.prototype.clearTempDirectory = function() {
  if (window.DocumentUtil.getWindowTop ().document_frame && window.DocumentUtil.getWindowTop ().document_frame.document.templateRunner) {
    var templateRunner = window.DocumentUtil.getWindowTop ().document_frame.document.templateRunner;
    try {
      templateRunner.cleanTemporaryFiles();
    } catch (e) {
      
      
    }
  }
}

DocumentUtilImpl.prototype.doNothing = function() {

}


DocumentUtilImpl.prototype.sendScriptToDocumentControl = function(controlID, script, tempFilePath) {
  
  Debug.log("sendScriptToDocumentControl tempFilePath=" + tempFilePath);
  window.DocumentUtil.getWindowTop ().document_frame.document.templateRunner.createFileFromScript(script, tempFilePath);

  var url = getBaseDocUtilPath() + "FileUpload.do";
  
  Debug.log("sendScriptToDocumentControl url=" + url);
  var newBody = window.DocumentUtil.getWindowTop ().document_frame.document.all.templateRunner.uploadFileContents(tempFilePath, 'fileContent', url, 'widgetRenderId', controlID, 'filePath', tempFilePath);
  window.DocumentUtil.getWindowTop ().document_frame.document.all.templateRunner.displayFile(tempFilePath);
  window.DocumentUtil.getWindowTop ().upload_frame.document.write(newBody);
  window.DocumentUtil.getWindowTop ().upload_frame.document.close();
}

DocumentUtilImpl.prototype.showBaseActionLinks = function(baseSpanName) {
  DHTML.showOrHideElement(baseSpanName + "view", true);
  DHTML.showOrHideElement(baseSpanName + "edit", true);
  DHTML.showOrHideElement(baseSpanName + "localEdit", false);
  DHTML.showOrHideElement(baseSpanName + "upload", false);
  DHTML.showOrHideElement(baseSpanName + "discard", false);
}

DocumentUtilImpl.prototype.showEditActionLinks = function(baseSpanName) {
  DHTML.showOrHideElement(baseSpanName + "view", false);
  DHTML.showOrHideElement(baseSpanName + "edit", false);
  DHTML.showOrHideElement(baseSpanName + "localEdit", true);
  DHTML.showOrHideElement(baseSpanName + "upload", true);
  DHTML.showOrHideElement(baseSpanName + "discard", true);
}


DocumentUtilImpl.prototype.displayRepositoryVersion = function(widgetId, operationsSuspendedMessage) {
  if (this.areDocumentOperationsSuspended()) {
    window.alert(operationsSuspendedMessage);
  } else {
    this.displayDocument(widgetId);
  }
}

DocumentUtilImpl.prototype.editRepositoryVersion = function(widgetId, operationsSuspendedMessage, baseSpanName) {
  if (this.areDocumentOperationsSuspended()) {
    window.alert(operationsSuspendedMessage);
  } else {
    this.displayDocumentAndCacheLocation(widgetId, baseSpanName);
  }
}

DocumentUtilImpl.prototype.editLocalVersion = function(widgetId, operationsSuspendedMessage) {
  if (this.areDocumentOperationsSuspended()) {
    window.alert(operationsSuspendedMessage);
  } else {
    this.displayDownloadedDocument(widgetId);
  }
}

DocumentUtilImpl.prototype.uploadLocalVersion = function(widgetId, operationsSuspendedMessage, baseSpanName) {
  if (this.areDocumentOperationsSuspended()) {
    window.alert(operationsSuspendedMessage);
  } else {
    this.uploadChangedDocument(widgetId, baseSpanName);
  }
}

DocumentUtilImpl.prototype.discardLocalVersion = function(widgetId, operationsSuspendedMessage, baseSpanName) {
  if (this.areDocumentOperationsSuspended()) {
    window.alert(operationsSuspendedMessage);
  } else {
    this.clearCachedDocumentLocation(widgetId, baseSpanName);
  }
}

DocumentUtilImpl.prototype.escapeForSendKeysVB = function( strKeys ) {
  var sb = "";
  for( i = 0; i < strKeys.length; i++ )
  {
    var c = strKeys.charAt( i );
    if(( c == '+' ) || ( c == '^' ) || ( c == '%' ) || ( c == '~' ) || ( c == '(' ) ||
        ( c == ')' ) || ( c == '[' ) || ( c == ']' ) || ( c == '{' ) || ( c == '}' ))
    {
      sb += "{" + c + "}";
    }
    else
    {
      sb += c;
    }
  }
  return sb;
}


DocumentUtilImpl.prototype.decode64 = function (input) {
  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }
   } while (i < input.length);

   return output;
}


///////////////////////////////////////////////////////////
// BEGIN EncryptedField.js





var EncryptedField = {
  encryptFields : EncryptedFieldImpl_encryptFields,
  preSubmit : EncryptedFieldImpl_preSubmit,
  preSetValue : EncryptedFieldImpl_preSetValue,
  postSetAvailability : EncryptedFieldImpl_postSetAvailability,
  isDisabled : EncryptedFieldImpl_isDisabled
}



function EncryptedFieldImpl_encryptFields(encryptedValues, menuText) {
  EncryptedField.menuText = menuText;
  for (var id in encryptedValues) {
    if (encryptedValues.hasOwnProperty(id)) {
      EncryptedFieldImpl_encryptInput(id, encryptedValues[id]);
    }
  }
}


function EncryptedFieldImpl_encryptInput (id, encryptedValue) {
  if (!encryptedValue) {
    return; 
  }

  var e = document.getElementById(id);
  var menuId = id + '_MENU';

  
  var encryptionE = DHTML.createElement('span', 'id', id +'_ENCRYPTED', 'class', 'encryptedValue');
  
  e.value = encryptedValue; 
  encryptionE.innerHTML = '<span>' + encryptedValue + '</span><span id="' +menuId+ '_container"></span>' 
  encryptionE.text = encryptionE.childNodes[0]
  encryptionE.menu = encryptionE.childNodes[1]
  e.parentNode.insertBefore(encryptionE, e);
  e.encryptionE = encryptionE;

  
  var url = 'javascript:EncryptedFieldImpl_decryptInput(\''+id+'\');document.getElementById(\''+id+'\').focus()';
  var menuItems = []
  for (var i = 0; i < EncryptedField.menuText.length; i++) {
    menuItems.push({text:EncryptedField.menuText[i], url:url})
  }
  menuItems[0].id = menuId + ':edit'
  Menu.createMenu(Menu.DV_POPUP_MENU, menuId,
      '<img src=\"images/drop_button.gif\" border=\"0\">',
      'MenuImpl_showMenu(\'' + menuId + '\')',
      menuItems, 0, false, true);

  EncryptedField.postSetAvailability(e);
  
  e.disabled = true;
  e.style.display = 'none';
}


function EncryptedFieldImpl_postSetAvailability(e) {
  if (!e.encryptionE) {
    return; 
  }

  if (!e.disabled) { 
    if (e.OLDdisabled == false) {
      return; 
    }
    e.OLDdisabled = false;
    if (e.style.display == 'none') {
      e.disabled = true; 
    }

    
    DHTML.appendToEventHandler(e, 'onpaste', EncryptedFieldImpl_getCallbackForDecryptInput(e));
    DHTML.appendToEventHandler(e, 'onkeypress', EncryptedFieldImpl_getCallbackForDecryptInput(e));
    DHTML.appendToEventHandler(e, 'onblur', EncryptedFieldImpl_getCallbackForEncryptInput(e));

    DHTML.removeStyleSuffix(e.encryptionE, "disabled");
    e.encryptionE.menu.style.display = ''; 

  } else {
    if (e.OLDdisabled == true) {
      return; 
    }
    e.OLDdisabled = true;

    DHTML.rollbackEventHandler(e, 'onblur', EncryptedFieldImpl_getCallbackForEncryptInput(e));
    DHTML.rollbackEventHandler(e, 'onpaste', EncryptedFieldImpl_getCallbackForDecryptInput(e));
    DHTML.rollbackEventHandler(e, 'onkeypress', EncryptedFieldImpl_getCallbackForDecryptInput(e));

    DHTML.addStyleSuffix(e.encryptionE, "disabled");
    e.encryptionE.menu.style.display = 'none'; 
  }
}

function EncryptedFieldImpl_getCallbackForDecryptInput(e) {
  return 'EncryptedFieldImpl_decryptInput(\''+e.id+'\')';
}

function EncryptedFieldImpl_getCallbackForEncryptInput(e) {
  return 'EncryptedFieldImpl_displayEncryptedFieldAs(\''+e.id+'\', true)';
}

function EncryptedFieldImpl_isDisabled(e) {
  return e.encryptionE ? e.OLDdisabled : e.disabled;
}


function EncryptedFieldImpl_decryptInput (e) {
  if (typeof(e)==typeof('')) {
    e = document.getElementById(e);
  }
  var encryptedE = e.encryptionE;
  if (!encryptedE) {
    return;
  }
  Debug.log('EncryptedFieldImpl_decryptInput(): ' + e.id);
  e.encryptionE = null; 
  encryptedE.parentNode.removeChild(encryptedE);

  DHTML.rollbackEventHandler(e, 'onblur', EncryptedFieldImpl_getCallbackForEncryptInput(e));
  DHTML.rollbackEventHandler(e, 'onpaste', EncryptedFieldImpl_getCallbackForDecryptInput(e));
  DHTML.rollbackEventHandler(e, 'onkeypress', EncryptedFieldImpl_getCallbackForDecryptInput(e));

  if (e.style.display == 'none') {
    EncryptedFieldImpl_toggleInputValue(e, false);
    e.style.display = '';
    e.disabled = e.OLDdisabled;
  }
}


function EncryptedFieldImpl_toggleInputValue(e, encryptedMode) {
  if (encryptedMode) {
    e.value = e.encryptionE.text.innerHTML;
  } else {
    
    e.value = '';
    FieldValidation.applyFieldMask(e);
  }
}

function EncryptedFieldImpl_displayEncryptedFieldAs (e, encryptedMode) {
  if (typeof(e)==typeof('')) {
    e = document.getElementById(e);
  }
  var encryptedE = e.encryptionE;
  if (!encryptedE) {
    return; 
  }
  Debug.log('EncryptedFieldImpl_displayEncryptedFieldAs(): ' + e.id + ', ' + encryptedMode);
  encryptedE.style.display = encryptedMode ? '' : 'none';
  e.style.display = encryptedMode ? 'none' : '';
  e.disabled = encryptedMode ? true : e.OLDdisabled;
  EncryptedFieldImpl_toggleInputValue(e, encryptedMode);
  if (!e.disabled) {
    DHTML.tryToFocus(e, true);
  }
}


function EncryptedFieldImpl_preSubmit () {
  var activeE = DHTML.getActiveElement();
  if (activeE) {
    EncryptedFieldImpl_displayEncryptedFieldAs(activeE, true);
  }
}


function EncryptedFieldImpl_preSetValue (e) {
  EncryptedFieldImpl_decryptInput(e);
}

///////////////////////////////////////////////////////////
// BEGIN EventHandlers.js



window.EventHandlers = new EventHandlersImpl();


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


function EventHandlersImpl() {

  
  this.closeOnUnload = false;

  
  this.altKeyDown = false;

  
  this.shiftKeyDown = false;

  
  this.FOOTER_SUFFIX = '_altFooter';
}


EventHandlersImpl.prototype.setCloseOnUnload = function() {
  setCloseOnUnload();
}
function setCloseOnUnload() {
  EventHandlers.closeOnUnload = true;
}


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
  
  
  
  window.onresize = this.resizeHandler;

  
  Menu.createMoreTab();

  
  var initialFocusId = document.mainForm.objFocusId.value;
  
  document.mainForm.objFocusId.value = '';
  DHTML.setInitialFocus(initialFocusId);

  
  if (window.onafterload) {
    window.onafterload();
  }

  
  if (window.exitPoint) {
    setTimeout(window.exitPoint, 100);
  }

  
  if (window.onRefreshPage && window.refreshPageDelay > 0) {
    window.setTimeout(window.onRefreshPage, window.refreshPageDelay * 1000);
  }

  
  if (window.smokeTest) {
    window.setTimeout(window.smokeTest, SmokeTest.delay);
  }

  resizeLeftNavOnload(document.getElementById('leftnav'));

  
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

  
  window.top.document.title = window.document.title;

  
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
  
}


EventHandlersImpl.prototype.partialLoadHandler = function() {
  
  DHTML.refreshButtonAvailability();

  
  DHTML.fixSelectWidth();

  
  Recorder.bindInputFields();
}


EventHandlersImpl.prototype.setWarnUnsavedWorkBeforeUnload = function(msg) {
  this._warnUnsavedWorkBeforeUnload = msg;
}


EventHandlersImpl.prototype.beforeUnloadAppHandler = function() {
  if (EventHandlers._warnUnsavedWorkBeforeUnload) {
    return EventHandlers._warnUnsavedWorkBeforeUnload;
  }
}

  
EventHandlersImpl.prototype.unloadHandler = function() {
  DHTML.closePopups();
  DHTML.cleanUpClosures();
  
  if (window == top.lastFocusWindow) {
    EventHandlers.clearLastFocus();
  }
  if (EventHandlers.closeOnUnload) {
    window.close();
  }
}


EventHandlersImpl.prototype.mouseOverHandler = function() {
  var infoText = '';
  if (self.status != infoText) {
    self.status = infoText;
  }
  return true;
}


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


function EventHandlersImpl_handleMouseRelease() {
  if (EventHandlers.mouseDown) {
    EventHandlers.mouseDown = false;
    if (EventHandlers.mouseReleaseActionStr != null) {
      eval(EventHandlers.mouseReleaseActionStr);
      EventHandlers.mouseReleaseActionStr = null;
    }
  }
}


EventHandlersImpl.prototype.mouseUpHandler = function() {
  DHTML.currentButton = null;
  EventHandlersImpl_handleMouseRelease();
}


EventHandlersImpl.prototype.mouseOutHandler = function() {
  EventHandlersImpl_handleMouseRelease();
}


EventHandlersImpl.prototype.mouseMoveHandler = function() {
  DHTML.recordMousePosition();
  Resize.onMove();
}

EventHandlersImpl.prototype.dblClickHandler = function() {
  Resize.onDblClick();
}


EventHandlersImpl.prototype.clickHandler = function(evt, dontReturnFalseOnShift) {
  Menu.menuClickAway();
  if (evt == null) {
    evt = window.event;
  } else if(evt.target) {
    DHTML.setActiveElementId(evt.target.id); 
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







  
EventHandlersImpl.prototype.focusOutHandler = function() {
  if (window.disableFocusHandler) {
    return;
  }
  if(window.event != null) {
    top.lastFocus = window.event.srcElement;
    top.lastFocusWindow = window;
    if (top.lastFocus != null && top.lastFocus.accessKey) {
      
      EventHandlers.clearLastFocus();
    }
  }
}

EventHandlersImpl.prototype.resizeHandler = function() {
  DHTML.resizeBusyDiv();
}


EventHandlersImpl.prototype.goToLastFocus = function() {
  if (top.lastFocus) {
    
    try { top.lastFocus.focus(); } catch (e) {}
    EventHandlers.clearLastFocus();
  }
}


EventHandlersImpl.prototype.clearLastFocus = function() {
  top.lastFocus = null;
  top.lastFocusWindow = null;
}


EventHandlersImpl.prototype.valueChanged = function(e, element, confirmMsg) {

  var event = e || window.event;
  var srcElement = event ? (event.srcElement || event.target) : undefined;

  
  
  var bDirectChange = (srcElement == element || element.maskFieldChanged);
  if (bDirectChange || window.smokeTest) {

    
    var oldValue = element._lastValue;

    
    
    if (confirmMsg != null && !DHTML.confirm(confirmMsg)) {

      
      if (element.tagName == 'SELECT') {
        element.selectedIndex = element._lastIndex;
      } else {
        DHTML.setValue(element, oldValue, true);
      }

      return false; 
    } else {
      
      if (element.tagName == 'SELECT') {
        element._lastIndex = element.selectedIndex;
      } else {
        element._lastValue = DHTML.getValue(element);
      }
    }

    
    if (window.checkSpellOnChange == true && ArrayUtil.inArray(element.id, spellCheckInfo)) {
      parent.spellcheck_frame.checkSpelling(new Array(element));
    }

    if(!(element.type == 'select-multiple')) {
      DHTML.propagateChangeToDuplicates(element);
    }

  }

  
  Recorder.changed(element);
  Reflection.reflect(element, bDirectChange);
  if (element.maskFieldChanged) {
    element.maskFieldChanged = false;
  }
}


EventHandlersImpl.prototype.onKeyPress = function() {
	  var elem = event.srcElement;
	  var maxLength = elem.getAttribute("maxLength"); //case-insensitive lookup
	  if (maxLength && typeof(maxLength) != "number") { // attribute not supported by browser
	    maxLength = parseInt(maxLength,10)
	    var selection = elem.document.selection.createRange();
	    var ret = (elem.value.length - selection.text.length < maxLength);

	    event.returnValue = ret;

	    return ret;
	  }
	}


	EventHandlersImpl.prototype.onPaste = function() {
		  var elem = event.srcElement;
		  var maxLength = elem.getAttribute("maxLength"); //case-insensitive lookup
		  if (maxLength && typeof(maxLength) != "number") { // attribute not supported by browser
		     maxLength = parseInt(maxLength,10)
		     var selection = elem.document.selection.createRange();
		     var iInsertLength = maxLength - elem.value.length + selection.text.length;
		     var sData = window.clipboardData.getData("Text").substr(0,iInsertLength);
		     selection.text = sData
		     event.returnValue = false;
		     return false;
		  }
		  event.returnValue = true;
		  return true;
		}


EventHandlersImpl.prototype.onFocus = function(e) {
  e = e || window.event;
  var elem = e.srcElement || e.target;
  if(!elem.tagName) {
    return;
  }

  DHTML.setActiveElementId(elem.id); 
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


EventHandlersImpl.prototype.onBlur = function(e) {
  e = e || window.event;
  var elem = e.srcElement || e.target;
  DHTML.hideHelpText(elem);
  document.mainForm.objFocusId.value = '';
}


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


EventHandlersImpl.prototype.toggleInputGroup = function(checkbox, groupId) {
  var groupElem = document.getElementById(groupId);
  var numChildrenInGroup = groupElem.childNodes.length;
  var infoOnServer = (numChildrenInGroup == 1) 
          && (groupElem.childNodes[0].childNodes.length < 5 || groupElem.childNodes[0].childNodes[4].childNodes.length == 0);
  var cbValue = DHTML.getValue(checkbox);

  if (infoOnServer) {
    var params = {};
    params[checkbox.id] = cbValue;
    AJAX.initRequest(groupId, params, function(){eval(AJAX.returnValue)}, true);
  } else {
    var bShowContent = ("true"==cbValue);
    
    for (var i = 1; i < numChildrenInGroup; i++) {
      try {
        groupElem.childNodes[i].style.display = bShowContent ? '' : 'none';
      } catch (e) {
        
      }
    }
    
    if (bShowContent) {
      DHTML.removeStyleSuffix(groupElem, "unchecked");
    } else {
      DHTML.addStyleSuffix(groupElem, "unchecked");
    }
  }
}
///////////////////////////////////////////////////////////
// BEGIN Events.js





window.Events = new EventsImpl();


var EVENT_DELAY_MS = 3000;


function EventsImpl() {

  this.eventInvoked = false;
  this.eventQueue = [];
  this.eventQueue_low = [];

}




EventsImpl.prototype.preSubmit = function() {
  FieldValidation.unmaskInputFields();
  EncryptedField.preSubmit();
  DHTML.storeScrollPositions();
}


EventsImpl.prototype.invokeEvent = function(sourceId, hourglass, param) {
  Debug.log('Invoking event: ' + sourceId);
  if (this.eventInvoked == false 
          && !EventHandlers.isAltShiftClick) {

    if (document.mainForm.reqMon) { 
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
    
    this.preSubmit();

    
    Debug.log('Submit form to server');
    document.mainForm.submit();
  } else {
    Debug.log('<font color=orange>Event disallowed: ' + sourceId + '</font>');
  }
}




EventsImpl.prototype.refresh = function(eId) {
  this.invokeEvent('_refresh_', true, eId);
}


EventsImpl.prototype.isNavigationAllowed = function() {
  return this.eventInvoked == false && !this.hasEventInQueue();
}


EventsImpl.prototype.disableNavigation = function() {
  Debug.log("<b>Disable navigation</b>");
  this.eventInvoked = true;
}


EventsImpl.prototype.enableNavigation = function() {
  Debug.log("<b>Enable navigation</b>");
  this.eventInvoked = false;
}


EventsImpl.prototype.invokeSpecialEventInHiddenFrame = function(sourceId, param) {
  var oldInFrameValue = document.mainForm.inFrame.value;
  document.mainForm.target = "utility_frame";
  document.mainForm.inFrame.value = "special";
  this.invokeEvent(sourceId, false, param);
  document.mainForm.target = "";
  document.mainForm.inFrame.value = oldInFrameValue;
}


EventsImpl.prototype.invokeSpecialEventInNewWindow = function(sourceId, param) {
  var oldInFrameValue = document.mainForm.inFrame.value;
  document.mainForm.target = "_blank";
  document.mainForm.inFrame.value = "special";
  this.invokeEvent(sourceId, true, param);
  document.mainForm.target = "";
  document.mainForm.inFrame.value = oldInFrameValue;
}


EventsImpl.prototype.setAndRefresh = function(fieldId, fieldValue) {
  document.getElementById(fieldId).value = fieldValue;
  
  Recorder.setAndRefresh(fieldId, fieldValue);
  this.refresh();
}




EventsImpl.prototype.getResourceURL = function(relativeURI) {
  if (relativeURI.substring(0, 1) == "/") {
    return relativeURI;
  } else {
    var base = this.getBase() + "";
    base = base.substr(0, base.lastIndexOf('/') + 1);
    return base + relativeURI;
  }
}


EventsImpl.prototype.getBase = function() {
  var baseTags = document.getElementsByTagName("base");
  if (baseTags && baseTags.length == 1 && baseTags[0].href) {
    return baseTags[0].href;
  }
  var basePath = window.location.protocol + "//" + window.location.host + window.location.pathname;
  basePath = basePath.substr(0, basePath.lastIndexOf('/') + 1);
  return basePath + 'resources/gw';
}


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




EventsImpl.prototype.checkBackButton = function() {
  if (document.mainForm.inFrame.value != 'mainframe') {
    return;
  }
  var rc = DHTML.getCookie('rcounter');
  if (rc != null && Math.floor(rc) > Math.floor(document.mainForm.rcounter.value)) {
    this.invokeEvent('_back_');
  }
}


EventsImpl.prototype.queueUniqueItem = function(item, handler) {
  
  if (!handler._itemArray) {
    handler._itemArray = [];
    var callback = function() { handler(handler._itemArray); handler._itemArray = undefined; };
    callback._low = true;
    Events.queueEvent(callback, true);
  }

  if (!ArrayUtil.inArray(item, handler._itemArray)) { 
    ArrayUtil.appendElement(handler._itemArray, item);
  }
}

///////////////////////////////////////////////////////////
// BEGIN FieldValidation.js

var FieldValidation = {

  

  
  validators : new Array(),
  
  defaultPlaceHolderChar : null,

  
  
  setMaskPlaceHolderChar : function(c) {this.defaultPlaceHolderChar = c},
  unmaskInputFields : FieldValidationImpl_unmaskInputFields,
  applyFieldMask: FieldValidationImpl_applyFieldMask,
  getUnmaskedInputValue: FieldValidationImpl_getUnmaskedInputValue,
  getValidatorForInput: FieldValidationImpl_getValidatorForInput,
  maskValueForInput : FieldValidationImpl_maskValueForInput,
  setInputFieldValidator : FieldValidationImpl_setInputFieldValidator,
  setDateFieldValidator : FieldValidationImpl_setDateFieldValidator,
  unmaskFieldValue : FieldValidationImpl_unmaskFieldValue
}



function FieldValidationImpl_unmaskInputFields() {
  for(var i = 0; i < FieldValidation.validators.length; i++) {
    FieldValidationImpl_unmaskField(FieldValidation.validators[i]);
  }
}


function FieldValidationImpl_unmaskField(validator) {
  
  if (document.getElementById(validator.id) == validator.input) {
    validator.input.value = FieldValidation.unmaskFieldValue(validator.input.value, validator.mask, validator.input.placeholderChar);
  }
}


function FieldValidationImpl_applyFieldMask(input) {
  var validator = FieldValidation.getValidatorForInput(input);
  if (validator != null) {
    input.value = FieldValidationImpl_maskFieldValue(input.value, validator.mask, input.placeholderChar);
  }
}


function FieldValidationImpl_getUnmaskedInputValue(input) {
  var validator = FieldValidation.getValidatorForInput(input);
  return validator == null ? input.value : FieldValidation.unmaskFieldValue(input.value, validator.mask, input.placeholderChar);
}


function FieldValidationImpl_getValidatorForInput(input) {
  for(var i = 0; i < FieldValidation.validators.length; i++) {
    if(FieldValidation.validators[i].input == input) {
      return FieldValidation.validators[i];
    }
  }
  return null;
}


function FieldValidationImpl_maskValueForInput(value, input) {
  var validator = FieldValidation.getValidatorForInput(input);
  if(validator != null) {
    return FieldValidationImpl_maskFieldValue(value, validator.mask, input.placeholderChar);
  } else {
    return value;
  }
}

var gaiIE10Timer = new Object();

function FixIE10_AutoClear_maskInput_removeInClaimCenter8(e) {
	var evt = e || window.event;
	var input = evt.srcElement;
	if (input == null) return;
	if (input.gaiIE10Timer != null) {
		clearTimeout(input.gaiIE10Timer);
	}
	gaiIE10Timer[input] = setTimeout(function () {FixIE10_AutoClear_maskInput_helper_removeInClaimCenter8(input)}, 50);
}

function FixIE10_AutoClear_maskInput_helper_removeInClaimCenter8(input) {
	gaiIE10Timer[input] = null;
	if (input.value.length != 0) return;
	var validator = FieldValidation.getValidatorForInput(input);
	if (validator == null) return;
	input.value = FieldValidationImpl_maskFieldValue(input.value, validator.mask, input.placeholderChar)
}

function FieldValidationImpl_setInputFieldValidator(id, mask, placeholderChar) {
  var input = DHTML.getElementById(id, true);
  if(input) {
    var validator = FieldValidation.getValidatorForInput(input)
    if(mask.length == 0 && validator == null) {
      return; 
    }

    if (!validator) {
      
      validator = new Object();
      FieldValidation.validators[FieldValidation.validators.length] = validator;

      validator.id = input.id;
      validator.input = input;

      

      DHTML.appendToEventHandler(input, "onkeydown", FieldValidationImpl_maskInput);
      DHTML.insertToEventHandler(input, "onkeypress", FieldValidationImpl_maskInput);

      DHTML.appendToEventHandler(input, "oncut", FieldValidationImpl_maskInput);
      DHTML.appendToEventHandler(input, "onpaste", FieldValidationImpl_maskInput);

      DHTML.appendToEventHandler(input, "onblur", FieldValidationImpl_fireOnchangeIfNeeded);
      
      DHTML.appendToEventHandler(input, "onmouseup", FixIE10_AutoClear_maskInput_removeInClaimCenter8);

    } else if (validator.mask) {
      
      input.value = FieldValidation.unmaskFieldValue(input.value, validator.mask, input.placeholderChar);
      if (input.oldSize) {
        input.size = input.oldSize;
        input.maxLength = input.oldMaxLength;
        input.style.fontFamily = input.oldFontFamily;
      }
    }

    
    if (!input.placeholderChar || placeholderChar) {
      input.placeholderChar = placeholderChar ? placeholderChar : FieldValidation.defaultPlaceHolderChar;
    }
    validator.mask = mask.replace(/#/g, input.placeholderChar);

    var fieldSize = validator.mask.length;
    if (fieldSize > 0) {
      if (!input.oldSize) {
        input.oldSize = input.size;
        input.oldMaxLength = input.maxLength;
        input.oldFontFamily = (input.currentStyle || input.style).fontFamily;
      }
      input.size = input.maxLength = fieldSize;
      if (input.isJpImperial) {
        
        input.size += (input.isDateTime == 'true' ? 3 : 2);
      }
      input.style.fontFamily = 'Courier New,Courier,monotype';

      input.value = FieldValidationImpl_maskFieldValue(input.value, validator.mask, input.placeholderChar);
    }
  }
}


function FieldValidationImpl_setDateFieldValidator(field) {
  if (field.isJpImperial && !DateTime.jpCalendarInfo.useInputMask) {
    return;
  }
  if (field.id == null || field.id.length == 0) {
    field.id = Math.random();
  }
  var mask;
  var bHasDate = false;
  var bHasTime = false;
  if (field.isDateTime == 'true') {
    bHasDate = bHasTime = true;
  } else if (field.isTimeOnly == 'true') {
    bHasTime = true;
  } else {
    bHasDate = true;
  }
  mask = DateTime.getDateTimeFormat(bHasDate, bHasTime, field.isJpImperial);

  var wildcard = '.';
  if(mask.indexOf('.') != -1) {
    wildcard = '-';
  }
  mask = mask.replace(/[A-Z,a-z]/g, wildcard);
  FieldValidation.setInputFieldValidator(field.id, mask, wildcard);
}

function FieldValidationImpl_fireOnchangeIfNeeded() {
  var input =window.event.srcElement;
  if (input.maskFieldChanged) {
    input.onchange();
  }
}

function FieldValidationImpl_maskInput() {
  var input = window.event.srcElement;
  var mask = '';
  var validator = FieldValidation.getValidatorForInput(input);
  if(validator == null) {
    return;
  }
  mask = validator.mask;
  if(mask.length == 0) {
    return;
  }
  var inputRange = input.createTextRange();
  var selectRange;
  try {
    selectRange = document.selection.createRange();
  } catch (caratStateUnknown) {
    return;     
  }

  if(!inputRange.inRange(selectRange)) {
    return; 
  }
  var selectLength = selectRange.text.length;
  var selectIndex = 0;
  while(inputRange.compareEndPoints('StartToStart', selectRange)) {
    selectIndex++;
    selectRange.moveStart('character', -1);
  }
  if(window.event.type == 'keypress' || window.event.type == 'keydown') {
    var keyCode = window.event.keyCode;
    if(window.event.altKey || window.event.ctrlKey) {
      return;
    }
    if(window.event.type == 'keydown'){
      if(keyCode == 8 || keyCode == 46) { 
        if(keyCode == 46 && selectLength == 0) {
          selectIndex++;
          while(selectIndex < input.value.length + 1 && mask.charAt(selectIndex - 1) != input.placeholderChar) {
            selectIndex++;
          }
        }
        FieldValidationImpl_maskRemoveChars(input, mask, selectIndex, selectLength);
        event.returnValue = false;
        event.cancelBubble = true;
      }
      return;
    } else { 
      FieldValidationImpl_maskAddChars(input, mask, selectIndex, selectLength, String.fromCharCode(keyCode));
      event.returnValue = false;
      event.cancelBubble = true;
    }
  } else if(window.event.type == 'cut') {
    window.clipboardData.setData("Text", (input.value + "").substr(selectIndex, selectLength));
    FieldValidationImpl_maskRemoveChars(input, mask, selectIndex, selectLength);
  } else if(window.event.type == 'paste') {
    var oldValue = input.value;
    var r = document.selection.createRange();
    var valueAfterCaret = oldValue.substr(selectIndex);
    var subMask = mask.substr(selectIndex);
    var numSelectedText = r.text.length;
    if (numSelectedText > 0) { 
      valueAfterCaret = FieldValidationImpl_removeUnmaksedChars(valueAfterCaret,
              subMask, input.placeholderChar, numSelectedText);
    }

    var newChars = window.clipboardData.getData("Text").replace(/[\r|\n|\r\n].*/g, ""); 
    var numNewChars = newChars.length;
    if (numNewChars > 0) { 
      var result = FieldValidationImpl_insertUnmaskedChars(
              valueAfterCaret, subMask, input.placeholderChar, newChars);
      valueAfterCaret = result.newValue;
      numNewChars += result.caretDelta;
    }

    r.moveEnd('character', 1);
    if (numSelectedText == r.text.length) {
      r.text = valueAfterCaret;
    } else {
      r.moveEnd('character', -1);
      
      var maxLength = input.maxLength;
      input.maxLength = input.oldMaxLength;

      
      
      
      
      r.text = valueAfterCaret.substr(0, numNewChars); 
      if (input.value.length > maxLength) {
        var remaining = valueAfterCaret.substr(numNewChars);
        
        r.moveStart('character', 1);
        r.moveEnd('character', oldValue.length - selectIndex); 
        r.text = remaining;
        
        r.moveEnd('character', -remaining.length)
        r.moveStart('character', -1)
        r.text = ''
      }

      
      FieldValidationImpl_moveCarat(input, selectIndex + numNewChars);

      input.maxLength = maxLength;
      input.maskFieldChanged = true;
    }
  }
  window.event.returnValue = false;
}


function FieldValidationImpl_maskAddChars(input, mask, selectIndex, selectLength, chars) {
  input.maskFieldChanged = true;
  if(selectLength > 0) {
    FieldValidationImpl_maskRemoveChars(input, mask, selectIndex, selectLength);
  }
  var availableSpace = 0;
  for(var i = selectIndex; i < input.value.length; i++) {
    if(mask.charAt(i) == input.placeholderChar && input.value.charAt(i) == input.placeholderChar) {
      availableSpace++;
    }
  }
  for(var i = 0; i < chars.length; i++) {
    if(availableSpace > 0) {
      while(selectIndex < mask.length && mask.charAt(selectIndex) != input.placeholderChar) {
        selectIndex++;
      }
      if(selectIndex >= mask.length) {
        FieldValidationImpl_moveCarat(input, mask.length);
        return;
      }
      var nextChar = chars.charAt(i);
      var index = selectIndex;
      while(index < input.value.length) {
        if(mask.charAt(index) == input.placeholderChar) {
          var charBuffer = input.value.charAt(index);
          FieldValidationImpl_setInputChar(input, index, nextChar);
          if(charBuffer == input.placeholderChar) {
            break;
          }
          nextChar = charBuffer;
        }
        index++;
      }







      selectIndex++;
      availableSpace--;
    }
  }
  FieldValidationImpl_moveCarat(input, selectIndex);
}


function FieldValidationImpl_insertUnmaskedChars(value, mask, placeholderChar, chars) {
  var availableSpace = 0;
  for(var i = 0; i < value.length; i++) {
    if(mask.charAt(i) == placeholderChar && value.charAt(i) == placeholderChar) {
      availableSpace++;
    }
  }
  var selectIndex = 0;
  for(var i = 0; availableSpace > 0 && i < chars.length; i++) {
    while(selectIndex < mask.length && mask.charAt(selectIndex) != placeholderChar) {
      
      if (mask.charAt(selectIndex) == chars.charAt(i)) {
        i++;
        if (i >= chars.length) {
          break;
        }
      }
      selectIndex++;
    }
    if(selectIndex >= mask.length || i >= chars.length) {
      break;
    }

    var nextChar = chars.charAt(i);
    for(var index = selectIndex; index < value.length; index++) {
      if(mask.charAt(index) == placeholderChar) {
        var charBuffer = value.charAt(index);
        value = value.substr(0, index) + nextChar + value.substr(index+1);
        if(charBuffer == placeholderChar) {
          break;
        }
        nextChar = charBuffer;
      }
    }
    selectIndex++;
    availableSpace--;
  }
  return {'newValue':value, 'caretDelta':selectIndex-chars.length}
}


function FieldValidationImpl_removeUnmaksedChars(value, mask, placeholderChar, numCharsToRemove) {
  for(var i = 0; i < numCharsToRemove; i++) {
    if(mask.charAt(i) == placeholderChar) {
      var index = 0;
      while(index < value.length) {
        if(mask.charAt(index) == placeholderChar) {
          var nextChar = index + 1;
          while(nextChar < value.length && mask.charAt(nextChar) != placeholderChar) {
            nextChar++;
          }
          value = value.substr(0, index) + (nextChar < value.length ? value.charAt(nextChar) : placeholderChar) + value.substr(index+1)
        }
        index++;
      }
    }
  }
  return value;
}


function FieldValidationImpl_maskRemoveChars(input, mask, selectIndex, selectLength) {
  input.maskFieldChanged = true;
  if(selectLength == 0) {
    selectIndex--;
    while(selectIndex >= 0 && mask.charAt(selectIndex) != input.placeholderChar) {
      selectIndex--;
    }
    selectLength++;
    if(selectIndex < 0) { 
      return;
    }
  }
  for(var i = 0; i < selectLength; i++) {

    if(mask.charAt(selectIndex + i) == input.placeholderChar) {
      var index = selectIndex;
      while(index < input.value.length) {
        if(mask.charAt(index) == input.placeholderChar) {
          var nextChar = index + 1;
          while(nextChar < input.value.length && mask.charAt(nextChar) != input.placeholderChar) {
            nextChar++;
          }
          if(nextChar < input.value.length) {
            FieldValidationImpl_setInputChar(input, index, input.value.charAt(nextChar));
          } else {
            FieldValidationImpl_setInputChar(input, index, input.placeholderChar);
          }
        }
        index++;
      }
    }
  }



  FieldValidationImpl_moveCarat(input, selectIndex);
}


function FieldValidationImpl_setInputChar(input, index, nextChar) {
  input.value = input.value.substring(0, index) +
                nextChar +
                input.value.substring(index + 1, input.value.length);
}


function FieldValidationImpl_moveCarat(input, selectIndex) {
  var inputRange = input.createTextRange();
  inputRange.collapse();
  inputRange.move('character', selectIndex);
  inputRange.select();
}


function FieldValidationImpl_maskFieldValue(value, mask, placeholderChar) {
  if(mask.length == 0) {
    return value;
  }
  var result = '';
  value += '';
  for(var i = 0; i < mask.length; i++) {
    var maskChar = mask.charAt(i);
    if(maskChar == placeholderChar && i < value.length) {
      result += value.charAt(i);
    } else {
      result += maskChar;
    }
  }
  return result;
}


function FieldValidationImpl_unmaskFieldValue(value, mask, placeholderChar) {
  if(mask.length == 0) {
    return value;
  }
  if(mask == value) {
    return '';
  }
  value = value.substr(0, mask.length);
  if(mask.charAt(mask.length - 1) == placeholderChar) { 
    while(value.length > 0 && value.charAt(value.length - 1) == mask.charAt(value.length - 1)) {
      value = value.substr(0, value.length - 1);
    }
  }
  return value;
}

///////////////////////////////////////////////////////////
// BEGIN Inspector.js



function inspector() {
  inspectorWindow = showFrame('jsinspector');
}


function inspectValues(toInspect) {
  var result, formattedResult = '';
  try {
    result = eval(toInspect);
  } catch (e) {
    result = new Array();
    result[0] = 'Error encountered!';
    result[1] = e.description;
  }

  var resultType = typeof result;

  if(resultType == 'string' || resultType == 'number' || resultType == 'boolean' ||
     resultType == 'undefined' || resultType == 'function' || result == null) {
    formattedResult = inspectValue(result, resultType);
  } else if(result instanceof Array) {
    formattedResult = 'Array(' + result.length + '): {' + inspectArray(toInspect, result) + '<br>}';
  } else {
    formattedResult = 'Object {' + inspectObject(toInspect, result) + '<br>}';
  }

  return formattedResult;
}


function inspectArray(toInspect, result) {
  var formattedResult = '';
  for(var i = 0; i < result.length; i++) {
    var subItem = toInspect + '[' + i + ']';
    formattedResult += '<br>&nbsp; &nbsp; <b>' + subItem + '</b> = ' + inspectValue(result[i], typeof result[i], subItem);
  }
  return formattedResult;
}


function inspectObject(toInspect, result) {
  var formattedResult = '';
  var keys = new Array();
  for(var a in result) {
    if(a != 'innerHTML' && a != 'outerHTML' && a != 'fileUpdatedDate') {
      keys[keys.length] = a + "";
    }
  }
  keys.sort();
  for(var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var subItem = toInspect +  "[" + key + "]";
    for(var j = 0; j < key.length; j++) {
      if("0123456789".indexOf(key.charAt[j]) == -1) {
        subItem = toInspect +  '.' + key;
      }
    }
    formattedResult += '<br>&nbsp; &nbsp; <b>' + subItem + '</b> = ';
    try {
      formattedResult += inspectValue(result[key], typeof result[key], subItem);
    } catch (err) {
      formattedResult += '<i>ERROR</i>';
    }
  }
  return formattedResult;
}


function inspectValue(value, valueType, valueLink) {
  if(valueType == 'string') {
    return "'" + value + "'";
  } else if(valueType == 'number' || valueType == 'boolean') {
    return value;
  } else if(valueType == 'undefined') {
    return '<i>undefined</i>';
  } else if(valueType == 'function') {
    return '<i>function</i>';
  } else if(value == null) {
    return '<i>null</i>';
  } else {
    return '<a href="javascript:inspect(&quot;' + valueLink + '&quot;)">' +
          ((value instanceof Array) ? 'Array[' + value.length + ']' : 'Object') + '</a>';
  }
}


function locationInfo() {
  showFrame('locinfo');
}


function widgetPageInfo() {
  showFrame('widget');
}

function showFrame(frameId) {
  return window.open(window.location.pathname + '?inFrame=' + frameId + '&r=' + Math.floor(Math.random() * 10000),
              frameId,
              'scrollbars=yes,width=600,height=500,dependent=yes,resizable=yes');
}

///////////////////////////////////////////////////////////
// BEGIN json.js






if (!Object.prototype.toJSONString) {

    Array.prototype.toJSONString = function (w) {
        var a = [],     
            i,          
            l = this.length,
            v;          



        for (i = 0; i < l; i += 1) {
            v = this[i];
            switch (typeof v) {
            case 'object':





                if (v) {
                    if (typeof v.toJSONString === 'function') {
                        a.push(v.toJSONString(w));
                    }
                } else {
                    a.push('null');
                }
                break;

            case 'string':
            case 'number':
            case 'boolean':
                a.push(v.toJSONString());



            }
        }



        return '[' + a.join(',') + ']';
    };


    Boolean.prototype.toJSONString = function () {
        return String(this);
    };


    Date.prototype.toJSONString = function () {



        function f(n) {



            return n < 10 ? '0' + n : n;
        }

        return '"' + this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1)  + '-' +
                f(this.getUTCDate())       + 'T' +
                f(this.getUTCHours())      + ':' +
                f(this.getUTCMinutes())    + ':' +
                f(this.getUTCSeconds())    + 'Z"';
    };


    Number.prototype.toJSONString = function () {



        return isFinite(this) ? String(this) : 'null';
    };


    Object.prototype.toJSONString = function (w) {
        var a = [],     
            k,          
            i,          
            v;          




        if (w) {
            for (i = 0; i < w.length; i += 1) {
                k = w[i];
                if (typeof k === 'string') {
                    v = this[k];
                    switch (typeof v) {
                    case 'object':





                        if (v) {
                            if (typeof v.toJSONString === 'function') {
                                a.push(k.toJSONString() + ':' +
                                       v.toJSONString(w));
                            }
                        } else {
                            a.push(k.toJSONString() + ':null');
                        }
                        break;

                    case 'string':
                    case 'number':
                    case 'boolean':
                        a.push(k.toJSONString() + ':' + v.toJSONString());



                    }
                }
            }
        } else {




            for (k in this) {
                if (typeof k === 'string' &&
                        Object.prototype.hasOwnProperty.apply(this, [k])) {
                    v = this[k];
                    switch (typeof v) {
                    case 'object':





                        if (v) {
                            if (typeof v.toJSONString === 'function') {
                                a.push(k.toJSONString() + ':' +
                                       v.toJSONString());
                            }
                        } else {
                            a.push(k.toJSONString() + ':null');
                        }
                        break;

                    case 'string':
                    case 'number':
                    case 'boolean':
                        a.push(k.toJSONString() + ':' + v.toJSONString());



                    }
                }
            }
        }



        return '{' + a.join(',') + '}';
    };


    (function (s) {






        var m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };


        s.parseJSON = function (filter) {
            var j;

            function walk(k, v) {
                var i;
                if (v && typeof v === 'object') {
                    for (i in v) {
                        if (Object.prototype.hasOwnProperty.apply(v, [i])) {
                            v[i] = walk(i, v[i]);
                        }
                    }
                }
                return filter(k, v);
            }














            if (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(this.
                    replace(/\\./g, '@').
                    replace(/"[^"\\\n\r]*"/g, ''))) {






                j = eval('(' + this + ')');




                return typeof filter === 'function' ? walk('', j) : j;
            }



            throw new SyntaxError('parseJSON');
        };


        s.toJSONString = function () {






            if (/["\\\x00-\x1f]/.test(this)) {
                return '"' + this.replace(/[\x00-\x1f\\"]/g, function (a) {
                    var c = m[a];
                    if (c) {
                        return c;
                    }
                    c = a.charCodeAt();
                    return '\\u00' +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }) + '"';
            }
            return '"' + this + '"';
        };
    })(String.prototype);
}
///////////////////////////////////////////////////////////
// BEGIN KeyboardShortcuts.js





var keyShortcuts = {'':{}};
var _disabledShortcuts = {};


function registerStandardKeyShortcuts() {
  registerKeyShortcut('Enter', 'handleEnterKey(event)');
  registerKeyShortcut('Esc', 'Menu.menuEscapeKey(true, event)');
  registerKeyShortcut('Del', 'Menu.menuEscapeKey(false, event)');
  registerKeyShortcut('Up', 'Menu.menuArrowKey("Up", event)');
  registerKeyShortcut('Down', 'Menu.menuArrowKey("Down", event)');
  registerKeyShortcut('Left', 'Menu.menuArrowKey("Left", event)');
  registerKeyShortcut('Right', 'Menu.menuArrowKey("Right", event)');

  registerKeyShortcut('ShiftF', 'Events.refresh()');

  
  registerKeyShortcut('ShiftN', 'ToggleNavDisplay()');
  registerKeyShortcut('ShiftAltColon', 'ToggleNavDisplay()');

  registerKeyShortcut('ShiftQ', 'TogglePerfActionRecording()');
  registerKeyShortcut('ShiftAltUp', 'keyListViewNav("Up")');
  registerKeyShortcut('ShiftAltDown', 'keyListViewNav("Down")');
  registerKeyShortcut('ShiftAltLeft', 'keyListViewNav("Left")');
  registerKeyShortcut('ShiftAltRight', 'keyListViewNav("Right")');
}




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


function findCurrentKeyboardScope() {
  return KeyboardShortcutsImpl_findEnclosingScopeElem(DHTML.getActiveElement());
}


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


function getKeyShortcutHandler(key, elem) {
  var scopeId = KeyboardShortcutImpl_getShortcutScopeId(key, elem);
  return (scopeId == null || _disabledShortcuts[scopeId+'|'+key]) ? null :
         keyShortcuts[scopeId][key];
}


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

  
  for (var scope = KeyboardShortcutsImpl_findEnclosingScopeElem(elem);
       scope != null;
       scope = KeyboardShortcutsImpl_findEnclosingScopeElem(scope.parentNode)) {
    if (keyShortcuts[scope.id][key]) {
      scopeId = scope.id;
      break;
    }
  }

  if (scopeId == null) { 
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


function registerMenuShortcut(key, id) {
  registerKeyShortcut(key, 'Menu.keyboardEnterMenu("' + id + '")', null, true);
}




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


function handleEnterKey(event) {

  
  var activeElement = DHTML.getActiveElement();

  if (activeElement) {
    var tagName = activeElement.tagName;
    var tagType = activeElement.type;

    if (tagName == 'TEXTAREA' || tagName == 'BUTTON' || tagName == 'A' ||  tagType == 'submit'
            || (activeElement.onkeypress && (!activeElement.placeholderChar || activeElement.afterHandleMask))) {
      return; 
    }
    if (tagName == 'SELECT') {
      
      
      if (listViewNavOnEnter(activeElement)) {
        event.returnValue = false;
        event.cancelBubble = true;
      }
      return;
    }

    if (tagName == 'INPUT' && tagType == 'file') { 
      activeElement.click();
      event.returnValue = false;
      event.cancelBubble = true;
      return;
    }

    
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


  
  if (Menu.menuEnterKey(event)) {
    return;
  }

  
  if (isCalendarOpen()) { 
    clearCalendar();
    event.returnValue = false;
    event.cancelBubble = true;
    return;
  }

  
  var defaultButton = getDefaultButton();
  if (defaultButton != null) {
    defaultButton.onclick();
    event.returnValue = false;
    event.cancelBubble = true;
  }
}


function getDefaultButton() {
  
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


function TogglePerfActionRecording() {
  var perfRecording = DHTML.getCookie('PerfRecording');
  if (perfRecording == 1) {
    document.cookie = 'PerfRecording=0';
  } else {
    document.cookie = 'PerfRecording=1';
  }
}


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
  
  
  if (evt.keyCode == 9 && !isCalendarOpen()) {
    Menu.menuEscapeKey();
    return;
  }

  
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


function disableAltKeys() {
  if (window.parent.name == 'bottom_frame') {
    return;
    
  }
  var keys = "abcdefghijklmnopqrstuvwxyz01234567890";
  DHTML.write('<span id="accesskeys" style="position:absolute">');
  for (var i = 0; i < keys.length; i++) {
    var key = keys.charAt(i);
    DHTML.write('<a accesskey="' + key + '" onfocus="EventHandlers.goToLastFocus()" href="javascript:DHTML.setInitialFocus()"></a>');
  }
  DHTML.write('</span>');
}


function findFocusable(elem, bExcludeEntryCheckbox) {
  if (elem == null) {
    return null;
  }
  
  var tagName = elem.tagName;
  if ((tagName == 'A' || tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'BUTTON' || tagName == 'TEXTAREA' || (tagName == 'SPAN' && elem.onclick))
          && DHTML.fieldCanAcceptFocus(elem) && (!bExcludeEntryCheckbox || elem.type != 'checkbox' || !elem.groupId)) {
    return elem;
  }

  
  for (var i = 0; i < elem.childNodes.length; i++) {
    var focusable = findFocusable(elem.childNodes[i], bExcludeEntryCheckbox);
    if (focusable != null) {
      return focusable;
    }
  }
  
  return null;
}



function listViewNavOnEnter(elem) {
  var table = findParentElem(elem, 'TABLE');
  if (table) {
    var bQuickAdd = table.quickAddOnEnter
    var bCellNav = bQuickAdd || table.cellNavOnEnter
    var bRowNav = bCellNav || table.rowNavOnEnter

    
    if (bCellNav) {
      var focusCell = findParentElem(document.activeElement, 'TD');
      if (focusCell && !focusCell.endOfCellNav &&
          keyListViewNavRight(focusCell.parentNode, findNodeIndex(focusCell))) {
        return true;
      }
    }

    
    if (bRowNav && keyListViewNavBeginNextRow(elem)) {
      return true;
    }

    
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
    if (!success) { 
      keyListViewSeek(focusCell, delta, true);
    }
  }
}


function keyListViewNavBeginNextRow(elem) {
  var nextRow = keyListViewFindRow(1, elem);
  if (nextRow) {
    var focusable = findFocusable(nextRow, true);
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
  if (recurse) { 
    DHTML.setInitialFocus();
    keyListViewSeek(focusCell, delta, false);
  }
}


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


///////////////////////////////////////////////////////////
// BEGIN Menu.js



window.Menu = new MenuImpl();

function MenuImpl() {
  this.TAB_MENU_ON = 0;
  this.TAB_MENU_OFF = 1;
  this.ACTION_NAV_MENU = 2;
  this.DV_POPUP_MENU = 3;
  this.MENU_BUTTON = 4;
  this.TABBAR_LINK = 5;
  this.MORE_TAB = 6;

  this.MENU_STYLES = [
    {"className": "tab_on", "isTopMenu": true,  "align": "v", "xOffset": 0, "yOffset": 4, "outerArrow" : true},
    {"className": "tab_off", "isTopMenu": true,  "align": "v", "xOffset": 0, "yOffset": 4, "outerArrow" : true},
    {"className": "menubutton", "isTopMenu": false,  "align": "h", "xOffset": 0, "yOffset": 0, "outerArrow" : true},
    {"className": "dv", "isTopMenu": false,  "align": "v", "xOffset": 4, "yOffset": 0, "outerArrow" : false},
    {"className": "menubutton", "isTopMenu": false,  "align": "v", "xOffset": 0, "yOffset": 0, "outerArrow" : true},
    {"className": "tabbarlink", "isTopMenu": false,  "align": "v", "xOffset": 0, "yOffset": 0, "outerArrow" : true},
    {"className": "tab_off", "isTopMenu": true,  "align": "v", "xOffset": 0, "yOffset": 4, "outerArrow" : true},
  ];

  
  this.openMenus = new Array();

  this.menus = new Object();
  this.topLevelMenus = new Array();
  this.tabMenus = new Array();
  this.moreTabMenus = [];
}

MenuImpl.prototype.createMenu = MenuImpl_createMenu;
MenuImpl.prototype.keyboardEnterMenu = MenuImpl_keyboardEnterMenu;
MenuImpl.prototype.menuArrowKey = MenuImpl_menuArrowKey;
MenuImpl.prototype.menuEscapeKey = MenuImpl_menuEscapeKey;
MenuImpl.prototype.menuEnterKey = MenuImpl_menuEnterKey;
MenuImpl.prototype.menuClickAway = MenuImpl_menuClickAway;
MenuImpl.prototype.menuShortcutKey = MenuImpl_menuShortcutKey;
MenuImpl.prototype.createMoreTab = MenuImpl_createMoreTab;


function MenuImpl_removeMenus(menuId) {
  for (var i=0; i<Menu.topLevelMenus.length; i++) {
    var menu = Menu.topLevelMenus[i];
    if (menu.id == menuId) {
      ArrayUtil.removeElement(Menu.topLevelMenus, i)
      MenuImpl_removeMenu(menu);
      break;
    }
  }
}

function MenuImpl_removeMenu(menu) {
  Menu.menus[menu.id] = undefined;
  menu.node.parentNode.removeChild(menu.node);
  if (menu.items) {
    for (var i=0; i<menu.items.length; i++) {
      MenuImpl_removeMenu(menu.items[i]);
    }
  }
}


function MenuImpl_createMenu(styleId, menuId, menuText, menuURL, subMenus, numEntriesPerColumn, flatten, disabled) {
  
  MenuImpl_removeMenus(menuId);

  var menu = new Object();
  menu.id = menuId;
  menu.style = this.MENU_STYLES[styleId];
  menu.disabled = disabled;
  menu.shortcuts = new Array();
  menu.shortcutItems = new Array();

  this.menus[menuId] = menu;
  this.topLevelMenus.push(menu);

  var container = document.getElementById(menuId + "_container");
  menu.container = container;
  var leftSpan = DHTML.createElement('span', 'class', 'menu_' + menu.style.className + '_left');
  container.appendChild(leftSpan);

  menu.node = DHTML.createElement('span', 'id', 'menu_' + menu.id, 'class', 'menu_' + menu.style.className,
          'onclick', 'event.cancelBubble = true;', 'onMouseOver', 'MenuImpl_mouseOverMenu(\'' + menu.id + '\')');

  var showJS = 'MenuImpl_showMenu(\'' + menu.id + '\')';
  if (menuURL == 'void(\'OPENPANEL\')') {
    menu.bPanelMenu = true;
    menuURL = showJS;
  } else if (menuURL == '') {
    if (!disabled || subMenus != null) {
      menuURL = showJS;
    }
  }

  var onrecord = null;
  if (!MenuImpl_subMenuOnServer(subMenus)) {
    if (menuURL == showJS) {
      onrecord = 'void(null)'; 
    }
  } else {
    showJS = showJS+';Recorder.click(this)'; 
  }

  menu.onfocus = null;
  MenuImpl_writeMenuLink(menuText, menuURL, onrecord, menu.onfocus, '', menu.style, 'menu_link_' + menu.style.className, false, menu.id, menu.node);

  if (menu.style.outerArrow && subMenus != null) { 
    var aElem = DHTML.createElement('a', 'id', menu.id + '_arrow', 'onClick', showJS);
    menu.node.appendChild(aElem);
    MenuImpl_writeOuterArrow(menu.style, aElem);
  }

  container.appendChild(menu.node);

  var rightSpan = DHTML.createElement('span', 'class', 'menu_' + menu.style.className + '_right');
  container.appendChild(rightSpan);

  menu.body = DHTML.createElement('div', 'id', 'menu_body_' + menu.id,
          'class', 'menu_body', 'style', 'display:none; position:absolute; top: 0px; left: 0px; z-index: 100');
  var bodyContainer = DHTML.createElement('div', 'class', 'menu_' + menu.style.className);
  bodyContainer.appendChild(menu.body);
  document.mainForm.insertBefore(bodyContainer, document.mainForm.childNodes[0]);

  MenuImpl_createSubMenus(menu, menu.body, subMenus, numEntriesPerColumn, flatten ? 1 : 0);

  if(menu.style.isTopMenu) {
    menu.text = menuText;
    menu.url = menuURL;
    this.tabMenus.push(menu);
  }
}

function MenuImpl_isTabElemFlowDropped(e1,e2) {
  return DHTML.getElementTop(e2.parentNode) > DHTML.getElementTop(e1.parentNode);
}

function MenuImpl_createMoreTab() {
  if (this.tabMenus.length > 1) {
    var droppedActiveTab = null;
    var firstTab = this.tabMenus[0];
    var lastShown = 0;
    for (var i = 1; i < this.tabMenus.length; i++) {
      var tab = this.tabMenus[i];
      if (this.moreTabMenus.length > 0 ||
          MenuImpl_isTabElemFlowDropped(firstTab.container, tab.container)) { 
        if (tab.style == this.MENU_STYLES[this.TAB_MENU_ON]) { 
          droppedActiveTab = tab;
        } else { 
          tab.container.parentNode.style.display = "none";
          this.moreTabMenus.push(tab);
        }
      } else {
        lastShown = i;
      }
    }

    if (droppedActiveTab || this.moreTabMenus.length > 0) { 
      
      var moreTab = DHTML.createElement('div', 'id', 'tab_more', 'class', 'tab_more', 'title', this.moreTabTitle,
              'onmouseenter', 'DHTML.buttonEnter(this)', 'onmouseleave', 'DHTML.buttonLeave(this)');
      firstTab.container.parentNode.parentNode.appendChild(moreTab);
      var moreTabContainer = DHTML.createElement('span', 'id', 'more_tab_container');
      moreTab.appendChild(moreTabContainer);

      while (MenuImpl_isTabElemFlowDropped(firstTab.container, moreTabContainer) ||
              droppedActiveTab && MenuImpl_isTabElemFlowDropped(firstTab.container, droppedActiveTab.container)) { 
        if (this.tabMenus[lastShown].style == this.MENU_STYLES[this.TAB_MENU_ON]) {
          lastShown --;
          if (lastShown < 0) {
            break;
          }
        }
        var lastTab = this.tabMenus[lastShown];
        lastTab.container.parentNode.style.display = "none";
        this.moreTabMenus.push(lastTab);
        lastShown--;
        if (lastShown < 0) {
          break;
        }
      }

      
      var moreTabItems = [];
      for(var i = 0; i < this.moreTabMenus.length; i++) {
        moreTabItems[i] = new Object();
        moreTabItems[i].id = this.moreTabMenus[i].id;
        this.moreTabMenus[i].id = '';  
        moreTabItems[i].url = this.moreTabMenus[i].url;
        moreTabItems[i].text = this.moreTabMenus[i].text;
        moreTabItems[i].items = this.moreTabMenus[i].items;
      }
      this.createMenu(this.MORE_TAB, 'more_tab', '', '', moreTabItems, 0, false, false);
    }

    var tabsContainer = DHTML.getElementById('topModetabs_middle');
    if (!tabsContainer.style.width) {
      tabsContainer.style.width = tabsContainer.offsetWidth + 3 + 'px'; 
    }
  }
}

function MenuImpl_createSubMenus(menu, body, subMenus, numEntriesPerColumn, flattenDepth) {
  if(!flattenDepth) {
    flattenDepth = 0
  }
  if (menu.items) {
    
    for (var i=0; i<menu.items.length; i++) {
      var item = menu.items[i];
      if (!ArrayUtil.inArray(item, subMenus)) {
        item.node.parentNode.removeChild(item.node);
        Menu.menus[item.id] = undefined;
      }
    }
  }

  menu.items = subMenus;
  if (subMenus == null || subMenus.length == 0) {
    return;
  }

  var parentNodes = new Array();
  if(numEntriesPerColumn > 0 && menu.items.length > numEntriesPerColumn) {
    for(var i = 0; i < Math.ceil(menu.items.length / numEntriesPerColumn); i++) {
      var columnNode = DHTML.createElement('span', 'class', 'menu_column');
      body.appendChild(columnNode);
      parentNodes[i] = columnNode;
    }
  } else {
    parentNodes[0] = body;
  }
  var col = 0;
  for (var i = 0; i < menu.items.length; i++) {
    MenuImpl_createItem(menu, parentNodes[col], menu.items[i], numEntriesPerColumn, flattenDepth);
    if((i + 1) % numEntriesPerColumn == 0) {
      col++;
    }
  }
}


function MenuImpl_createItem(menu, parentNode, item, numEntriesPerColumn, flattenDepth) {

  if (item.isFlat) {
    flattenDepth = 1; 
  }

  var oldItem = Menu.menus[item.id];
  if (oldItem) {
    item.disabled = oldItem.disabled; 
  }

  Menu.menus[item.id] = item;

  item.parent = item.menu = menu;
  item.style = menu.style;

  if (item.htmlSrc != null) {

    if (oldItem && oldItem.node) {
      item.node = oldItem.node.parentNode.removeChild(oldItem.node);
    } else {
      var temp = DHTML.createElement("span");
      DHTML.setInnerHTML(temp, item.htmlSrc);
      item.node = temp.removeChild(temp.firstChild);
    }
    parentNode.appendChild(item.node);
    DHTML.setFieldToClosure(item.node, "onmouseover", function() {MenuImpl_mouseOverMenuItem(menu,item);});

    if (item.focusableId) {
      item.focusable = document.getElementById(item.focusableId);
    }

    item.isVirtual = true;

  } else {

    var onClick = '';
    var hasSubItems = MenuImpl_hasSubItems(item);

    if(hasSubItems && flattenDepth > 0) {
      var groupNode = DHTML.createElement('div', 'class', 'menu_group');
      parentNode.appendChild(groupNode);
      parentNode = groupNode;
    } else {
      onClick = 'MenuImpl_hideAllMenus();';
    }

    if(!item.disabled) {
      onClick += item.url.replace(/\"/g, "'"); // Replace " with '
    }

    item.node = DHTML.createElement('div', 'id', 'menu_item_' + menu.id + '_' + item.id,
            'class', (flattenDepth > 0) && hasSubItems ? 'menu_header' :
                     item.divider ? 'menu_item_divider' :
                        'menu_item' + (item.disabled ? "_disabled" : ""),
            'nowrap', 'true',
            'onClick', onClick + ';event.cancelBubble = true',
            'title', item.tooltip ? item.tooltip : '');
    if((flattenDepth <= 0 || !hasSubItems || (item.url && item.url != 'void(0)' && item.url != '')) && !item.disabled) {
      DHTML.setFieldToClosure(item.node, "onmouseover", function() {MenuImpl_mouseOverMenuItem(menu,item);});
      item.text = MenuImpl_makeMenuShortcut(item.text, menu, item);
    }
    if(hasSubItems && flattenDepth <= 0 && !(item.url && item.url != 'void(0)' && item.url != '')) {
      DHTML.setFieldToClosure(item.node, "onclick", function() {MenuImpl_mouseOverMenuItem(menu,item);});
    }
    parentNode.appendChild(item.node);

    MenuImpl_writeMenuLink(item.text, item.url, null, '', null, menu.style, 'menu_item_link', hasSubItems && (flattenDepth <= 0), item.id, item.node, item.checked);

    if (hasSubItems) {
      if(flattenDepth > 0) {
        item.isFlat = true;
        MenuImpl_createSubMenus(item, parentNode, item.items, 0, flattenDepth - 1);
      } else {
        item.body = DHTML.createElement('div',
                'id', 'menu_body_' + item.id,
                'class', 'menu_body',
                'style', 'display:none; position:absolute; top: 0px; left: 0px; z-index:100');
        parentNode.appendChild(item.body);
        MenuImpl_createSubMenus(item, item.body, item.items, 0, 0);
      }
    }
  }

}

function MenuImpl_showMenu(menuId) {
  if(!Events.isNavigationAllowed()) return;

  var menu = Menu.menus[menuId];
  if (menu.container.disabled) return;

  clearCalendar();
  MenuImpl_hideAllMenus();

  var askServer = false;
  if (MenuImpl_subMenuOnServer(menu.items)) {
    askServer = true;
    if (menu.bPanelMenu) {
      menu.items = AJAX.getLoadingHTML();
    } else {
      MenuImpl_createSubMenus(menu, menu.body, [{text:AJAX.getLoadingHTML(), disabled:'true'}]);
    }
  }

  if (menu.bPanelMenu) {
    Menu.openMenus[Menu.openMenus.length] = MenuImpl_createOpenMenu(menu, 0);
    ScrollingPanel.showText(document.getElementById(menuId), menu.items, 'popupPanel', true, 500, 800, true);
  } else {
    if (!menu.items) {
      return;
    }

    MenuImpl_positionMenuBody(menu.node, menu.body, menu.style);
    for(var i = 0; i < menu.items.length; i++) {
      if(menu.items[i].divider) {
        if (i == 0 || i == menu.items.length - 1) {
          menu.items[i].node.style.display = 'none'; 
        } else {
          menu.items[i].node.style.width = DHTML.getElementWidth(menu.body);
        }
      }
    }
    Menu.openMenus[Menu.openMenus.length] = MenuImpl_createOpenMenu(menu, 0);

    var toSelect = MenuImpl_firstEnabledItem(menu);
    if (toSelect) {
      while(toSelect.isFlat && toSelect.items && toSelect.items.length > 0 && (toSelect.url == "void(0)" || toSelect.url == "")) {
        toSelect = MenuImpl_firstEnabledItem(toSelect);
      }
      MenuImpl_setSelectedMenuItem(menu, toSelect);
    }
  }

  if (askServer) {
    window.AJAX.initRequest(DHTML.findOriginalElementId(menu), null,
            function(){
              if (menu.bPanelMenu) {
                menu.items = AJAX.returnValue;
              } else {
                eval("MenuImpl_createSubMenus(menu, menu.body, " + AJAX.returnValue + ")");
              }
              MenuImpl_showMenu(menuId);
            }, true);
  }
}

function MenuImpl_firstEnabledItem(menu) {
  var i = 0;
  while(menu.items && i < menu.items.length && menu.items[i].disabled) {
    i++;
  }
  return menu.items[i];
}

function MenuImpl_writeMenuLink(text, url, onrecord, onfocus, onclick, style, className, hasSubItems, id, parentElem, checked) {
  if (hasSubItems) {
    var imgElem = DHTML.createElement('span', 'class', className + '_arrow');
    parentElem.appendChild(imgElem);
  }

  if (checked) {
    var imgElem = DHTML.createElement('span', 'class', className + '_checked', 'id', id+'_checked');
    parentElem.appendChild(imgElem);
  }

  var spanElem;
  if (url) {
    url = url.replace(/\"/g, "'"); // Replace " with '
    if ((onclick == null) && !hasSubItems) {
      onclick = "MenuImpl_hideAllMenus();";
    }

    if ((url != null) && (url != "javascript:void(null)") && hasSubItems) {
      url = url + ";MenuImpl_hideAllMenus();";
    }

    onclick += ";" + url;

    
    spanElem = DHTML.createElement('a', 'id', id, 'class', className,
            'href', 'javascript:void(0)',
            'onclick', 'Recorder.click(this);' + onclick
            + ';event.cancelBubble=true',
            (onrecord != null ? 'onrecordclick' : ""), onrecord,
            (onfocus == '' ? 'hidefocus' : 'onfocus'), (onfocus == '' ? 'true' : onfocus));
  } else {
    spanElem = DHTML.createElement('span', 'id', id);
  }
  parentElem.appendChild(spanElem);
  DHTML.setInnerHTML(spanElem, text);
}


function MenuImpl_writeOuterArrow(menuStyle, parentElem) {
  var imgElem = DHTML.createElement('span', 'class', 'menu_arrow_' + menuStyle.className, 'border', '0');
  parentElem.appendChild(imgElem);
}


function MenuImpl_mouseOverMenu(menuIndex) {
  with (Menu) {
    if (openMenus.length > 0 && openMenus[openMenus.length-1].menu.id != menuIndex) {
      MenuImpl_showMenu(menuIndex);
    }
  }
}


function MenuImpl_showSubMenus(menuItem, selectFirstItem) {
  with (Menu) {
    if (menuItem.items == null || menuItem.isFlat ||
            menuItem.body.style.display == 'block')  {
      return;
    }

    var askServer = false;
    if (MenuImpl_subMenuOnServer(menuItem.items)) { 
      askServer = true;
      MenuImpl_createSubMenus(menuItem, menuItem.body, [{text:AJAX.getLoadingHTML(), disabled:'true'}]);
    }

    openMenus[openMenus.length] = MenuImpl_createOpenMenu(menuItem, selectFirstItem?0:-1);
    if (selectFirstItem) {
      var subItemToSelect = MenuImpl_firstEnabledItem(menuItem);
      if (subItemToSelect) {
        MenuImpl_setSelectedMenuItem(menuItem, subItemToSelect);
      }
    }
    MenuImpl_positionSubMenuBody(menuItem.node, menuItem.body);
    for(var i = 0; i < menuItem.items.length; i++) {
      if(menuItem.items[i].divider) {
        if (i == 0 || i == menuItem.items.length - 1) {
          menuItem.items[i].node.style.display = 'none'; 
        } else {
          menuItem.items[i].node.style.width = DHTML.getElementWidth(menuItem.body) - 2;
        }
      }
    }

    if (askServer) {
      window.AJAX.initRequest(DHTML.findOriginalElementId(menuItem), null,
        function(){
          eval("MenuImpl_createSubMenus(menuItem, menuItem.body, " + AJAX.returnValue + ")");
          menuItem.body.style.display = 'none';
          MenuImpl_showSubMenus(menuItem, selectFirstItem);
        }, true)
    }
  }
}


function MenuImpl_hideAllMenus() {
  with (Menu) {
    if (openMenus.length > 0) {
      for (var i=0;i<openMenus.length;i++) {
        MenuImpl_hideSubMenu(openMenus[i]);
      }
      openMenus = new Array();
    }
  }
}



function MenuImpl_hideSubMenu(openMenu) {
  if (openMenu.menu.bPanelMenu) {
    ScrollingPanel.hideText();
  } else {
    if (openMenu.menu.body.style.display == 'none') {
      return;
    }
    DHTML.unshimElement(openMenu.menu.body);
    openMenu.menu.body.style.display = 'none';
    if (openMenu.activeItem != null) {
      MenuImpl_unhighlightMenuItem(openMenu.activeItem);
    }
  }
}




function MenuImpl_keyboardEnterMenu(menuId, calledFromFocus) {
  with (Menu) {
    if (!calledFromFocus && menus[menuId].node.firstChild.onfocus) { 
      menus[menuId].node.firstChild.focus();
      if (menus[menuId].onfocus == null) { 
        MenuImpl_showMenu(menuId);
      }
    } else {
      MenuImpl_showMenu(menuId);
    }
    EventHandlers.clearLastFocus();
  }
}


function MenuImpl_menuArrowKey(dir, event) {
  with (Menu) {
    if (openMenus.length == 0) {
      EventHandlers.clearLastFocus();
      return;
    }
    var currItem = MenuImpl_getActiveMenuItem();
    if (currItem != null && currItem.isVirtual && (dir == "Left" || dir == "Right")) {
      EventHandlers.clearLastFocus();
      return;
    }
    if(!event) {
      event = window.event;
    }
    event.returnValue = false;
    event.cancelBubble = true;
    if (dir == "Up") {
      MenuImpl_moveMenuItemSelectionDelta(-1);
    } else if (dir == "Down") {
      MenuImpl_moveMenuItemSelectionDelta(1);
    } else if (dir == "Left") {
      if (openMenus.length > 1) {
        MenuImpl_closeSubMenuKey();
      } else {
        MenuImpl_moveMenuKey(-1);
      }
    } else if (dir == "Right") {
      if (currItem == null) {
        
        
        
        
        var currOpenMenu = openMenus[openMenus.length-1];
        var topMenu = MenuImpl_hasSubItems(currOpenMenu.menu) ? currOpenMenu.menu.menu : currOpenMenu.menu;
        MenuImpl_setSelectedMenuItem(topMenu, MenuImpl_firstEnabledItem(currOpenMenu.menu));
        currItem = MenuImpl_getActiveMenuItem();
      }
      if (MenuImpl_hasSubItems(currItem)) {
        MenuImpl_openSubMenuKey();
      } else {
        MenuImpl_moveMenuKey(1);
      }
    }
    EventHandlers.clearLastFocus();
  }
}

function MenuImpl_getActiveMenuItem() {
  with (Menu) {
    if (openMenus.length == 0) return null;
    return openMenus[openMenus.length-1].activeItem;
  }
}


function MenuImpl_menuEnterKey(event) {
  if(!event) {
    event = window.event;
  }
  var item = MenuImpl_getActiveMenuItem();
  if (item == null) {
    EventHandlers.clearLastFocus();
    return false;
  }
  if (MenuImpl_hasSubItems(item) && !item.isFlat) {
    MenuImpl_openSubMenuKey();
    event.returnValue = false;
    event.cancelBubble = true;
  } else if (item.isVirtual) {
    EventHandlers.clearLastFocus();
    return true;
  } else {
    event.returnValue = false;
    event.cancelBubble = true;
    var itemInput = MenuImpl_findFocusableItemNode(item);
    if (itemInput != null && (itemInput.tagName == 'A' || itemInput.onclick)) {
      itemInput.onclick();
    }
    MenuImpl_menuEscapeKey(true, event);
  }
  EventHandlers.clearLastFocus();
  return true;
}


function MenuImpl_menuEscapeKey(doClearCalendar, event) {
  if(!event) {
    event = window.event;
  }
  with (Menu) {
    var currItem = MenuImpl_getActiveMenuItem();
    var isBackspace = event.keyCode == 8;
    var swallowed = false;
    if (currItem != null && currItem.isVirtual && isBackspace) {
      
    } else if (openMenus.length > 0) {
      var isTop = (openMenus[openMenus.length-1].menu.style && openMenus[openMenus.length-1].menu.style.isTopMenu);
      MenuImpl_hideAllMenus();
      if (isTop) {
        DHTML.setInitialFocus();
      }
      event.returnValue = false;
      event.cancelBubble = true;
      swallowed = true;
    }
    EventHandlers.clearLastFocus();
    if (doClearCalendar) {
      clearCalendar(true);
    }
    
    
    if (isBackspace && !swallowed && !MenuImpl_targetOfEventIsTextField(event)) {
      event.returnValue = false;
      event.cancelBubble = true;
    }
  }
}


function MenuImpl_targetOfEventIsTextField(event) {
  var target = event.srcElement;
  return target != null &&
      (target.type == "text" ||
       target.type == "textarea" ||
       target.type == "password") &&
      !target.readOnly;
}


function MenuImpl_menuClickAway() {
  var currItem = MenuImpl_getActiveMenuItem();
  if (currItem != null && currItem.isVirtual) {
    
  } else if (MenuImpl_mouseInOpenMenu(0)) {
    
  } else {
    MenuImpl_hideAllMenus();
  }
}


function MenuImpl_menuShortcutKey(keyChar, event) {
  if(!event) {
    event = window.event;
  }
  with (Menu) {
    if (openMenus.length == 0) {
      EventHandlers.clearLastFocus();
      return;
    }
    var menu = openMenus[openMenus.length-1].menu;
    if (menu.shortcuts) {
      for (var i = 0; i < menu.shortcuts.length; i++) {
        if (menu.shortcuts[i] == keyChar) {
          var item = menu.shortcutItems[i];
          if (MenuImpl_hasSubItems(item) && !item.isFlat) {
            MenuImpl_setSelectedMenuItem(menu, item);
            MenuImpl_showSubMenus(item, true);
          } else {
            var itemInput = MenuImpl_findFocusableItemNode(item);
            if (itemInput != null && (itemInput.tagName == 'A' || itemInput.onclick)) {
              itemInput.onclick();
            }
            MenuImpl_menuEscapeKey(true, event);
          }
          event.returnValue = false;
          event.cancelBubble = true;
        }
      }
    }
    EventHandlers.clearLastFocus();
  }
}


function MenuImpl_moveMenuItemSelectionDelta(delta) {
  with (Menu) {
    var currItem = MenuImpl_getActiveMenuItem();
    var currOpenMenu = openMenus[openMenus.length-1];
    var newIndex = currOpenMenu.activeIndex;
    var visibleItems = MenuImpl_getVisibleItems(currOpenMenu.menu);
    do {
      newIndex += delta;
      if ((newIndex < 0) || (newIndex >= visibleItems.length)) return;
      currItem = visibleItems[newIndex];
    } while((currItem.items && currItem.items.length > 0 && currItem.isFlat && (currItem.url == "void(0)" || currItem.url == "")) || currItem.disabled);
    MenuImpl_setSelectedMenuItem(currOpenMenu.menu, visibleItems[newIndex]);
  }
}

function MenuImpl_getVisibleItems(menu) {
  var items = new Array();
  for(var i = 0; i < menu.items.length; i++) {
    items.push(menu.items[i]);
    if(menu.items[i].isFlat) {
      items = items.concat(MenuImpl_getVisibleItems(menu.items[i]));
    }
  }
  return items;
}


function MenuImpl_setSelectedMenuItem(menu, item, autoOpenSubMenu) {
  with (Menu) {
    var index = 0;
    var items = MenuImpl_getVisibleItems(menu);
    for (var i=0;i<items.length;i++) {
      if (items[i] == item) {
        index = i;
        break;
      }
    }

    
    for (var i=openMenus.length-1;i>0;i--) {
      if (openMenus[i].menu == (menu.isFlat ? menu.menu : menu)) {
        break;
      }
      MenuImpl_hideSubMenu(openMenus.pop());
    }
    if(openMenus.length == 0) {
      return;
    }

    var currItem = MenuImpl_getActiveMenuItem();
    if (currItem != null) MenuImpl_unhighlightMenuItem(currItem);
    openMenus[openMenus.length-1].activeIndex = index;
    openMenus[openMenus.length-1].activeItem = item;
    MenuImpl_highlightMenuItem(item);
    if (autoOpenSubMenu) MenuImpl_showSubMenus(MenuImpl_getActiveMenuItem(), true);
  }
}


function MenuImpl_highlightMenuItem(item) {
  item.node.oldClassName = item.node.className;
  item.node.className = item.node.className + "_highlighted";
  var itemInput = MenuImpl_findFocusableItemNode(item);
  if (itemInput == null) {
    return;
  } else if (itemInput.tagName == 'INPUT' || itemInput.tagName == 'A') {
    try {
      itemInput.focus();
    } catch (e) {}
  } else if (itemInput.style) {
    itemInput.style.textDecoration = 'underline';
  }
}


function MenuImpl_unhighlightMenuItem(item) {
  if (item.isVirtual) {
    MenuImpl_findFocusableItemNode(item).blur();
  }
  if (item.node.oldClassName) item.node.className = item.node.oldClassName;
  var itemInput = MenuImpl_findFocusableItemNode(item);
  if (itemInput != null && itemInput.style) {
    itemInput.style.textDecoration = '';
  }
}



function MenuImpl_openSubMenuKey() {
  MenuImpl_showSubMenus(MenuImpl_getActiveMenuItem(), true);
}


function MenuImpl_closeSubMenuKey() {
  MenuImpl_hideSubMenu(Menu.openMenus.pop());
}


function MenuImpl_moveMenuKey(delta) {
  with (Menu) {
    var newOpenMenu = ArrayUtil.indexOf(openMenus[0].menu, topLevelMenus) + delta;
    while(!(newOpenMenu < 0 || newOpenMenu >= topLevelMenus.length) &&
          (!topLevelMenus[newOpenMenu].items || topLevelMenus[newOpenMenu].items.length == 0
                  || ArrayUtil.inArray(topLevelMenus[newOpenMenu], moreTabMenus))) { 
      newOpenMenu += delta;
    }
    if (newOpenMenu < 0 || newOpenMenu >= topLevelMenus.length ||
        !openMenus[openMenus.length-1].menu.style || !topLevelMenus[newOpenMenu].style ||
        !openMenus[openMenus.length-1].menu.style.isTopMenu || !topLevelMenus[newOpenMenu].style.isTopMenu) {
      return;
    }
    MenuImpl_keyboardEnterMenu(topLevelMenus[newOpenMenu].id);
  }
}


function MenuImpl_makeMenuShortcut(itemText, menu, item) {
  if (itemText.indexOf('<') != -1 || itemText.indexOf('+') != -1) {
    return itemText;
  }
  var upperCaseText = itemText.toUpperCase();
  for (var i = 0; i < itemText.length; i++) {
    var c = upperCaseText.substr(i, 1);
    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) != -1) {
      var alreadyUsed = false;
      while(menu.parent && menu.isFlat) {
        menu = menu.parent;
      }
      if (menu.shortcuts) {
        for (var j = 0; j < menu.shortcuts.length; j++) {
          if (menu.shortcuts[j] == c) {
            alreadyUsed = true;
            break;
          }
        }
      } else {
        menu.shortcuts = new Array();
        menu.shortcutItems = new Array();
      }
      if (!alreadyUsed) {
        menu.shortcuts[menu.shortcuts.length] = c;
        menu.shortcutItems[menu.shortcutItems.length] = item;
        return itemText.substr(0, i) + "<u>" + itemText.substr(i, 1) + "</u>" + itemText.substr(i + 1);
      }
    } else if (c == '&') { 
      while (i < itemText.length && upperCaseText.substr(i, 1) != ';') {
        i++;
      }
    }
  }
  return itemText;
}




function MenuImpl_positionMenuBody(menuNode, menuBody, style) {
  if (menuBody.parentElement != document.body && !DHTML.isFirefox) {
    if(menuBody.parentElement) {
      menuBody.parentElement.removeChild(menuBody);
    }
    document.mainForm.insertBefore(menuBody, document.mainForm.childNodes[0]);
  }
  var left = DHTML.getElementLeft(menuNode.parentNode) + style.xOffset;
  var top = DHTML.getElementTop(menuNode.parentNode) + style.yOffset;
  if(style.align == "h") {
    left += DHTML.getElementWidth(menuNode.parentNode);
  } else if(style.align == "v") {
    top += DHTML.getElementHeight(menuNode);
  }
  menuBody.style.display = "block"; 
  var width = DHTML.getElementWidth(menuBody);
  if(left + width > document.body.scrollLeft + document.body.clientWidth) {
    left = (document.body.scrollLeft + document.body.clientWidth) - width;
  }
  if(left < 0) {
    left = 0;
  }
  menuBody.style.left = left;
  menuBody.style.top = top;
  var bottom = DHTML.getElementTop(menuBody) + DHTML.getElementHeight(menuBody);
  var windowBottom = document.body.scrollTop + document.body.clientHeight;
  if (bottom > windowBottom) {
    menuBody.style.top = top + windowBottom - bottom;
  }
  DHTML.shimElement(menuBody);
}


function MenuImpl_positionSubMenuBody(menuNode, menuBody) {
  var top = menuNode.offsetTop - 2;
  var left = DHTML.getElementWidth(menuNode);
  var parent = menuNode.parentNode;
  while(parent != null) {
    if(parent.className == "menu_column") {
      left += parent.offsetLeft;
    } else if(parent.className == "menu_body") {
      break;
    }
    parent = parent.parentNode;
  }
  menuBody.style.left = left;
  menuBody.style.top = top;
  menuBody.style.display = "block";
  var subMenuBottom = DHTML.getElementTop(menuBody) + DHTML.getElementHeight(menuBody);
  var windowBottom = document.body.scrollTop + document.body.clientHeight;
  if(subMenuBottom > windowBottom) {
    top += windowBottom - (subMenuBottom + 1);
    menuBody.style.top = top;
  }
  var subMenuLeft = DHTML.getElementLeft(menuBody);
  var subMenuWidth = DHTML.getElementWidth(menuBody);
  var subMenuRight = subMenuLeft + subMenuWidth;
  var windowRight = document.body.scrollLeft + document.body.clientWidth;
  if(subMenuRight > windowRight) {
    left += windowRight - (subMenuRight + 1);
    menuBody.style.left = left;
  }
  subMenuLeft = DHTML.getElementLeft(menuBody);
  subMenuRight = subMenuLeft + subMenuWidth;
  var menuLeft = DHTML.getElementLeft(menuNode);
  if(subMenuLeft <= menuLeft) {
    left += menuLeft - (subMenuRight + 1);
    menuBody.style.left = left;
  }
  DHTML.shimElement(menuBody);
}


function MenuImpl_mouseInOpenMenu(padding) {
  with (Menu) {
    for (var i=0;i<openMenus.length;i++) {
      var menu = openMenus[i].menu;
      if ((menu.node && DHTML.mouseInElement(menu.node, padding)) ||
          (menu.body && DHTML.mouseInElement(menu.body, padding))) {
        return true;
      }
    }
    return false;
  }
}



function MenuImpl_findFocusableItemNode(item) {
  var res = item.focusable;
  if (res == null) res = findFocusable(item.node);
  return res;
}


function MenuImpl_mouseOverMenuItem(menu, item) {
  if(!item.disabled) {
    MenuImpl_setSelectedMenuItem(menu, item, true);
  }
}


function MenuImpl_createOpenMenu(menu, activeIndex) {
  var openMenu = new Object();
  openMenu.menu = menu;
  openMenu.activeIndex = activeIndex;
  if (activeIndex == -1) {
    openMenu.activeItem = null;
  } else {
    openMenu.activeItem = menu.items[activeIndex];
  }
  return openMenu;
}

function MenuImpl_hasSubItems(menu) {
  return menu.items != null;
}

function MenuImpl_subMenuOnServer(items) {
  return items != null && items.length == 0;
}

///////////////////////////////////////////////////////////
// BEGIN NewClaimWizardUtil.js

function NewClaimWizardUtil() {
}

NewClaimWizardUtil.NO_CHANGE = "<NOCHANGE>";

NewClaimWizardUtil.getMainContactType = function(triggerIndex, mainContact, insured, reportedBy, reportedByType) {
  
  if (triggerIndex == 1) { 
    if (mainContact == null || mainContact == "") {
      return "";
    } else if (mainContact == insured) {
      return "self"
    } else if (mainContact == reportedBy) {
      return reportedByType;
    }
  }

  return NewClaimWizardUtil.NO_CHANGE;
}
///////////////////////////////////////////////////////////
// BEGIN NumberUtil.js



window.NumberUtil = new NumberUtilImpl();


function NumberUtilImpl() {
  this.thousandsSymbol = ',';
  this.decimalSymbol = '.';



  this.multiCurrencyMode = false;
  this.defaultCurrency = null;
  this.positivePatternPrefixes = {"null":"$"};
  this.positivePatternSuffixes = {"null":""};
  this.negativePatternPrefixes = {"null":"($"};
  this.negativePatternSuffixes = {"null":")"};
  this.storageScales = {"null":"2"};
}


NumberUtilImpl.prototype.setLocale = function(thousandsSymbol, decimalSymbol,
                                              currencyPattern, negativeCurrencyPattern) {
  this.thousandsSymbol = thousandsSymbol;
  this.decimalSymbol = decimalSymbol;


}


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


NumberUtilImpl.prototype.safeConvertToNumber = function(value) {
  if(!value) {
    return 0;
  }
  
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
    } else if(ch == '(') { 
      multiplier = -1;
    }
  }
  return (newValue.length > 0) ? Number(newValue) * multiplier : 0;
}


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
  while (newValue.charAt(0) == '0') { 
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


NumberUtilImpl.prototype.convertNumberToFixed = function(value, digitsAfterPoint) {
  

  
  value = this.safeConvertToNumber(this.convertNumberToString(value));

  var roundedValue = value.toFixed(digitsAfterPoint);
  var strValue = this.convertNumberToString(roundedValue);
  
  var pointIndex = strValue.indexOf(this.decimalSymbol);
  if (pointIndex == 0) {
    strValue = "0" + strValue;
  } else if (pointIndex < 0) {
    strValue = strValue + this.decimalSymbol;
  }
  return strValue;
}


NumberUtilImpl.prototype.convertNumberToCurrency = function(value) {
  return NumberUtil.convertNumberToMulticurrency(value, null);
}


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


NumberUtilImpl.prototype.zeroFill = function(number, length) {
  var result = '' + number;
  while (result.length < length) {
    result = '0' + result;
  }
  return result;
}


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

///////////////////////////////////////////////////////////
// BEGIN Progress.js



window.Progress = new ProgressImpl();

function ProgressImpl() {
  this._version = 0;
  this[this._version] = [];
  this._interval = window.setInterval(ProgressImpl_pollIfNeeded, 3000) 
}
ProgressImpl.prototype.updateProgress = ProgressImpl_updateProgress;

function ProgressImpl_updateProgress (info) {

  
  if (info == null || ProgressImpl_refreshContainerIfNeeded(info)) {
    return;
  }

  var done = info.percentage >= 100;
  if (info.sync) {
    
    if (done) {
      Debug.log("Invoke event after progress completes: " + info.id);
      Events.enableNavigation();
      Events.invokeEvent(info.id+'_act', true);
      return;
    }

    Debug.log("Disabled navigation for sync progress");    
    Events.disableNavigation();
    DHTML.hourglass();
  }

  
  var htmlContent = '';

  
  if (info.percentage < 0 && !info.hideAnimation) {
    htmlContent += '<span class="inProgressIcon"></span> ';
  }
  
  if (info.status != null) {
    htmlContent += '<span class="inProgressMsg">' + info.status + '</span>';
  }
  
  if (info.percentage >= 0 && !done && !info.hideAnimation ) {
    htmlContent += '<div class="progressBar" title="'+info.percentage+'%"><span class="progressCompleted" style="width:'+info.percentage+'%"></span></div>';
  }

  var elt = document.getElementById(info.id);
  DHTML.setInnerHTML(elt, htmlContent);
  if(!document.all && info.percentage >= 0 && !done && !info.hideAnimation) {
    
    elt.childNodes[1].childNodes[0].style.width = "";
    var pad = 200 * info.percentage / 100;
    elt.childNodes[1].childNodes[0].style.paddingLeft = pad + "px";
    if(document.defaultView.getComputedStyle(elt.childNodes[1], "").getPropertyValue("display") == "inline") {
      elt.childNodes[1].style.paddingRight = (200 - pad) + "px";
    }
  }
  Debug.log('Progress of "' +info.id+ '" updated to ' + info.percentage);

  
  if (!done) {
    ProgressImpl_registerToPoll(info.id)
  }
}


function ProgressImpl_refreshContainerIfNeeded (info) {
  if (info.refreshContainerId != null) {
    DHTML.updateElement(info.refreshContainerId, info.content, info.delayedJS, info.refreshChildrenOnly);
    Debug.log('progress done; container reloaded')
    return true;
  }
  return false; 
}


function ProgressImpl_pollIfNeeded(){
  var currentPoll = Progress._version;
  if (Progress[currentPoll].length == 0) {
    return; 
  }

  var nextPoll = currentPoll+1;
  Progress[nextPoll] = []
  Progress._version = nextPoll; 

  var ids = Progress[currentPoll];
  Progress[currentPoll] = null; 

  var reqs = [];
  for (var i = 0; i < ids.length; i++) {
    reqs[i] = AJAX.buildSingleRequest(ids[i], null, ProgressImpl_callback)
  }
  AJAX.initRequestEx(reqs)
}


function ProgressImpl_registerToPoll(id){
  Progress[Progress._version].push(id);
}


function ProgressImpl_callback() {
  eval("ProgressImpl_updateProgress(" +AJAX.returnValue+ ")")
}

///////////////////////////////////////////////////////////
// BEGIN Reflection.js







function ReflectionImpl_init(metaMap, bAppend, reflectionOnLoad) {
  if (!bAppend) { 
    this.reflectors = new Array();
    this.rangeReflectorToTriggersMap = {};
  }
  for (var rId in metaMap) {
    if (metaMap.hasOwnProperty(rId)) {
      var reflector = new Reflector(rId, metaMap[rId]);
      ArrayUtil.appendElement(this.reflectors, reflector);
      reflector.addRangeReflector(this.rangeReflectorToTriggersMap); 
    }
  }
  this._reflectPath = [];

  if (reflectionOnLoad) {
    this._trackElementsToRedo = [];
    this._pendingReqs = [];
    for (var i = 0; i < reflectionOnLoad.length; i++) {
      Reflection.reflect(DHTML.getElementById(reflectionOnLoad[i]), true)
    }

    
    var sumValueReqs = DHTML.updateSumValues(Reflection._trackElementsToRedo);
    if (sumValueReqs) {
      for (var i=0; i<sumValueReqs.length; i++) {
        this._pendingReqs.push(sumValueReqs[i]);
      }
    }

    if (this._pendingReqs.length > 0) {
      AJAX.initRequestEx(this._pendingReqs, true, false, ReflectionImpl_endRedoMode); 
    } else {
      ReflectionImpl_endRedoMode();
    }
    this._pendingReqs = null;
  }
}


function ReflectionImpl_endRedoMode() {
  Events.queueEvent('Debug.log("End reflection redo mode");Reflection._trackElementsToRedo = null', true)
}


function ReflectionImpl_getPrerequisiteAjaxParam(triggerElem) {
  var rangeTriggers = Reflection.rangeReflectorToTriggersMap[ReflectionImpl_getIdForReflection(triggerElem)];
  return rangeTriggers == null ? null : ReflectionImpl_addAjaxParams({}, null, rangeTriggers, null);
}


function ReflectionImpl_reflect(e, bDirectChange) {

  
  var tId = e.id;
  if (ArrayUtil.inArray(ReflectionImpl_getIdForReflection(e), postOnChangeInfo)) {
    
    var actionStr = ReflectionImpl_getDelayedRefreshActionString(tId);
    var waitTillMouseRelease = EventHandlers.setMouseReleaseActionString(actionStr);
    if (!waitTillMouseRelease) {
      
      eval(actionStr);
    }
    return;
  }

  
  
  
  if (bDirectChange) {
    this._reflectPath = [tId]; 
  }

  
  var aspects = [];
  var reflectors = [];
  var cancelledReflectors = [];
  for (var i=0; i<this.reflectors.length; i++) {
    var reflector = this.reflectors[i];
    if (this._trackElementsToRedo && DHTML.getElementById(reflector.id).tagName != 'SPAN') {
      continue; 
    }
    if (!ArrayUtil.inArray(reflector.id, this._reflectPath)) {
      var oldLen = aspects.length;
      reflector.addAspects(e, bDirectChange, aspects);
      if (aspects.length > oldLen) {
        reflectors[reflectors.length] = reflector.id;
      }
    } else {
      
      var temp = [];
      reflector.addAspects(e, bDirectChange, temp);
      if (temp.length > 0) {
        cancelledReflectors[cancelledReflectors.length] = reflector.id;
      }
    }
  }

  if (aspects.length > 0 || cancelledReflectors.length > 0) {
    
    if (Debug.isOn()) {
      var logMsg = '<b>Start reflecting </b>: ' + e.id;
      if (this._reflectPath.length > 1) {
        logMsg += '<br>(path): ' + this._reflectPath;
      }
      if (aspects.length > 0) {
        logMsg += '<br>(Reflectors): ';
        for (var i = 0; i < aspects.length; i++) {
          if (i>0) {
            logMsg += ' | '
          }
          logMsg += aspects[i].reflector.id + ' [' +aspects[i].name+ ']';
        }
      }
      if (cancelledReflectors.length > 0) {
        logMsg += '<br>(Circular reflectors cancelled): ' + cancelledReflectors;
      }
      Debug.log(logMsg);
    }

    var newValues = [];
    var ajaxRequests = [];
    var updateReflectors = function() {
      Reflection.updateAllReflectors(aspects, newValues);
      
      for (var i = 0; i < reflectors.length; i++) {
        Reflection._reflectPath[Reflection._reflectPath.length] = reflectors[i];
      }
    };

    
    for (var i = 0; i < aspects.length; i++) {
      newValues[i] = this.NO_CHANGE;
      var ajaxCall = aspects[i].addNewReflectorValue(e, newValues, i);
      if (ajaxCall) {
        ajaxRequests[ajaxRequests.length] = ajaxCall;
      }
    }

    
    if (ajaxRequests.length > 0) {
      
      var origCallback = ajaxRequests[ajaxRequests.length-1].callback;
      ajaxRequests[ajaxRequests.length-1].callback = function(){ origCallback(); updateReflectors(); };

      if (this._trackElementsToRedo) { 
        for (var i=0; i<ajaxRequests.length; i++) {
          this._pendingReqs.push(ajaxRequests[i]);
        }
      } else {
        AJAX.initRequestEx(ajaxRequests, true);
      }
    } else {
      updateReflectors();
    }
  }

  
  DHTML.updateStyle(e);
  
  DHTML.updateAltValue(e);

  if (this._trackElementsToRedo) {
    this._trackElementsToRedo.push(e); 
  } else {
    Events.queueUniqueItem(e, ReflectionImpl_updateSumValues); 
  }
}


function ReflectionImpl_updateSumValues(elemArray) {
  var reqs = DHTML.updateSumValues(elemArray)
  if (reqs) {
    AJAX.initRequestEx(reqs, true);
  }
}

function ReflectionImpl_updateAllReflectors(aspects, newValues) {
  for (var i = 0; i < aspects.length; i++) {
    aspects[i].updateReflector(newValues[i]);
  }
}

function ReflectionImpl_getDelayedRefreshActionString(id) {
  return 'Events.queueEvent(\'Events.refresh(\\\''+id+'\\\')\');'
}

function ReflectionImpl_getIdForReflection(e) {
  var type = e.type;
  if (type == 'radio' || type == 'checkbox') {
    var id = e.id;
    var name = e.name;
    return id.indexOf(name) == 0 ? name : id; 
  } else {
    return e.id;
  }
}


function ReflectionImpl() {
  
  this.NO_CHANGE = '<NOCHANGE>'; 
  this.TRIGGER_INDEX_PARAM = 'TRIGGER_INDEX'; 
}

ReflectionImpl.prototype.reflect = ReflectionImpl_reflect
ReflectionImpl.prototype.updateAllReflectors = ReflectionImpl_updateAllReflectors
ReflectionImpl.prototype.init = ReflectionImpl_init


window.Reflection = new ReflectionImpl();






function Reflector (id, aspectMap) {
  if (arguments.length == 0) {
    return;
  }

  this.id = id;
  this.aspects = new Array();
  for (var name in aspectMap) {
    if (aspectMap.hasOwnProperty(name)) {
      if ('DIRECT_ONLY' == name) {
        this.bReflectDirectChangeOnly = aspectMap[name];
      } else {
        ArrayUtil.appendElement(this.aspects, new ReflectAspect(this, name, aspectMap[name]));
      }
    }
  }
}

function ReflectorImpl_addAspects(e, bDirectChange, aspects) {
  if (!this.bReflectDirectChangeOnly || bDirectChange) {
    for (var i = 0; i < this.aspects.length; i++) {
      var aspect = this.aspects[i];
      if (aspect.isTriggered(e)) {
        aspects[aspects.length] = aspect;
      }
    }
  }
}


function ReflectorImpl_addRangeReflector(reflectorToTriggersMap) {
  for (var i = 0; i < this.aspects.length; i++) {
    var rangeTriggers = this.aspects[i].getRangeTriggers();
    if (rangeTriggers != null) {
      reflectorToTriggersMap[this.id] = rangeTriggers;
      break;
    }
  }
}
Reflector.prototype.addAspects = ReflectorImpl_addAspects
Reflector.prototype.addRangeReflector = ReflectorImpl_addRangeReflector





function ReflectAspect (reflector, name, args) {
  if (arguments.length == 0) {
    return;
  }
  this.reflector = reflector;
  this.name = name;
  this.method = args[0];
  this.tIds = args[1];
  if (args.length > 2) {
    this.args = args[2];
  }
}


function ReflectAspectImpl_isTriggered(e) {
  return ArrayUtil.inArray(ReflectionImpl_getIdForReflection(e), this.tIds);
}


function ReflectAspectImpl_getRangeTriggers() {
  return this.name == 'OPTIONS' ? this.tIds : null;
}


function ReflectAspectImpl_addNewReflectorValue(e, newValues, index) {
  var ajaxParams = null;
  if (this.method == 'map') {
    ajaxParams = ReflectionImpl_getPrerequisiteAjaxParam(e); 
  }

  if (ajaxParams == null) {
    ajaxParams = this[this.method](e, newValues, index);
  } else {
    ReflectionImpl_addAjaxParams(ajaxParams, this.name, this.tIds, e.id) 
  }
  if (ajaxParams) {
    Debug.log('Request reflecotr value from server for "' + this.reflector.id + '", trigger("'+e.id+'") - ' +this.name);
    return AJAX.buildSingleRequest(this.reflector.id, ajaxParams, function() {newValues[index] = AJAX.returnValue;});
  } else {
    return null;
  }
}


function ReflectAspectImpl_updateReflector(value) {
  if (value == Reflection.NO_CHANGE) {
    return; 
  }
  
  var rE = document.getElementById(this.reflector.id)
  switch (this.name) {
    case 'VALUE':
      DHTML.setValue(rE, value, null);
      break;
    case 'OPTIONS':
      DHTML.setOptions(rE, value);
      break;
    case 'AVAILABLE':
      DHTML.setAvailability(rE, value)
      break;
    case 'MASK':
      FieldValidation.setInputFieldValidator(rE.id, value);
      break;
    case 'CUSTOM':
      
      break;
    default:
      alert ("Unkown aspect: " + asName);
      break;
  }
}

function ReflectAspectImpl_getTriggerValue(e, newValues, index) {
  newValues[index] = DHTML.getValue(e);
}

function ReflectAspectImpl_map (e, newValues, index) {
  if (this.args != null) {
    for (var i = 0; i<this.args.length; i++) {
      if (ArrayUtil.contentsEqual(this.args[i][0], DHTML.getValueByIds(this.tIds))) {
        newValues[index] = this.args[i][1];
        return null;
      }
    }
    newValues[index] = Reflection.NO_CHANGE;
    return null;
  } else { 
    return ReflectionImpl_addAjaxParams({}, this.name, this.tIds, e.id); 
  }
}


function ReflectionImpl_addAjaxParams(params, type, tIds, triggerId) {
  if (type) {
    params['aspectType'] = type;
  }
  var tValues = DHTML.getValueByIds(tIds);
  for (var i=0; i<tIds.length; i++) {
    params[tIds[i]] = tValues[i];
    if (tIds.length > 1 && triggerId == tIds[i]) {
      params[Reflection.TRIGGER_INDEX_PARAM] = i+1; 
    }
  }
  return params;
}


function ReflectAspectImpl_filter (e, newValues, index) {
  var tValues = DHTML.getValueByIds(this.tIds);

  var result = new Array();
  for (var i = 0; i < this.args.length; i++) {
    var item = this.args[i][0]
    var ok = true;

    
    if (this.args[i].length > 1) {
      var conditions = this.args[i][1];

      for (var j = 0; j < tValues.length; j++) {
        var tValue = tValues[j]

        if (tValue != '') { 
          var expected = conditions[this.tIds[j]]
          if (!ArrayUtil.inArray(tValue, expected)) {
            ok = false;
            break;
          }
        }
      }
    }

    if (ok) {
      ArrayUtil.appendElement(result, item);
    }
  }

  newValues[index] =  result;
}

function ReflectAspectImpl_eval(e, newValues, index) {

  
  window.VALUE = DHTML.getValue(e);
  
  for (var i = 0; i < this.tIds.length; i++) {
    var idx = Number(i)+1;
    window['VALUE'+idx] = DHTML.getValueById(this.tIds[i]);
    if (this.tIds.length > 1 && e.id == this.tIds[i]) {
      window[Reflection.TRIGGER_INDEX_PARAM] = idx;
    }
  }
  
  window.REFLECTOR = document.getElementById(this.reflector.id)

  newValues[index] =  eval(this.args[0]);
}
ReflectAspect.prototype.addNewReflectorValue = ReflectAspectImpl_addNewReflectorValue
ReflectAspect.prototype.updateReflector = ReflectAspectImpl_updateReflector
ReflectAspect.prototype.isTriggered = ReflectAspectImpl_isTriggered
ReflectAspect.prototype.getRangeTriggers = ReflectAspectImpl_getRangeTriggers

ReflectAspect.prototype.tv = ReflectAspectImpl_getTriggerValue
ReflectAspect.prototype.map = ReflectAspectImpl_map
ReflectAspect.prototype.filter = ReflectAspectImpl_filter
ReflectAspect.prototype.eval = ReflectAspectImpl_eval

///////////////////////////////////////////////////////////
// BEGIN Resize.js


var Resize = {
  OFFSET : 8, 
  MIN : 8, 

  _startInfo : null, 

  
  setCursorStyle : function(cursorStyle) {
    if (!Resize._resizeCursorSS) {
      Resize._resizeCursorSS = document.createStyleSheet();
      Resize._resizeCursorSS.addRule('*', 'cursor:' + cursorStyle + ' !important');
    } else {
      Resize._resizeCursorSS.disabled = false;
      Resize._resizeCursorSS.rules[0].style.cursor = cursorStyle;
    }
  },

  
  restorCursorStyle : function () {
    if (Resize._resizeCursorSS) {
      Resize._resizeCursorSS.disabled = true;
    }
  },

  
  getDirection : function(elem) {

    var x = 0, y = 0;
    for (var e = elem; e != null && e.tagName != 'BODY'; e = e.offsetParent) {
      if (e != elem) {
        x += e.offsetLeft - e.scrollLeft;
        y += e.offsetTop - e.scrollTop;
      }
      if (Resize.isResizable(e, '.')) {
        var dir = '';
        
        var yPos = window.event.offsetY + y;
        if (Resize.isResizable(e, 'T') && yPos < Resize.OFFSET) {
          dir += "n";
        } else if (Resize.isResizable(e, 'B') && yPos > e.offsetHeight - Resize.OFFSET) {
          dir += "s";
        }

        var xPos = window.event.offsetX + x;
        if (Resize.isResizable(e, 'L') && xPos < Resize.OFFSET) {
          dir += "w";
        } else if (Resize.isResizable(e, 'R') && xPos > e.offsetWidth - Resize.OFFSET) {
          dir += "e";
        }

        return dir ? {dir:dir, elem:e} : null;
      }
    }

    return null;
  },

  
  isResizable : function (e, dir) {
    var cls = e.className
    return cls && cls.match('resize' + dir)
  },

  
  onDown : function() {
    if (!window.event) {
      return; 
    }
    
    var dirInfo = Resize.getDirection(event.srcElement);
    if (dirInfo) {
      var e = dirInfo.elem, dir = dirInfo.dir;
      var minOverride = e.min;
      Resize._startInfo = new Resize_StartInfo(e, dir, (Number(minOverride) || this.MIN),
              window.event.clientX, window.event.clientY,
              e.offsetWidth, e.offsetHeight, e.offsetLeft, e.offsetTop);
      window.event.returnValue = false;
      window.event.cancelBubble = true;
    }
  },

  
  onDblClick : function() {
    if (!window.event) {
      return;
    }
    if (Resize._startInfo != null) {
      Resize._startInfo.resizeTo()
    }
  },

  
  onMove : function () {
    if (!window.event) {
      return; 
    }
    
    if (window.event.button == 0 && Resize._startInfo != null) {
      Resize.restorCursorStyle();
      Resize._startInfo = null;
      return;
    }

    if (Resize._startInfo == null) {
      var dirInfo = Resize.getDirection(event.srcElement);
      if (dirInfo) {
        Resize.setCursorStyle(dirInfo.dir + '-resize')
      } else {
        Resize.restorCursorStyle();
      }
    } else { 
      Resize._startInfo.resizeTo(window.event.clientX, window.event.clientY);
      window.event.returnValue = false;
      window.event.cancelBubble = true;
    }
  },

  
  getSibToResize : function(e, attrib) {
    if (e.parentNode.childNodes.length == 2) {
      var m = e.currentStyle[attrib].match('([0-9]+)%');
      if (m) {
        var sib = e.nextSibling || e.previousSibling;
        if (sib.currentStyle[attrib].match('([0-9]+)%')) {
          return sib;
        }
      }
    }
    return null;
  }
}


function Resize_StartInfo(e, dir, min, x, y, width, height, left, top) {
  this._elem = e;
  this._dir = dir;      
  this._min = min;      

  this._startX = x;
  this._startY = y;

  this._width = width;
  this._height = height;

  if (this._widthSib = Resize.getSibToResize(e, 'width')) {
    this._widthModifier =  '%';
    this._percentageWidth = Number(e.currentStyle.width.replace('%', ''));
    this._sibPercentageWidth = Number(this._widthSib.currentStyle.width.replace('%', ''));
  } else {
    this._widthModifier =  'px';
    this._percentageWidth = null;
  }

  if (this._heightSib = Resize.getSibToResize(e, 'height')) {
    this._heightModifier =  '%';
    this._percentageHeight = Number(e.currentStyle.height.replace('%', ''));
    this._sibPercentageHeight = Number(this._heightSib.currentStyle.height.replace('%', ''));
  } else {
    this._heightModifier =  'px';
    this._percentageHeight = null;
  }

  this._left = left;
	this._top = top;
}


Resize_StartInfo.prototype.isMinimized = function (d) {
  return d <= this._min + 20;
}

Resize_StartInfo.prototype.resizeTo = function (clientX, clientY) {
  var posToRestore = this._elem._toRestore;

  var bW;
  if (this._dir.indexOf("e") != -1 || (bW = this._dir.indexOf("w") != -1)) {
    var newWidth, xDiff;
    if (!clientX) { 
      xDiff = ((posToRestore && this.isMinimized(this._width)) ? posToRestore.x : this._min) - this._width;
    } else { 
      xDiff = (clientX - this._startX) * (bW ? -1 : 1);
      xDiff = Math.max(xDiff, -this._width + this._min)
    }
    if (this._percentageWidth) {
      xDiff = Math.round(this._percentageWidth * xDiff / this._width);
      xDiff = Math.min(xDiff, 100 - this._percentageWidth);
      newWidth = this._percentageWidth + xDiff;

      this._widthSib.style.width = this._sibPercentageWidth - xDiff + this._widthModifier;
    } else {
      newWidth = this._width + xDiff;
      if (bW) {
        this._elem.style.left = this._left - xDiff + "px";
      }
    }

    this._elem.style.width = newWidth + this._widthModifier;
  }

  var bN;
  if (this._dir.indexOf("s") != -1 || (bN = this._dir.indexOf("n") != -1)) {
    var newHeight, yDiff;
    if (!clientY) { 
      yDiff = ((posToRestore && this.isMinimized(this._height)) ? posToRestore.y : this._min) - this._height;
    } else { 
      yDiff = (clientY - this._startY) * (bN ? -1 : 1);
      yDiff = Math.max(yDiff, -this._height + this._min)
    }
    if (this._percentageHeight) {
      yDiff = Math.round(this._percentageHeight * yDiff / this._height);
      yDiff = Math.min(yDiff, 100 - this._percentageHeight);
      newHeight = this._percentageHeight + yDiff
      this._heightSib.style.height = this._sibPercentageHeight - yDiff + this._heightModifier;
    } else {
      newHeight = this._height + yDiff;
      if (bN) {
        this._elem.style.top = this._top - yDiff + "px";
      }
    }

    this._elem.style.height = newHeight + this._heightModifier;
  }

  
  if (!posToRestore) {
    posToRestore = {x:this._width, y:this._height}
  } else {
    if (!this.isMinimized(this._width)) {
      posToRestore.x = this._width;
    }
    if (!this.isMinimized(this._height)) {
      posToRestore.y = this._height;
    }
  }
  this._elem._toRestore = posToRestore;
};



function workspaceResized(elem) {
  
  var barYInfo = [elem.previousSibling.style.height];
  if (elem._toRestore) {
    barYInfo[1] = elem._toRestore.y;
  }
  document.mainForm.dividerBarY.value = barYInfo.toJSONString();
}


function workspaceOnLoad(elem) {
  if (elem) {
    var barYInfo = document.mainForm.dividerBarY.value;
    if (barYInfo) {
      barYInfo = barYInfo.parseJSON()
      if (barYInfo.length > 1) {
        elem._toRestore = {y:barYInfo[1]};
      }
    }
  }
}


function leftNavResized() {
  var width = window.event.srcElement.offsetWidth;
  document.getElementById('mainContent').childNodes[0].style.marginLeft=(width+2)+'px';
  var widthInfo = [width];
  if (window.event.srcElement._toRestore) {
    widthInfo[1] = window.event.srcElement._toRestore.x
  }
  document.mainForm.leftnavWidth.value = widthInfo.toJSONString();
}


function resizeLeftNavOnload(elem) {
  if (elem) {
    var width = document.mainForm.leftnavWidth.value;
    if (width) {
      width = width.parseJSON();
      elem.style.width = width[0] + 'px';
      if (width.length > 1) {
        elem._toRestore = {x:width[1]};
      }
    }
    elem.onresize = leftNavResized;
  }
}
///////////////////////////////////////////////////////////
// BEGIN ScrollingPanel.js





window.ScrollingPanel = new ScrollingPanelImpl();

function ScrollingPanelImpl() {
  this.zIndex = 50;
  this.maxWidth = 300;
  this.maxHeight = 100;

  this.panel = null; 
  this.upScroller = null; 
  this.downScroller = null; 

  this.scrollIntervalID = null;
}

ScrollingPanelImpl.prototype.showText = ScrollingPanelImpl_showText;
ScrollingPanelImpl.prototype.hideText = ScrollingPanelImpl_hideText;
ScrollingPanelImpl.prototype.mouseDownHandler = ScrollingPanelImpl_mouseDownHandler;





function ScrollingPanelImpl_showText(elem, content, styleClass, bFormattedHTML, maxWidth, maxHeight, bAutoHide) {

  ScrollingPanelImpl_createPanel(styleClass, bAutoHide);
  ScrollingPanel.panel.elem = elem;

  ScrollingPanel.panel.style.display = 'block';
  if (bFormattedHTML) {
    ScrollingPanel.panel.innerHTML = content;
  } else {
    ScrollingPanel.panel.innerText = content;
  }

  
  if (maxWidth == null) {
    maxWidth = ScrollingPanel.maxWidth;
  }
  if (maxHeight == null) {
    maxHeight = ScrollingPanel.maxHeight;
  }
  if(document.all) {
    ScrollingPanel.panel.style.width = '0%';
  }
  ScrollingPanel.panel.style.whiteSpace = 'nowrap';
  
  for (var i = 0; i < ScrollingPanel.panel.childNodes.length; i ++) {
    if (ScrollingPanel.panel.childNodes[i].style != null) {
      ScrollingPanel.panel.childNodes[i].style.overflowX = "visible";
    }
  }
  ScrollingPanel.panel.style.width = Math.min(Math.max(ScrollingPanel.panel.offsetWidth, ScrollingPanel.panel.scrollWidth), maxWidth);
  ScrollingPanel.panel.style.whiteSpace = 'normal';
  ScrollingPanel.panel.style.height = Math.min(
          ScrollingPanel.panel.scrollHeight
                  + ScrollingPanelImpl_safeParseInt(DHTML.getStyle(ScrollingPanel.panel, "border-top-width"))
                  + ScrollingPanelImpl_safeParseInt(DHTML.getStyle(ScrollingPanel.panel, "border-bottom-width")),
          maxHeight);

  
  ScrollingPanel.panel.style.left = DHTML.getElementLeft(elem); 
  if (ScrollingPanel.panel.offsetLeft + ScrollingPanel.panel.clientWidth > ScrollingPanel.panel.offsetParent.offsetWidth) {
    ScrollingPanel.panel.style.left = ScrollingPanel.panel.offsetParent.offsetWidth - ScrollingPanel.panel.offsetWidth; 
  } else if (ScrollingPanel.panel.offsetLeft < 0) {
    ScrollingPanel.panel.style.left = 0; 
  }
  ScrollingPanel.panel.style.top = DHTML.getElementTop(elem) + elem.offsetHeight + 1; 
  if (elem.tagName == 'SELECT' || 
      elem.getAttribute('autocomplete') != null ||
      ScrollingPanel.panel.offsetTop + ScrollingPanel.panel.clientHeight > ScrollingPanel.panel.offsetParent.offsetHeight) { 
    ScrollingPanel.panel.style.top = DHTML.getElementTop(elem) - ScrollingPanel.panel.offsetHeight - 1; 
  }

  DHTML.shimElement(ScrollingPanel.panel);

  
  if (ScrollingPanel.panel.scrollHeight > ScrollingPanel.panel.style.pixelHeight) {

    var left = ScrollingPanel.panel.offsetLeft + ScrollingPanelImpl_safeParseInt(DHTML.getStyle(ScrollingPanel.panel, "border-left-width"));
    var width = ScrollingPanel.panel.clientWidth;
    var topBorderWidth = ScrollingPanelImpl_safeParseInt(DHTML.getStyle(ScrollingPanel.panel, "border-top-width"));

    
    ScrollingPanel.upScroller.style.width = width;
    ScrollingPanel.upScroller.style.left = left;
    ScrollingPanel.upScroller.style.top = ScrollingPanel.panel.offsetTop + topBorderWidth;

    
    ScrollingPanelImpl_showScroller(false);
    ScrollingPanel.downScroller.style.width = width;
    ScrollingPanel.downScroller.style.left = left;
    ScrollingPanel.downScroller.style.top = ScrollingPanelImpl_safeParseInt(DHTML.getStyle(ScrollingPanel.panel, "top"))
            + topBorderWidth + ScrollingPanel.panel.clientHeight - ScrollingPanel.downScroller.offsetHeight;
  }
}

function ScrollingPanelImpl_safeParseInt (value) {
  var i = parseInt(value,10);
  if (isNaN(i)) {
    i = 0;
  }
  return i;
}


function ScrollingPanelImpl_hideText(elem) {
  if (ScrollingPanel.panel == null || ScrollingPanel.panel.style.display == 'none' ||
      elem != null && elem != ScrollingPanel.panel.elem) {
    return null;
  } else {
    ScrollingPanel.panel.style.display = 'none';
    var oldText = DHTML.getInnerText(ScrollingPanel.panel);
    DHTML.innerHTML = '';

    DHTML.unshimElement(ScrollingPanel.panel);
    ScrollingPanelImpl_hideScroller(true);
    ScrollingPanelImpl_hideScroller(false);

    ScrollingPanelImpl_stopScrolling();

    return oldText;
  }
}


function ScrollingPanelImpl_createPanel(styleClass, bAutoHide) {
  if (ScrollingPanel.panel == null) {

    
    ScrollingPanel.panel = document.createElement('DIV');
    ScrollingPanel.panel.style.cssText = 'position:absolute;overflow-y:hidden;z-index:' + ScrollingPanel.zIndex;
    ScrollingPanel.panel.onmousedown = DHTML.cancelEventFunction;
    ScrollingPanel.panel.onclick = function() { Recorder.click(event.srcElement); DHTML.cancelEventFunction();};
    document.mainForm.appendChild(ScrollingPanel.panel);

    
    ScrollingPanelImpl_createScroller(true);
    ScrollingPanelImpl_createScroller(false);
  }
  ScrollingPanel.panel.className = styleClass;
  ScrollingPanel.panel.bAutoHide = bAutoHide;
}

function ScrollingPanelImpl_mouseDownHandler() {
  with (ScrollingPanel) {
    if (panel != null && panel.bAutoHide) {
      hideText();
    }
  }
}


function ScrollingPanelImpl_createScroller(bUp) {

  
  var bgDiv = document.createElement('DIV');
  bgDiv.style.cssText = 'border:0px;padding:'
          + (bUp ? '1px 0px 0px 0px' : '0px 0px 1px 0px')
          + ';position:absolute;display:none;text-align:center;background-color:'
          + DHTML.getStyle(ScrollingPanel.panel, "background-color")
          + ';z-index:' + (ScrollingPanel.zIndex + 1);
  document.body.appendChild(bgDiv);

  
  var img = document.createElement('IMG');
  img.src = 'images\/' + (bUp ? 'up' : 'down') + '.png';
  img.style.cssText = "border:0px;filter:alpha(opacity=80);";
  img.onmouseover = bUp ?
                    function () {ScrollingPanelImpl_stopScrolling();ScrollingPanel.scrollIntervalID = setInterval('ScrollingPanelImpl_scroll(-2)', 20)} :
                    function () {ScrollingPanelImpl_stopScrolling();ScrollingPanel.scrollIntervalID = setInterval('ScrollingPanelImpl_scroll(2)', 20)};
  img.onmouseout = ScrollingPanelImpl_stopScrolling;
  bgDiv.appendChild(img);

  if (bUp) {
    ScrollingPanel.upScroller = bgDiv;
  } else {
    ScrollingPanel.downScroller = bgDiv;
  }
}


function ScrollingPanelImpl_showScroller(bUp) {
  if (bUp) {
    if (ScrollingPanel.upScroller.style.display == 'none') {
      ScrollingPanel.upScroller.style.display = 'block';
    }
  } else {
    if (ScrollingPanel.downScroller.style.display == 'none') {
      ScrollingPanel.downScroller.style.display = 'block';
    }
  }
}



function ScrollingPanelImpl_hideScroller(bUp) {
  if (bUp) {
    if (ScrollingPanel.upScroller.style.display == 'block') {
      ScrollingPanel.upScroller.style.display = 'none';
    }
  } else {
    if (ScrollingPanel.downScroller.style.display == 'block') {
      ScrollingPanel.downScroller.style.display = 'none';
    }
  }
}



function ScrollingPanelImpl_scroll(delta) {
  ScrollingPanel.panel.scrollTop += delta;

  
  if (ScrollingPanel.panel.scrollTop > 0) {
    ScrollingPanelImpl_showScroller(true);
  } else {
    ScrollingPanelImpl_hideScroller(true);
  }

  
  if (ScrollingPanel.panel.scrollTop < ScrollingPanel.panel.scrollHeight - ScrollingPanel.panel.clientHeight) {
    ScrollingPanelImpl_showScroller(false);
  } else {
    ScrollingPanelImpl_hideScroller(false);
  }
}


function ScrollingPanelImpl_stopScrolling() {
  if (ScrollingPanel.scrollIntervalID != null) {
    clearInterval(ScrollingPanel.scrollIntervalID);
    ScrollingPanel.scrollIntervalID = null;
  }
}

///////////////////////////////////////////////////////////
// BEGIN Shuttle.js



window.Shuttle = new ShuttleImpl();

function ShuttleImpl() {
}

ShuttleImpl.prototype.shuttleSelectionChanged = ShuttleImpl_shuttleSelectionChanged;
ShuttleImpl.prototype.select = ShuttleImpl_select;
ShuttleImpl.prototype.deselect = ShuttleImpl_deselect;
ShuttleImpl.prototype.remove = ShuttleImpl_remove;
ShuttleImpl.prototype.copyValueToSelectAndClear = ShuttleImpl_copyValueToSelectAndClear;



function ShuttleImpl_shuttleSelectionChanged(id) {
  var baseId = id.substr(0, id.lastIndexOf("_"));
  var otherSelect, myButton, otherButton;
  if(StringUtil.endsWith(id, "_left")){
    otherSelect = DHTML.getElementById(baseId + "_right");
    myButton = DHTML.getElementById(baseId + "_right_button");
    otherButton = DHTML.getElementById(baseId + "_left_button");
  } else {
    otherSelect = DHTML.getElementById(baseId + "_left");
    myButton = DHTML.getElementById(baseId + "_left_button");
    otherButton = DHTML.getElementById(baseId + "_right_button");
  }
  otherSelect.selectedIndex = -1;
  DHTML.setButtonEnabled(myButton, true);
  DHTML.setButtonEnabled(otherButton, false);
}

function ShuttleImpl_select(id) {
  var unselectedSelect = DHTML.getElementById(id + "_left");
  var selectedSelect = DHTML.getElementById(id + "_right");
  for(var i = 0; i < unselectedSelect.options.length; i++) {
    var option = unselectedSelect.options[i];
    if(option.selected) {
      unselectedSelect.remove(i);
      i--;
      DHTML.insertSelectOptionBefore(selectedSelect, option,
              DHTML.getSelectOptionAfter(selectedSelect, option.getAttribute("order")));
      option.selected = false;
    }
  }
  ShuttleImpl_refreshBackingSelect(id);
  DHTML.setButtonEnabled(DHTML.getElementById(id + "_left_button"), false);
  DHTML.setButtonEnabled(DHTML.getElementById(id + "_right_button"), false);
}

function ShuttleImpl_deselect(id) {
  var unselectedSelect = DHTML.getElementById(id + "_left");
  var selectedSelect = DHTML.getElementById(id + "_right");
  for(var i = 0; i < selectedSelect.options.length; i++) {
    var option = selectedSelect.options[i];
    if(option.selected) {
      selectedSelect.remove(i);
      i--;
      DHTML.insertSelectOptionBefore(unselectedSelect, option,
              DHTML.getSelectOptionAfter(unselectedSelect, option.getAttribute("order")));
      option.selected = false;
    }
  }
  ShuttleImpl_refreshBackingSelect(id);
  DHTML.setButtonEnabled(DHTML.getElementById(id + "_left_button"), false);
  DHTML.setButtonEnabled(DHTML.getElementById(id + "_right_button"), false);
}

function ShuttleImpl_remove(id) {
  var selectedSelect = DHTML.getElementById(id + "_right");
  for(var i = 0; i < selectedSelect.options.length; i++) {
    var option = selectedSelect.options[i];
    if(option.selected) {
      selectedSelect.remove(i);
      i--;
    }
  }
  ShuttleImpl_refreshBackingSelect(id);
  DHTML.setButtonEnabled(DHTML.getElementById(id + "_remove_button"), false);
}

function ShuttleImpl_copyValueToSelectAndClear(textBox, backingSelectId) {
  var entry = textBox.value;
  var backingSelect = DHTML.getElementById(backingSelectId);
  var selectedSelect = DHTML.getElementById(backingSelectId + "_right");
  var found = false;
  for(var i = 0; i < backingSelect.options.length; i++) {
    var option = backingSelect.options[i];
    if (option.text == entry) {
      if (!option.selected) {
        option.selected = true;
        var newOption = new Option(option.text, option.value);
        DHTML.insertSelectOptionBefore(selectedSelect, newOption,
                DHTML.getSelectOptionAfter(selectedSelect, option.getAttribute("order")));
        newOption.setAttribute("order", option.getAttribute("order"));
      }
      found = true;
      break;
    }
  }
  if(!found) {
    var newOption = new Option(entry, entry);
    DHTML.insertSelectOptionBefore(backingSelect, newOption, null);
    newOption.selected = true;
    newOption = new Option(entry, entry);
    DHTML.insertSelectOptionBefore(selectedSelect, newOption, null);
  }
  textBox.value = '';
}

function ShuttleImpl_refreshBackingSelect(id) {
  var backingSelect = DHTML.getElementById(id);
  var selectedSelect = DHTML.getElementById(id + "_right");
  for(var i = 0; i < backingSelect.options.length; i++) {
    var selected = false;
    for(var j = 0; j < selectedSelect.options.length; j++) {
      if(backingSelect.options[i].value == selectedSelect.options[j].value) {
        selected = true;
        break;
      }
    }
    backingSelect.options[i].selected = selected;
  }
  Recorder.changed(backingSelect);
}
///////////////////////////////////////////////////////////
// BEGIN StringBuffer.js


function StringBuffer() {

  this.stringArray = new Array();

}

StringBuffer.prototype.append = function(str) {
  ArrayUtil.appendElement(this.stringArray, str);
  return this;
}

StringBuffer.prototype.toString = function() {
  return this.stringArray.join('');
}


///////////////////////////////////////////////////////////
// BEGIN StringUtil.js



window.StringUtil = new StringUtilImpl();


function StringUtilImpl() {
  
}


StringUtilImpl.prototype.capitalizeFirstLetter = function(str) {
  if (str.length > 0) {
    var firstChar = str.substring(0,1);
    var end = str.substring(1, str.length);
    return firstChar.toUpperCase() + end;
  } else {
    return str;
  }
}


StringUtilImpl.prototype.endsWith = function(strA, strB) {
  if (!strA || strA.length < strB.length) {
    return false;
  }
  return strA.substr(strA.length - strB.length) == strB;
}


StringUtilImpl.prototype.splitEntityOption = function(entityOption) {
  if(entityOption == null) {
    return null;
  }

  return entityOption.split( ":" );
}


StringUtilImpl.prototype.composeUserGroupValue = function(user, group) {
  return "User:" + user + ";Group:" + group;
}


StringUtilImpl.prototype.trim = function(str) {
  return str == null ? str : str.replace(/^\s+|\s+$/g,"");
}

///////////////////////////////////////////////////////////
// BEGIN TreeView.js



var TreeView = {
  createTree : TreeViewImpl_createTree,
  treeElemsByFullId : []
}



function TreeViewImpl_createTree(info) {

  info.foldersToggled = [] 
  var container = document.getElementById(info.id);
  var buf = new StringBuffer();
  TreeViewImpl_createChildNodes(buf, info);
  container.innerHTML = buf.toString();

}


function TreeViewImpl_createChildNodes(buf, node) {
  if (!node.items) {
    return;
  }

  
  var prefix = node.prefix
  if (node.parent != node.tree) {
    prefix = (prefix ? prefix + ',' : '') + (node.bLast ? 'empty' : 'line');
  }

  if (node.items.length == 0) {
    
    TreeViewImpl_renderNode(buf, null, prefix)
  } else {
    for (var i = 0; i < node.items.length; i++) {
      var child = node.items[i];
      child.parent = node;
      child.tree = node.tree ? node.tree : node;
      if (prefix) {
        child.prefix = prefix;
      }
      if (i==(node.items.length-1)) {
        child.bLast = true;
      }

      TreeViewImpl_renderNode(buf, child);

      
      buf.append('<div')
              .append(' id = "tv_div_').append(child.tree.id).append('_').append(child.id).append('"')
              .append(' style="display:').append(child.open ? 'block' : 'none').append('">');
      TreeViewImpl_createChildNodes(buf, child);
      buf.append('</div>');
    }
  }

}


function TreeViewImpl_createIcon(buf, icon, node, id) {

  
  if (node) {
    var fullId = node.tree.id+'_'+node.id;
    TreeView.treeElemsByFullId[fullId] = node;
    buf.append('<a href="javascript:void(TreeViewImpl_toggleFolder(\'').append(id).append('\'))"')
            .append(' onclick="return Events.isNavigationAllowed()" id=').append(id)
            .append(' node="').append(fullId).append('"')
            .append('>');
  }

  buf.append('<img src="').append(Events.getResourceURL(icon)).append('"')
      .append(' border=0 width=18 height=18, align=top />');

  if (node) {
    buf.append('</a>')
  }
}


function TreeViewImpl_toggleFolder(elemId) {
  var elem = document.getElementById(elemId);
  var node = TreeView.treeElemsByFullId[elem.getAttribute('node')]
  node.open = !node.open;

  
  elem.childNodes[0].src = 'images/tree/folder-' + (node.open ? 'open' : 'closed') + '.png';

  
  var contentsDiv = DHTML.getElementById('tv_div_' + node.tree.id+'_'+node.id);
  contentsDiv.style.display = node.open ? 'block' : 'none';

  if (node.items.length == 0 && node.open) {
    
    AJAX.initRequest(node.tree.id, {folderId:node.id}, function() {
      node.items = AJAX.returnValue;
      var buf = new StringBuffer()
      TreeViewImpl_createChildNodes(buf, node)
      contentsDiv.innerHTML = buf.toString()
    }, true)
  } else {
    
    var index = ArrayUtil.indexOf(node.id, node.tree.foldersToggled);
    if (index >= 0) {
      ArrayUtil.removeElement(node.tree.foldersToggled, index);
    } else {
      ArrayUtil.appendElement(node.tree.foldersToggled, node.id);
    }
    
    document.getElementById(node.tree.id + '_toggle').value = node.tree.foldersToggled.toString();
  }
}


function TreeViewImpl_clickNode(elemId) {
  var node = TreeView.treeElemsByFullId[document.getElementById(elemId).getAttribute('node')]
  Events.invokeEvent(node.tree.id, true, node.id);
}


function TreeViewImpl_renderPrefixIcons(buf, iconList) {
  if (iconList) {
    var iconArray = iconList.split(',');
    for (var i = 0; i < iconArray.length; i++){
      TreeViewImpl_createIcon(buf, 'images/tree/'+ iconArray[i] +'.png')
    }
  }
}


function TreeViewImpl_renderNode(buf, node, prefix) {
  TreeViewImpl_renderPrefixIcons(buf, prefix  || (node && node.prefix));
  
  if (node == null) { 
    
    TreeViewImpl_createIcon(buf, 'images/tree/loading_icon.png')

    buf.append('<span class="treeViewLoading">').append(AJAX.getLoadingHTML()).append('</span>')

  } else {
    
    
    if (node.parent != node.tree) {
      TreeViewImpl_createIcon(buf, 'images/tree/' + (node.bLast ? 'corner' : 'cross') + '.png');
    }

    var styleClass = node.current ? 'treeViewCurrentItem ' : '';
    var fullId = node.tree.id+'_'+node.id
    if (node.items) { 
      TreeViewImpl_createIcon(buf, 'images/tree/folder-' + (node.open ? 'open' : 'closed') + '.png',
              node, 'tv_folder_' + fullId, "Folder: " + node.id);
      styleClass += node.tree.folderStyle;
    } else { 
      TreeViewImpl_createIcon(buf, 'images/tree/dash.png');
      styleClass += node.tree.leafStyle;
    }

    if (node.canClick) {
      
      TreeView.treeElemsByFullId[fullId] = node;
      buf.append('<span class="').append(styleClass).append('">')
          .append('<a href="javascript:void(TreeViewImpl_clickNode(\'').append(fullId).append('\'))"')
          .append(' id="').append(fullId).append('"')
          .append(' node="').append(fullId).append('"')
          .append(' class="').append(styleClass).append('">')
          .append(node.lbl)
          .append('</a>')
          .append('</span>');
    } else {
      
      buf.append('<span class="').append(styleClass).append('" id="').append(fullId).append('">')
              .append(node.lbl)
              .append('</span>');
    }
  }

  buf.append('<br>');

}


