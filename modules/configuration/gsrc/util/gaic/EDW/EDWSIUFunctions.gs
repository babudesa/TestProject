package util.gaic.EDW;
uses templates.messaging.edw.SpecialInvestigationEDW

class EDWSIUFunctions {
  private static final var fieldList : String[] = 
        {"SIUInvestigator", "ReferralDate","ReferralReason","SIUClaimType","OtherType",
        "SIUReferralType","SurvRequested","InvestigationStatus","SIUOpenDate","SIUCloseDate","SIUOpinion","ClaimWithdrawn",
        "DOIReferral","DOIReferralDate","DOIDisposition","DOIAgencyLevel", "SIUClaimant"};
  
  private construct() {
  }
  
  static function getInstance() : EDWSIUFunctions {
    return new EDWSIUFunctions();
  }
  
  static function isSIUChanged(thesiu : SIUInvestigationExt) : boolean {
    if (thesiu.isArrayElementAddedOrRemoved( "SIUVendors" ) || thesiu.isArrayElementAddedOrRemoved( "SIUTravelInfos" )
      || thesiu.isArrayElementAddedOrRemoved( "DataResearchParties" ) || thesiu.isArrayElementChanged( "SIUVendors" ) 
      || thesiu.isArrayElementChanged( "SIUTravelInfos" ) || thesiu.isArrayElementChanged( "DataResearchParties" )) {
        return true;
    } else {
      // some fields in SIUTravelInfos doesn't trigger array element changed
      for (travelinfo in thesiu.SIUTravelInfos) {
        if (travelinfo.TravelAddress.Changed && !travelinfo.TravelAddress.New) {
          return true;
        }
      }
      for (researchparty in thesiu.DataResearchParties) {
        for (researchtyp in researchparty.ResearchTypes) {
          if (researchtyp.Changed) {
            return true;
          }
        }
          if (researchparty.isArrayElementAddedOrRemoved("ResearchTypes") ) {
            return true;
          }
      }
    }
    
    if (util.gaic.CommonFunctions.fieldFromListChanged(thesiu, fieldList)) return true;
    
    return false;
  }
  
  function sendSIUChanges(messageContext : MessageContext, claim : Claim) {
    // send added SIUs
    for (item in claim.getAddedArrayElements( "SIUInvestigationsExt" )) {
      sendSIU( messageContext, "A", item as SIUInvestigationExt );
    }
    
    // send changed SIUs
    for (item in claim.SIUInvestigationsExt){
      if (item.New) continue;
      if (isSIUChanged(item)) {
        sendSIU( messageContext, "C", item);
      }
    }
    
    // send removed SIUs
    for (item in claim.getRemovedArrayElements( "SIUInvestigationsExt" )) {
      sendSIU( messageContext, "D", item as SIUInvestigationExt );
    }
  }

  protected function sendSIU(messageContext : MessageContext, objectStatus : String, item : SIUInvestigationExt) {
    createPayload(messageContext, objectStatus, item);
  }
  
  protected function createPayload(messageContext : MessageContext, objectStatus : String, item : SIUInvestigationExt) {
    var siuData = SpecialInvestigationEDW.renderToString(item, objectStatus);
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, siuData);
  }
}