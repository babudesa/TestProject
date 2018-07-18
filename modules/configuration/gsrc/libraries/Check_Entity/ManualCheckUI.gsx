package libraries.Check_Entity

/**
* Enhancement for Manual Checks User Interface
*/
enhancement ManualCheckUI : entity.Check {
  
    
    /**
    * Validates the CheckNumber field on the Check for a Manual Check
    */
    @Returns ("The Validation Message for the Check Number")
    function validateManualCheckNumber() : String {
      
        var paymentMethod = this.ex_ManualPaymentMethod
        var validationMessage : String = null
        var checkNumberRegEx : String = null 
           
        if(paymentMethod == ManualPaymentMethod.TC_TOMIC) {
            
            checkNumberRegEx = "\\d{10}"
            validationMessage = "Must be 10 digits for a manual TOMIC check."      
        } else if(paymentMethod == ManualPaymentMethod.TC_AVIATION) {
            
            checkNumberRegEx = "\\d{10}"
            validationMessage = "Must be 10 digits for a manual Aviation check."      
        } else {
        
            checkNumberRegEx = "\\d{6}"
            validationMessage = "Must be 6 digits for a manual check."        
        }        
               
        return this.isManualCheckNumberValid(checkNumberRegEx) ? null : validationMessage
    }
    
    
    /**
    * Given a regular expression, checks the validity of a this Checks Check Number
    */
    @Returns ("Is the check number valid")
    function isManualCheckNumberValid(checkNumberRegEx : String) : boolean {
       
       var isValid = false
       
        if(this.CheckNumber == null || !this.CheckNumber.matches(checkNumberRegEx)){
            isValid = false
        } else {
            isValid = true
        }        
        return isValid
    }
    
    
    /**
    * Checks to see if the Check Prefix field should be visible
    */
    property get isCheckPrefixVisible() : boolean {
        
        var paymentMethod = this.ex_ManualPaymentMethod
        var isVisible = false
        
        if(paymentMethod == ManualPaymentMethod.TC_MANUAL || paymentMethod == ManualPaymentMethod.TC_TOMIC ||
           paymentMethod == ManualPaymentMethod.TC_AVIATION){
            isVisible = false
        }else {
            isVisible = true
        }
        
        return isVisible
    }
    
    
    /**
    * Checks to see if the Draft Region field should be visible
    */
    property get isDraftRegionVisible() : boolean {
        
        var paymentMethod = this.ex_ManualPaymentMethod
        var isVisible = false
        
        if(paymentMethod == ManualPaymentMethod.TC_MANUAL) {
            isVisible = true
        }else {
            isVisible = false
        }
        
        return isVisible
    }
    
    
    /**
    * Filters the TOMIC manual payment method out unless the the Claim
    * is a Specialty E&S Claim.
    * Filters the AVIATION manual payment method out unless the Claim
    * is a Aviation Claim.
    */
    function filterManualPaymentMethod(value : ManualPaymentMethod) : boolean {
        
        var showValue : boolean = null
        var env = gw.api.system.server.ServerUtil.getEnv();
        
        if(value == ManualPaymentMethod.TC_TOMIC) {
            
            if(this.Claim.LossType == LossType.TC_SPECIALTYES and this.Claim.Policy.PolicyType != PolicyType.TC_PRC and this.Claim.Policy.PolicyType != PolicyType.TC_PRX){
                showValue = true
            }else {
                showValue = false
            }
        
        }else if(value == ManualPaymentMethod.TC_TRUCKING) {
            if(this.Claim.LossType == LossType.TC_TRUCKINGAUTO){
                showValue = true
            }else {
                showValue = false
            }
        }else if(value == ManualPaymentMethod.TC_AVIATION) {
            if(this.Claim.LossType == LossType.TC_AVIATION){
                showValue = true
            }else {
                showValue = false
            }
         }else if(value == ManualPaymentMethod.TC_TPA and (env=="uat" or env=="cert" or env=="prod") ){
          // do not enable yet in production
         // this option should be permanently disabled as TPA checks are coming from
         // external and issued, so they should not be editable -kmolnar2
                showValue = false
         }else {
                showValue = true
            }
        return showValue
    }    
  
}
