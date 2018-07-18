package libraries
uses gw.api.database.Query
uses gw.api.util.DateUtil
uses java.util.ArrayList


class ICDCodeUtil {
  
  construct(){
  }
  //OOB code not called in CC
  static function ICDSearch(findCode : String, findBodySystem : ICDBodySystem, adminSearch : boolean) : ICDCodeQuery  {
     var currDate = gw.api.util.DateUtil.currentDate()
     var icdQuery = Query.make(ICDCode)
    
    //icdVersion = (ScriptParameters.ICDCodeDate <= DateUtil.currentDate() && icdVersion == null) ? ICDVersionExt.TC_10 : icdVersion; 
    
    // Should only be called from admin screens. No dates are checked
    if(adminSearch == true) {
      // Search with both criteria if both aren't null
      if(findCode != null) {
        icdQuery.contains("Code", findCode, true)
      }
      // Search with code only
      if(findBodySystem != null) {
        icdQuery.compare("BodySystem", Equals, findBodySystem)
      }
      // Called from any non admin screens. Expiry and availability dates are checked. Unconstrained searches are not supported
    } else {
      icdQuery.and(\ and2 -> and2.or(\ or2 -> {
                                                  or2.compare("AvailabilityDate", LessThanOrEquals, currDate)
                                                  or2.compare("AvailabilityDate", Equals, null)
                                               }
                                     )
                  )
      icdQuery.and(\ and3 -> and3.or(\ or3 -> {
                                                  or3.compare("ExpiryDate",GreaterThanOrEquals, currDate)
                                                  or3.compare("ExpiryDate", Equals, null)
                                               }
                                     )
                 )      
      // Search with both criteria if both aren't null
      if(findCode != null) {
        icdQuery.contains("Code", findCode, true)
      // Search with code only
      } 
      if(findBodySystem != null) {
        icdQuery.compare("BodySystem", Equals, findBodySystem)
      }
    }
    return icdQuery.select()
 }

  /*  This function is called by the ICD search screen to retrieve matching codes. 
      The conditions match the possibilities of parameters. 
      "strictlyEqual" parameter indicates if the result will be a set of values (using 'contains') 
      or one value which is strictly equal to findCode    
  */
   static function ICDSearch(findCode : String, findBodySystem : ICDBodySystem, findKeyword : String, adminSearch : boolean, codeType : String, icdVersion : ICDVersionExt, strictlyEqual:boolean) : ICDCodeQuery {
    var currDate = gw.api.util.DateUtil.currentDate()
    var icdQuery = Query.make(ICDCode)
    
    icdVersion = (ScriptParameters.ICDCodeDate <= DateUtil.currentDate() && icdVersion == null) ? ICDVersionExt.TC_10 : icdVersion; 
    
    // Should only be called from admin screens. No dates are checked
    if(adminSearch == true) {
      if(findCode != null) {
        icdQuery.contains("Code", findCode, true)
      // Search with code and bodysystem only
      } 
      if(findBodySystem != null) {
        icdQuery.compare("BodySystem", Equals, findBodySystem)
      // Search with code and keyword only
      }
      if(findKeyword != null) {
        icdQuery.contains("CodeDesc", findKeyword, true)
      }
    // Called from any non admin screens. Expiry and availability dates are checked. Unconstrained searches are not supported
    } else {
      //default query
      icdQuery.and(\ and2 -> and2.or(\ or2 -> {
                                                  or2.compare("AvailabilityDate", LessThanOrEquals, currDate)
                                                  or2.compare("AvailabilityDate", Equals, null)
                                               }
                                     )
                  )
      icdQuery.and(\ and3 -> and3.or(\ or3 -> {
                                                  or3.compare("ExpiryDate",GreaterThanOrEquals, currDate)
                                                  or3.compare("ExpiryDate", Equals, null)
                                               }
                                     )
                 )      
                 
      if(codeType == "CauseOfInjury") {           
        if (icdVersion == ICDVersionExt.TC_9) {
          icdQuery.subselect("Code", CompareIn, ICDCode, "Code").startsWith("Code", "E", true)
        } 
        if (icdVersion == ICDVersionExt.TC_10) {
          icdQuery.and(\ and4 -> and4.or(\ or4 -> {
                                                    or4.subselect("Code", CompareIn, ICDCode, "Code").startsWith("Code", "V", true)
                                                    or4.subselect("Code", CompareIn, ICDCode, "Code").startsWith("Code", "W", true)
                                                    or4.subselect("Code", CompareIn, ICDCode, "Code").startsWith("Code", "X", true)
                                                    or4.subselect("Code", CompareIn, ICDCode, "Code").startsWith("Code", "Y", true)
                                                   }
                                         )
                      )
        }
      } else {
        if (icdVersion == ICDVersionExt.TC_9) {
          icdQuery.subselect("Code", CompareNotIn, ICDCode, "Code").startsWith("Code", "E", true)
        } 
        
        if (icdVersion == ICDVersionExt.TC_10) {
          icdQuery.and(\ and5 -> {
                                                and5.subselect("Code", CompareNotIn, ICDCode, "Code").startsWith("Code", "V", true)
                                                and5.subselect("Code", CompareNotIn, ICDCode, "Code").startsWith("Code", "W", true)
                                                and5.subselect("Code", CompareNotIn, ICDCode, "Code").startsWith("Code", "X", true)
                                                and5.subselect("Code", CompareNotIn, ICDCode, "Code").startsWith("Code", "Y", true)
                                               }
                                  )
                      
        }
      }
      if (icdVersion != null) {
        icdQuery.compare("ICDVersionExt", Equals, icdVersion);
      }
      // Search with both criteria if both aren't null
      if(findCode != null) {
        // for search of one value that is equal to findCode
        if(strictlyEqual == true)
          icdQuery.compare("Code", Equals, findCode)
        // for search of all values that contain findCode
        else
          icdQuery.contains("Code", findCode, true)
      // Search with code and bodysystem only
      }  
      if(findBodySystem != null) {
        icdQuery.compare("BodySystem", Equals, findBodySystem)
      // Search with code and keyword only
      }
      if(findKeyword != null) {
        icdQuery.contains("CodeDesc", findKeyword, true)
      }
    } 
    return icdQuery.select()
 }
  
 static function getBodySystemList(search :  String, icdVersion : ICDVersionExt) : ArrayList<ICDBodySystemExt> {
   var fullList = new ArrayList<ICDBodySystemExt>()
   if(search == "CauseOfInjury"){
     if (icdVersion == null || icdVersion == ICDVersionExt.TC_9) {
        fullList.add(ICDBodySystemExt.get("18"))
     }
     if (icdVersion == null || icdVersion == ICDVersionExt.TC_10) {
        fullList.add(ICDBodySystemExt.get("A20"))        
     }
   } else {    
     fullList.addAll(ICDBodySystemExt.getTypeKeys(false))
     fullList.remove(ICDBodySystemExt.get("18"))
     fullList.remove(ICDBodySystemExt.get("19"))
     fullList.remove(ICDBodySystemExt.get("A20"))
     if (icdVersion == ICDVersionExt.TC_9) {
       fullList.removeWhere(\ i -> i.Code.startsWith("A"))
     }
     if (icdVersion == ICDVersionExt.TC_10) {
       fullList.removeWhere(\ i -> !i.Code.startsWith("A"))
     }
   }
   return fullList
 }
}

