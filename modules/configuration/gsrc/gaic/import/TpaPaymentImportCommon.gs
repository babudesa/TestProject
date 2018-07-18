package gaic.import
uses util.WCHelper
uses java.util.ArrayList
uses gaic.import.bill.validation.NonVendorMatcher
uses util.gaic.billimport.BillImportCommon
uses gw.api.util.TypecodeMapper
uses util.StringUtils


class TpaPaymentImportCommon {

  construct() {

  }
  
  protected static final var WC_EXPENSE_CODE : String = "WCExpenseCode"
  protected static final var TPA_GENERAL_CODES : String = "TpaGeneralExpCode"
  protected static final var CSC_CODES : String = "CSC"
  private static var nonVendorMatcher : NonVendorMatcher = new NonVendorMatcher()
  
  
 /**
  * Gets the contact role given the payee type code on
  * the import record
  */
  static function getContactRoleFromPayeeType(importRecord : BillImportRecordExt) : ContactRole {
    return ContactRole.get(importRecord.PayeeType)
  }
  
  
  /**
  * Gets the injury type given the code on
  * the import record
  */
  static function getInjuryTypeFromImportRecord(importRecord : BillImportRecordExt) : WCInjuryTypeExt {
    return WCInjuryTypeExt.get(importRecord.InjuryType)
  }
  
  
  /**
  * Gets the expense type given the code on
  * the import record
  */
  static function getExpenseTypeFromImportRecord(importRecord : BillImportRecordExt) : TransactionQualifierExt {
    return TransactionQualifierExt.get(importRecord.ExpenseType)
  }
  
  
  /**
  * Gets the payment type given the code on
  * the import record
  */
  static function getPaymentTypeFromImportRecord(importRecord : BillImportRecordExt) : PaymentType {
    return PaymentType.get(importRecord.PaymentType)
  }
  
  
  /**
  * Gets the check prefix given the code on
  * the import record
  */
  static function getCheckPrefixFromImportRecord(importRecord : BillImportRecordExt) : CheckPrefixExt {
    return CheckPrefixExt.get(importRecord.CheckPrefix)
  }
  
  
  /**
  * Gets the manual payment method given the code on
  * the import record
  */
  static function getManualPaymentMethodFromImportRecord(importRecord : BillImportRecordExt) : ManualPaymentMethod {
    return ManualPaymentMethod.get(importRecord.PaymentMethod)
  }
  
  
  /**
  * Gets the cost type given the code on
  * the import record
  */
  static function getCostTypeFromImportRecord(importRecord : BillImportRecordExt) : CostType {
    //switches the value of cost type to claim cost
    if(importRecord.CostType.equals("loss")){
      importRecord.CostType = "claimcost"
    }
    return CostType.get(importRecord.CostType)
  }
  
  
  /**
  * Gets the method of settlement given the code on
  * the import record
  */
  static function getMethodOfSettlementFromImportRecord(importRecord : BillImportRecordExt) : MethodOfSettlement {
    return MethodOfSettlement.get(importRecord.MethodOfSettlement)
  }
  
  
  /**
  * Gets the settle method (settlement type) given the code on
  * the import record
  */
  static function getSettlementTypeFromImportRecord(importRecord : BillImportRecordExt) : SettleMethod {
    return SettleMethod.get(importRecord.SettlementType)
  }
  
 
  /**
   * Decides if the feature is at ability to pay
   */
  static function isFeatureAtATP(importRecord : BillImportRecordExt, claim : Claim) : Boolean {
    var isFeatureATP : Boolean = false
    if(WCHelper.isWCorELLossType(claim)) {
      isFeatureATP = isWcFeatureATP(importRecord, claim)
    }else {
      isFeatureATP = isNonWcFeatureATP(importRecord, claim)
    }
    return isFeatureATP
  }
  
  
  /**
   * Decides if a WC claim feature is Ability to pay
   */
  static function isWcFeatureATP(importRecord : BillImportRecordExt, claim : Claim) : Boolean {
    var isFeatureATP : Boolean = false
    var exposureType : ExposureType = ExposureType.get(importRecord.FeatureType)
    //WC claims can only have one of each feature type so if this is
    //empty there are no matching features at ATP
    if(getMatchingATPFeaturesByType(claim, exposureType).Empty) {
      isFeatureATP = false
    }else {
      isFeatureATP = true
    }
        
    return isFeatureATP
  }
  
  
   /**
   * Decides if a NON WC claim feature is Ability to pay
   */
  static function isNonWcFeatureATP(importRecord : BillImportRecordExt, claim : Claim) : Boolean {
    var isFeatureATP : Boolean = false
    var exposureType : ExposureType = ExposureType.get(importRecord.FeatureType)
    var exposures : ArrayList<Exposure> = getMatchingATPFeaturesByType(claim, exposureType)
    
    //non WC claims can have multiple features of the same type
    //additional logic is required (matching on claimant) if a feature is found.
    if(exposures.Empty) {
      isFeatureATP = false
    }else {
      //TODO implement logic for claimant matching here.  Not needed for Athens dev testing.
      isFeatureATP = true
    }
    
    return isFeatureATP
  }
  
  
  static function getMatchingATPFeaturesByType(claim : Claim, exposureType : ExposureType) : ArrayList<Exposure> {
      var matchingExposures : ArrayList<Exposure> = new ArrayList<Exposure>()
      matchingExposures = claim.Exposures.where(\ e -> e.ExposureType == exposureType and e.ValidationLevel == ValidationLevel.TC_PAYMENT) as java.util.ArrayList<entity.Exposure>      
      return matchingExposures
  }
  
  
  /**
  * Validates a non-vendor payee meets requirements to
  * allow payment to be imported.
  */
  static function validateNonVendorPayee(claim : Claim, importRecord : BillImportRecordExt) : BillImportStatusExt {
    
    var validationStatus : BillImportStatusExt
    var matchesClaimContact = false
    var contactsToSearch = getClaimLevelPayeeContacts(claim, importRecord)
    matchesClaimContact = nonVendorMatcher.matchesContactInList(contactsToSearch, importRecord.VendorTaxID, importRecord.PayeeName, importRecord.PayeeFirstName, importRecord.PayeeLastName)
    if (matchesClaimContact){
      validationStatus = BillImportStatusExt.TC_VALID
    } else{
      validationStatus = BillImportStatusExt.TC_PAYEENOTAVAILABLE
    }
    
    return validationStatus
  }
  
  
  /**
   * Retrieves the non vendor claim contact for the payee.
   */
  static function getNonVendorPayeeMatch(contacts : ArrayList<ClaimContact>, importRecord : BillImportRecordExt) : ClaimContact {
    var matchingContact : ClaimContact
    if(contacts != null and contacts.size() > 0){
      for(contact in contacts){
        if(nonVendorMatcher.contactMatches(contact, importRecord.VendorTaxID, importRecord.PayeeName, importRecord.PayeeFirstName, importRecord.PayeeLastName)){
          matchingContact = contact
        }
      }
    } 
    return matchingContact
  }
  
  
  /**
  * Retrieves the a contact match given a list to search and the
  * mail to contact data from the import record
  */
  static function getMailToContactMatch(contacts : ArrayList<ClaimContact>, importRecord : BillImportRecordExt) : ClaimContact {
    var matchingContact : ClaimContact
    
    if(contacts != null and contacts.size() > 0){
      for(contact in contacts){
        if(nonVendorMatcher.contactMatches(contact, importRecord.MailToTaxId, importRecord.MailToName, importRecord.MailToFirstName, importRecord.MailToLastName)){
          matchingContact = contact
        }
      }
    } 
    return matchingContact
  }
  
  
  /**
  * Get all the contacts for a specific role  * 
  */
  static function getClaimLevelPayeeContacts(claim : Claim, importRecord : BillImportRecordExt) : ArrayList<ClaimContact>{
    var contacts = new ArrayList<ClaimContact>()
    var roleToSearch : ContactRole = TpaPaymentImportCommon.getContactRoleFromPayeeType(importRecord)
    contacts = claim.ClaimContactsForAllRoles.where(\ c -> exists(ccRole in c.Roles where 
       ccRole.Role == roleToSearch)) as java.util.ArrayList<entity.ClaimContact>
    
    //Also check policy contacts if no claim contacts are found  
    if(contacts.Empty) {
      contacts = claim.Policy.ClaimContactsForAllRoles.where(\ c -> exists(ccRole in c.Roles where 
       ccRole.Role == roleToSearch)) as java.util.ArrayList<entity.ClaimContact>
    }

    return contacts  
  }
  
  
  /**
   * Determins if payee data is the same as the mail to 
   * data on the import record.
   */
  static function isPayeeSameAsMailTo(importRecord : BillImportRecordExt) : Boolean {
    var areTheSame : boolean = false
    var notMatchingCount : int = 0
   
 
    if(!StringUtils.equals(importRecord.VendorTaxID, importRecord.MailToTaxId)) { 
      notMatchingCount ++
    }  

    if(!StringUtils.equals(importRecord.PayeeName,importRecord.MailToName)) {
      notMatchingCount ++
    }
  
    if(!StringUtils.equals(importRecord.PayeeFirstName,importRecord.MailToFirstName)) {
      notMatchingCount ++
    }
    
    if(!StringUtils.equals(importRecord.PayeeLastName,importRecord.MailToLastName)) {
      notMatchingCount ++
    }
             
    if(notMatchingCount == 0) {
      areTheSame = true
    }
    
    return areTheSame
  }
  
  /**
  * Checks all the line category namespaces for the desc.  Returned and used on the reports
  */
  static function getLineCategoryDesc(importRecord : BillImportRecordExt) : String {
    var description : String
    
    description = BillImportCommon.getLineCategoryDescription(WC_EXPENSE_CODE, importRecord.ExpenseCode)
    if(description == null or description.Empty) {
      description = BillImportCommon.getLineCategoryDescription(TPA_GENERAL_CODES, importRecord.ExpenseCode)
    }
    if(description == null or description.Empty) {
      description = BillImportCommon.getLineCategoryDescription(CSC_CODES, importRecord.ExpenseCode)
    }
    return description
  }
  
  
  /**
   * Checks all the line category namespaces for the category
   */
  static function getLineCategory(importRecord : BillImportRecordExt) : LineCategory {
    var lineCategory : LineCategory
    var mapper : TypecodeMapper= gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    
    //try the WC namespace first
    lineCategory = mapper.getInternalCodeByAlias("LineCategory", WC_EXPENSE_CODE, importRecord.ExpenseCode)
    
    //if nothing is found in the WC mapping then check generic mapping
    if(lineCategory == null) {
       lineCategory = mapper.getInternalCodeByAlias("LineCategory", TPA_GENERAL_CODES, importRecord.ExpenseCode)
    }
    
    //if its still null try the CSC legal mapping codes
    if(lineCategory == null) {
      lineCategory = mapper.getInternalCodeByAlias("LineCategory", CSC_CODES, importRecord.ExpenseCode)  
    }
    
    return lineCategory
  }
  
    
}//End Class
