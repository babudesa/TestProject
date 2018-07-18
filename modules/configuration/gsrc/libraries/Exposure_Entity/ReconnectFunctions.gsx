package libraries.Exposure_Entity

enhancement ReconnectFunctions : entity.Exposure {
  function getFormerRiskName() : String{
    var name = "";
    if(this.Claim.LOBCode == "equine"){
       name = this.FixedPropertyIncident.PreviousPropertyExt.LocationNumber;
    }
    return name;
  }

  function setCoverage(cvg:Coverage){
    this.Coverage = cvg;
    this.PrimaryCoverage = cvg.Type;  
    this.PreviousCoverageExt = cvg;
  }

  //tnewcomb 04-24-2012: Removed ancient commented out code and added a check to see if the Claim is ISOEnabled
  //before creating the note, so it doesn't get created for BUs that don't use ISO (FidCrime only as of now).
  function createReconnectSuccessEvent(Automated:boolean){
    this.ReconnectFailExt = false
    
    if(Automated){
      this.Claim.createCustomHistoryEvent( "DataChange", displaykey.Rules.Preupdate.Exposure.Agri.AutomatedReconnectSuccess(this.DisplayName, this.Coverage.DisplayName ) ) 
    }
    else{
      this.Claim.createCustomHistoryEvent( "DataChange", displaykey.Rules.Preupdate.Exposure.Agri.ManualReconnectSuccess(this.DisplayName, this.Coverage.DisplayName ) ) 
    }
    /*    
    var sendNote = libraries.ISO.getISONoteBody(this)
    if(this.Claim.ISOEnabled and !this.Closed and this.isValid("iso") and !exists(note in this.Claim.Notes where note.New and note.Body==sendNote)){
      if(!this.Claim.ISOClaimLevelMessaging){
        var note = this.Claim.addNote( this, "investigation", sendNote )
        note.Subject = displaykey.ISO.SentToISO
      } else {
        var note = this.Claim.addNote( "investigation", sendNote )
        note.Subject = displaykey.ISO.SentToISO
      }
    }
    */
  }

  function createReconnectFailEvent(){
    if(!this.ReconnectFailExt){
      this.ReconnectFailExt = true;
      this.Claim.createCustomHistoryEvent( "DataChange", displaykey.Rules.Preupdate.Exposure.Agri.ReconnectFail(this.DisplayName, this.PreviousCoverageExt.DisplayName )  )  
    }
  }  
}
