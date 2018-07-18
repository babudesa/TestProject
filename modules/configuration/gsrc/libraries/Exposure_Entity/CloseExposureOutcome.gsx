package libraries.Exposure_Entity

enhancement CloseExposureOutcome : entity.Exposure {
  public function filterOutcome(outcome : String) : Boolean{
    var result : Boolean = true;
  
    if(this.Claim.LossType != "EQUINE" and outcome == "wronghorse"){
      result = false
    }
    if(this.Claim.LossType == "EQUINE" and outcome == "invalidfeature"){
      result = false
    }
  
    return result;
  }

  //3/9/10 erawe - defect 3097 - Do not show invalidfeature if the claim is suspended.  If we do
  //show we get an EDW gscript error as it conflicts with the first exposure validation rule
  //that says to skip expsoure validation rules if closedoutcome == invalidfeature.
  public function filterOutcomeInvalid(outcome : String) : Boolean{
    var result : Boolean = true;
  
    if(this.Claim.checkDisconnectedFeatures()){
        if(outcome == "invalidfeature"){
          result = false
        }
      }
      return result;
  }
}
