package libraries.Activity_Entity

enhancement ActivityEnhancement : entity.Activity {
  
  function getApprovalUserOrGroupString() : String {
    
    if( this.CloseUser != null )  {
      return this.CloseUser.DisplayName
    } 
    else if( this.AssignedUser != null ) {
      return this.AssignedUser.DisplayName
    }  
    else if( this.AssignedGroup != null ) {
      return this.AssignedGroup.DisplayName
    } 
    else {
      return ""
    }
  }

  function getApprovalString() : String {
    if (this.Approved == null) {
      return displaykey.Java.ApprovalHistory.PendingApproval
    } else if (this.Approved) {
      return displaykey.Java.ApprovalHistory.Approved
    } else {
      return displaykey.Java.ApprovalHistory.Rejected
    }
  }

  /**
  * As part of the Manual Claims Conversion Project isConvertedExt, 
  * isUpdatedExt or isNativeORUpdatedExt should replace all instances 
  * of LoadCommandID.
  * 
  * @return TRUE = converted claim and FALSE = natively created claim
  */
  function isConvertedExt(): Boolean
  {
    var retValue = false
    if (this.LoadCommandID != null)
    {
      retValue= true
    }
    return retValue
  }
  /**
  * As part of the Manual Claims Conversion Project isConvertedExt, 
  * isUpdatedExt or isNativeORUpdatedExt should replace all instances 
  * of LoadCommandID.
  * 
  * @return TRUE = updated converted claim and FALSE = native claim or untouched
  */
  function isUpdatedExt(): Boolean
  {
    var retValue = true 
    if (this.isConvertedExt() && 
        (this.LoadCommandID.equals(ScriptParameters.CurrentConversionLoadCommandID) || 
         this.LoadCommandID.equals(ScriptParameters.GOSULoadCommandID)))
    {
      retValue = false
    }
    return retValue
  }
  /**
  * As part of the Manual Claims Conversion Project isConvertedExt, 
  * isUpdatedExt or isNativeORUpdatedExt should replace all instances 
  * of LoadCommandID.
  * 
  * @return TRUE = native claim or updated converted claim and FALSE = untouched converted claim
  */
  function isNativeORUpdatedExt(): Boolean
  {
    var retValue = false
    if (this.isUpdatedExt() || 
        !this.isConvertedExt())
    {
      retValue = true
    }
    return retValue
  }
}
