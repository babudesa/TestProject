package libraries.IndepAdjusterExt_Entity

enhancement IndepAdjusterFunctions : entity.IndepAdjusterExt {
  //Defect 2695 - zjthomas - Function to generalize the masking of an IA phone number so it wasn&apos;t PCF specific.
  function indepAdjusterPhoneInputMask(phoneType:String) : String{
      if(phoneType == null or phoneType == "business")
        {return "###-###-#### x####";}
      else
        {return "###-###-####";}
  }

  //Defect 2695 - zjthomas - Function to set the initial values on an Other Independent Adjuster report.
  function setIAInitialValues(){
    if(this.Subtype == "IAOtherExt"){
      if(this.Claim.LossType != null){
        (this as IAOtherExt).IAOtherLossType = this.Claim.LossType;
      }
      if(this.Claim.LossCause != null){
        (this as IAOtherExt).IAOtherLossCause = this.Claim.LossCause;
      }
    }
  }

  //Defect 2695 - zjthomas - Function to generalize the creation of a note on a claim when a IA report is sent to ECF.
  function addIAClaimNote(){
    var iaName : String = null;
    
    if(this.Subtype == "IAOtherExt"){
      iaName = (this as IAOtherExt).IAOtherName.toUpperCase();
    }else{
      iaName = this.AdjusterName.Code.toUpperCase();
    }
  
    var noteText : String = "This claim was assigned to independent adjuster " + iaName + " on " + this.UpdateTime + " by " + this.UpdateUser + ".";
    var note = this.Claim.addNote( "investigation", noteText );
    note.Subject = "Claim Assigned to Independent Adjuster";
  }
}
