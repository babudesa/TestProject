package libraries.ExposuresUI
uses java.util.ArrayList

/**
 * This class is used on Exposure/Feature related screens as a helper for 
 * UI fields and general user interface functionality
 * 
 * @author kepage
 */
class ExposureUIHelper {

    private var _exposure : Exposure
    private var _exposureFactory : ExposureFactory
    
    construct(exposure : Exposure) {
        
        this._exposure = exposure
        this._exposureFactory = ExposureFactory.getInstance()
    }   
    
     
    /**
     * Function is used to set inital values for newly created exposures.
     * Called from the NewExposure screen
     */
    function setInitialValues(){
    
        //if the exposure is new then use the exposure factory to setup the inital values
        if(_exposure.BeanVersion == null || _exposure.BeanVersion == 0){            
            _exposure = _exposureFactory.getInitialValues(_exposure)        
        }   
    }    
    
    
    /**
     * Indicator as to if the "Deductible Exists" field should be displayed on the 
     * UI for the current exposure.F
     * 
     * @return should the "Deductible Exists" field be displayed on the 
     * UI for the current exposure
     */
    property get IsDeductibleVisible() : boolean {
        var type = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        
        if(type == LossType.TC_SPECIALTYES && 
        (expoType != ExposureType.TC_SP_MEDICAL_PAYMENT &&
          expoType != ExposureType.TC_SP_CONTRACTUAL && expoType != ExposureType.TC_SP_SPECIAL_FORM)){
            return true
        }else if (expoType == ExposureType.TC_AV_BODILYINJURY || expoType == ExposureType.TC_AV_PERSONALINJURY ||
                  expoType == ExposureType.TC_AV_PHYSICALDAMAGE || expoType == ExposureType.TC_AV_PROPERTYDAMAGE){
          return true
        }else{
          return false
        }
    }
    
    
     /**
     * Indicator as to if the "Damaged Property Description" text box should be displayed on the 
     * UI for the current exposure.
     * 
     * @return should the "Damaged Property Description" text box be displayed on the 
     * UI for the current exposure
     */
    property get IsDamagedPropertyDescVisible() : boolean {
        var type = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        
        if(this._exposure.Claim.Policy.PolicyType == PolicyType.TC_PRC or this._exposure.Claim.Policy.PolicyType == PolicyType.TC_PRX){
          return true
         } else if(type == LossType.TC_SPECIALTYES) {
           if(expoType != ExposureType.TC_SP_SPECIAL_FORM) {
               return true
           }else {
               return false
           }
        }else{
            return true
        }
    }
    
    
     /**
     * Indicator as to if the "Jurisdiction Country" field should be displayed on the 
     * UI for the current exposure.
     * 
     * @return should the "Jurisdiction Country" field be displayed on the 
     * UI for the current exposure
     */
    property get IsJusridictionCountryVisible() : boolean {
        var type = this._exposure.Claim.LossType
        
        if(type == LossType.TC_SPECIALTYES){
            return true
        }else if (this._exposure.ExposureType == ExposureType.TC_AV_PERSONALINJURY){
          return true
        }else{
            return false
        }
    }
    
    
    
   /**
   * Indicator as to if the "Excess" field should be displayed on the 
   * UI for the current exposure.
   * 
   * @return should the "Excess" field be displayed on the 
   * UI for the current exposure
   */
    property get IsExcessVisible() : boolean {
        var type = this._exposure.Claim.LossType
                
        if((type == LossType.TC_FIDCRIME)  || 
        ((type == LossType.TC_EXCESSLIABILITY || type == LossType.TC_EXCESSLIABILITYAUTO) && util.custom_Ext.Environmentinfo.showField())){
            return true
        }else{
            return false
        }
    }
    
    
/**
 * Indicator as to if the "Quota Share" field should be displayed on the 
 * UI for the current exposure.
 * 
 * @return should the "Quota Share" field be displayed on the 
 * UI for the current exposure
 */
  property get IsQuotaShareVisible() : boolean {
        var type = this._exposure.Claim.LossType
               
        if((type == LossType.TC_FIDCRIME)  || 
        ((type == LossType.TC_EXCESSLIABILITY || type == LossType.TC_EXCESSLIABILITYAUTO) && util.custom_Ext.Environmentinfo.showField())){
            return true
        }else{
            return false
        }
    }
    
    
   /**
   * Indicator as to if the "Seatbelt Available" field should be displayed on the 
   * UI for the current exposure.
   * 
   * @return should the "Seatbelt Available" field be displayed on the 
   * UI for the current exposure
   */
    property get IsSeatbeltAvailableVisible() : boolean {
                
        var lsType = this._exposure.Claim.LossType
         
        //SPECIALTYES
        if(lsType == LossType.TC_SPECIALTYES){
            return false
        }else{
            return true
        }
        
    }      
    
    
   /**
   * Indicator as to if the non_medpay section in "InjuryDetailsInputSet.pcf" should be displayed on the 
   * UI for the current exposure.
   * 
   * @return should the non_medpay section in "InjuryDetailsInputSet.pcf" be displayed on the 
   * UI for the current exposure
   */
    property get IsNonMedPayInjuryDetailsInputSetVisible() : boolean {
        var lsType = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        
        if(lsType == LossType.TC_SPECIALTYES && (expoType == ExposureType.TC_SP_BODILY_INJURY ||
             expoType == ExposureType.TC_SP_PERSONAL_INJURY)){
            return true
        }else if(lsType == LossType.TC_AVIATION && (expoType == ExposureType.TC_AV_BODILYINJURY ||
             expoType == ExposureType.TC_AV_PERSONALINJURY)){
            return true
        }else{
            return false
        }
    }
    
    //Used for field visibility in new development of Commercial Auto - ALTMARKETSAUTO OR SHSAUTO OR TRUCKINGAUTO
    property get IsCommAuto() : boolean {                
        var lsType = this._exposure.Claim.LossType
         
        if(lsType == LossType.TC_ALTMARKETSAUTO OR lsType == LossType.TC_SHSAUTO OR lsType == LossType.TC_TRUCKINGAUTO){
            return true
        }else{
            return false
        }        
    }      
    
    
   /**
   * Indicator as to if the Primary Injury Type Input should be displayed on the 
   * UI for the current exposure.
   * 
   * @return should the Primary Injury Type Input field be displayed on the 
   * UI for the current exposure
   */
    function IsPrimaryInjuryTypeVisible(ExpType :String) : boolean {
        var lsType = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        
        if(lsType == LossType.TC_SPECIALTYES) {
            if((expoType == ExposureType.TC_SP_BODILY_INJURY || expoType == ExposureType.TC_SP_PERSONAL_INJURY)){
                return true
            }else{
                return false
            }
        } else if(ExpType != "MedPay" && expoType != ExposureType.TC_AV_MEDPAY){
            return true
        }else{
            return false
        }
    }
    
    
   /**
   * Indicator as to if the medpay section in "InjuryDetailsInputSet.pcf" should be displayed on the 
   * UI for the current exposure.
   * 
   * @return should the medpay section in "InjuryDetailsInputSet.pcf" field be displayed on the 
   * UI for the current exposure
   */
    property get IsMedPayInjuryDetailsInputSetVisible() : boolean {
        var lsType = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        
        if(lsType == LossType.TC_SPECIALTYES && (expoType == ExposureType.TC_SP_MEDICAL_PAYMENT)){
            return true
        }else if (lsType == LossType.TC_AVIATION && (expoType == ExposureType.TC_AV_MEDPAY)){
            return true
        }else{
            return false
        }
    }
    
    
   /**
   * Indicator as to if the "Attorney Represented" field should be displayed on the 
   * UI for the current exposure.
   * 
   * @return should the "Attorney Represented " field be displayed on the 
   * UI for the current exposure
   */
    property get IsAttorneyRepresentedVisible() : boolean {
        var lsType = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        
        //AVIATION
        if(expoType == ExposureType.TC_AV_BODILYINJURY || expoType == ExposureType.TC_AV_BUSINESSINC ||
                expoType == ExposureType.TC_AV_MEDPAY || expoType == ExposureType.TC_AV_PERSONALINJURY ||
                expoType == ExposureType.TC_AV_PHYSICALDAMAGE || expoType == ExposureType.TC_AV_PROPERTYDAMAGE){
          return true 
        }
        
        //COMMERCIAL AUTO
        if(((expoType == ExposureType.TC_AB_AUTOPROPDAM OR expoType == ExposureType.TC_AB_BODILYINJURY) AND this._exposure.LossParty == LossPartyType.TC_THIRD_PARTY) OR ((expoType == ExposureType.TC_AB_AUTOPROPDAM OR 
            expoType == ExposureType.TC_AB_BODILYINJURY OR expoType == ExposureType.TC_AB_MEDPAY OR expoType == ExposureType.TC_AB_PIP OR expoType == ExposureType.TC_AB_PROPERTYDAMAGE) AND 
            this._exposure.LossParty == LossPartyType.TC_INSURED) AND (lsType == LossType.TC_ALTMARKETSAUTO OR lsType == LossType.TC_SHSAUTO OR lsType == LossType.TC_TRUCKINGAUTO)){
            return true 
        }
        
        if(this._exposure.LossParty == LossPartyType.TC_INSURED and this._exposure.Claim.Policy.PolicyType != PolicyType.TC_PRC and this._exposure.Claim.Policy.PolicyType != PolicyType.TC_PRX){
            return false
        }
        
        //SPECIALTYES
        if(lsType == LossType.TC_SPECIALTYES && (expoType != ExposureType.TC_SP_IDENTITY_THEFT)){
             return true
        }
        else{
            return false
        }
    }
    
    
  /**
   * Indicator as to if the "Statute of Limitations" field should be displayed on the 
   * UI for the current exposure.
   * 
   * @return should the "Statute of Limitations" field be displayed on the 
   * UI for the current exposure
   */
    property get IsStatuteOfLimitationsVisible() : boolean {
        var type = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        var clm = this._exposure.Claim
        
        if((type == LossType.TC_SPECIALTYES && (expoType == ExposureType.TC_SP_BODILY_INJURY)) ||
            util.WCHelper.isWCorELLossType(clm) || expoType==ExposureType.TC_AV_BODILYINJURY){
            return true
        }else{
            return false
        }
    }
    
    
  /**
   * Indicator as to if the "Is there Salvage Potential" field should be displayed on the 
   * UI for the current exposure.
   * 
   * @return should the "Is there Salvage Potential" field be displayed on the 
   * UI for the current exposure
   */
    property get IsSalvagePotentialVisible() : boolean {
        var type = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        
        //Specialty E&S
        if(type == LossType.TC_SPECIALTYES){
            
            if(expoType == ExposureType.TC_SP_IDENTITY_THEFT || expoType == ExposureType.TC_SP_PROPERTY_DAMAGE ||
                  expoType == ExposureType.TC_SP_SPECIAL_FORM || expoType == ExposureType.TC_SP_PRODUCT_WITHDRWL){
            
                return true  
            }else{
                return false
            }  
        //all others
        }else{
            return true    
        }
    }
    
    
   /**
   * Indicator as to if the "Is there Salavage Potential" field should be required on the 
   * UI for the current exposure.
   * 
   * @return should the Is there Salavage Potential" field be required on the 
   * UI for the current exposure
   */
    property get IsSalvagePotentialRequired() : boolean {
               var type = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        
        //Specialty E&S
        if(type == LossType.TC_SPECIALTYES &&(expoType == ExposureType.TC_SP_IDENTITY_THEFT || 
              expoType == ExposureType.TC_SP_PROPERTY_DAMAGE ||expoType == ExposureType.TC_SP_PRODUCT_WITHDRWL)){
              
              return true
        //all others
        }else{
            return false    
        }
    }
    
    
   /**
   * Indicator as to if the "Is there Subrogation Potential?" field should be required on the 
   * UI for the current exposure.
   * 
   * @return should the Is there Subrogation Potential?" field be required on the 
   * UI for the current exposure
   */
    property get IsSubgrogationPotentialRequired() : boolean {
        var type = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        
        //Specialty E&S
        if(type == LossType.TC_SPECIALTYES &&(expoType == ExposureType.TC_SP_IDENTITY_THEFT)){              
              return true
        //all others
        }else if (expoType == ExposureType.TC_AV_BODILYINJURY || expoType == ExposureType.TC_AV_PHYSICALDAMAGE){
          return true
        }else{
            return false    
        }
    }
    
        
   /**
   * Indicator as to if the "Statute of Limitations" field is required on the 
   * UI for the current exposure.
   * 
   * @return should the "Statute of Limitations" field is required on the 
   * UI for the current exposure
   */
    property get IsStatuteOfLimitationsRequired() : boolean {
        var type = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        var clm = this._exposure.Claim
        
        if(type == LossType.TC_SPECIALTYES && (expoType == ExposureType.TC_SP_BODILY_INJURY)){
            return false
        }else if (type == LossType.TC_EXCESSLIABILITY || type == LossType.TC_EXCESSLIABILITYAUTO){
            return false
        }else if (util.WCHelper.isWCorELLossType(clm)){
            return false
        }else if (type == LossType.TC_AVIATION && clm.LossLocation.State != State.TC_CA){
            return false
        }else if ((type == LossType.TC_ALTMARKETSAUTO OR type == LossType.TC_SHSAUTO OR type == LossType.TC_TRUCKINGAUTO) AND (expoType == ExposureType.TC_AB_BODILYINJURY)){
            return false
        }else{
            return true
        }
    }
    
    
  /**
   * Creates the label for Exposure.InjuryNatureDescExt on InjuryDetailsInputSet.pcf
   * There are different labels based on losstype/feature
   * 
   * @return label for Exposure.InjuryNatureDescExt on InjuryDetailsInputSet.pcf
   */
    property get InjuryNatureDescExt_Label() : String {
        var type = this._exposure.Claim.LossType
        var expoType = this._exposure.ExposureType
        
        if(type == LossType.TC_SPECIALTYES && (expoType == ExposureType.TC_SP_PERSONAL_INJURY)){
            return displaykey.NVV.Exposure.SubView.Exposure.InjuryNatureDesc_SP_PERSONAL_INJURY
        }else {
            return displaykey.NVV.Exposure.SubView.Exposure.InjuryNatureDesc
        }
    }
  
  
   /**
   * Indicator as to if the "Exposure Details" field should be displayed on the 
   * UI for the current exposure.
   * 
   * @return should the "Exposure Details" field be displayed on the 
   * UI for the current exposure
   */
    property get IsExposureDetailVisible() : boolean {
         
         //If the exposure type and coverage type combination are added on the "Not Appilicable"
         //type key return false
         if(ExposureDetails.TC_NA.hasCategory(this._exposure.ExposureType) &&
             ExposureDetails.TC_NA.hasCategory(this._exposure.PrimaryCoverage)){
             
             return false
         
         //if there are any keys in the typelist that have 
         //the exposure type and coverage type combination then return true
         }else if(exists(key in ExposureDetails.getTypeKeys(false) where
             key.hasCategory(this._exposure.ExposureType) &&
             key.hasCategory(this._exposure.PrimaryCoverage))){
               /**
                *  Defect 8658 - kniese - 2/10/17
                *  While adding ExposureDetail for SpecE&S Inland Marine values were also being added to the PIMINMARINE typelist. 
                *  This extra check is needed so that the filed does not display for these ExposureTypes on PIM. 
                */
               if((this._exposure.ExposureType == ExposureType.TC_IM_PERSONALPROP || this._exposure.ExposureType == ExposureType.TC_IM_PROPOFOTHERS) 
                   and this._exposure.Claim.LossType == LossType.TC_PIMINMARINE){
                 return false
               }
             
             return true                  
         
         }else{
           return false
         }   
    }
    
    
  
  /**
   * Function handles the On Change event for the "Jurisdiction Country field
   * on ExposureSummaryInputSet.pcf
   */
    function JurisdictionCountry_OnChange(){
        //if(!gw.api.address.CountryAddressFields.forCountry(this._exposure.JurisdictionCountryExt).IsCountryWithStates){
            this.resetJurisdictionState()
       // }
    }
    
      
  /**
   * Resets the "Jurisdiction State" field to null
   */
    function resetJurisdictionState(){
        this._exposure.JurisdictionState = null
    }
    
    
    /**
     * Gets a list of the valid states for the exposure
     */
    property get ValidStates() : List<State> {
      var theLossType = this._exposure.Claim.LossType
      var states : List<State> = new ArrayList<State>()
      
      if(theLossType == LossType.TC_SPECIALTYES) {
         states.addAll(State.getTypeKeys(false).where(\ s -> s.hasCategory(this._exposure.JurisdictionCountryExt)))
      
      //if no loss location is selected use default US
      }else if(this._exposure.Claim.LossLocation == null) {
         states.addAll(State.getTypeKeys(false).where(\ s -> s.hasCategory(Country.TC_US)))
        
      }else {
        states.addAll(State.getTypeKeys(false).where(\ s -> s.hasCategory(this._exposure.Claim.LossLocation.Country)))
      }    
        
      return states
    }
    
    
    
   /**
   * Function handles the On Change event for the AppliesToCertAggLimit field
   * on ExposureCertificateInpuSet.pcf
   */
    function AppliesToCertAggLimit_OnChange() {
        this._exposure.CertCoverageDescExt = null
        this._exposure.CertSublimitAggregateExt = null
        this._exposure.CertSublimitExt = null
        this._exposure.CertSublimitAppExt = null
        this._exposure.CertSublimitDeductibleExt = null
        this._exposure.CertSublimitDeductibleAppExt = null
    }
    
    /**
     * Defect 8658 - kniese - 2/10/2017
     * Adding the ExposureType and CoverageType for SpecE&S Inland Marine to ExposureDetails causes 
     * additional values to show up on PIMINMARINE dropdowns. We need to add a filter so that the 
     * SpecE&S Inland Marine values don't show up for PIM.
     */
    function filterFeatureDetails(expDetail : ExposureDetails) : Boolean {
      if((this._exposure.ExposureType == ExposureType.TC_IM_PERSONALPROP or this._exposure.ExposureType == ExposureType.TC_IM_PROPOFOTHERS) and expDetail == ExposureDetails.TC_068){
        if(this._exposure.Coverage.Type == CoverageType.TC_SP_MTPFLTUILOBMTPFLTR or this._exposure.Coverage.Type == CoverageType.TC_SP_MTPFLTRMANU){
          return true
        }else{
          return false
        }
      }
      return true
    } 
    
    function getLienholderList() :List{
      var lienholderList = new ArrayList<Contact>()
      for(con in this._exposure.Claim.Contacts){
        if((con.hasRole(ContactRole.TC_CLAIMLOSSPAYEE as java.lang.String))OR(con.hasRole(ContactRole.TC_FRMRCLAIMLOSSPAYEE as java.lang.String))OR
        (con.hasRole(ContactRole.TC_LIENHOLDER as java.lang.String))){
          lienholderList.add(con.Contact)
        }
      }
      return lienholderList
    }

    function addFormerRole(lien: LienDetailsExt){
      var claimcontact = this._exposure.Claim.Contacts.where(\ l -> l.Contact == lien.LienholderExt).first()
      for (r in claimcontact.Roles){
        if (r.Role == ContactRole.TC_CLAIMLOSSPAYEE and r.Exposure==lien.Exposure){
          lien.LienholderExt.createFormerRole(this._exposure.Claim, r)
          this._exposure.removeRole(r)
        }
      }
    }

}//End ExposureUIHelper class
