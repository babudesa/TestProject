package gw.webservice.cc.claim

uses entity.Claim
uses entity.ClaimInfo
uses typekey.ClaimAccessType
uses typekey.ClaimClosedOutcomeType
uses typekey.ClaimReopenedReason
uses typekey.ClaimState
uses entity.Document
uses entity.Exposure
uses entity.Note
uses entity.PolicySummary
uses typekey.CustomHistoryType
uses gw.api.webservice.pl.FieldValue
uses gw.plugin.assignment.AssignmentResponse
uses gw.api.webservice.ObjectFilter
uses gw.api.tools.ProcessID
uses gw.api.messaging.SynchStateData
uses gw.api.webservice.exception.PermissionException;
uses gw.api.webservice.exception.DataConversionException;
uses gw.api.webservice.exception.EntityStateException
uses gw.api.webservice.exception.SOAPException
uses gw.api.webservice.exception.SOAPServerException
uses gw.api.webservice.exception.BadIdentifierException
uses gw.api.webservice.WSRunlevel;
uses gw.fnolmapper.acord.AcordFNOLMapper
uses gw.api.fnolmapper.FNOLMapper


/**
 * IClaimAPI provides methods for adding claims and claim related items such as exposures, documents and
 * notes to ClaimCenter.
 */
@WebService(WSRunlevel.NODAEMONS)
@ReadOnly
class IClaimAPI {

  /**
   * Retrieves a claim given the claim identifier
   *
   * @param claimPublicID The ID of the claim to retrieve
   * @param objectFilter  Specifies which fields should be present on the returned object
   * @return The ClaimData representing the claim
   */
  @Throws(DataConversionException, "If the claimID does not exist.")
  @Throws(PermissionException, "If the user does not have VIEW_CLAIM permission.")
  @Throws(SOAPException, "")
  @Throws(SOAPServerException, "")
  @Deprecated( "The ObjectFilter class is deprecated. Instead, rewrite integration code as custom web service APIs for each integration point, defining most application logic within the web service. Before this release, external code requested large objects and used ObjectFilter to define arbitrary fields to return so that the data transfer is not too large. Instead, design your new custom web services to return only what is needed. You might want to create new Gosu classes or non-persistent business entities for some integration points to encapsulate data passed to the web service or returned from the web service." )
  function getClaim(claimPublicID : String, objectFilter : ObjectFilter) : Claim {
    return getDelegate().getClaim( claimPublicID, objectFilter )
  }

  /**
   * Adds an activity to a claim using an activity pattern. First, attempts to generate an activity from the given
   * pattern.  The activity pattern must be from the list of activity patterns for the given claim that meet the
   * following criteria:
   * <p/>
   * 1) if the claim is closed, then the activity pattern must be available to closed claims<br>
   * 2) the activity pattern's loss type must either be null, or must match the claim's
   * loss type.
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
   * The activity's claim ID is set to the given claim ID, and the exposure ID is set to null.  The activity's
   * previousUserID is set to the current user.
   * <p/>
   * The newly created activity is then assigned to a group and/or user using the Assignment Engine.  Finally, the
   * activity is saved in the database, and the public id of the newly created activity is returned.
   *
   * @param claimPublicID           The ID of the claim to which the activity should be added.
   * @param activityPatternPublicId The ID of the activity pattern that is to be used for the activity.
   * @return The public id of the newly created activity.
   */   
  @Throws(DataConversionException, "If either the claimID or activityPatternID does not exist.")
  @Throws(PermissionException, "If the caller does not have all of the following permissions: VIEW_CLAIM, CREATE_ACTIVITY.")
  @Throws(EntityStateException, "If there is an attempt to add an activity using an activity pattern that isn't available to the particular type of the given claim, or that isn't available to a closed claim (if the given claim is closed).")
  @Throws(SOAPException, "")
  function addActivityFromPattern(claimPublicID : String, activityPatternPublicId : String) : String {
    return getDelegate().addActivityFromPattern( claimPublicID, activityPatternPublicId )
  }

  /**
   * Adds an activity to a claim allowing for the specification of activity field values.
   *
   * @param claimPublicID           The ID of the claim to which to dd the activity.
   * @param activityPatternPublicId The ID of the activity pattern that is to be used for the activity.
   * @param activityFields          An array of field values that will be applied to the activity.
   * @return The public id of the newly created activity.
   */  
  @Throws(DataConversionException, "If either the claimID or activityPatternID does not exist.")
  @Throws(PermissionException, "If the caller does not have all of the following permissions: VIEW_CLAIM, CREATE_ACTIVITY.")
  @Throws(EntityStateException, "If there is an attempt to add an activity using an activity pattern that isn't available to the particular type of the given claim, or that isn't available to a closed claim (if the given claim is closed).")
  @Throws(SOAPException, "")
  function addActivityFromPatternWithOverride(claimPublicID : String, activityPatternPublicId : String, activityFields : FieldValue[]) : String {
    return getDelegate().addActivityFromPatternWithOverride( claimPublicID, activityPatternPublicId, activityFields )
  }

  /**
   * Adds an activity to a claim using an activity pattern. First, attempts to generate an activity from the given
   * pattern.  The activity pattern must be from the list of activity patterns for the given claim that meet
   * the following criteria:
   * <p/>
   * 1) if the claim is closed, then the activity pattern must be available to closed claims<br>
   * 2) the activity pattern's loss type must either be null, or must match the claim's loss type.
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
   * The activity's claim ID is set to the given claim ID.  The activity's previousUserID is set to the current
   * user.
   * <p/>
   * The newly created activity is then assigned to a group and/or user using the Assignment Engine.  Finally, the
   * activity is saved in the database, and the public id of the newly created activity is returned.  The
   * activity is associated with the given claimant.
   *
   * @param claimPublicID           The ID of the claim to which the activity should be added.
   * @param claimantPublicID        The claimant (in the form of a public id of an existing contact record).
   * @param activityPatternPublicId The ID of the activity pattern that is to be used for the activity.
   * @return The public id of the newly created activity.
   */   
  @Throws(DataConversionException, "If either the claimID or activityPatternID does not exist.  If the contact isn't a claimant on the claim, throws DataConversionException.GeneralConversionException.  If the contact isn't associated with the claim at all, throws DataConversionException.GeneralConversionException")
  @Throws(PermissionException, "If the caller does not have all of the following permissions: VIEW_CLAIM, CREATE_ACTIVITY.")
  @Throws(EntityStateException, "If there is an attempt to add an activity using an activity pattern that isn't available to the particular type of the given exposure, or that isn't available to a closed exposure (if the given exposure is closed).")
  @Throws(SOAPException, "")
  function addClaimantActivityFromPattern(claimPublicID : String, claimantPublicID : String, activityPatternPublicId : String) : String {
     return getDelegate().addClaimantActivityFromPattern( claimPublicID, claimantPublicID, activityPatternPublicId )
   }

 

  /**
   * Complete the activity  specified by the identifier.
   * @param activityPublicID The publc id that specifies the activity to complete
   */
  @Throws(gw.api.webservice.exception.BadIdentifierException, "If the public id doesn't correspond to an existing activity.")
  @Throws(gw.api.webservice.exception.PermissionException, "If the caller does not have the VIEW_CLAIM, CREATE_ACTIVITY permission.")
  @Throws(gw.api.webservice.exception.SOAPServerException, "")
  function completeActivity(activityPublicID: String ){
    getDelegate().completeActivity(activityPublicID)
  }

  /**
   * Skip the activity specified by the identifier.
   * @param activityPublicID The publc id that specifies the activity to skip
   */
  @Throws(gw.api.webservice.exception.BadIdentifierException, "If the public id doesn't correspond to an existing activity.")
  @Throws(gw.api.webservice.exception.PermissionException, "If the caller does not have the VIEW_CLAIM, CREATE_ACTIVITY permission.")
  @Throws(gw.api.webservice.exception.SOAPServerException, "")
  function skipActivity(activityPublicID: String){
    getDelegate().skipActivity(activityPublicID)
  }

  /**
   * Adds an FNOL claim to the system. FNOLs are run through the Loaded rules, an import History event is created
   * and the claim is then run through save and setup (details below), at the end of which the claim is OPEN.
   * Finally the claim is committed; this commit will include all exposures, activities etc. created during the
   * call. At commit time the pre update, validation and event messaging rules run. The claim is validated at the
   * "loadandsave" level.
   * <p>
   * Save and Setup performs the following steps:
   * <ol>
   * <li> Creates a new claim number (if one does not exist)
   * <li> Creates a claim snapshot
   * <li> Runs the "Pre-setup" rules on the claim and each exposure
   * <li> Runs the segmentation rules on each exposure, then the claim
   * <li> Runs the assignment rules on the claim, then each exposure
   * <li> Runs the workplan rules on the claim, then each exposure (generating the workplan)
   * <li> Runs the "Post-setup" rules on the claim and each exposure
   * <li> Updates history timestamps (for client-added history events to be correctly stamped)
   * <li> Sets the status of the claim and each exposure to "open"
   * <li> Makes sure that each exposure has a valid claim order field set
   * <li> Sets initial reserves
   * </ol>
   *
   * @param fnol           The FNOL, represented in a claim instance, to be added to the system.
   * @param synchStateData List of sync states for each message sink for this new claim; if a message sink isn't in this
   *                       list then it's considered to be not synced with this claim.
   * @return The public id of the newly created claim.
   */
  @Throws(DataConversionException, "If the claim number is not unique, a DataConversionException.DuplicateKeyException is thrown.  If the claim number isn't found on the claim, then a DataConversionException.RequiredFieldException is thrown.  If the policy isn't found on the claim, then a DataConversionException.RequiredFieldException is thrown.")
  @Throws(PermissionException, "If the caller does not have the EDIT_CLAIM permission")
  @Throws(EntityStateException, "")
  @Throws(SOAPServerException, "Thrown if no assignment target is found for the claim, or if a ConcurrentDataChange exception is thrown by the server.  In addition, other unexpected server exceptions will be wrapped by this exception.")
  @Throws(SOAPException, "")
  function addFNOL(fnol : Claim, synchStateData : SynchStateData[]) : String {
    return getDelegate().addFNOL( fnol, synchStateData )
  }

  /**
   * Adds an FNOL claim to the system, populated from the given XML by using the
   * named mapper class. A new, empty, claim is created then an instance of the
   * given mapper class is created and called to populate the claim from the XML.
   * The populated claim is then processed in the same way as a normal addFNOL call:
   * the loaded rules are called, a history event is added and save and setup is
   * performed. See the addFNOL documentation for details.
   * @param fnol The FNOL, as an XML string.
   * @param mapper The name of a Gosu class that implements the gw.api.fnolmapper.FNOLMapper
   * @return The public id of the imported claim
   */
  @Throws(DataConversionException, "If the claim number is not unique, a DataConversionException.DuplicateKeyException is thrown.  If the claim number isn't found on the claim, then a DataConversionException.RequiredFieldException is thrown.  If the policy isn't found on the claim, then a DataConversionException.RequiredFieldException is thrown.")
  @Throws(PermissionException, "If the caller does not have the EDIT_CLAIM permission")
  @Throws(EntityStateException, "")
  @Throws(SOAPServerException, "Thrown if no assignment target is found for the claim, or if a ConcurrentDataChange exception is thrown by the server.  In addition, other unexpected server exceptions will be wrapped by this exception.")
  @Throws(SOAPException, "")
  function importClaimFromXML(xml: String, mapperClassName : String) : String {
    return getDelegate().importFNOLFromXML(xml, mapperClassName) 
  }
  
  //Internal method for calling the delegate
  private function importClaimFromXMLInternal(xml : String, mapperClass : Type<? extends FNOLMapper>) : String {
    return getDelegate().importFNOLFromXML(xml, mapperClass)
  }

  /**
   * Adds an FNOL claim to the system, populated from the given ACORD XML by using
   * the out of box gw.fnolmapper.acord.AcordFNOLMapper mapper class. This is just a
   * convenience interface which calls importClaimFromXML with gw.fnolmapper.acord.AcordFNOLMapper
   * as the mapperClassName argument
   * @param fnol The FNOL, as an Acord XML string.
   * @return The public id of the imported claim
   */
  @Throws(DataConversionException, "If the claim number is not unique, a DataConversionException.DuplicateKeyException is thrown.  If the claim number isn't found on the claim, then a DataConversionException.RequiredFieldException is thrown.  If the policy isn't found on the claim, then a DataConversionException.RequiredFieldException is thrown.")
  @Throws(PermissionException, "If the caller does not have the EDIT_CLAIM permission")
  @Throws(EntityStateException, "")
  @Throws(SOAPServerException, "Thrown if no assignment target is found for the claim, or if a ConcurrentDataChange exception is thrown by the server.  In addition, other unexpected server exceptions will be wrapped by this exception.")
  @Throws(SOAPException, "")
  function importAcordClaimFromXML(xml : String) : String {
    return importClaimFromXMLInternal(xml, gw.fnolmapper.acord.AcordFNOLMapper.Type)
  }

  /**
   * Adds a claim to the system. The claim must past level0 (loadsave) validation before it will be added
   * to the system. The claim that is being added is presumed to have been worked on in another system and
   * is being migrated to ClaimCenter, so it will not go through the load rules or the setup process that
   * is executed by {@link #addFNOL}. The claim is marked as being in the "Open" state.
   * <p>
   * The steps executed by this method are
   * <ol>
   * <li>Sets the claim state to Open
   * <li>Synch the claim according to the given SynchStateData
   * <li>Synch any exposures on the claim according to the given SynchStateData
   * <li>Assign the claim to the given user and group
   * <li>Commit the claim; this will run pre-update rules, validate the claim at the loadsave level and run event rules
   * </ol>
   * <p>
   *
   * @param assignedGroupId Group to which the claim is assigned. Must be the public id of an existing group.
   * @param assignedUserId  User that the claim will be assigned to. Must be the public id of an existing user
   *                        and the user must belong to the group.
   * @param claim           The claim to be added to the system.
   * @param syncState       List of synch states for each message sink for this new claim; if a message sink
   *                        isn't in this list then it's considered to be not synched with this claim. Can be
   *                        null or empty if claim is not synched with any sinks.
   *
   * @return The public id of the newly created claim.
   */
  @Throws(DataConversionException, "")
  @Throws(PermissionException, "")
  @Throws(EntityStateException, "")
  @Throws(SOAPServerException, "")
  @Throws(SOAPException, "")
  function migrateClaim(claim : Claim, assignedGroupId : String, assignedUserId : String, syncState : SynchStateData[]) : String {
    return getDelegate().migrateClaim( claim, assignedGroupId, assignedUserId, syncState )
  }

  /**
   * Adds a claim to the system. The claim must past level0 (loadsave) validation before it will be added
   * to the system. The claim that is being added is presumed to have been worked on in another system and
   * is being migrated to ClaimCenter, so it will not go through the load rules or the setup process that
   * is executed by {@link #addFNOL}. The claim is marked as being in the given state.
   * <p>
   * The steps executed by this method are
   * <ol>
   * <li>Sets the claim state to the given state
   * <li>Synch the claim according to the given SynchStateData
   * <li>Synch any exposures on the claim according to the given SynchStateData
   * <li>Assign the claim to the given user and group
   * <li>Commit the claim; this will run pre-update rules, validate the claim at the loadsave level and run event rules
   * </ol>
   * <p>
   *
   * @param state           The state of the claim - open, closed or draft. Must not be null
   * @param assignedGroupId Group to which the claim is assigned. Must be the public id of an existing group.
   * @param assignedUserId  User that the claim will be assigned to. Must be the public id of an existing user
   *                        and the user must belong to the group.
   * @param claim           The claim to be added to the system.
   * @param syncState       List of synch states for each message sink for this new claim; if a message sink
   *                        isn't in this list then it's considered to be not synched with this claim. Can be
   *                        null or empty if claim is not synched with any sinks.
   *
   * @return The public id of the newly created claim.
   */  
  @Throws(DataConversionException, "")
  @Throws(PermissionException, "")
  @Throws(EntityStateException, "")
  @Throws(SOAPServerException, "")
  @Throws(SOAPException, "")
  function migrateClaim(claim : Claim, state : ClaimState, assignedGroupId : String, assignedUserId : String, syncState : SynchStateData[]) : String{
    return getDelegate().migrateClaim( claim, state, assignedGroupId, assignedUserId, syncState )
  }

  /**
   * Adds a custom history event and a blank description to a claim with the given CustomHistoryType
   *
   * @param claimPublicID The ID of the claim to modify.
   * @param historyType   The type of the history event
   */  
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  @Throws(SOAPException, "")
  function addCustomHistory(claimPublicID : String, historyType : CustomHistoryType){
    getDelegate().addCustomHistory( claimPublicID, historyType )  
  }

  /**
   * Adds a custom history event to the a claim, overriding the value of Description present
   * in the custom history type list.
   *
   * @param claimPublicID The ID of the claim to modify.
   * @param historyType   The type of the history event
   * @param description   A String that will override the value that exists in the typekey specified
   *                      by historyType.
   */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "")
  @Throws(SOAPException, "")
  @Throws(SOAPServerException, "")  
  function addCustomHistoryWithDesc(claimPublicID : String, historyType : CustomHistoryType, description : String){
    getDelegate().addCustomHistoryWithDesc( claimPublicID, historyType, description )  
  }

  /**
   * Associates the given document with the claim specified by the identifier
   *
   * @param claimPublicID The public id that specifies the claim with which to associate the document.
   * @param doc           The document to associate with the specified claim.
   * @return An EntityIdentifer containing the identifier of the newly created document.
   *
   */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "")
  @Throws(SOAPException, "")
  @Throws(SOAPServerException, "")  
  function addDocument(claimPublicID : String, doc : Document) : String{
    return getDelegate().addDocument( claimPublicID, doc )
  }

  /**
   * Associates the given document with the claim specified by the identifier.  The document will also be associated
   * with the specified claimant contact.
   *
   * @param claimPublicID The public id that specifies the exposure with which to associate the document.
   * @param claimantID    The claimant (in the form of a public id of an existing contact record).
   * @param doc           The document to associate with the specified exposure.
   * @return An EntityIdentifer containing the identifier of the newly created document.
   */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.  If the contact isn't a claimant on the claim, throws DataConversionException.GeneralConversionException.  If the contact isn't associated with the claim at all, throws DataConversionException.GeneralConversionException")
  @Throws(PermissionException, "If the caller does not have the VIEW_CLAIM permission.")
  @Throws(SOAPException, "")
  @Throws(SOAPServerException, "")  
  function addClaimantDocument(claimPublicID : String, claimantID : String, doc : Document) : String{
    return getDelegate().addClaimantDocument( claimPublicID, claimantID, doc )
  }

  /**
   * Associates the given document with the claim specified by the identifier.  The document will also be associated
   * with the specified claim contact.
   *
   * @param claimPublicID The public id that specifies the exposure with which to associate the document.
   * @param claimContactID    The claim contact (in the form of a public id of an existing contact record).
   * @param doc           The document to associate with the specified exposure.
   * @return An EntityIdentifer containing the identifier of the newly created document.
   */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException. If the contact isn't associated with the claim, throws DataConversionException.GeneralConversionException")
  @Throws(PermissionException, "If the caller does not have the VIEW_CLAIM permission.")
  @Throws(SOAPException, "")
  @Throws(SOAPServerException, "")  
  function addClaimContactDocument(claimPublicID : String, claimContactID : String, doc : Document) : String{
    return getDelegate().addClaimContactDocument( claimPublicID, claimContactID, doc )
  }

  /**
   * Associates the given document with the claim specified by the identifier.  The document will also be associated
   * with the specified claimant contact.
   *
   * @param claimPublicID The public id that specifies the exposure with which to associate the document.
   * @param exposureID    The exposure (in the form of a public id of an existing exposure).
   * @param doc           The document to associate with the specified exposure.
   * @return An EntityIdentifer containing the identifier of the newly created document.
   */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException. If the contact isn't associated with the claim, throws DataConversionException.GeneralConversionException")
  @Throws(PermissionException, "If the caller does not have the VIEW_CLAIM permission.")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function addExposureDocument(claimPublicID : String, exposureID : String, doc : Document) : String{
    return getDelegate().addExposureDocument( claimPublicID, exposureID, doc )
  }

  /**
   * Associates the given document with the claim specified by the identifier.  The document will also be associated
   * with the specified claimant contact.
   *
   * @param claimPublicID The public id that specifies the exposure with which to associate the document.
   * @param matterID    The matter (in the form of a public id of an existing matter).
   * @param doc           The document to associate with the specified exposure.
   * @return An EntityIdentifer containing the identifier of the newly created document.
  */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException. If the contact isn't associated with the claim, throws DataConversionException.GeneralConversionException")
  @Throws(PermissionException, "If the caller does not have the VIEW_CLAIM permission.")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function addMatterDocument(claimPublicID : String, matterID : String, doc : Document) : String{
    return getDelegate().addMatterDocument( claimPublicID, matterID, doc )
  }

  /**
   * Associates the given ExposureData with a claim.  If the claim's state is OPEN, then runs save and setup on the
   * new exposure.  If the claim's state is DRAFT, simply sets the exposure order on the claim.
   * <p>
   * <b>WARNING:</b> Do not add new exposures to ClaimCenter via web service APIs while the financials
   * calculations are running.
   * <p>
   * saveAndSetup performs the following steps:
   * <ol>
   * <li> Set the exposure's claim order
   * <li> Runs the "Pre-setup" rules on the exposure
   * <li> Runs the segmentation rules on the exposure
   * <li> Runs the strategy rules on the exposure
   * <li> Runs the assignment rules on the exposure
   * <li> Runs the workplan rules on the exposure
   * <li> Runs the "Post-setup" rules on the exposure
   * <li> Sets the exposure's status to "open"
   * <li> Creates initial reserves
   * <li> Commits the exposures's bundle (which will contain the exposure,
   * activities, and other objects creating during the call)
   * </ol>
   *
   * @param claimPublicID The ID of the claim to which the exposure is added.
   * @param exposure      The ExposureData to associate with the claim.
   * @param synchState    List of sync states for each message sink for this.
   *                      new exposure; if a message sink isn't in this list then it's
   *                      considered to be not synced w/ this exposure.
   * @return An public id containing the identifier of the newly created exposure.
   */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have both the EDIT_CLAIM permission and the CREATE_NEW_EXPOSURE permission.")
  @Throws(EntityStateException, "If the claim has been marked closed or closed pending approval.")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function addExposure(claimPublicID : String, exposure : Exposure, synchState : SynchStateData[]) : String{
    return getDelegate().addExposure( claimPublicID, exposure, synchState )
  }

  /**
   * Associates the given note with the claim identified by the given identifier.
   *
   * @param claimPublicID The public id that specifies the claim with which to associate the note
   * @param note          The note to associate with the specified claim.
   * @return An EntityIdentifer containing the identifier of the newly created note.
   */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have both the EDIT_CLAIM permission and the ADD_NOTE permission.")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function addNote(claimPublicID : String, note : Note) : String{
    return getDelegate().addNote( claimPublicID, note )
  }

  /**
   * Adds a note to the given claim that is associated with the given contact.  The contact must be a claimant on the
   * claim or one of the claim's exposures.  The contact must also be the same version as the contact associated with
   * the claim or exposures; in other words, if a snapshot version of the contact is being used on the claim/exposures,
   * then that same snapshot version must be used in this method.
   *
   * @param claimPublicID The public id that specifies the claim with which to associate the note
   * @param claimantID    The claimant (in the form of a public id of an existing contact record)
   * @param note          The note to associate with the specified claim.
   * @return An EntityIdentifer containing the identifier of the newly created note.
   */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.  If the contact isn't a claimant on either the claim or the exposures, throws DataConversionException.GeneralConversionException.  If the contact isn't associated with the claim at all, throws DataConversionException.GeneralConversionException")
  @Throws(PermissionException, "If the caller does not have both the EDIT_CLAIM permission and the ADD_NOTE permission.")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function addClaimantNote(claimPublicID : String, claimantID : String, note : Note) : String{
    return getDelegate().addClaimantNote( claimPublicID, claimantID, note )
  }

  /**
   * Check to see if the claim specified by claimID exists in the system.
   *
   * @param claimPublicID The ID of the claim to check
   * @return <code>true</code> if the claim exists in ClaimCenter, and <code>false</code>
   *         otherwise
   */
  @Throws(DataConversionException, "")
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function doesExist(claimPublicID : String) : boolean{
    return getDelegate().doesExist( claimPublicID )
  }

  /**
   * Check to see if the claims specified by the given claim numbers exist in
   * the system. Returns an array containing just the claim numbers that do
   * exist. If no numbers match returns an empty array. The order of the numbers
   * in the returned array is undefined - you should <em>not</em> rely on it
   * being the same order as in the claimNumbers parameter.
   *
   * @param claimNumbers the claim numbers to search for
   * @return array of strings containing all claim numbers that match
   */
  @Throws(DataConversionException, "")
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function claimsExist(claimNumbers : String[]) : String[]{
    return getDelegate().claimsExist( claimNumbers )
  }

  /**
   * Checks to see if the claim is valid. Any exposures associated with the claim are checked, as well. Validity is
   * determined by applying the claim validation rules.  If the validationLevelCode is blank, or doesn't match an
   * existing ValidationLevel value, then the method returns false if any errors are found.
   *
   * @param claimPublicID          The ID of the claim to check
   * @param strValidationLevelCode The validation level to check
   * @return <code>true</code> if the claim and exposures are valid and <code>false</code> otherwise.
   */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have the VIEW_CLAIM permission")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function checkValid(claimPublicID : String, strValidationLevelCode : String) : boolean{
    return getDelegate().checkValid( claimPublicID, strValidationLevelCode )
  }

  /**
   * Schedules all imported claims whose loadCommandID matches the supplied value for validation.
   * The claim and its associated policy and exposures will be validated.
   * Bulk validation uses distributed work queues to spread the work of validating large
   * numbers of claims across multiple threads/nodes.  This method does NOT perform the validation;
   * instead, it creates a workitem for each claim to be validated.  These workitems are processed
   * by distributed worker instances that perform the validation.<p>
   *
   * This method launches a batch process to generate the workitems; the process is NOT
   * guaranteed (or expected) to finish before the method returns.  The returned ProcessID
   * can be used to query the status of the batch process using the methods on IMaintenanceToolsAPI.
   * <p>
   *
   * By default no worker instances are configured to run for this process.  In order to perform the actual validation,
   * use IMaintenanceToolsAPI.setWorkQueueConfig() to dynamically allocate worker instances.
   * <p>
   * The complete process is:
   * <ol>
   * <li>Load claims via ItableImportAPI.integrityCheckStagingTableContentsAndLoadSourceTables())</li>
   * <li>Extract the loadCommandID from the returned TableImportResult object</li></li>
   * <li>Call IClaimAPI.bulkValidate(loadCommandID)</li>
   * <li>Poll IMaintenanceToolsAPI.batchProcessStatusByID() using the returned processID until the batch process completes.</li>
   * <li>Configure workers using IMaintenanceToolsAPI.setWorkQueueConfig() with work queue name "ClaimValidation"</li>
   * <li>Notify workers using IMaintenanceToolsAPI.notifyQueueWorkers() with work queue name "ClaimValidation"</li>
   * </ol>
   * @param loadCommandID  An integer value identifying the conversion batch that imported these claims.
   * The loadCommandID value is available through the TableImportResult object returned from a table
   * import operation. (e.g. ITableImportAPI.integrityCheckStagingTableContentsAndLoadSourceTables())
   */
  @Throws(SOAPException, "")  
  function bulkValidate(loadCommandID : int) : ProcessID{
    return getDelegate().bulkValidate( loadCommandID )
  }

  /**
   * Check to see if a claim has been flagged.  If the Claim.Flagged field equals TC_IS_FLAGGED,
   * then method returns true.  Otherwise, returns false.
   *
   * @param claimPublicID The ID of the claim to check
   * @return <code>true</code> if the claim is flagged, and <code>false</code> otherwise.
   */
  @Throws(DataConversionException, "If the ClaimIdentifier doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function isFlagged(claimPublicID : String) : boolean{
    return getDelegate().isFlagged( claimPublicID )
  }

  /**
   * Processes the given claim through the assignment engine, and produces an AssignmentResponse instance
   * that indicates the assignment found for this item.  Does NOT commit the item to the database.
   *
   * @param claimData The claim to run through the assignment engine
   * @return AssignmentResponse instance indicating the assignment found for this item
   */
  @Throws(DataConversionException, "")
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "If the assignment adapter cannot be loaded.")  
  @Throws(SOAPException, "")
  function previewAssignment(claimData : Claim) : AssignmentResponse {
    return getDelegate().previewAssignment( claimData )
  }

  /**
   * Closes the claim specified by the identifier.  Uses the same logic that governs the Close Claim screen.
   *
   * @param claimPublicID The publc id that specifies the claim to close
   * @param outcomeType   Type of outcome
   * @param reason        Optional string giving the reason for closing the claim
   */
  @Throws(DataConversionException, " If the public id doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have the CLOSE_CLAIM_OR_EXPOSURE permission.")
  @Throws(SOAPServerException, "If the claim fails open/close validation rules.")  
  @Throws(SOAPException, "")
  function closeClaim(claimPublicID : String, outcomeType : ClaimClosedOutcomeType, reason : String){
    getDelegate().closeClaim( claimPublicID, outcomeType, reason )  
  }

  /**
   * Reopens the claim specified by the identifier.  Uses the same logic that governs the Reopen Claim screen
   *
   * @param claimPublicID The public id that specifies the claim to reopen
   * @param reasonType    typekey giving reason for reopen
   * @param reason        Optional string giving the reason for reopening the claim
   */
  @Throws(DataConversionException, "If the public id doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have the REOPEN_CLAIM_OR_EXPOSURE permission.")
  @Throws(SOAPServerException, "If the claim fails reopen validation rules.")  
  @Throws(SOAPException, "")
  function reopenClaim(claimPublicID : String, reasonType : ClaimReopenedReason, reason : String){
    getDelegate().reopenClaim( claimPublicID, reasonType, reason )  
  }

  /**
   * Reopens the claim specified by the identifier.  Uses the same logic that governs the Reopen Claim screen.
   *
   * @param claimPublicID The public id that specifies the claim to reopen
   * @param reason        Optional string giving the reason for reopening the claim
   */
  @Throws(DataConversionException, "If the public id doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "If the caller does not have the REOPEN_CLAIM_OR_EXPOSURE permission.")
  @Throws(SOAPServerException, "If the claim fails reopen validation rules.")  
  @Throws(SOAPException, "")
  @Deprecated("Use reopenClaim(claimPublicID : String, reasonType : ClaimReopenedReason, reason : String)")
  function reopenClaim(claimPublicID : String, reason : String){
    reopenClaim( claimPublicID, null, reason)
  }

  /**
   * Returns the code of the claim's state (a typekey from the ClaimState typelist) as a string.  If for some reason
   * the claim's state is not defined, returns a null string.
   *
   * @param claimPublicID The public id that specifies the claim to get the state from
   * @return String representing the given claim's state
   */
  @Throws(DataConversionException, "If the public id doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function getClaimState(claimPublicID : String) : ClaimState{
    return getDelegate().getClaimState( claimPublicID )
  }

  /**
   * Cause the policy on the claim to be refreshed with the latest information from the Policy store
   *
   * @param claimPublicID The public id that specifies the claim whose policy will be refreshed
   */
  @Throws(DataConversionException, "If the public id doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException. If the claim's loss date is null, throws DataConversionException.RequiredFieldException.")
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")  
  @Throws(SOAPException, "")
  function refreshPolicy(claimPublicID : String){
    getDelegate().refreshPolicy( claimPublicID )  
  }

  /**
   * Cause the policy on the Claim to be set to a new policy instance found using the given information.
   * If the specified policy is already set on the claim, then the policy information will be refreshed.
   * NOTE: Changing the policy can have many side effects, especially if the old and new policies do not contain
   * the same set of sub-objects (such as vehicles). This method should be used with caution
   * NOTE2: The PolicySummary parameter should be populated with whatever information might be required to
   * retrieve the appropriate Policy from the Policy adapter. It need not be as fully populated as it would be
   * were it to be displayed in the UI.
   *
   * @param claimPublicID The public id that specifies the claim whose policy will be set
   * @param policySummary
   */
  @Throws(DataConversionException, "If the public id doesn't correspond to an existing claim, throws DataConversionException.BadIdentifierException.")
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  @Throws(SOAPException, "")
  function setPolicy(claimPublicID : String, policySummary : PolicySummary){
    getDelegate().setPolicy( claimPublicID, policySummary )  
  }

  /**
   * Finds the public id of a claim by the claimNumber
   * @param claimNumber
   * @return claim's publicId, else null if claim not found
   */
  @Throws(SOAPException, "")
  function findPublicIdByClaimNumber(claimNumber : String) : String {
    return getDelegate().findPublicIdByClaimNumber( claimNumber )
  }

  /**
   * Give a user permission on a claim
   *
   * @param claimPublicID The public id that specifies the claim the permission is added
   * @param userPublicID      the uesr the permissions to be given.
   * @param types        permissions to be given to the user.
   */
  @Throws(PermissionException, "If user doesn't exist, will thrown LoginException")
  @Throws(SOAPException, "")  
  function giveUserPermissionsOnClaim(claimPublicID : String, userPublicID : String, types : ClaimAccessType[]) {
    getDelegate().giveUserPermissionsOnClaim( claimPublicID, userPublicID, types )  
  }

  /**
   * Schedules the claims with the given claim numbers for archive. The claims are looked up and,
   * providing they are closed, are immediately scheduled for archive by creating a high priority
   * work item that will be picked up by the archiving work queue. Note that the archiving work
   * queue is processed asynchronously so it is unlikely that any of the claims will actually be
   * archived by the time this call returns.
   * <p>
   * There is a race condition that can affect this call. If a claim to be archived references a
   * newly created admin object, such as a new user, there is a chance the archiving of the claim
   * will fail because the new admin object has not yet been copied to the archiving database. This
   * is a rare edge case as most claims to be archived are old, closed, claims which have not been
   * altered for a long time. The chances of hitting this race condition can be minimized by
   * explicitly running the archive batch process before calling this method, though this is
   * expensive and is not recommended as a general practice.
   * <p>
   * Throws SOAPException if claims cannot be scheduled for archive because they cannot be found,
   * are closed or because an archive work item could not be created. If any of the claims is not
   * found or is not closed then the call fails before attempting to archive any other claims.
   * However if all the claims are present and closed it is possible, though very unlikely, for
   * some work items to be created successfully and others to fail.
   *
   * @param claimNumbers Claim numbers of the claims to schedule for archive
   */
  @Throws(SOAPException, "If claims cannot be found or cannot be scheduled for archive")  
  @Throws(PermissionException, "")
  function scheduleForArchive(claimNumbers : String[]) {
    getDelegate().scheduleForArchive( claimNumbers )
  }

  /**
   * Schedules the claims with the given public ids for archive. The claims are looked up and,
   * providing they are closed, are immediately scheduled for archive by creating a high priority
   * work item that will be picked up by the archiving work queue. Note that the archiving work
   * queue is processed asynchronously so it is unlikely that any of the claims will actually be
   * archived by the time this call returns.
   * <p>
   * There is a race condition that can affect this call. If a claim to be archived references a
   * newly created admin object, such as a new user, there is a chance the archiving of the claim
   * will fail because the new admin object has not yet been copied to the archiving database. This
   * is a rare edge case as most claims to be archived are old, closed, claims which have not been
   * altered for a long time. The chances of hitting this race condition can be minimized by
   * explicitly running the archive batch process before calling this method, though this is
   * expensive and is not recommended as a general practice.
   * <p>
   * Throws SOAPException if claims cannot be scheduled for archive because they cannot be found,
   * are closed or because an archive work item could not be created. If any of the claims is not
   * found or is not closed then the call fails before attempting to archive any other claims.
   * However if all the claims are present and closed it is possible, though very unlikely, for
   * some work items to be created successfully and others to fail.
   *
   * @param claimPublicIds Public ids of the claims to schedule for archive
   */
  @Throws(SOAPException, "If claims cannot be found or cannot be scheduled for archive")  
  @Throws(PermissionException, "")
  function scheduleForArchiveByPublicId(publicIds : String[]) {
    getDelegate().scheduleForArchiveByPublicId(publicIds)
  }

  /**
   * Restore claims from the archive database
   * @param claimPublicIDs Public IDs of the claim to be restored
   * @param comment comment for restoring the claims
   * @return The public IDs of the claims that were restored
   */
  @Throws(SOAPException, "")  
  @Throws(PermissionException, "")
  function restoreClaim(claimPublicIDs : String[], comment : String) : String[] {
    return getDelegate().restoreClaim( claimPublicIDs, comment )
  }

  /**
   * Retrieves a claim info given the claim public ID
   *
   * @param claimPublicID The ID of the claim that the claim info is for
   * @param objectFilter  Specifies which fields should be present on the returned object
   * @return The ClaimInfoData representing the claim info
   */
  @Throws(SOAPException, "")  
  @Throws(PermissionException, "")
  @Throws(BadIdentifierException, "If the claim with such public ID does not exist.")
  @Throws(SOAPException, "")
  @Deprecated( "The ObjectFilter class is deprecated. Instead, rewrite integration code as custom web service APIs for each integration point, defining most application logic within the web service. Before this release, external code requested large objects and used ObjectFilter to define arbitrary fields to return so that the data transfer is not too large. Instead, design your new custom web services to return only what is needed. You might want to create new Gosu classes or non-persistent business entities for some integration points to encapsulate data passed to the web service or returned from the web service." )
  function getClaimInfo(claimPublicID : String, objectFilter : ObjectFilter) : ClaimInfo{
    return getDelegate().getClaimInfo( claimPublicID, objectFilter )
  }
  
    /**
   * Retrieves a claim info given the claim public ID
   *
   * @param claimPublicID The ID of the claim that the claim info is for
   * @param objectFilter  Specifies which fields should be present on the returned object
   * @return The ClaimInfoData representing the claim info
   */
  @Throws(SOAPException, "")  
  @Throws(PermissionException, "")
  @Throws(BadIdentifierException, "If the claim with such public ID does not exist.")
  @Throws(SOAPException, "")
  function getClaimInfo(claimPublicID : String) : ClaimInfo{
    return getDelegate().getClaimInfo( claimPublicID )
  }
  
  //----------------------------------------------------------------- private helper methods
  
  private function getDelegate() : gw.api.webservice.cc.claim.ClaimAPIImpl {
    return new gw.api.webservice.cc.claim.ClaimAPIImpl()
  }
}
