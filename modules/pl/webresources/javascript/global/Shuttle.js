/**
 *
 */

//-------------------------------------------------------------------------- interface
window.Shuttle = new ShuttleImpl();

function ShuttleImpl() {
}

ShuttleImpl.prototype.shuttleSelectionChanged = ShuttleImpl_shuttleSelectionChanged;
ShuttleImpl.prototype.select = ShuttleImpl_select;
ShuttleImpl.prototype.deselect = ShuttleImpl_deselect;
ShuttleImpl.prototype.remove = ShuttleImpl_remove;
ShuttleImpl.prototype.copyValueToSelectAndClear = ShuttleImpl_copyValueToSelectAndClear;

//-------------------------------------------------------------------------- implementation

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