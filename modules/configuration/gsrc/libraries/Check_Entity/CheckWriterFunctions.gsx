package libraries.Check_Entity

enhancement CheckWriterFunctions : entity.Check {
  
  //moved Splitname() function to StringUtil.gs

  function getFirstTaxID() : String{
    var tempString : String = ""
    if(this.IssuedPayeeTaxIDExt != null){
      var token : java.util.StringTokenizer = new java.util.StringTokenizer(this.IssuedPayeeTaxIDExt, "\n")
      while(token.hasMoreElements()){
        tempString = token.nextElement().toString().trim()
        if(tempString.trim().length() == 9){
          break;
        }
      }
    }
    return tempString;
  }
  function replacePostalCode(mailAddress : Address) : String {
    if(mailAddress.PostalCode != null && mailAddress.Country.Code =="US" && mailAddress.PostalCode.length()==10 && mailAddress.PostalCode.contains("-")){
    return mailAddress.PostalCode.replace("-", "")
    }
   else if(mailAddress.PostalCode != null && mailAddress.Country.Code =="US" && mailAddress.PostalCode.length()==10 && mailAddress.PostalCode.contains(" ")){
    return mailAddress.PostalCode.replace(" ", "")
    }
    else{
      return mailAddress.PostalCode
    }
  }
  
  /**
   * Returns <code>true</code> if the state requires unique,  
   * back-of-check fraud language for Workers' Comp claims.
   * As of 8.26.15, the list includes AR, CA, DE, NC, NY, 
   * RI and UT. All other states use default language.
   * 
   * @param state  the 2-character state code
   * 
   * Defect 8917 - anicely - Removing NC
   * 
   */
  static function hasStateSpecificLanguage(state : String) : Boolean {
    return state=="AR" or state=="CA" or state=="DE" or state=="NY" or state=="RI" or state=="UT" or state=="KS"
  }

  /**
   * Gets the 2-character state code used by CheckWriter to determine 
   * the state-specific fraud language that should be printed on the  
   * back of a Workers' Comp check (if any).  
   *  
   * @return 2-character state code
   * 
   * Defect 8917 - anicely - Based on Jurisdiction State
   * Does not apply to HCS/LitAdvisor/Mitchell payments
   * Applies to checks with an Injured Worker payee
   * Applies to Doctor and MedicalCareOrg checks with a Jurisdiction State of NY
   * Applies to Mitchell checks with a Jurisdiction State of NY
   */
  function getBackOfCheckStateCode() : String {
    if(!util.WCHelper.isWCorELLossType(this.Claim)){
      return ""
    }
    if(this.CheckSet.PrimaryCheck.CheckCategoryExt == CheckCategoryExt.TC_HCS || this.CheckSet.PrimaryCheck.CheckCategoryExt == CheckCategoryExt.TC_LIT_ADVISOR ||
       this.CheckSet.PrimaryCheck.CheckCategoryExt == CheckCategoryExt.TC_OCCM || this.CheckSet.PrimaryCheck.CheckBatching == CheckBatching.TC_BULKCHECK){
      return ""
    }
    else{
     // var jurisdictionState = this.Claim.JurisdictionState.Code
     var jurisdictionState = this.CheckSet.PrimaryCheck.Claim.JurisdictionState.Code
       if(jurisdictionState != null && hasStateSpecificLanguage(jurisdictionState) && this.CheckSet.PrimaryCheck.CheckCategoryExt != CheckCategoryExt.TC_MITCHELL && 
         (exists(payee in this.Payees where payee.ClaimContact.Contact.Subtype == typekey.Contact.TC_INJUREDWORKEREXT))){
           return jurisdictionState
        }
       if(jurisdictionState != null && jurisdictionState == "NY" && ((exists(payee in this.Payees where payee.ClaimContact.Contact.Subtype == typekey.Contact.TC_DOCTOR)) || 
          exists(payee in this.Payees where payee.ClaimContact.Contact.Subtype == typekey.Contact.TC_MEDICALCAREORG))){
            return jurisdictionState
       }
       if(jurisdictionState != null && jurisdictionState == "NY" && this.CheckSet.PrimaryCheck.CheckCategoryExt == CheckCategoryExt.TC_MITCHELL){
         return jurisdictionState
       }
       else{
         return ""
   }
    }
  }
  
  /**
   * Gets indicator field for CheckWriter. As of 8.26.15 this indicator
   * is only used for Workers' Comp checks and Bulk Checks that include
   * at least one payment allocated to a WC claim. Indicates that the 
   * check is related to a WC claim and may require unique text on the 
   * back of the check.
   * 
   * @author Craig Mullin 8.26.15
   * @return 2-character code
   */
  function getBackOfCheckIndicator() : String {
    var result : String = ""
    if(util.WCHelper.isWCorELLossType(this.Claim)){
      result = "WC"
    }
    return result
  }
}