package libraries.SIUInvestigationExt_Entity


enhancement SIUInvestigationExtEnhancement : entity.SIUInvestigationExt {
  function isDisassociatedClaimant() : boolean {
  
    var name : Contact  
    var disassociatedClaimant : boolean = false
  
      name = this.SIUClaimant

      if(!exists(refs in this.Claim.getClaimantsExt() where name == refs))
        disassociatedClaimant = true

    return disassociatedClaimant 
  }
  

 /*used to pull all contacts from parties involved use this method 1/12/17 ER. We are pulling only the claimant
 at this time in the for loop in the NewSIUInvestigation.gst file */
  function siuContactInfo(con : Contact) :String {
    var name = ""
    if (con typeis Person){
          name += "Name: "
          if (con.FirstName != null){
            name +=  con.FirstName
          }
          if (con.LastName != null){
            name +=  " " + con.LastName 
          } 
          name += "</br>Address: "
          if (con.PrimaryAddress.AddressLine1 != null){
            name +=  con.PrimaryAddress.AddressLine1
          }
          if (con.PrimaryAddress.AddressLine2 != null){
            name +=  " " + con.PrimaryAddress.AddressLine2
          }
          if (con.PrimaryAddress.CityStateZip != null){
            name +=  " " + con.PrimaryAddress.CityStateZip
          }
          name +=  "</br>Date of Birth: "
          if (con.DateOfBirth != null){
            name += con.DateOfBirth
          }
          name += "</br>SSN: "
          if (con.TaxID != null){
            name += con.TaxID
          }
          name += "</br>Phone: "
          if (con.WorkPhone != null){
            name += con.WorkPhone
          }
          
        } else if (con typeis Company){
          name += "Name: "
          if (con.Name !=null){
            name +=  con.Name
          }
          if (con.Name2Ext !=null){
            name +=  " " + con.Name2Ext
          }
          name += "</br>Address: "
          if (con.PrimaryAddress.AddressLine1 != null){
            name += con.PrimaryAddress.AddressLine1
          }
          if (con.PrimaryAddress.AddressLine2 != null){
            name +=  " " + con.PrimaryAddress.AddressLine2
          }
          if (con.PrimaryAddress.CityStateZip != null){
            name +=  " " + con.PrimaryAddress.CityStateZip
          }
          name += "</br>TaxID: "
          if (con.TaxID != null){
            name += con.TaxID
          }
          name += "</br>Phone: "
          if (con.WorkPhone != null){
            name +=  con.WorkPhone
          }
        }
     return name
  }
 
  static function formatCollection(listToFormat : List) : String {
    var formattedList : String = ""
    if(listToFormat.HasElements){
      for(item in listToFormat){
        if(item!=listToFormat.last() and item.toString()!=""){
          formattedList += item.toString() + ", "
        } else {
          formattedList += item.toString()
        }
      }
    }
    return formattedList
  }
  
  /* function is to set SIU Investigaton label to Research Type values
  with a new line for each type.  Had to work around the array in the function call
  this is why there are 2 functions like getResearchTypes... */
  function getResearchTypeslabel(Party : DataResearchPartyExt[]) : String {
    var retString = ""
    var lineBreak = ""
    //var indexItem = ""
    lineBreak = "\n"
    //if (Party != null and Party.HasElements){ 
      //indexItem = Party[0] 
      if (Party != null and Party.HasElements and Party[0].ResearchTypes != null and Party[0].ResearchTypes.HasElements){
          for (type in Party[0].ResearchTypes){
            retString = retString + type.ResearchType.DisplayName +  lineBreak
          }
          retString = retString.trim()
          if (retString.endsWith(lineBreak)){
            retString = retString.substring( 0, retString.lastIndexOf(lineBreak))
          }
       } else {
          retString = "(none)"
       }
    //}
    return retString
  }
  
  
  /* format Research Types as requested as separate lines in the UI and emails
  uses </br> for the emails and </n> for the Ui */
  function getResearchTypes(Party : DataResearchPartyExt, isHTML : boolean) : String {
    var retString = ""
    var lineBreak = ""
    if (isHTML){
      lineBreak = "</br>"}
      else
      lineBreak = "\n"
    if (Party.ResearchTypes.length>0){
      for (type in Party.ResearchTypes){
        retString = retString + type.ResearchType.DisplayName +  lineBreak
      }
      retString = retString.trim()
        if (retString.endsWith(lineBreak)){
          retString = retString.substring( 0, retString.lastIndexOf(lineBreak))
        }
    } else {
      retString = "(none)"
    }
    return retString
  }
  
    
  /*1/5/17 used to show a list as a comma seperated string if we need all parties from parties involved */
  function siuContactRoles(rls : Contact) : String {
    return formatCollection(this.Claim.Contacts.where(\ cc -> cc.Contact==rls).first().Roles*.Role)
  }
 
   
}


