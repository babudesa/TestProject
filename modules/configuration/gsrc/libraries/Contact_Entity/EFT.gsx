package libraries.Contact_Entity
uses java.util.ArrayList

enhancement EFT : entity.Contact {
  /*
    This is checking to see if eft information has been entered for a person contact. If it has 'true' is returned. 
    It's purpose is to prevent address book linking of a person contact if there is no EFT information entered.
    True is also returned for contacts that aren't of subtype person.  
  */

  function hasEFT(inContact:Contact): boolean{
    var eftList = new ArrayList()   
    var hasIt = false
    if(inContact.Subtype == "Person")
    {
      for(x in inContact.ABEFTAccountInfoExt)
      {
        eftList.add( x )  
      }
      if (!eftList.Empty)
      {
        hasIt = true
      }
    }
    else
    {
       hasIt = true 
    }
    return hasIt
   }
}
