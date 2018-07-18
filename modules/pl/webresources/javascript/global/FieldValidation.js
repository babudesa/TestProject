/**
 * Handles validation of input fields, particularly the registering of input masks on text inputs.
 */
var FieldValidation = {

  //--------------------------------------------------- member variables:

  /**
   * The map of validated fields
   */
  validators : new Array(),
  /**
   * The character used as the mask wildcard
   */
  defaultPlaceHolderChar : null,

  //---------------------------------------------------- methods:
  
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


/**
 * Removes any input masking still present in input fields.
 */
function FieldValidationImpl_unmaskInputFields() {
  for(var i = 0; i < FieldValidation.validators.length; i++) {
    FieldValidationImpl_unmaskField(FieldValidation.validators[i]);
  }
}

/**
 * Unmasks a single field validator
 */
function FieldValidationImpl_unmaskField(validator) {
  // Only check if field still exists
  if (document.getElementById(validator.id) == validator.input) {
    validator.input.value = FieldValidation.unmaskFieldValue(validator.input.value, validator.mask, validator.input.placeholderChar);
  }
}

/**
 * Applies a mask to a single form input
 */
function FieldValidationImpl_applyFieldMask(input) {
  var validator = FieldValidation.getValidatorForInput(input);
  if (validator != null) {
    input.value = FieldValidationImpl_maskFieldValue(input.value, validator.mask, input.placeholderChar);
  }
}

/**
 * Gets the unmasked value of a single form input
 */
function FieldValidationImpl_getUnmaskedInputValue(input) {
  var validator = FieldValidation.getValidatorForInput(input);
  return validator == null ? input.value : FieldValidation.unmaskFieldValue(input.value, validator.mask, input.placeholderChar);
}

/**
 * Retrieves the validator for a given field, or null if it's not validating
 */
function FieldValidationImpl_getValidatorForInput(input) {
  for(var i = 0; i < FieldValidation.validators.length; i++) {
    if(FieldValidation.validators[i].input == input) {
      return FieldValidation.validators[i];
    }
  }
  return null;
}

/**
 * Masks a value according to the input mask of the given input
 */
function FieldValidationImpl_maskValueForInput(value, input) {
  var validator = FieldValidation.getValidatorForInput(input);
  if(validator != null) {
    return FieldValidationImpl_maskFieldValue(value, validator.mask, input.placeholderChar);
  } else {
    return value;
  }
}

/**
 * Puts a client-side validation format on a given field
 */
function FieldValidationImpl_setInputFieldValidator(id, mask, placeholderChar) {
  var input = DHTML.getElementById(id, true);
  if(input) {
    var validator = FieldValidation.getValidatorForInput(input)
    if(mask.length == 0 && validator == null) {
      return; // do not creat new object, if no mask
    }

    if (!validator) {
      // Register new validator
      validator = new Object();
      FieldValidation.validators[FieldValidation.validators.length] = validator;

      validator.id = input.id;
      validator.input = input;

      // register event handlers:

      DHTML.appendToEventHandler(input, "onkeydown", FieldValidationImpl_maskInput);
      DHTML.insertToEventHandler(input, "onkeypress", FieldValidationImpl_maskInput);

      DHTML.appendToEventHandler(input, "oncut", FieldValidationImpl_maskInput);
      DHTML.appendToEventHandler(input, "onpaste", FieldValidationImpl_maskInput);

      DHTML.appendToEventHandler(input, "onblur", FieldValidationImpl_fireOnchangeIfNeeded);

    } else if (validator.mask) {
      // clear old mask:
      input.value = FieldValidation.unmaskFieldValue(input.value, validator.mask, input.placeholderChar);
      if (input.oldSize) {
        input.size = input.oldSize;
        input.maxLength = input.oldMaxLength;
        input.style.fontFamily = input.oldFontFamily;
      }
    }

    // do not override existing placeholder char, if not specified:
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
        // workaround the problem that Japanese characters are wider
        input.size += (input.isDateTime == 'true' ? 3 : 2);
      }
      input.style.fontFamily = 'Courier New,Courier,monotype';

      input.value = FieldValidationImpl_maskFieldValue(input.value, validator.mask, input.placeholderChar);
    }
  }
}

/**
 * Called by the calendar widget to impose a special date validation mask on a field
 */
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
/**
 * Masks an input by trapping key & clipboard events
 * This function does the basic processing and then hands control
 * to FieldValidationImpl_maskAddChars or FieldValidationImpl_maskRemoveChars
 */
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
    return; // do nothing when it's not directy changed by the user
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
      if(keyCode == 8 || keyCode == 46) { // Delete
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
    } else { // Char to add
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
    if (numSelectedText > 0) { // mask-remove selected chars:
      valueAfterCaret = FieldValidationImpl_removeUnmaksedChars(valueAfterCaret,
              subMask, input.placeholderChar, numSelectedText);
    }

    var newChars = window.clipboardData.getData("Text").replace(/[\r|\n|\r\n].*/g, ""); // disallow more than 1 line      
    var numNewChars = newChars.length;
    if (numNewChars > 0) { // insert pasted chars:
      var result = FieldValidationImpl_insertUnmaskedChars(
              valueAfterCaret, subMask, input.placeholderChar, newChars);
      valueAfterCaret = result.newValue;
      numNewChars += result.caretDelta;
    }

    // PL-13792 when pasting with no selection need to make room for r   
    if (r.text.length == 0 && input.value == mask) {
        r.moveEnd('character', numNewChars);
    } else {
        r.moveEnd('character', 1);
    } 

    if (numSelectedText == r.text.length) {
      r.text = valueAfterCaret;
    } else {
      r.moveEnd('character', -1);
      
      var maxLength = input.maxLength;
      input.maxLength = input.oldMaxLength;

      //
      // Insert changed value in multiple step, to keep caret in the right position:
      // (To workaround IE bug - caret position set programmatically is ignored after paste is done)
      //
      r.text = valueAfterCaret.substr(0, numNewChars); // insert new chars first, so that the caret postion is remembered
      if (input.value.length > maxLength) {
        var remaining = valueAfterCaret.substr(numNewChars);
        // move the caret away from current position, so that following change does not affect caret postion afterwards
        r.moveStart('character', 1);
        r.moveEnd('character', oldValue.length - selectIndex); // select till the end
        r.text = remaining;
        // remove the 1 char that separates the new chars and remaining cars:
        r.moveEnd('character', -remaining.length)
        r.moveStart('character', -1)
        r.text = ''
      }

      // restore caret position anyway, even though it doesn't seem to work during paste:
      FieldValidationImpl_moveCarat(input, selectIndex + numNewChars);

      input.maxLength = maxLength;
      input.maskFieldChanged = true;
    }
  }
  window.event.returnValue = false;
}

/**
 * Adds characters to the masked input
 */
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
//      var maskChar = mask.charAt(selectIndex);
//      if(maskChar == input.placeholderChar) {
//        if('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz '.indexOf(nextChar) != -1) {
//          FieldValidationImpl_setInputChar(input, selectIndex++, nextChar);
//        }
//      }

      selectIndex++;
      availableSpace--;
    }
  }
  FieldValidationImpl_moveCarat(input, selectIndex);
}

/**
 * Similar to FieldValidationImpl_maskAddChars, but only calculate the new value without changing the input value
 * @param value old value
 * @param mask
 * @param placeholderChar
 * @param chars chars to insert into the beginning of the old value; these chars can be masked or unmasked
 * @return the new value and caret position change (due to insert non-placeholder chars from the mask)
 */
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
      // skip mask in the new value:
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

/**
 * Similar to FieldValidationImpl_maskRemoveChars(), but only calculates the new value without changing the input
 * @param value old value
 * @param mask
 * @param placeholderChar
 * @param numCharsToRemove # of chars to remove from the beginning of the old value
 * @return new value
 */
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

/**
 * Removes characters from the masked input
 */
function FieldValidationImpl_maskRemoveChars(input, mask, selectIndex, selectLength) {
  input.maskFieldChanged = true;
  if(selectLength == 0) {
    selectIndex--;
    while(selectIndex >= 0 && mask.charAt(selectIndex) != input.placeholderChar) {
      selectIndex--;
    }
    selectLength++;
    if(selectIndex < 0) { // Can't delete first character
      return;
    }
  }
  for(var i = 0; i < selectLength; i++) {
//    FieldValidationImpl_setInputChar(input, selectIndex + i, mask.charAt(selectIndex + i));
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
//  while(selectIndex > 1 && mask.charAt(selectIndex - 1) != input.placeholderChar) {
//    selectIndex--;
//  }
  FieldValidationImpl_moveCarat(input, selectIndex);
}

/**
 * Sets a single character in an input value
 */
function FieldValidationImpl_setInputChar(input, index, nextChar) {
  input.value = input.value.substring(0, index) +
                nextChar +
                input.value.substring(index + 1, input.value.length);
}

/**
 * Moves the selection to the given index
 */
function FieldValidationImpl_moveCarat(input, selectIndex) {
  var inputRange = input.createTextRange();
  inputRange.collapse();
  inputRange.move('character', selectIndex);
  inputRange.select();
}

/**
 * Returns the result of a applying mask to a given value
 */
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

/**
 * Returns the result of removing a mask from a given value
 */
function FieldValidationImpl_unmaskFieldValue(value, mask, placeholderChar) {
  if(mask.length == 0) {
    return value;
  }
  if(mask == value) {
    return '';
  }
  value = value.substr(0, mask.length);
  if(mask.charAt(mask.length - 1) == placeholderChar) { // If last char is a wildcard, allow partial fill
    while(value.length > 0 && value.charAt(value.length - 1) == mask.charAt(value.length - 1)) {
      value = value.substr(0, value.length - 1);
    }
  }
  return value;
}
