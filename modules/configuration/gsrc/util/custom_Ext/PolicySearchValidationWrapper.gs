package util.custom_Ext;

uses com.guidewire.cc.domain.policy.PolicySearchCriteria;
uses com.guidewire.pl.web.controller.UserDisplayableException;
//uses java.lang.StringBuffer;

// 03/27/2008 - zthomas - Defect 938, Class used to validate the correct fields are completed before performing a policy search.
class PolicySearchValidationWrapper
{
  construct()
  {
  } 

  public static function validate(criteria : PolicySearchCriteria, verifiedPolicyInfo : util.custom_Ext.VerifiedPolicyInfo) : PolicySummaryQuery {
    //var errorMsg : StringBuffer = new StringBuffer();
    if(criteria != null){
        
//      if(criteria.LossDate == null){ 
//        throw new UserDisplayableException(PLDisplayKeys.Java_Search_Error_RequiredNotPresent) 
//      }else{ 
//        return criteria.performSearch() 
//      } 
      
      switch(criteria.LossType){
        case "EQUINE":
          if(criteria.LossDate != null and (criteria.PolicyNumber != null or criteria.ex_InsuredName != null or criteria.ex_PropertyName != null)){
            verifiedPolicyInfo.SearchLossDate = criteria.LossDate;
            return criteria.performSearch();
          }else{
            throw new UserDisplayableException(displaykey.Web.Policy.PolicySearch.Equine.Validation.Message);
          }
        case LossType.TC_AGRIAUTO: case LossType.TC_ALTMARKETSAUTO : case LossType.TC_SHSAUTO : case LossType.TC_TRUCKINGAUTO :
          if(criteria.LossDate != null and (criteria.PolicyNumber != null or criteria.ex_InsuredName != null or criteria.ex_PropertyName != null or criteria.Vin != null)){
            verifiedPolicyInfo.SearchLossDate = criteria.LossDate;
            return criteria.performSearch();
          }else{
            throw new UserDisplayableException(displaykey.Web.Policy.PolicySearch.Default.Validation.MessageCA);
          }
        default:
          if(criteria.LossDate != null and (criteria.PolicyNumber != null or criteria.ex_InsuredName != null)){
            verifiedPolicyInfo.SearchLossDate = criteria.LossDate;
            return criteria.performSearch();
          }else{
            throw new UserDisplayableException(displaykey.Web.Policy.PolicySearch.Default.Validation.Message);
          }
      }
    } 
    return null ;
  }
  
  public static function validateVIN(criteria : PolicySearchCriteria){
    if(criteria.Vin != null){
      if(criteria.Vin.length<6 or criteria.Vin.length>20){
        throw new UserDisplayableException(displaykey.Web.Policy.PolicySearch.Default.Validation.VIN)
      }
    }
  }
}
