package libraries.Claim_Entity

enhancement DisconnectedFeatureFunctions : entity.Claim {
  /*Function checks for an exposure that has a ReconnectFailExt value of true
    Sprint/Maintenance Release: EM 10 - Defect 1131
    Author: Zach Thomas
    Date: 05/20/08
  */
  function checkDisconnectedFeatures():Boolean{
    var disconnectedFeatures : Boolean = false;
    if(exists(exp in this.Exposures where exp.ReconnectFailExt)){  //find exposure(s) on the claim that have failed to reconnect.
      disconnectedFeatures = true;
    }
    return disconnectedFeatures;
  }

  /*Function checks PolicyDisconnectedWarningExt on the Claim and checkDisconnectedFeatures on the claim and 
    returns true to display the Policy Disconnected Warning if both are true.
    Sprint/Maintenance Release: EM 10 - Defect 1131
    Author: Zach Thomas
    Date: 05/20/08
    Updated: 05/05/09 - Changed if check to use passed in policyDisconnectedWarning instead of PolicyDisconnectedWarningExt on the Claim.
  */
  function displayDisconnectedWarning(policyDisconnectedWarning:Boolean):Boolean{
    var displayWarning : Boolean = false;
    if(policyDisconnectedWarning and this.checkDisconnectedFeatures() ){
      displayWarning = true
    }
    return displayWarning;
  }

  /*Function returns the text for the PolicyDisconnected warning message.  Includes all features that are disconnected.
    Sprint/Maintenance Release: EM 10 - Defect 1131
    Author: Zach Thomas
    Date: 05/20/08
  */
  function getDisconnectedFeatures():String{
    var features : java.lang.StringBuffer = new java.lang.StringBuffer(displaykey.Web.Claim.DisconnectedFeatures.WarningMessage(this.ClaimNumber));
    for(exp in this.Exposures){ // loop 
      if(exp.ReconnectFailExt){
        features.append( "\n" + exp.DisplayName );
      }
    }
    return features.toString();
  }

  /*Function sets PolicyDisconnectedWarningExt on the Claim to the passed in value.
    Sprint/Maintenance Release: EM 10 - Defect 1131
    Author: Zach Thomas
    Date: 05/20/08
  */
  function setPolicyDisconnectedWarning(displayWarning:Boolean){
    this.PolicyDisconnectedWarningExt = displayWarning;
  }
}
