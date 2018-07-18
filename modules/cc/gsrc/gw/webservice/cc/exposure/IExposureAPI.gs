package gw.webservice.cc.exposure

uses entity.Document
uses typekey.ExposureClosedOutcomeType
uses typekey.ExposureReopenedReason
uses typekey.ExposureState
uses entity.Note
uses gw.api.webservice.exception.DataConversionException
uses gw.api.webservice.exception.EntityStateException
uses gw.api.webservice.exception.PermissionException
uses gw.api.webservice.exception.SOAPException
uses gw.api.webservice.exception.SOAPServerException
uses gw.api.webservice.WSRunlevel;

/**
 * IExposureAPI encapsulates the mechanisms available for the manipulation of exposures in the system. External
 * systems make ClaimCenter aware of new exposures by associating them with or adding them to a claim.
 */
@WebService(WSRunlevel.NODAEMONS)
@ReadOnly
class IExposureAPI {

  /**
   * Adds an activity to a exposure using an activity pattern. First, attempts to generate an activity from the given
   * pattern.  The activity pattern must be from the list of activity patterns for the given exposure's claim that meet
   * the following criteria:
   * <p/>
   * 1) if the exposure's claim is closed, then the activity pattern must be available to closed claims<br>
   * 2) the activity pattern's loss type must either be null, or must match the exposure's claim's loss type.
   * <p/>
   * If the activity pattern doesn't match the above criteria, an EntityStateException is thrown.
   * <p/>
   * The new activity is initialized with the following fields from the activity pattern:
   * Pattern, Type, Subject, Description, Mandatory, Priority, Recurring, Command
   * <p/>
   * The activity's target date is calculated using the pattern's targetStartPoint, TargetDays,
   * TargetHours, and TargetIncludeDays fields.  The activity's escalation date is calculated using the pattern's
   * escalationStartPoint, EscalationDays, EscalationHours, and EscalationIncludeDays fields.  If those fields aren't
   * included in the activity pattern, then the target and/or escalation date won't be set.  If the target date is
   * calculated to be after the escalation date, then the target date is set to be the same as the escalation date.
   * <p/>
   * The activity's exposure ID is set to the given exposure ID.  The activity's previousUserID is set to the current
   * user.
   * <p/>
   * The newly created activity is then assigned to a group and/or user using the Assignment Engine.  Finally, the
   * activity is saved in the database, and the String of the newly created activity is returned.
   *
   * @param exposureID        The ID of the exposure to which the activity should be added.
   * @param activityPatternId The ID of the activity pattern that is to be used for the activity.
   * @return The String of the newly created activity.
   */   
  @Throws(DataConversionException, "If either the exposureID or activityPatternID does not exist.")
  @Throws(PermissionException, "If the caller does not have all of the following permissions: VIEW_CLAIM, CREATE_ACTIVITY.")
  @Throws(EntityStateException, "If there is an attempt to add an activity using an activity pattern that isn't available to the particular type of the given exposure, or that isn't available to a closed exposure (if the given exposure is closed).")
  public function addActivityFromPattern(exposureID : String, activityPatternId : String) : String {
    return getDelegate().addActivityFromPattern( exposureID, activityPatternId )
  }

  /**
   * Associates the given note with the exposure identified by the given identifier.  Also associates the note with
   * the exposure's claim.
   *
   * @param exposureID The String that specifies the exposure with which to associate the NoteData
   * @param note       The note to associate with the specified exposure.
   * @return An EntityIdentifer containing the identifier of the newly created note.
   */
  @Throws(DataConversionException, "If the String doesn't correspond to an existing exposure, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have both the VIEW_CLAIM and the ADD_NOTE permission.")
  @Throws(SOAPServerException, "")
  @Throws(SOAPException, "")
  public function addNote(exposureID : String, note : Note) : String {
    return getDelegate().addNote( exposureID, note )
  }

  /**
   * Associates the given document with the claim specified by the identifier.
   *
   * @param exposureID The String that specifies the exposure with which to associate the document.
   * @param doc        The document to associate with the specified exposure.
   * @return An EntityIdentifer containing the identifier of the newly created document.
   */
  @Throws(DataConversionException, "If the String doesn't correspond to an existing exposure, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have VIEW_CLAIM permission.")
  @Throws(SOAPServerException, "")
  @Throws(SOAPException, "")
  public function addDocument(exposureID : String, doc : Document) : String {
    return getDelegate().addDocument( exposureID, doc )
  }

  /**
   * Closes the exposure specified by the identifier.  Uses the same logic that governs the Close Exposure screen.
   *
   * @param exposureID     The String that specifies the exposure to close
   * @param outcome        the outcome type key
   * @param reason         Optional string giving the reason for closing the claim
   */
  @Throws(DataConversionException, "If the String doesn't correspond to an existing exposure, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have CLOSE_CLAIM_OR_EXPOSURE permission.")
  @Throws(SOAPServerException, "If the exposure fails open/close validation rules")
  @Throws(SOAPException, "")
  public function closeExposure(exposureID : String, outcome : ExposureClosedOutcomeType, reason : String) {
    getDelegate().closeExposure( exposureID, outcome, reason )    
  }

  /**
   * Reopens the exposure specified by the identifier.  Uses the same logic that governs the Reopen Exposure screen
   *
   * @param exposureID The String that specifies the exposure to close
   * @param reasonType ExposureReopenedReason typekey, or null
   * @param reason     Optional string giving the reason for closing the exposure
   */
  @Throws(DataConversionException, "If the String doesn't correspond to an existing exposure, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have REOPEN_CLAIM_OR_EXPOSURE permission.")
  @Throws(SOAPServerException, "If the exposure fails open/close validation rules")
  @Throws(SOAPException, "")
  public function reopenExposure(exposureID : String, reasonType : ExposureReopenedReason, reason : String) {
    getDelegate().reopenExposure( exposureID, reasonType, reason )
  }

  /**
   * Reopens the exposure specified by the identifier.  Uses the same logic that governs the Reopen Exposure screen
   *
   * @param exposureID The String that specifies the exposure to close
   * @param reason     Optional string giving the reason for closing the exposure
   *
   * @deprecated       Use the version of this method that takes a reopened reason type key.
   *
   */
  @Throws(DataConversionException, "If the String doesn't correspond to an existing exposure, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have REOPEN_CLAIM_OR_EXPOSURE permission.")
  @Throws(SOAPServerException, "If the exposure fails open/close validation rules")
  @Throws(SOAPException, "")
  public function reopenExposure(exposureID : String, reason : String) {
    getDelegate().reopenExposure( exposureID, null, reason )
  }

  /**
   * Returns the code of the exposure's state (a typekey from the ExposureState typelist) as a string.  If for some
   * reason the exposure's state is not defined, returns a null string.
   *
   * @param exposureID The String that specifies the exposure to get the state from
   * @return String representing the given exposure's state
   */
  @Throws(DataConversionException, "If the String doesn't correspond to an existing exposure, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  @Throws(SOAPException, "")
  public function getExposureState(exposureID : String) : ExposureState {
    return getDelegate().getExposureState( exposureID )
  }
  
  //----------------------------------------------------------------- private helper methods
  
  private function getDelegate() : gw.api.webservice.cc.exposure.ExposureAPIImpl {
    return new gw.api.webservice.cc.exposure.ExposureAPIImpl()
  }  
}
