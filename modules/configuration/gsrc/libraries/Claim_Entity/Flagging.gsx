package libraries.Claim_Entity

enhancement Flagging : entity.Claim {
  // Library used to intelligently set and remove claim flags

  // set the specified flag if it does not already exist
  function setFlagExt(flagReasonToSet : String) : Boolean
  {
    // set flag if it does not already exist
    if (! gw.api.util.StringUtil.contains( this.FlaggedReason , flagReasonToSet ))
    {
    	this.setFlag( flagReasonToSet )
    	return true
    }

          return false;
  }

  // remove just the specified flag
  function removeFlagExt(flagReasonToRemove : String) : Boolean{

    // continue if claim is flagged
    if (this.Flagged == "isflagged"){
      var flgReasonString : String = this.FlaggedReason
	
      // continue if specific flag exists
      if (gw.api.util.StringUtil.contains( flgReasonString , flagReasonToRemove )){
        // remove flag text from flag reason
        flgReasonString = gw.api.util.StringUtil.substitute( flgReasonString, "s/; " + flagReasonToRemove + "; /; /" )
        flgReasonString = gw.api.util.StringUtil.substitute( flgReasonString, "s/" + flagReasonToRemove + "; //" )
        flgReasonString = gw.api.util.StringUtil.substitute( flgReasonString, "s/; " + flagReasonToRemove + "//" )
        flgReasonString = gw.api.util.StringUtil.substitute( flgReasonString, "s/" + flagReasonToRemove + "//" )
		
        // check to see if user has permission to remove flag (check all assigned roles)
        for (role in User.util.getCurrentUser().Roles){
          for (privilege in role.Role.Privileges){
            if (privilege.Permission == "claimremflag"){
              // user has correct permission - remove flag and add the 
              // flag back with the updated text
              this.clearFlag( "Removing Flag: " + flagReasonToRemove)
              // if there are other flags set, put them back
              if (flgReasonString.length() > 0){
                this.setFlag( flgReasonString )	
              }
              return true
            }
          }		
        }
      }
      // flag was not set
      return false
    }
    return false;
  }
}
