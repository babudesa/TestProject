package libraries.Incident_Entity

class ICDHelper {
 
  var _contact : ContactISOMedicareExt as ContactISO
  
  construct(cont : ContactISOMedicareExt){
      _contact = cont
      
      
  }
  
  function addCodes(checkedValues:ICDCode[], allowedCount : int){
    
     var conICD : ContactICDExt
    
     for (code in checkedValues){
       conICD = new ContactICDExt()
       conICD.ICDCode = code
       
       // Checking to see if this being called from the Cause of Injury lookup
       if(allowedCount == 1){
         conICD.CauseOfInjury = true
       }
       
       this._contact.addToContactICDExt(conICD)
     }

  }
  
  function removeCodes(conICD: ContactICDExt){
     this._contact.removeFromContactICDExt(conICD)
  }

}
