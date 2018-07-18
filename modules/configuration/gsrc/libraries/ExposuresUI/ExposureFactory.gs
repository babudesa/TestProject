package libraries.ExposuresUI


/**
 * The ExposureFactory class is used to get new exposures with different 
 * default values across business units.  This class is implemented as 
 * a Singleton
 */
class ExposureFactory {

  
    private construct() {
           
    }
    
    
    private static var instance : ExposureFactory = null    
  
    /**
    * Gets a new instance of the ExposureFactory class.
    * 
    * @return instance of ExposureFactory class.
    */
    public static function getInstance() : ExposureFactory {
      
        if(instance == null){
            instance = new ExposureFactory()
        }      
        return instance
    }
  
    
    
    /**
     * Initialize any standard default values on an Exposure based on the loss type and
     * feature type
     * 
     * @returns an Exposure with default vaules 
     */
    function getInitialValues(exposure : Exposure) : Exposure {
  
        
        
        //Setup initial values for specialty E&S losstype related features
        if(exposure.Claim.LossType == LossType.TC_SPECIALTYES){ 
            return this.getSpecialtyESExposure(exposure)
        }           
        
        return exposure
    }
    
    
   
  /**
   * Builds the default values for Specialty E&S Exposures   * 
   * 
   * @return Specialty ES Exposure with default values
   */
    private function getSpecialtyESExposure(exposure : Exposure) : Exposure{
        
        var expoType = exposure.ExposureType
        
        // Defect 9082 - keep AppliesToCertAggLimitExt equal to null for product recall
        if(exposure.Claim.Policy.PolicyType != PolicyType.TC_PRC and exposure.Claim.Policy.PolicyType != PolicyType.TC_PRX){
          exposure.AppliesToCertAggLimitExt = true 
        }
        
        exposure.JurisdictionCountryExt = Country.TC_US
        exposure.JurisdictionState = null
        
        //Set defaults for Bodily Injury /Coverage B / Personal Injury / Product Withdrawal / MedPay
        if(expoType == ExposureType.TC_SP_BODILY_INJURY ||
            expoType == ExposureType.TC_SP_PERSONAL_INJURY ||
            expoType == ExposureType.TC_SP_MEDICAL_PAYMENT){
            
            exposure.ContribPotentialExt = false
            exposure.DeductibleExistsExt = true
            exposure.ReservedFileExt = true
            
        //Set defaults for Identity Theft && Property Damage
        }else if(expoType == ExposureType.TC_SP_IDENTITY_THEFT){
            
            exposure.SalvagePotentialExt = false
            exposure.SubrogPotentialExt = false
            exposure.DeductibleExistsExt = true
            exposure.ReservedFileExt = true
        
        //Set defaults for Property Damage 
        }else if(expoType == ExposureType.TC_SP_PROPERTY_DAMAGE || expoType == ExposureType.TC_SP_PRODUCT_WITHDRWL){
            
            exposure.SalvagePotentialExt = false                
            exposure.ContribPotentialExt = false
            exposure.DeductibleExistsExt = true
            exposure.ReservedFileExt = true
            
        //Set defaults for Contractual    
        }else if(expoType == ExposureType.TC_SP_CONTRACTUAL){
            
            exposure.ReservedFileExt = true
        
        //Set defaults for Special Form    
        }else if(expoType == ExposureType.TC_SP_SPECIAL_FORM){
            
             exposure.ReservedFileExt = true
             
        }
        
        return exposure
    }

}//End ExposureFactory
