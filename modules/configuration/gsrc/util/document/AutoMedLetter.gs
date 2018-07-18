package util.document
uses java.util.HashMap
uses gw.api.database.*
uses gw.api.util.Logger

class AutoMedLetter {

  construct() {}
  
  @Param("lossType","Loss Type to Check")
  @Returns("True if lossType and level combination is valid")
  public static function autoMedLetterController(lossType : LossType) : boolean {
      var result : boolean = false
      var LOB = Query.make(AutoMedLetterExt).compare("LossTypeExt", Equals, lossType).select()
      if(LOB.Count > 0) {
       var LOBEnabled = LOB.getAtMostOneRow().EnabledExt
         if (LOBEnabled == true){
           var LOBClaim = LOB.getAtMostOneRow().EnabledExt
             if(LOBClaim == true){
               result = true
             }
          }
      }
      return result
  }
  
  @Param("claim","Claim to Check")
  @Returns("True if claim was created on or after Line of Business Effective Date")
  public static function createdAfterEffDate(claim : Claim) : boolean {
    var result : boolean = false
    var LOB = Query.make(AutoMedLetterExt).compare("LossTypeExt", Equals, claim.LossType).select()
    if(LOB != null) {
      if(claim.CreateTime >= LOB.getAtMostOneRow().EffectiveDateExt){result=true}
    }
    return result
  }
    
  public static function saveMedLetter(claim : Claim) {
    //name of the document to create
     var documentName : String
     var adjBusinessUnit = util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(claim)
     //if(claim.LossType ==  LossType.TC_STRATEGICCOMPEL || claim.LossType == LossType.TC_STRATEGICCOMPWC ){
     if(adjBusinessUnit!=null && adjBusinessUnit.containsIgnoreCase("Strategic Comp")){
       documentName = "AutoMedicareLetterSC.gosu.rtf";
     } else {
       documentName = "AutoMedicareLetter.gosu.rtf";
     }
     //check to see if the document is supported
     if (util.document.DocumentProduction.synchronousDocumentCreationSupported( documentName )) {
        var doc : Document = createDocument(claim)
        var values : HashMap = loadValues(claim, doc)
        util.document.DocumentProduction.createAndStoreDocumentSynchronously(documentName, values, doc )
        createNote(claim)
    } else {
      Logger.logDebug("ERROR: COULD NOT CREATE DOCUMENT");
    }
  }
  
  private static function createDocument(claim : Claim) : Document {
    var doc : Document = new Document(claim)
    doc.Claim = claim
    var adjBusinessUnit = util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(claim)
    if(claim.Exposures.first() != null){
      doc.ex_ClaimantName = claim.Exposures.first().Claimant.DisplayName
      doc.Exposure = claim.Exposures.first() 
    }
    //if(claim.LossType ==  LossType.TC_STRATEGICCOMPEL || claim.LossType == LossType.TC_STRATEGICCOMPWC ){
    if(adjBusinessUnit!=null && adjBusinessUnit.containsIgnoreCase("Strategic Comp")){
      doc.Name = "Auto Medicare Letter - SC"
      doc.FormIDExt = "SC0002"
    } else {
      doc.Name = "Auto Medicare Letter";
      doc.FormIDExt = "ENT0041"
    }
    doc.Description = "Automated Medicare Letter"
    doc.DocUID = "ID-" + java.util.Calendar.getInstance().getTimeInMillis()
    doc.ex_Type = "Medicare"
    doc.ex_SubType = "Correspondence"
    doc.ProcessMethod = "Forward_to_adjuster"
    doc.MimeType = "application/rtf"
    doc.Privileged = "No"
    doc.ex_CentralPrint = true
    doc.ex_CentralPrintSuccessfull = false
    doc.Status = "approved"
    doc.MailToExt = (claim.claimant as Contact)
    return doc
  }
  
  private static function loadValues(claim : Claim, doc : Document) : HashMap {
    var values = new HashMap();

    values.put("DivisionName", doc.getDivisionName())
    values.put("AssignedGroup", claim.AssignedGroup)
    values.put("BusinessAddressLine1", claim.AssignedGroup.getBusinessAddress().AddressLine1)
    values.put("BusinessCityStateZip", claim.AssignedGroup.getBusinessAddress().CityStateZip)
    values.put("CurrentDate", gw.api.util.StringUtil.formatDate(gw.api.util.DateUtil.currentDate(), "MMMMM d, yyyy"))    
    values.put("Claimant", util.StringUtils.getDisplayNameWithoutFormerAndClosed(claim.claimant.DisplayName))
    values.put("ToAddressLine1", (doc.MailToExt == null || doc.MailToExt.PrimaryAddress == null) ? null : doc.MailToExt.PrimaryAddress.gaic_getmailingaddresslines())
    values.put("ClaimantCityStateZip", doc.getExposureValue("ClaimantCityStateZip"))
    values.put("DateOfLoss", gw.api.util.StringUtil.formatDate(claim.LossDate, "MM/dd/yyyy"))
    values.put("ClaimNumber", claim.ClaimNumber)
    values.put("Adjuster", doc.returnAdjusterField("DisplayName"))
    // will remove once all medicare letters use the adjuster mailing address
    values.put("AdjAddress1", doc.returnAdjusterField("AddressLine1"))
    values.put("AdjAddress2", doc.returnAdjusterField("AddressLine2"))
    values.put("AdjCityStateZip", doc.returnAdjusterField("CityStateZip"))
    // ----------------------------------------------------------------------
    values.put("AdjMailingAddress1", doc.adjusterMailingAddress().AddressLine1)
    values.put("AdjMailingCityStateZip", doc.adjusterMailingAddress().CityStateZip)
    values.put("AdjusterSignature", doc.adjustersignature())
    values.put("DocuName", doc.FormIDExt)
    values.put("AdjusterMailingSignature", doc.adjusterMailingSignature())

    return values
  }
  
  private static function createNote(claim : Claim) {
    var note : Note
    note = claim.addNote( "general", "Automated Medicare letter was created and mailed to the "+claim.claimant+"." )
    note.Subject = "Medicare Letter";
    note.Author = util.custom_Ext.finders.getUserOb( "batchsu" )
    note.addEvent("NoteAdded")
  }
}
