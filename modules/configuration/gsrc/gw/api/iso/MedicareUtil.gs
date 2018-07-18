package gw.api.iso

uses xsd.iso.req.ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo1
uses xsd.iso.req.ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo2
uses xsd.iso.req.ClaimsParty
uses xsd.iso.req.ClaimsInjuredInfo
uses xsd.iso.req.StringCd
uses xsd.iso.req.ClaimInvestigationAddRq_com_iso_AddCovInfo
uses java.math.BigDecimal
uses java.text.DecimalFormat

class MedicareUtil {
  
  var _claimsInjuredInfo : ClaimsInjuredInfo
  var _medicareCont : ContactISOMedicareExt
  var _searchRequest : ISOClaimSearchRequest
  var _addCovInfo : ClaimInvestigationAddRq_com_iso_AddCovInfo
  var _covInfo1 : ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo1
  var _covInfo2 : ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo2
  var _exposure : Exposure as Expo
  
  construct(exposure : Exposure, 
            claimsInjuredInfo : ClaimsInjuredInfo,
            searchRequest : ISOClaimSearchRequest){
    _exposure = exposure
    _medicareCont = (exposure.Claimant as Person).ContactISOMedicareExt
    _claimsInjuredInfo = claimsInjuredInfo
    _searchRequest = searchRequest
    _addCovInfo = searchRequest.AddRequest.com_iso_AddCovInfo
    _covInfo1 = getOrCreateCovInfo1()
    _covInfo2 = getOrCreateCovInfo2()
  }  
  
  function populateMedicareInfo(){
    populateCovInfo1()
    populateCovInfo2()
    populateRelationships()
  }
  
  /*
  
  */
  private function populateCovInfo1(){    
    _covInfo1.ItemRef = _claimsInjuredInfo
    
    if(_exposure.IsORMExposure){
      addORMInfo()  
    }
    
    //CMS Incident Date
    if(_medicareCont.CMSIncidentDateExt != null){
      _covInfo1.com_iso_CMSIncidentDt = ISOTranslate.instance().formatClaimDate(_medicareCont.CMSIncidentDateExt)
    }
    
    //Delete from CMS indicator
    _covInfo1.com_iso_DeleteFromCMS.Text = (_medicareCont.Contact as Person).DeleteFromCMSIndicatorExt ? ISOConstants.YES : ISOConstants.NO
        
    //Do not send this coverage to CMS...always send NO - not implemented in the UI
    _covInfo1.com_iso_NotSendCovCMS.Text = ISOConstants.NO
    
    //On-Going Responsibility For Medicals Indicator
    _covInfo1.com_iso_ORMInd = _exposure.IsORMExposure ? ISOConstants.YES : ISOConstants.NO    
    
    //Total Payment Obligation To Claimant
    if(_medicareCont.TPOCExt != null && _medicareCont.TPOCExt.HasElements){
      addTPOCInfo()
    }
    
    //State of Venue
    if(_medicareCont.StateOfVenueExt != null){
      _covInfo1.Addr.StateProvCd = _medicareCont.StateOfVenueExt.Code
    }
  }
  
  /**
   * Adds Medicare data that is applicable only to ORM type features (MedPay/PIP currently)
   */
  private function addORMInfo(){
    //No Fault Insurance Limit
    if(_medicareCont.NFILLimitExt != null){
      _covInfo1.com_iso_NFLTLimit = this.formatCurrency(_medicareCont.NFILLimitExt)
    }

    //Exhaust Date for NFIL
    if(_medicareCont.ExhaustDateExt != null){
      _covInfo1.com_iso_ExhaustDt = ISOTranslate.instance().formatClaimDate(_medicareCont.ExhaustDateExt)
    }

    //On-Going Responsibility For Medicals Termination Date
    if(_medicareCont.ORMEndDateExt != null){
      _covInfo1.com_iso_ORMDt = ISOTranslate.instance().formatClaimDate(_medicareCont.ORMEndDateExt)
    }    
    
  }
  
  private function populateCovInfo2(){
    _covInfo2.ItemRef = _claimsInjuredInfo
    _covInfo2.com_iso_AllegedHarm = _medicareCont.AllegedHarmExt
    _covInfo2.com_iso_BrandName = _medicareCont.ProductBrandNameExt
    _covInfo2.com_iso_GenName = _medicareCont.ProductGenericNameExt
    
    //product liability indicator
    if(_medicareCont.ProductLiabTypeExt != null){
      var prodLiabInd : String = ""    
      if(_medicareCont.ProductLiabTypeExt == ProductLiabilityTypeExt.TC_NO){
        prodLiabInd = "1" 
      }else if(_medicareCont.ProductLiabTypeExt == ProductLiabilityTypeExt.TC_YESNO){
        prodLiabInd = "2"
      }else if(_medicareCont.ProductLiabTypeExt == ProductLiabilityTypeExt.TC_YESYES){
        prodLiabInd = "3"
      }
      _covInfo2.com_iso_ProdLiabInd = prodLiabInd    
    }
    _covInfo2.com_iso_ProdMfr = _medicareCont.ProductManufacturerExt
  }
  
  public function populateRelationships(){
    
    var claimsParty : ClaimsParty = this._searchRequest.ClaimsParties._partiesByContact.get(this._medicareCont.Contact)
    
    if(claimsParty != null){
      /** injured party representative */
      _searchRequest.ClaimsParties.addServiceProvider(claimsParty, _medicareCont.InjuredPartyRep.RelatedContact, getRole(_medicareCont.InjuredPartyRep))             
                      
      /** beneficiaries */
      for(addnlClaimant in _medicareCont.Contact.AllContactContacts.where(\ c -> c.ClaimantFlagExt)){
        var addClaimant = _searchRequest.ClaimsParties.addServiceProvider(claimsParty, addnlClaimant.RelatedContact, getAddnlClaimantRole(addnlClaimant))
        
        /** beneficiaries' reps */
        if(addClaimant != null){
          for(addClaimantRep in addnlClaimant.RelatedContact.AllContactContacts.where(\ c -> c.ClaimantAddRepFlagExt)){
            _searchRequest.ClaimsParties.addServiceProvider(addClaimant, addClaimantRep.RelatedContact, getRole(addClaimantRep)) 
          }
        }
      }  
    }
  }
  
  private function getRole(contCont : ContactContact) : ISOClaimsPartyRole{
    switch(contCont.Relationship){
      case ContactRel.TC_ATTORNEY:
        return ISOClaimsPartyRole.LC
      case ContactRel.TC_GUARDIAN:
        return ISOClaimsPartyRole.GU
      case ContactRel.TC_MEDICAREGUARDIAN:
        return ISOClaimsPartyRole.GU
      case ContactRel.TC_CONSERVATOR:
        return ISOClaimsPartyRole.GU        
      case ContactRel.TC_POWEROFATTORNEY:
        return ISOClaimsPartyRole.PW
      case ContactRel.TC_OTHER:
        return ISOClaimsPartyRole.OTR        
      default:
        return null
    }
  }
  
  private function getAddnlClaimantRole(contCont : ContactContact) : ISOClaimsPartyRole {
    switch(contCont.Relationship){
      case ContactRel.TC_ESTATEHEIR:
        return ISOClaimsPartyRole.ES
      case ContactRel.TC_FAMILYHEIR:
        return ISOClaimsPartyRole.FA
      case ContactRel.TC_OTHERHEIR:
        return ISOClaimsPartyRole.OC
      default:
        return null
    }
  }
  
  private function addTPOCInfo() {
    var tpocID : int = 0
    for(tpoc in _medicareCont.TPOCExt.where(\ t -> t.ExposureExt == _exposure)){
      _covInfo1.com_iso_TPOCAmts.add(convertToXSDString(this.formatCurrency(tpoc.CMSTPOCAmount)))
      _covInfo1.com_iso_TPOCAmts[tpocID].id = "id" + ((tpocID+1) as String)
      _covInfo1.com_iso_TPOCDts.add(convertToXSDString(tpoc.CMSTPOCDate as String))
      _covInfo1.com_iso_TPOCDts[tpocID].id = "id" + ((tpocID+1) as String)
      if(tpoc.CMSTPOCStartDate != null){
        _covInfo1.com_iso_TPOCStartDts.add(convertToXSDString(ISOTranslate.instance().formatClaimDate(tpoc.CMSTPOCStartDate)))
        _covInfo1.com_iso_TPOCStartDts[tpocID].id = "id" + ((tpocID+1) as String)
      }
      tpocID++
    }
  }
  
  private function convertToXSDString(value : String) : xsd.iso.req.String{
    var xsdString = new xsd.iso.req.String()
    xsdString.Value = value
    return xsdString
  }
  
  /**
   *  Used on NFIL and TPOC amounts... 
   *  Specify dollars and cents with implied decimal. 
   *  Ex. $10,500.00 should be coded as 00001050000.
   *  Fill with all 9's if there is no dollar limit. 
   *  Fill with all 0's for WC or Liability claims.
   */ 
  private function formatCurrency(amount : BigDecimal) : String{
    var formattedNFIL = ""
    
    if(amount == null or amount == BigDecimal.ZERO){
      formattedNFIL = "999999999"
    }else{
      var df = new DecimalFormat()
      df.setMaximumFractionDigits(2)
      df.setMinimumFractionDigits(2)
      df.setMaximumIntegerDigits(9)
      df.setMinimumIntegerDigits(9)
      df.setGroupingUsed(false)
      formattedNFIL = df.format(amount).replaceAll("\\.", "")
    }    
    
    return formattedNFIL
  }
  
  
  private function getOrCreateCovInfo1() : ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo1 {
    if(_addCovInfo.com_iso_CovInfo1s.Count == 0){
      _addCovInfo.com_iso_CovInfo1s.add(new ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo1())
    }
    
    return _addCovInfo.com_iso_CovInfo1s[0]
  }
  
  private function getOrCreateCovInfo2() : ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo2 {
    if(_addCovInfo.com_iso_CovInfo2s.Count == 0){
      _addCovInfo.com_iso_CovInfo2s.add(new ClaimInvestigationAddRq_com_iso_AddCovInfo_com_iso_CovInfo2()) 
    }
    
    return _addCovInfo.com_iso_CovInfo2s[0]    
  }  

}
