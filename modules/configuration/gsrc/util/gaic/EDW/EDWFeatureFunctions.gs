package util.gaic.EDW;
uses templates.messaging.edw.ExposureDataEDW
uses templates.messaging.edw.PartyDataEDW
uses gw.policy.RefreshPolicyParallel

class EDWFeatureFunctions {
  
  private var commonF = EDWFunctionsFactory.getCommonFunctions();
    
  private construct() {
  }
  
  static function getInstance() : EDWFeatureFunctions {
    return new EDWFeatureFunctions();
  }
  
  // Sends CC outbound message to EDW for Exposure adds and changes
  function sendExposureChanges(messageContext : MessageContext, exposure : Exposure) {
      // do not send EDW messages if policy is refreshed from batch process 
    var claim=exposure.Claim
    if (claim != null and RefreshPolicyParallel.wasClaimRefreshedFromBatchRefreshPolicy(claim.ID)) {
      return
    } 
    var isExposureNew = false;
    var isVehicleNew = false
    var isIncidentNew = false
    var isSIRNew = false
     
//    var isClaimNew = false;
    
//    if (isClaimNew(exposure))
//    {
//      isClaimNew = true;
//    }
    var state = exposure.State
    //print(state);
    
    if (exposure.RptCreateDateExt != null && exposure.RptUpdateDateExt !=null
      && exposure.RptCreateDateExt == exposure.RptUpdateDateExt) {
      if (exposure.VehicleIncident != null && exposure.VehicleIncident.Vehicle != null) {
        if (exposure.VehicleIncident.CreateTime == exposure.VehicleIncident.UpdateTime
         && exposure.VehicleIncident.Vehicle.CreateTime == exposure.VehicleIncident.Vehicle.UpdateTime) {
             isVehicleNew = true
        }
      } if(exposure.SIRsExt != null) {
        //defect 7051, make exceptions to send messages if Invoices have been added to the exposure or if SIRsExt has been updated
        if(exposure.SIRsExt.UpdateTime == exposure.SIRsExt.CreateTime){
          if(exposure.SIRsExt.getRemovedArrayElements("SIRInvoicesExt").IsEmpty && 
            exposure.SIRsExt.SIRInvoicesExt.IsEmpty){
              isSIRNew = true
            }
        }
      } if (exposure.Incident != null){
          if(exposure.Incident.CreateTime==exposure.Incident.UpdateTime){
            isIncidentNew = true
          }
      }
      
      if(isVehicleNew and isSIRNew and isIncidentNew){
        isExposureNew = true
      }
    }
    
    if (messageContext.EventName == "ExposureAdded" && exposure.State != "draft") {
      sendExposureAdd(messageContext, exposure)
    } else if (messageContext.EventName == "ExposureChanged" && exposure.State != "draft"
    && !isExposureNew &&  !exposure.Claim.New && !exposure.New) {
           // create exposure message with risk and coverage delete
      var previousExposure = exposure.OriginalVersion as Exposure;
      if (previousExposure.Coverage != exposure.Coverage and previousExposure.Coverage != null) {
        createExposurePayload(messageContext, previousExposure, "D", "Actual");
      }
      if (exposure.Coverage != null) {
         sendExposureChange(messageContext, exposure)
      }
    }
    //&& !claimF.isInjWorkerClaimFieldChanged(exposure.Claim)
    //worker comp - may need to generate injured worker party message which will contain relationships to features
    if (exposure.Claim.InjuredWorker != null){
      if (!exposure.Claim.InjuredWorker.Changed){      
        if (isInjWorkerExpFieldChanged(exposure) ) {
           if(exposure.Claim.Exposures.Count > 1) {
               if (!commonF.isInjWorkerClaimFieldChanged(exposure.Claim)){
                 createExpInjuredWorkerPayload(messageContext, exposure.Claim, "C");
                 //claimF.createInjuredWorkerPayload(messageContext, exposure.Claim, "C"); 
               }
           }
        }
      }
    }
  }
  
  // Sends CC outbound message to EDW for Exposure add
  protected function sendExposureAdd(messageContext : MessageContext, exposure : Exposure) {
    createExposurePayload(messageContext, exposure, "A", "open");
  }
   
  // Sends CC outbound message to EDW for Exposure add
  protected function sendExposureChange(messageContext : MessageContext, exposure : Exposure) {
    if (exposureFieldChanged(exposure) or otherCoverageDetChanged(exposure)) {
       createExposurePayload(messageContext, exposure, "C", "Actual");
    }
   }
  
  // Helper for anyFieldChanged; returns true if any claim fields of interest to Feature have changed
  protected function exposureFieldChanged(exposure : Exposure) : boolean {
    var fields = new String[] {  "StatuteOfLimitationsExt", "ReservedFileExt", "TotalLossIndExt", "AssignmentDate",
    "SalvagePotentialExt", "SubrogPotentialExt", "CourseOfEmployExt", "VehicleOperableExt", "TypeOfLossMostExt",
    "DateOfBirthExt", "ContribPotentialExt", "ex_InSuit", "ClaimOrder", "LossAppToExt", "SublimitsExt",
    "MethodVerifyDamagesExt", "BasisOfPayExt", "ExposureDetailsExt", "ExposureType", "LossParty", "State",
    "ClosedOutcome", "MethodOfSettlementExt", "JurisdictionState", "ReOpenedReason", "LossDueToExt", "LossLocationExt",
    "Coverage", "ReciprocatePIPExt", "ConstructedByExt", "DriverTypeExt", "InjuryNatureDescExt", "LostPropertyType",
    "LegalExpenseExt", "NoLegalExpenseTypeExt", "ExposureDeductibleExt", "GlassOnlyClaimIndExt", "BodyShopPaymentIndExt",
    "TotalDamageIndExt", "ReinspectedIndExt", "ReinspectionResultExt", "RptUpdateDateExt", "DeductibleExistsExt", 
    "JurisdictionCountryExt", "AppliesToCertAggLimitExt", "CertCoverageDescExt", "CertSublimitAggregateExt",
    "CertSublimitAppExt", "CertSublimitDeductibleExt", "CertSublimitDeductibleAppExt", "CertSublimitExt",
    "JurisdictionCountryExt", "SIRsExt", "SettleMethod" , "FuneralAmountExt", "VocRehabLimitAmtExt", "VocRehabLimitWeeksExt", 
    "RemarriagePaymentExt", "ImpairPercBasisExt", "AnnuityPurchaseAmtExt", "DrivingExperienceExt"};
    
    if (util.gaic.CommonFunctions.fieldFromListChanged(exposure, fields)) {
      return true;
    }
    if (propertyIncidentChanged(exposure.FixedPropertyIncident)) {
      return true;
    }
//    if (exposure.Claim.Policy.PolicyType.Code != "AMP" and exposure.FixedPropertyIncident != null and exposure.FixedPropertyIncident.Property != null) {
//      if (propertyIncidentPropChanged(exposure.FixedPropertyIncident.Property)) {
//        return true;
//      }
//    }
    if (exposure.Coverage.Type == "ab_EQCCC" and exposure.FixedPropertyIncident != null and exposure.FixedPropertyIncident.Property != null) {
      if (propertyIncidentPropChanged(exposure.FixedPropertyIncident.Property)) {
        return true;
      }
    }
    if (exposure.VehicleIncident != null and vehicleIncidentChanged(exposure.VehicleIncident)) {
      return true;
    }
    if (exposure.VehicleIncident != null and exposure.VehicleIncident.Vehicle != null) {
      if (vehIncidentVehChanged(exposure.VehicleIncident.Vehicle)) {
        return true;
      }
    }
    if (exposure.isFieldChanged("ClaimantDenorm")) {
      return true;
    }
    if (exposure.Incident != null && exposureIncidentChanged(exposure.Incident)) { 
      return true;
    }
    if (exposure.SIRsExt != null){
      if(SIRChanged(exposure.SIRsExt))
        return(true)  
    }
  
      // Helper to determine if Cargo added, changed, or removed 
    if ( exposure.getAddedArrayElements("CargoExt").length != 0 or 
        exposure.getRemovedArrayElements("CargoExt").length != 0 or 
        exposure.getChangedArrayElements("CargoExt").length != 0) { 
         return true;
    }
    
      // Helper for Exposure change - determine if medical treatments were added, changed, or removed
    if (exposure.getAddedArrayElements("MedTreatmentsPrescribedExt").length != 0 or 
        exposure.getRemovedArrayElements("MedTreatmentsPrescribedExt").length != 0 or 
        exposure.getChangedArrayElements("MedTreatmentsPrescribedExt").length != 0) { 
         return true;
    }

    return false;
  }
  
  // Helper for anyFieldChanged; returns true if any claim fields of interest to Feature have changed
  protected function exposureCoveragePropertyChanged(exposure : Exposure) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(exposure, new String[] {  "Coverage"  })) {
      return true;
    }
    if (propertyIncidentChanged(exposure.FixedPropertyIncident)) {
      return true;
    }
    return false;
  }
  
  // Helper for feature change related to Incident 
  private static function exposureIncidentChanged(inc : Incident) : boolean {  
     if (util.gaic.CommonFunctions.fieldFromListChanged(inc, new String[] {  "Description", "Severity" })) {
      return true;
    }
    return false;
  }

  // Helper for anyFieldChanged; returns true if any claim fields of interest to Feature have changed
  private static function propertyIncidentChanged(propinc : PropertyIncident) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(propinc, new String[] {  "Property" })) {
      return true;
    }
    return false;
  }
  
  // Helper for anyFieldChanged; returns true if any claim fields of interest to Feature have changed
  private static function propertyIncidentPropChanged(prop : PolicyLocation) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(prop, new String[] {  "LocationNumber","ex_Breed",
    "ex_Sex","ex_AnimalUse","ex_DateofBirth", "AnimalValueExt","VetBillsExt","BoardingExt","VetBillsExt",
    "AnimalUse2Ext" })) {
      return true;
    }
    return false;
  }
   // Helper for anyFieldChanged; returns true if any claim fields of interest to Feature have changed
  private static function vehicleIncidentChanged(vehinc : VehicleIncident) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(vehinc, new String[] {  "OdomRead", "ReasonForTotalLossExt",
      "IsOwnerRetainingExt" })) {
      return true;
    }
    return false;
  }
  
    private static function SIRChanged(SIRext : SIRExt) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(SIRext, new String[] {  "InsuringAgreementExt", "CovPartLimOcc",
      "SIR", "SIRAggregate", "MaintenanceSIR", "SIRInvoicesExt" })) {
      return true;
    }
    for(invoice in SIRext.SIRInvoicesExt){
      if(util.gaic.CommonFunctions.fieldFromListChanged(invoice, new String[] {  "InvoiceAmount", "DisputedAmount",
      "CreditSIR", "LineCategoryExt", "InvoiceDate", "InvoiceNumber", "CostTypeExt" })) {
        return true;
      }
    }
    if(SIRext.getRemovedArrayElements("SIRInvoicesExt") != null){
      return true;
    }
    return false;
  }

  // Helper for anyFieldChanged; returns true if any claim fields of interest to Feature have changed
  private static function vehIncidentVehChanged(veh : Vehicle) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(veh, new String[] {  "Make", "Model", "Vin", "Year", "TrailerYearExt", 
      "HoursExt","ModelYearExt","TrailerMakeExt","RefrigerationExt","VehicleStyleExt", "VehicleTypeExt"})) {
      return true;
    }
    return false;
  }
  
  // Helper for anyFieldChanged; returns true if any contact fields of interest to Feature have changed
  protected function contactFieldChanged(contact : Contact) : boolean {
    var fields = new String[] { "LastName", "FirstName", "MiddleName" };
    if ((contact typeis Person) and util.gaic.CommonFunctions.fieldFromListChanged(contact, fields)) {
      return true;
    }
    if ((contact typeis Company) and util.gaic.CommonFunctions.fieldFromListChanged(contact, new String[] { "Name" })) {
      return true;
    }
    return false; 
  }

  // Helper for anyFieldChanged; returns true if any exposure fields of interest to ISO have changed
  protected function exposureClaimantChanged(exposure : Exposure) : boolean {  
    if (exposure.isFieldChanged("ClaimantDenorm") or contactFieldChanged(exposure.ClaimantDenorm)) {
      return true;
    }
    return false;
  }
  
  // Helper for anyFieldChanged; returns true if any address fields of interest to ISO have changed
  protected function addressFieldChanged(address : Address) : boolean {
    return util.gaic.CommonFunctions.fieldFromListChanged(address, new String[] { "State" }) 
  }

  // Helper for anyFieldChanged; returns true if any otherrcoveragedetail has changed or is new
  protected function otherCoverageDetChanged(exposure : Exposure) : boolean  {
    for (othercov in exposure.OtherCoverageDet) {
      if (othercov.New or othercov.Changed) {   
          return true
      } 
    }
    return false;
  }
  
  // Helper for feature change related to injured worker
  private function isInjWorkerExpFieldChanged(exposure : Exposure) : boolean {
    var fields = new String[] { "WageStmtRecd", "WageStmtSent", "WeeklyWageDeterminExt", "ReturnToWorkDateExt", "ReturnToModWorkActualExt",
    "ReturnToModWorkValidExt", "ReturnToModWorkDateExt", "ReturnToWorkActualExt", "ReturnToWorkValidExt"};
  
    if (util.gaic.CommonFunctions.fieldFromListChanged(exposure, fields)) {
      return true;
    }    
    return false;
  }  
    
  protected function createExposurePayload(messageContext : MessageContext, exposure : Exposure, objStatus : String, openstatus : String) {
    var templateData = ExposureDataEDW.renderToString(exposure, openstatus, objStatus, "");
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, templateData);
  } 
  
  // work comp injured worker
  protected function createExpInjuredWorkerPayload(messageContext : MessageContext, claim : Claim, objStatus : String) {
    var templateData = PartyDataEDW.renderToString("", claim.InjuredWorker as Contact, objStatus, claim);
    util.gaic.CommonFunctions.sendTemplateMessage( messageContext, templateData );
  } 
  private function isClaimNew(exposure : Exposure) : boolean
  {
    if ((exposure.Claim.Changed && exposure.Claim.isFieldChanged( "RptUpdateDateExt" )) && exposure.Claim.Policy.Changed)
    {
      return true;
    }
    return false;
  }
}
