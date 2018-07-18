package libraries.Check_Entity
uses util.gaic.CMS.validation.*
uses com.guidewire.pl.web.controller.UserDisplayableException


enhancement CMSCheckFunctions : entity.Check {
  
  /**
   * Runs CMS field validation against any payments on this Check that meet the following:
   *   1) CostType of ClaimCost (Loss Payment)
   *   2) Payment's Exposure is a Medicare Exposure Type
   *   3) Payment's Exposure's Claimant:
   *     a) Is exactly of type Person
   *     b) Does not have either of the SSN/HICN override fields invoked
   */
  function validateFinalPayment(){
    var paymentsToValidate = this.Payments.where(\ pmt -> CMSValidationUtil.generalPrecondition(pmt.Exposure) &&
                                                   pmt.PaymentType != PaymentType.TC_PARTIAL)
  
    for(pmt in paymentsToValidate){
      var cmsVal = new PaymentValidation(pmt)
      
      CMSValidationUtil.validate(cmsVal)
      
      var validationMessage = cmsVal.ValidationMessage
      
      if(validationMessage != ""){
        throw new UserDisplayableException(validationMessage)
      }
    }
  }
}
