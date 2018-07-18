package gw.api.claim

uses pcf.api.Location
uses com.guidewire.pl.system.expression.WebImmediate

@Export
class NewClaimWizardInfo extends NewClaimWizardInfoBase {

  private var _homeownersHelper : FnolWizardHomeownersHelper
  private var _vehicleHelper : FnolWizardVehicleHelper as readonly VehicleHelper
  var _assignSaveNote : Note
  
  construct(location : Location) {
    this(location, gw.api.claim.NewClaimCheck)
  }

  construct(location : Location, type : Type) {
    super(location, type)
  }
  
  property get AssignSaveNoteBody() : String {
    return _assignSaveNote.Body
  }
  
  /**
   * This is the note on the Assign & Save wizard.
   */
  property set AssignSaveNoteBody(body:String) {
    //if null, create one and add to draft Claim
    if(_assignSaveNote==null) {
      if(body!=null) {
        _assignSaveNote = new Note()
        _assignSaveNote.Author = User.util.CurrentUser
        _assignSaveNote.Topic = NoteTopicType.TC_FNOL
        _assignSaveNote.Body = body
        Claim.addToNotes(_assignSaveNote)
      }
    } else {
      if(body==null) {  //remove the note
        Claim.removeFromNotes(_assignSaveNote)
        _assignSaveNote = null
      } else {          //change the note body
        _assignSaveNote.Body = body
      }
    }
  }
  
  property get VehicleHelper() : FnolWizardVehicleHelper {
    if(this._vehicleHelper == null)
      _vehicleHelper = new FnolWizardVehicleHelper()
    return _vehicleHelper
  }

  property get HomeownersHelper() :  FnolWizardHomeownersHelper {
    if (_homeownersHelper == null) {
      _homeownersHelper = new FnolWizardHomeownersHelper(this.Claim) 
    }
    return _homeownersHelper
  }
  
  property get SelectedPolicyType() : PolicyType {
    var type = PolicyDescription.PolicyVerified ? PolicyDescription.PolicySummary.PolicyType : PolicyDescription.UnverifiedPolicyType
    if (type == null) {
      // User didn't select type; can happen if re-enter wizard for draft claim
      type = Claim.Policy.PolicyType
    }
    return type
  }

  override property get Check() : NewClaimCheck {
    return super.getCheck() as NewClaimCheck
  }
  
  /**
   * Method to be called if required field may have a value incompatible with
   * the full claim wizard.
   */
  @WebImmediate
  function goToFullWizardFromIncompatible(returnStep:String, highWaterMark:String) {
     var isIncompatible:boolean = (FirstFinalReportedAgency == "VENDOR")
     if(isIncompatible) {
       Claim.reporter = null
     }
     returnToFullWizardAndRemoveExposures(returnStep, highWaterMark, !isIncompatible)
  }
  
  /**
   * Resets the Claim Wizard when the policy is changed.
   */
  function resetClaimForPolicyChange() {
    foreach (existingIncident in Claim.Incidents){
      Claim.removeFromIncidents( existingIncident )
    }
    foreach (exposure in Claim.Exposures){
      removeExposureFromAssignments(exposure)
      Claim.removeFromExposures(exposure)
    }
    Claim.reporter = null
    Claim.ReportedByType = null
    Claim.ReportedDate = null
    Claim.HowReported = null
    Claim.maincontact = null
    Claim.MainContactType = null
    Claim.LossLocation = null
    Claim.claimant = null
    Claim.LOBCode = null

    _homeownersHelper = null
    _vehicleHelper = null
    _assignSaveNote = null

    setHighWaterMarkAsCurrentStep()
  }
}
