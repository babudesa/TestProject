/**
 * Gets the new primary phone value, based on the phone number inputs. If the current
 * primary phone value is blank, and there is exactly one non-blank phone number input,
 * then the primary phone value corresponding to that non-blank input is returned.
 * Otherwise, the special <NOCHANGE> reflection token is returned.
 */
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