function AJAXAutoCompleter(){
  this.hasCompleteSuggestionList = false;
  this.completeAsOf = 0;
  this.pendingKeyPresses = 0;
}

//------------------------------------------------------
// Class "constants"
//------------------------------------------------------
//Useful keycodes
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

  //IE-ism
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

  //did autocomplete for this field
  this.didAutoComplete = true;

  //If there is a selected element, unselect it
  if(this.selectedIndex >= 0){
    this.setUnselectedStyle(this.dropdown.childNodes[this.selectedIndex], this.selectedIndex);
  }
  this.selectedIndex = newSelectionIndex;
  //bound the selected index
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
  //alert('select down');
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
      // always hit the server again after a space, in case there's
      // a progressively disclosed completion
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
      //alert('did autocomplete');
      this.input.onchange();
    } else {
      //alert('didnt do autocomplete');
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
    //case this.BACKSPACE:
    //These are handled in the keyDown event
    case this.SHIFT:
    //We don't want to do anything for this
    break;
    case this.TAB:
    //Don't want to auto complete on tabbing in
    break;
    case this.DOWN:
      if(!this.autocompleting) {
        this.doAutoComplete();
      }
    break;
    case this.ENTER:
      //alt-enter does auto-complete
      if(event.altKey){
        //alert("keycode is : " + keyPressed);
        this.doAutoComplete();
      } else {
        this.clearAutoComplete();
      }
    break;
    default:
//      if(this.autocompleting){
      this.doAutoComplete();
//      } else {
//        this.showTooltip();
//      }
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

  //Always reset the selection
  if(this.selectedIndex >= 0) {
    this.selectedIndex = -1;
  }

  if(DHTML.getValue(this.input) != requestInputText){
    //user has typed more stuff since we sent the request
    this.doAutoComplete();
    return;
  }

  if(DHTML.getValue(this.input) != this.autoCompletingText){
    //If the user has gotten a head of us, do nothing
    this.clearAutoComplete();
  } else {
    //The user has waited for autocomplete, so set things up and go

    //used in callbacks
    var me = this;

    //Fill in the value
    this.clearResults();

    //If there were no results, return
    if(responseText.length < 1){
      //alert("no results");
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
  //used in callbacks
  var me = this;
  var resultCount = 0;
  //Populate the completions
  for(var i = 0; i < results.length; i++){
    if(results[i].text.length < 1) continue;
    var suggestion = document.createElement("div");
    suggestion.id = this.input.id + "_autocomplete_" + i;
    suggestion.result = results[i];
//    suggestion.style.width = '100%';
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
  //alert('doing auto complete');
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
    // declared so this can be accessed in callbacks
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
    // filter existing results client-side
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

  //------------------------------------------------------
  // Hacky logic to determine position of input widget
  //------------------------------------------------------
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

  //------------------------------------------------------
  // Class variables
  //------------------------------------------------------

  // declared so this can be accessed in callbacks
  var me = this;

  // set up class variables
  this.input = input;
  this.oldInputValue = DHTML.getValue(this.input);
  this.rootId = rootId;
  this.selectedIndex = -1;

  this.autocompleting = false;
  this.isCommandMode = isCommandMode;
  this.suggestsOnEmpty = suggestsOnEmpty;
  this.charsToWaitFor = charsToWaitFor;

  //------------------------------------------------------
  // Set up div for displaying results
  //------------------------------------------------------
  this.dropdown = DHTML.createElement('div');
  this.dropdown.id = input.id + "_autocomplete";
  this.dropdown.style.position="absolute";
  this.dropdown.style.top = 0;
  this.dropdown.style.left = 0;
  this.dropdown.style.zIndex= this.input.style.zIndex + 3;
  this.dropdown.style.height="0px";
  this.dropdown.style.visibility = "hidden";
  this.dropdown.className = "autocomplete";

  //add the dropdown to the document
  document.body.appendChild(this.dropdown);

  //-------------------------------
  // Set up widget events
  //-------------------------------
  DHTML.insertToEventHandler(input, "onkeydown", function(event) {me.handleKeyDown(event)})
  DHTML.insertToEventHandler(input, "onkeyup", function(event) {me.handleKeyUp(event)})
  DHTML.insertToEventHandler(input, "onkeypress", function(event) {(event || window.event).cancelBubble = true;})

  DHTML.appendToEventHandler(input, "onfocus", function() {me.handleFocus()})
  DHTML.appendToEventHandler(input, "onblur", function() {me.handleBlur()})
  
  // add onchange handler to each arg element, to clear out suggestion list when any arg element changes:
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

        // register event handler in a separate function, to create a closure for the element variable
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

  //alert("In MakeAutoCompleter");
  input = (typeof input == 'object') ? input : DHTML.getElementById(input, true);

  //------------------------------------------------------
  // INITIALIZATION LOGIC
  //------------------------------------------------------
  // if there is no autocompleter class specified for this element, or
  // if we have already created an AJAXAutoCompleter for this element, return
  if(input.hasAutoCompleter == true) {
    return;
  }
  // flag this input as having an autocompleter
  input.hasAutoCompleter = true;
  input.autoCompleter = new AJAXAutoCompleter();
  input.autoCompleter.init(input, rootId, isCommandMode, suggestsOnEmpty, charsToWaitFor);
  if(suggestsOnEmpty) {
    input.autoCompleter.doAutoComplete();
  } else {
    input.autoCompleter.clearAutoComplete();
  }
}
