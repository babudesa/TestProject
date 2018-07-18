package libraries.User_Entity

enhancement UserFunctions : entity.User {
  function getUserGroupBusinessUnit(type : String) : String {
  /*  
     defect 1331 - Office name and business unit are on two seperate lines.  The type returned will be either
     the Office or Business Unit.  Mwissel - 2/16/2009
  */  

    var userGroupBusinessUnit : String = null;
    var userBusinessUnit : String = null;
 
   for(grp in this.GroupUsers )
     {
        var userGroup : Group = grp.Group
        userGroupBusinessUnit = userGroup.DisplayName
        if(userGroup.GroupType == "busunit") {
          break;  }  
        
       while(userGroup != grp.Group.RootGroup){
          if(userGroup.GroupType == "busunit") {
            userBusinessUnit = userGroup.DisplayName    
  //          userGroupBusinessUnit = userGroupBusinessUnit + ", " + userGroup.DisplayName 
            break;
          }
          userGroup = userGroup.Parent
        }
    }
  if (type == "Office") 
    { return userGroupBusinessUnit; }
    else
  if (type == "BusinessUnit")  
    { return userBusinessUnit;}
    else 
  return "Corporate Claims"  
  }



  public function signatureRequired() : boolean {
     for(grp in this.GroupUsers ) {
        if((grp.Group.Parent.GroupType == "busunit" or grp.Group.GroupType == "busunit") and 
            grp.Group != ScriptParameters.Statistical_Compliance_Group )
         return true    
     }
     return false
  }

  function setSignature() : void {
  
    var signature : String
    signature = ""
  
    if(this.New == true) {
      if (this.Contact.FirstName != null)
        signature += this.Contact.FirstName + " "
      if(this.Contact.MiddleName != null)
         signature += this.Contact.MiddleName + " "
      if(this.Contact.LastName != null)
         signature += this.Contact.LastName + " "
      this.ex_Signature = signature
    }
  }
  

  function getGeneralBusinessUnit() : String {
    try {
      var tempGroup : Group = this.GroupUsers[0].Group
      var retString : String = ""
  
      while(true){
        if(tempGroup.GroupType == "busunit"){
          break;
        } else {
          tempGroup = tempGroup.Parent
        }
        if(tempGroup.Parent == null){
        break;
      }
    }
    if((tempGroup == this.GroupUsers[0].Group and tempGroup.GroupType != "busunit") or (tempGroup.Parent == null and tempGroup.GroupType != "busunit")){
      retString = "Non-Business Unit"
    } else {
      retString = tempGroup.Name
    }
    return retString;
    }
    catch(e) {
      return null
    }
  }

  function getUserBusinessUnitAndGroup() : String {
  
    var userBusinessUnit : String = "";
    var userGroupName : String = "";
    var userBusinessUnitandGroup : String = "";
 
    for(grp in this.GroupUsers ){
      userGroupName = grp.Group.Name
      var newGroup = grp.Group
      
       while(newGroup != newGroup.RootGroup){
         userBusinessUnit = newGroup.DisplayName;
         if(newGroup.GroupType == GroupType.TC_BUSUNIT){
           break;
         }
         newGroup = newGroup.Parent;
       }
    }
    if(!userBusinessUnit.equals( userGroupName ) and (userBusinessUnit != "")){
      userBusinessUnitandGroup = userBusinessUnit + ", " + userGroupName;
    }else{
      userBusinessUnitandGroup = userGroupName
    }

    return userBusinessUnitandGroup;

  }

  function getUserBusinessUnit() : String {
  
    var userBusinessUnit : String = "";
 
    for(grp in this.GroupUsers ){
      var userGroup : Group = grp.Group
        
       while(userGroup != grp.Group.RootGroup){
         userBusinessUnit = userGroup.DisplayName;
         if(userGroup.GroupType == "busunit"){
           break;
         }
         userGroup = userGroup.Parent;
       }
    }

    return userBusinessUnit;

  }
}
