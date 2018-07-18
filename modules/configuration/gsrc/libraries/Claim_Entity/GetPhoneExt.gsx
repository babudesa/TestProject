package libraries.Claim_Entity

enhancement GetPhoneExt : entity.Claim {
  function getClaimOwnerExtension(): String
  {
    var workphone=this.AssignedUser.Contact.WorkPhone;
    if( this.AssignedUser.Contact.WorkPhone != NULL ){
     var ext = workphone.indexOf( "x" );
     if(ext != -1){
       return workphone.substring( ext + 1 );
     }
     return null;
    }
    return null
  }
}
