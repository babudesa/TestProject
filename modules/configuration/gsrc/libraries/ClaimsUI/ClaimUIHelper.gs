package libraries.ClaimsUI

class ClaimUIHelper {

    private var _claim : Claim
    private var _lossDetailsUIHelper : LossDetailsUIHelper

    construct(claim : Claim) {
        this._claim = claim
        this._lossDetailsUIHelper = new LossDetailsUIHelper()

    }
    
       
    /**
    * Property stores the Claim UI Helper Class
    *
    *@returns new ClaimUIHelper 
    */
    property get LossDetailsHelper(): LossDetailsUIHelper{
        return this._lossDetailsUIHelper
    }
    
   
    
   /**
   * Indicator as to if the "Site Number field should be displayed on the 
   * UI for the current Claim (LossDetailsDV).
   * 
   * @return should the "Site Number" field be displayed on the 
   * UI for the current Claim
   */
    property get IsSiteNumberVisible() : boolean {
        var polType = this._claim.Policy.PolicyType;
    
        if(this._claim.LossType == LossType.TC_SPECIALTYES &&
            (polType == PolicyType.TC_BTA || polType  == PolicyType.TC_STA || polType  == PolicyType.TC_TPA || polType == PolicyType.TC_IMP)){
            return true
        }else{
            return false
        }
    }

   
   /**
   * Indicator as to if the "Site Name" field should be displayed on the 
   * UI for the current Claim 
   * 
   * @return should the "Site Name" field be displayed on the 
   * UI for the current Claim
   */
    property get IsSiteNameVisible() : boolean {
        var polType = this._claim.Policy.PolicyType;
      
        if(this._claim.LossType == LossType.TC_SPECIALTYES &&
            (polType == PolicyType.TC_BTA || polType  == PolicyType.TC_STA ||  polType  == PolicyType.TC_TPA || polType == PolicyType.TC_IMP)){
            return true
        }else{
            return false
        }
    }    


   /**
   * Indicator as to if the "Inspection Date" field should be displayed on the 
   * UI for the current Claim 
   * 
   * @return should the "Inspection Date" field be displayed on the 
   * UI for the current Claim  
   */
    property get IsInspectionDateVisible() : boolean {
              
        if(this.IsRESPA) {
            return true
        }else {
            return false
        }        
    }
           

  /**
   * Indicator as to if the "Certificate Number" field should be required on the 
   * UI for the current claim.
   * 
   * @return should the "Certificate Number" field be required on the 
   * UI for the current Claim
   */    
    property get IsCertificateNumberRequired() : boolean {
        var type = this._claim.LossType
        var isRequired : boolean = false
        
        //Specialty E&S
        if(type == LossType.TC_SPECIALTYES && (this._claim.CertHolderExt != null || 
           this._claim.CertEffectiveDateExt != null || this._claim.CertExpirationDateExt != null ||
           //Defect 7609 dcarson2 - Adding the following fields
           this._claim.CertLocationIDExt != null || this._claim.CertGenAggregateLimitExt != null || 
           this._claim.CertProdCompAggLimitExt != null || this._claim.CertPersAdInjuryAggLimitExt != null || 
           this._claim.CertEachOccLimitExt != null || this._claim.CertDeductibleExt != null || 
           this._claim.CertDeductibleAppExt != null)) {
              
              isRequired = true
              
        //all others
        }else{
            isRequired = false  
        }
        
        return isRequired
    
    }
    
    
   /**
   * Indicator as to if the "Certificate Holder" field should be required on the 
   * UI for the current claim.
   * 
   * @return should the "Certificate Holder" field be required on the 
   * UI for the current Claim
   */    
    property get IsCertificateHolderRequired() : boolean {
        var type = this._claim.LossType
        var isRequired : boolean = false
        
        //Specialty E&S
        if(type == LossType.TC_SPECIALTYES && (this._claim.CertNumberExt != null || 
           this._claim.CertEffectiveDateExt != null || this._claim.CertExpirationDateExt != null ||
           //Defect 7609 dcarson2 - Adding the following fields
           this._claim.CertLocationIDExt != null || this._claim.CertGenAggregateLimitExt != null || 
           this._claim.CertProdCompAggLimitExt != null || this._claim.CertPersAdInjuryAggLimitExt != null || 
           this._claim.CertEachOccLimitExt != null || this._claim.CertDeductibleExt != null || 
           this._claim.CertDeductibleAppExt != null)) {
              
              isRequired = true
              
        //all others
        }else{
            isRequired = false  
        }
        
        return isRequired
    
    }
    
    
   /**
   * Indicator as to if the "Certificate Effective Date" field should be required on the 
   * UI for the current claim.
   * 
   * @return should the "Certificate Effective Date" field be required on the 
   * UI for the current Claim
   */    
    property get IsCertificateEffectiveDateRequired() : boolean {
        var type = this._claim.LossType
        var isRequired : boolean = false
        
        //Specialty E&S
        if(type == LossType.TC_SPECIALTYES && (this._claim.CertNumberExt != null || this._claim.CertHolderExt != null || 
           this._claim.CertExpirationDateExt != null ||
           //Defect 7609 dcarson2 - Adding the following fields
           this._claim.CertLocationIDExt != null || this._claim.CertGenAggregateLimitExt != null || 
           this._claim.CertProdCompAggLimitExt != null || this._claim.CertPersAdInjuryAggLimitExt != null || 
           this._claim.CertEachOccLimitExt != null || this._claim.CertDeductibleExt != null || 
           this._claim.CertDeductibleAppExt != null)) {
              
              isRequired = true
              
        //all others
        }else{
            isRequired = false  
        }
        
        return isRequired
    
    }
    
    
   /**
   * Indicator as to if the "Certificate Expiration Date" field should be required on the 
   * UI for the current claim.
   * 
   * @return should the "Certificate Expiration Date" field be required on the 
   * UI for the current Claim
   */    
    property get IsCertificateExpirationDateRequired() : boolean {
        var type = this._claim.LossType
        var isRequired : boolean = false
        
        //Specialty E&S
        if(type == LossType.TC_SPECIALTYES && (this._claim.CertNumberExt != null || this._claim.CertHolderExt != null || 
           this._claim.CertEffectiveDateExt != null ||
           //Defect 7609 dcarson2 - Adding the following fields
           this._claim.CertLocationIDExt != null || this._claim.CertGenAggregateLimitExt != null || 
           this._claim.CertProdCompAggLimitExt != null || this._claim.CertPersAdInjuryAggLimitExt != null || 
           this._claim.CertEachOccLimitExt != null || this._claim.CertDeductibleExt != null || 
           this._claim.CertDeductibleAppExt != null)) {
              
              isRequired = true
              
        //all others
        }else{
            isRequired = false  
        }
        
        return isRequired
    
    }


   /**
   * Indicator as to if the Claim is a RESPA Claim 
   * 
   * @return is this Claim a RESPA Claim 
   */
    property get IsRESPA() : boolean {
              
        if(this._claim.Policy.Account == ScriptParameters.RESPA_AccountNumber1 ||
            this._claim.Policy.Account == ScriptParameters.RESPA_AccountNumber2) {
              
            return true
        } else {
          return false 
        }
    }
    
    /*Function for visible property to show SIR for E&S LOB, Policy Types PL and XS and
    profit center 0643, for all E&S exposure types - defect 8797
    */
    function isSIRVisible() : boolean {
      var type = this._claim.LossType
      var polType = this._claim.Policy.PolicyType
      var profitCenter = this._claim.Policy.ex_Agency.ex_AgencyProfitCenter
      
       if (type == LossType.TC_SPECIALTYES and (polType == PolicyType.TC_PL and profitCenter.equalsIgnoreCase("0643")|| polType == PolicyType.TC_XS and profitCenter.equalsIgnoreCase("0643"))){
         return true
      }else{
        return false
       }
    }
    
}//End ClaimUIHelper