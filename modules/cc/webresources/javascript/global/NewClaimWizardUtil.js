/**
 * Utility methods for the new claim wizard
 */
function NewClaimWizardUtil() {
}

NewClaimWizardUtil.NO_CHANGE = "<NOCHANGE>";

NewClaimWizardUtil.getMainContactType = function(triggerIndex, mainContact, insured, reportedBy, reportedByType) {
  //alert("triggerIndex=" + triggerIndex + "\nmainContact=" + mainContact + "\ninsured=" + insured + "\nreportedBy=" + reportedBy + "\nreportedByType=" + reportedByType);
  if (triggerIndex == 1) { // Ignore it if the main contact field didn't trigger the event
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