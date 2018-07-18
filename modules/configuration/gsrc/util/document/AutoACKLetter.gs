package util.document;
uses java.util.HashMap
uses gw.api.database.*
uses gw.api.util.Logger //Added for logging in Debug - SR

class AutoACKLetter
{  
  construct(){}
  
  @Param("lossType","Loss Type to Check")
  @Param("level","Level to Check")
  @Returns("True if lossType and level combination is valid")
  public static function autoAckController(lossType : LossType, level : AutoAckLevelExt) : boolean {
      var result : boolean = false
      var LOB = Query.make(AutoAckExt).compare("LossTypeExt", Equals, lossType).select()
      if(LOB.Count > 0) {
          var LOBEnabled = LOB.getAtMostOneRow().EnabledExt
          if (LOBEnabled == true){
              var LOBClaim = LOB.getAtMostOneRow().ClaimExt
              var LOBFeature = LOB.getAtMostOneRow().FeatureExt
              var LOBIO = LOB.getAtMostOneRow().IncidentOnlyExt
              switch( level ) {
                  case TC_IO:
                      if(LOBIO == true){result = true}
                      break
                  case TC_ANY:
                      result = true
                      break
                  case TC_CLAIM:
                      if(LOBClaim == true){result = true}
                      break
                  case TC_FEATURE:
                      if(LOBFeature == true){result = true}
                      break
                  default:
                      result = false}}}
      return result}
  
  public static function saveACKLetter(claim : Claim, exposure: Exposure, isIncidentRptAckDoc : boolean, contact : Contact, createNote : boolean) {
     //get the name of the document that you want to create
     var documentName : String = getDocumentFilename(claim, isIncidentRptAckDoc, exposure)
     //check to see if the document is supported...some documents are not supported 
     //that is why we need to check this
     if (util.document.DocumentProduction.synchronousDocumentCreationSupported( documentName )) {
        var doc : Document = createDocument(claim, exposure, contact, isIncidentRptAckDoc)
        var values : HashMap = loadValues(claim, doc)
        util.document.DocumentProduction.createAndStoreDocumentSynchronously(documentName, values, doc )
        if(createNote)
          createNote(claim, exposure)
    } else {
      //changed to logging in Debug - SR
      Logger.logDebug("ERROR: COULD NOT CREATE DOCUMENT");
    }}
  
  private static function createDocument(claim : Claim, exposure : Exposure, contact : Contact, incident : boolean) : Document {
    var doc : Document = new Document(claim)
    doc.Claim = claim
    if(exposure != null){
      doc.ex_ClaimantName = exposure.Claimant.DisplayName
      doc.Exposure = exposure 
      doc.FormIDExt = getFormID(claim, incident, true)
    } else {
       doc.FormIDExt = getFormID(claim, incident, false)
    }
    if (util.WCHelper.isWCorELLossType(claim)){
      doc.ex_ClaimantName = claim.claimant.DisplayName
    }
    doc.DocUID = "ID-" + java.util.Calendar.getInstance().getTimeInMillis()
    doc.Name = "Auto Acknowledgement Letter"
    doc.ex_Type = "Correspondence"
    doc.ex_SubType = "Claim Acknowledgement"
    doc.Description = "Automated Acknowledgement Letter"
    doc.ProcessMethod = "Sent_to_File"
    doc.MimeType = "application/rtf"
    doc.Privileged = "No"
    doc.ex_CentralPrint = true
    // setting email flag and email address depending on the new Delivery Type
    var lob = Query.make(AutoAckExt).compare("LossTypeExt", Equals, claim.LossType).select()
    if(lob.Count>0){
      var emailFlag = lob.AtMostOneRow.DeliveryTypeExt
      if(emailFlag==typekey.MailTypeExt.TC_EMAIL){
        doc.emailExt = true
        doc.deliveryEmailAddrExt = lob.AtMostOneRow.EmailAddressExt
      }
    }
    doc.Status = "approved"
    doc.MailToExt = contact
    return doc
  }
  
  private static function loadValues(claim : Claim, doc : Document) : HashMap {
    var values = new HashMap();
    values.put("CurrentDate", gw.api.util.StringUtil.formatDate(gw.api.util.DateUtil.currentDate(), "MMMMM d, yyyy"))
    values.put("SendTo", doc.MailToExt)
    values.put("ToAddressLine1", doc.getAddressLine1())
    values.put("ToCityStateZip", doc.getCityStateZip())
    values.put("InsuredFormal", ((claim.Insured typeis Person and claim.Insured.Prefix != null ) ? ((claim.Insured as Person).Prefix + " " + claim.Insured.DisplayName) : claim.Insured.DisplayName))
    if (util.WCHelper.isWCorELLossType(claim)){
      values.put("Claimant", util.StringUtils.getDisplayNameWithoutFormerAndClosed(claim.claimant.DisplayName))
    }else { values.put("Claimant", util.StringUtils.getDisplayNameWithoutFormerAndClosed(doc.Claimant.DisplayName))}
    values.put("DateOfLoss", gw.api.util.StringUtil.formatDate(claim.LossDate, "MM/dd/yyyy"))
    values.put("PolicyNumber", doc.getPolicyString())
    values.put("ClaimNumber", claim.ClaimNumber )
    values.put("AdjToll", ( doc.returnAdjusterField("TollFreePhone") != null ? doc.returnAdjusterField("TollFreePhone") : ""))
    values.put("AdjWorkPhone", ((doc.returnAdjusterField("WorkPhone") != null) ? doc.returnAdjusterField("WorkPhone") : ""))
    values.put("AdjFax", ((doc.returnAdjusterField("FaxPhone") != null) ? doc.returnAdjusterField("FaxPhone") : ""))
    values.put("AdjFaxLabel", ((doc.returnAdjusterField("FaxPhone") != null) ? "Fax:" : ""))
    values.put("AdjusterSignature", doc.adjustersignature())
    values.put("CCNoAgency", doc.getCCUsers(false, false))
    values.put("DocuName", doc.FormIDExt)
    values.put("ACKClaimant", ((doc.ex_ClaimantName != null) ? util.StringUtils.getDisplayNameWithoutFormerAndClosed(doc.ex_ClaimantName) : "Claim-level"))
    values.put("TradeMark", ((doc.Claim.NCWOnlyBusinessUnitExt == "ab") ? "®" : ""))
    values.put("LossType", getLossType(doc.Claim.NCWOnlyBusinessUnitExt as java.lang.String, doc))
    values.put("addDivision", ((doc.Claim.NCWOnlyBusinessUnitExt == "ab" || doc.Claim.NCWOnlyBusinessUnitExt == "eq") ? " Division" : ""))
    values.put("AdjusterMailingSignature", doc.adjusterMailingSignature())
    values.put("DivisionName", doc.getDivisionName())
    if (util.WCHelper.isWCorELLossType(claim)){
      values.put("IncidentClaimant", claim.claimant)} 
    else { values.put("IncidentClaimant", (claim.incidentclaimant!=null ? claim.incidentclaimant : ""))}
    values.put("ClaimantLabel", (doc.getClaimantLabel()))
    values.put("InsuredLabel", (doc.getInsuredLabel()))
    values.put("DateOfLossLabel", (doc.getDateofLossLabel()))
    return values
  }
  
  private static function getLossType(lossType : String, doc : Document) : String {
   var LOB : String = null
    if(lossType == "ab")
      LOB = "AgriBusiness"
    else if(lossType == "eq")
      LOB = "Equine"
    else
      LOB = doc.Claim.LossType.Description
    return LOB}
  
  private static function getDocumentFilename(claim: Claim, isIncidentRptAckDoc : boolean,  exposure : Exposure) : String {
    var adjBusinessUnit = util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(claim)
    //if (claim.LossType != LossType.TC_STRATEGICCOMPEL && claim.LossType != LossType.TC_STRATEGICCOMPWC){
    if(adjBusinessUnit==null || (adjBusinessUnit!=null && !adjBusinessUnit.containsIgnoreCase("Strategic Comp"))){
      if (!isIncidentRptAckDoc and exposure != null){
        return "AutoAcknowledgementLetter_Claimant.gosu.rtf"
      }
      else if(!isIncidentRptAckDoc){
        return "AutoAcknowledgementLetter.gosu.rtf"
      }
      else{
        return "AutoAcknowledgementLetter_IncidentRpt.gosu.rtf"
      }
    } else {
      if (!isIncidentRptAckDoc and exposure != null){
        return "AutoAcknowledgementLetter_ClaimantSC.gosu.rtf"
      }
      else if(!isIncidentRptAckDoc){
        return "AutoAcknowledgementLetterSC.gosu.rtf"
      }
      else{
        return "AutoAcknowledgementLetter_IncidentRptSC.gosu.rtf"
      }
    }
  }
  
  private static function createNote(claim : Claim, exposure : Exposure) {
        var note : Note
        
        // Note should be different when Delivery Type == Email on Auto Ack Admin screen.
        var LOB = Query.make(AutoAckExt).compare("LossTypeExt", Equals, claim.LossType).select()
        if(LOB != null) {
          if(LOB.getAtMostOneRow().DeliveryTypeExt == typekey.MailTypeExt.TC_EMAIL){
            note = claim.addNote( "general", 
            "Acknowledgement Letter emailed to "+ LOB.getAtMostOneRow().EmailAddressExt+".")
          }
          else{
            if(exposure != null) {
                note = claim.addNote( exposure, "general", 
                "Automated Acknowledgement letters were created and mailed to the "+claim.Insured+" and "+claim.Policy.ex_Agency.DisplayName+  " for "+ exposure.Claimant+".");
            } 
            //Defect 9455 dnmiller - SHS Auto should only be sent to the agent
            else if (claim.LossType == typekey.LossType.TC_SHSAUTO){
              note = claim.addNote( "general", 
              "Automated Acknowledgement letters were created and mailed to the "+claim.Policy.ex_Agency.DisplayName+"." )
            }
            // Defect#8379 Do not show Claimant on the Auto Ack Note for Incident only WC claims 
            else if (claim.isWCclaim && claim.IncidentReport == false){
                note = claim.addNote( "general", 
                "Automated Acknowledgement letters were created and mailed to the "+claim.Insured+" , "+claim.Policy.ex_Agency.DisplayName+ 
                 " and "+ claim.claimant+".")
            } 
            else{
                note = claim.addNote( "general", 
                "Automated Acknowledgement letters were created and mailed to the "+claim.Insured+" and "+claim.Policy.ex_Agency.DisplayName+"." )
            }
          }
        }
        note.Subject = "Acknowledgement Letter";
        //mbendure: Defect 5351 Setting the by field in notes to Batch Superuser
        note.Author = util.custom_Ext.finders.getUserOb( "batchsu" )
        note.addEvent("NoteAdded")
  }
  
  public static function createNoteOnCancelECFDocument(doc : Document) : void {
    var note : Note
    if(doc.Exposure != null){
      note = doc.Claim.addNote( doc.Exposure, "general",  "The printing of the acknowledgement letter has been cancelled" )
      note.Subject = "Acknowledgement letter print cancelled" + " for " + doc.MailToExt
      note.addEvent("NoteAdded")
    } else {
      note = doc.Claim.addNote("general", "The printing of the acknowledgement letter has been cancelled" )
      note.Subject = "Acknowledgement letter print cancelled" + " for " + doc.MailToExt
      note.addEvent("NoteAdded")
    }
  }
  
  @Param("claim","Claim to Check")
  @Returns("True if claim was created on or after Line of Business Effective Date")
  public static function createdAfterEffDate(claim : Claim) : boolean {
    var result : boolean = false
    var LOB = Query.make(AutoAckExt).compare("LossTypeExt", Equals, claim.LossType).select()
    if(LOB != null) {
      if(claim.CreateTime >= LOB.getAtMostOneRow().EffectiveDateExt){result=true}}
    return result}
    
    
  private static function getFormID(claim: Claim, incident: Boolean, exposure : Boolean): String{
    var adjBusinessUnit = util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(claim)
    if(adjBusinessUnit!=null && adjBusinessUnit.containsIgnoreCase("Strategic Comp")){
    //if (claim.LossType == LossType.TC_STRATEGICCOMPEL || claim.LossType == LossType.TC_STRATEGICCOMPWC){
      if (incident){
        return "SC0005"
      } else {
        if (exposure){
          return "SC0004"
        } else {
          return  "SC0012"
        }
      }
    } else {
      // All non-SC lines of busienss
       if (incident){
        return "ENT0016"
      } else {
        if (exposure) {
          return "ENT0031"
        } else {
          return  "ENT0002"
        }
      }
    }
  }
  
   public static function unverifiedPolicy(claim:Claim){
      if(!exists(var note in claim.Notes where note.Subject=="Acknowledgement Letter Not Generated")){
          var note : Note
          note = claim.addNote ( "general", "This claim is on an unverified policy; no Automated Acknowledgement Letter was generated.")
          note.Subject = "Acknowledgement Letter Not Generated"
          note.Author = util.custom_Ext.finders.getUserOb("batchsu")
          note.addEvent("NoteAdded")}
  }
  
  public static function claimLevel(claim:Claim){
      if(claim.IncidentReport == false &&
          util.document.AutoACKLetter.autoAckController(claim.LossType, TC_CLAIM) and
          claim.Documents.where(\d -> d.ex_SubType == "Claim Acknowledgement" and isAutoAckByFormID(d.FormIDExt)).IsEmpty and
          (claim.Exposures.length == 0 or !util.document.AutoACKLetter.autoAckController(claim.LossType, TC_FEATURE))){
              if (claim.LossType == typekey.LossType.TC_SHSAUTO){
                //Defect 9455 dnmiller - SHS Auto should only be sent to the agent
                util.document.AutoACKLetter.saveACKLetter(claim, null, false, claim.Policy.ex_Agency, true)
              }else if (!claim.isWCclaim){
                util.document.AutoACKLetter.saveACKLetter(claim, null, false, claim.Insured, false)
                util.document.AutoACKLetter.saveACKLetter(claim, null, false, claim.Policy.ex_Agency, true)
              } else {
                if (claim.claimant.PrimaryAddress != null){
                  util.document.AutoACKLetter.saveACKLetter(claim, null, false, claim.Insured, false)
                  util.document.AutoACKLetter.saveACKLetter(claim, null, false, claim.Policy.ex_Agency, true)
                  util.document.AutoACKLetter.saveACKLetter(claim, null, false, claim.ClaimantDenorm, false)
                }
              }
      }
  }
  
  public static function featureLevel(exp:Exposure){
      if(util.document.AutoACKLetter.autoAckController(exp.Claim.LossType, TC_FEATURE) &&
          !exp.ReconnectFailExt &&
          exp.shouldCreateAutoAcknowledgementLetter()){
             if (exp.Claim.LossType == typekey.LossType.TC_SHSAUTO){
                //Defect 9455 dnmiller - SHS Auto should only be sent to the agent
                util.document.AutoACKLetter.saveACKLetter(exp.Claim, exp, false, exp.Claim.Policy.ex_Agency, true)
              }else{
                util.document.AutoACKLetter.saveACKLetter(exp.Claim, exp, false, exp.Claim.Insured, false)
                util.document.AutoACKLetter.saveACKLetter(exp.Claim, exp, false, exp.Claim.Policy.ex_Agency, true)}
          }
  }
              
  public static function incidentOnly(claim:Claim){
      if(claim.IncidentReport == true and
        util.document.AutoACKLetter.autoAckController(claim.LossType, TC_IO) and
        claim.Documents.where(\d -> d.ex_SubType == "Claim Acknowledgement" and isAutoAckByFormID(d.FormIDExt)).IsEmpty
        and (claim.Exposures.length == 0 or !util.document.AutoACKLetter.autoAckController(claim.LossType, TC_FEATURE))){
          // Defect# 8379 All Incident Only claims should not send AutoAck Letter to the Claimant, even WC
          /*if (!claim.isWCclaim){
            util.document.AutoACKLetter.saveACKLetter(claim, null, true, claim.Insured, false)
            util.document.AutoACKLetter.saveACKLetter(claim, null, true, claim.Policy.ex_Agency, true)
          }
          else {
            if (claim.claimant.PrimaryAddress != null){
              util.document.AutoACKLetter.saveACKLetter(claim, null, true, claim.Insured, false)
              util.document.AutoACKLetter.saveACKLetter(claim, null, true, claim.Policy.ex_Agency, true)
              util.document.AutoACKLetter.saveACKLetter(claim, null, true, claim.ClaimantDenorm, false)
            }
          } */
           if (claim.LossType == typekey.LossType.TC_SHSAUTO){
             //Defect 9455 dnmiller - SHS Auto should only be sent to the agent
             util.document.AutoACKLetter.saveACKLetter(claim, null, true, claim.Policy.ex_Agency, true)
           }else {
             util.document.AutoACKLetter.saveACKLetter(claim, null, true, claim.Insured, false)
             util.document.AutoACKLetter.saveACKLetter(claim, null, true, claim.Policy.ex_Agency, true)
           }
      }
  }  
  // is used to check if auto ack letter already exists on a claim by document's FormID 
  public static function isAutoAckByFormID(docFormID:String):Boolean{
    var autoAckFormIDs = { "SC0005", "SC0004", "SC0006", "ENT0016", "ENT0031", "ENT0002", "ENT002", "SC0012"}
    return autoAckFormIDs.contains(docFormID)
  } 
}  