/**
 * Renders a field that never reveals any existing  (i.e., previously committed) value,
 * but allows the user to enter new value.
 */

//TODO: support client reflection on availability for encrypted field

//------------------------------------------------------- interface:
var EncryptedField = {
  encryptFields : EncryptedFieldImpl_encryptFields,
  preSubmit : EncryptedFieldImpl_preSubmit,
  preSetValue : EncryptedFieldImpl_preSetValue,
  postSetAvailability : EncryptedFieldImpl_postSetAvailability,
  isDisabled : EncryptedFieldImpl_isDisabled
}

//------------------------------------------------------- implementation:
/**
 * Called by server to process all encrypted field on page load
 * @param encryptedValues a map (id -> encrypted value) of all encrypted fields
 * @param menuText an array of menu item text for editing an encrypted field
 */
function EncryptedFieldImpl_encryptFields(encryptedValues, menuText) {
  EncryptedField.menuText = menuText;
  for (var id in encryptedValues) {
    if (encryptedValues.hasOwnProperty(id)) {
      EncryptedFieldImpl_encryptInput(id, encryptedValues[id]);
    }
  }
}

/**
 * Creates an encrypted view for the input, and hides and disables the input.
 */
function EncryptedFieldImpl_encryptInput (id, encryptedValue) {
  if (!encryptedValue) {
    return; // do not encrypt blank value
  }

  var e = document.getElementById(id);
  var menuId = id + '_MENU';

  // create the encrypted view for the input
  var encryptionE = DHTML.createElement('span', 'id', id +'_ENCRYPTED', 'class', 'encryptedValue');
  // copy encrypted value to both the input and its encrypted view:
  e.value = encryptedValue; 
  encryptionE.innerHTML = '<span>' + encryptedValue + '</span><span id="' +menuId+ '_container"></span>' // add a container for menu icon
  encryptionE.text = encryptionE.childNodes[0]
  encryptionE.menu = encryptionE.childNodes[1]
  e.parentNode.insertBefore(encryptionE, e);
  e.encryptionE = encryptionE;

  // crete editing menu
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
  // At last, make sure the input is disabled and hidden:
  e.disabled = true;
  e.style.display = 'none';
}

/**
 * Called after change field availability
 */
function EncryptedFieldImpl_postSetAvailability(e) {
  if (!e.encryptionE) {
    return; // no op, if not encrypted
  }

  if (!e.disabled) { // enabled
    if (e.OLDdisabled == false) {
      return; // no op
    }
    e.OLDdisabled = false;
    if (e.style.display == 'none') {
      e.disabled = true; // always disable, if in encryted view 
    }

    // register event handlers to toggle display mode
    DHTML.appendToEventHandler(e, 'onpaste', EncryptedFieldImpl_getCallbackForDecryptInput(e));
    DHTML.appendToEventHandler(e, 'onkeypress', EncryptedFieldImpl_getCallbackForDecryptInput(e));
    DHTML.appendToEventHandler(e, 'onblur', EncryptedFieldImpl_getCallbackForEncryptInput(e));

    DHTML.removeStyleSuffix(e.encryptionE, "disabled");
    e.encryptionE.menu.style.display = ''; // show menu

  } else {
    if (e.OLDdisabled == true) {
      return; // no op
    }
    e.OLDdisabled = true;

    DHTML.rollbackEventHandler(e, 'onblur', EncryptedFieldImpl_getCallbackForEncryptInput(e));
    DHTML.rollbackEventHandler(e, 'onpaste', EncryptedFieldImpl_getCallbackForDecryptInput(e));
    DHTML.rollbackEventHandler(e, 'onkeypress', EncryptedFieldImpl_getCallbackForDecryptInput(e));

    DHTML.addStyleSuffix(e.encryptionE, "disabled");
    e.encryptionE.menu.style.display = 'none'; // hide menu
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

/**
 * Turns an encrypted field back into a normal field.
 * This method is called when the user changes the field value, so that the new value no longer has to be encrypted
 */
function EncryptedFieldImpl_decryptInput (e) {
  if (typeof(e)==typeof('')) {
    e = document.getElementById(e);
  }
  var encryptedE = e.encryptionE;
  if (!encryptedE) {
    return;
  }
  Debug.log('EncryptedFieldImpl_decryptInput(): ' + e.id);
  e.encryptionE = null; // clear it, so we won't try to decrypt the field again
  encryptedE.parentNode.removeChild(encryptedE);

  DHTML.rollbackEventHandler(e, 'onblur', EncryptedFieldImpl_getCallbackForEncryptInput(e));
  DHTML.rollbackEventHandler(e, 'onpaste', EncryptedFieldImpl_getCallbackForDecryptInput(e));
  DHTML.rollbackEventHandler(e, 'onkeypress', EncryptedFieldImpl_getCallbackForDecryptInput(e));

  if (e.style.display == 'none') {
    EncryptedFieldImpl_toggleInputValue(e, /*encryptedMode*/false);
    e.style.display = '';
    e.disabled = e.OLDdisabled;
  }
}

/**
 * Toggle the input value based on encryption mode
 */
function EncryptedFieldImpl_toggleInputValue(e, encryptedMode) {
  if (encryptedMode) {
    e.value = e.encryptionE.text.innerHTML;
  } else {
    // show empty value in clear text, and apply input mask if any 
    e.value = '';
    FieldValidation.applyFieldMask(e);
  }
}
/**
 * Changes the display of an encrypted field
 * @param e  the Input widget for the field
 * @param encryptedMode  if true, display the field in an encrypted view which does not send value back to server;
 *                       if false, display the field as an input.
 */
function EncryptedFieldImpl_displayEncryptedFieldAs (e, encryptedMode) {
  if (typeof(e)==typeof('')) {
    e = document.getElementById(e);
  }
  var encryptedE = e.encryptionE;
  if (!encryptedE) {
    return; // no-op, if field is not encrypted
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

/**
 * Called before submit form to blur the active element if it's an encrypted field, so that
 * it does not accidentally erase server side value
 */
function EncryptedFieldImpl_preSubmit () {
  var activeE = DHTML.getActiveElement();
  if (activeE) {
    EncryptedFieldImpl_displayEncryptedFieldAs(activeE, true);
  }
}

/**
 * Called when programtically change the field value, to decrypt the field
 */
function EncryptedFieldImpl_preSetValue (e) {
  EncryptedFieldImpl_decryptInput(e);
}
