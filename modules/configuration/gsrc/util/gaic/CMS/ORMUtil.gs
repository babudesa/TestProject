package util.gaic.CMS

class ORMUtil {

  private var _ormValues : ORMValues as readonly ORMValues
  
  construct() {
    
  }
  
  /**
   *
   */
  function doORMCalc(claim : Claim, expo : Exposure, contactISO : ContactISOMedicareExt) : ORMValues {
    _ormValues = new ORMValues()
    
    if(expo != null){
      if(contactISO.Contact.New){
        if(expoCond(expo)){
          ORMValues.Indicator = true
          ORMValues.Editable= false 
        }else{
          ORMValues.Indicator = false
          ORMValues.Editable = true 
        }
      }
      
      if(expo.New){
        if(expoCond(expo) || newExpoCond(claim, expo)){
          ORMValues.Indicator = true
          ORMValues.Editable = false 
        }else{
          ORMValues.Indicator = false
          ORMValues.Editable = true 
        }
      }
      
      if(expoCond(expo)){
        ORMValues.Indicator = true
        ORMValues.Editable = false
      }
    }else{
      if(!contactISO.Contact.New){
        var claimantExpos : Exposure[]
        if(claim.Exposures != null){
          claimantExpos = claim.Exposures.where(\ e -> e.Claimant == contactISO.Contact)
        }
        
        for(e in claimantExpos){
          if(expoCond(e)){
            ORMValues.Indicator = true
            ORMValues.Editable = false
            break 
          }
          
          ORMValues.Indicator = false
          ORMValues.Editable = true          
        }
      }
    }
    
    return ORMValues
  }
  
  function expoCond(expo : Exposure) : boolean {
    return (expo.MedicareExposureExt || expo.IsMedicareExposureExt) && expo.IsORMExposure    
  }
  
  function newExpoCond(claim : Claim, expo : Exposure) : boolean {
    return claim.Exposures.hasMatch(\ e -> expoCond(e) && e.Claimant == expo.Claimant)    
  }
}
