package util.gaic.billimport

/**
 * When used in conjuction with the Comparator, provides a way to rank Exposures based on their Exposure Type.
 * Contains an inner enum, whose declaration order decides priority of each Exposure Type.
 */
class ExposurePaymentPriority {

  enum ExposureTypePriority{
    //the order in which these are delcared is vital to how this works
    MEDICAL(ExposureType.TC_WC_MEDICAL_DETAILS),
    INDEMNITY(ExposureType.TC_WC_INDEMNITY_TIMELOSS), 
    VOC_REHAB(ExposureType.TC_WC_VOCATIONAL_REHAB)
    
    private var _expoType : ExposureType as ExpoType
    
    private construct(eType : ExposureType){
      _expoType = eType 
    }
  }
  
  private var _exposure : Exposure as Exposure
  private var _expoTypePriority : ExposureTypePriority as Priority
  
  construct(expo : Exposure) {
    _exposure = expo
    _expoTypePriority = ExposureTypePriority.AllValues.where(\ e -> e.ExpoType == expo.ExposureType).first()
  }
}
