package libraries.Exposure_Entity

enhancement TypeOfLoss2 : entity.Exposure {
  //Function decides the visibility for subline 470
  //
  //Author Stephanie Przygocki Sprint 11 2/14/08

  function setSublineVisibility() : boolean {
    var result:boolean = false
  
    if(this.ExposureType=="ab_SchedPerProp"){
      if(this.Coverage.SublineExt=="470" && this.ExposureDetailsExt!=null){
        result = true
      } 
    } else {
      if(this.Coverage.SublineExt=="470"){
        result = true 
      }
    }
  
    return result
  }

  function setTypeOfLossVisibility() : boolean {
    var result:boolean = false
  
    if(this.Coverage.SublineExt == "930"){
      result = false
    } else if(this.Coverage.SublineExt == "470"){
      if(this.SPP_LossLocationExt!=null){
        result = true
      }
    } else if(this.Coverage.SublineExt == "105" || 
              this.Coverage.SublineExt == "106"){
      if(this.LossAppToExt!=null or this.CoverageSubType == typekey.CoverageSubtype.TC_AB_ORCHVINE_PD or this.CoverageSubType == typekey.CoverageSubtype.TC_AB_ORCHARDVINEYARD_PD){
        result = true 
      }
    } else {
      result = true
    }
  
    return result
  }

  //2/21/10 - sprzygocki - Set a label for Type of Loss to explain why it is not required
  function getTypeOfLossNotReqLabel() : String {
    var label : String = ""
    if (this.Claim.LossType == typekey.LossType.TC_AVIATION){
      label = "None"
    } else {
      if(this.Coverage.State==null)
        label = "Type of Loss is not required for this feature because its risk state is not reportable to Statistical Compliance"
      if(this.Coverage.SublineExt==null || this.Coverage.SublineExt=="0" || this.Coverage.SublineExt=="NR" || this.Claim.LossType == typekey.LossType.TC_PERSONALAUTO)
        if(label==null || label=="")
          label = "Type of Loss is not required for this feature because its subline is not reportable to Statistical Compliance"
        else
          label = "Type of Loss is not required for this feature because its risk state and subline are not reportable to Statistical Compliance"
    }
    return label;
  }

  function typeOfLossIsIncomplete() : boolean {
    var result : boolean = false
    
    /*This if added for FidCrime, AC Foreign addy*/
    if (this.ExposureType == typekey.ExposureType.TC_FC_FIDELITY and this.Claim.Addresses.where(\ a -> a.State!=null).IsEmpty){
      return false
    }
    
    if(this.ExposureType == typekey.ExposureType.TC_KR_KIDNAPRANSOM){
      return  false
    }
    
    switch(this.Coverage.SublineExt){
      case "920":
        if(this.LossLocationExt==null || this.TypeOfLossMostExt==null){
          result = true
        }
        break
      case "930":
        if(this.LossAppToExt==null){
          result = true
        }
        break
      case "470":
        if(this.SPP_LossLocationExt==null || this.TypeOfLossMostExt==null){
          result = true
        }
        break
      case "105":
      case "106":
        if(this.LossAppToExt==null || this.TypeOfLossMostExt==null){
          result = true
        }
        break
      case "001":
      case "002":
      case "010":
      case "090":
      case "100":
      case "116":
      case "136":
      case "156":
      case "176":
      case "196":
      case "317": // 4.12.13 - C.Mullin - added ELD subline. 
      case "332":
      case "334":
      case "336":
      case "337":
      case "338":
      case "339":
      case "325":
      case "342":
      case "347":
      case "350":
      case "392":
      case "443":
      case "469":
      case "496":
      case "615":
      case "625":
      case "635":
      case "611":
      case "620":
      case "621":
      case "622":
      case "623":
      case "618":
      case "810":
      case "965":
      case "970":
        if(this.TypeOfLossMostExt==null){
          result = true
        }
        break
      default:
        break    
    }
    return result;
  }

  function resetTypeofLoss(){
    this.LossLocationExt = null;
    this.LossDueToExt = null;
    this.LossAppToExt = null;
    this.SPP_LossLocationExt = null;
    this.TypeOfLossMostExt = null;
        if (this.ExposureDetailsExt != ExposureDetails.TC_REMEDIATION){
      this.ExposureDetails2Ext = null
        }
    }
    
  function getTypeofLossLabel():String{
    if (this.Claim.LossType == typekey.LossType.TC_AVIATION){
      return displaykey.NVV.Claim.SubView.LossDetailsWorkersComp.Claim.TypeOfLoss
    } else {
      return ""
    }
  }
}
