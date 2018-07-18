package util.admin


uses gw.api.database.Query
//uses gw.api.database.IQueryBeanResult

class ExternalUserAdminUtil {

  construct() {}
  
  static function enable(exUser: TPAAdminExt){
    exUser.TPAEnabledExt = true
  }
  
  static function disable(exUser: TPAAdminExt){
    exUser.TPAEnabledExt = false
  }
  
  // Return the names of the TPAs on the Admin screen, for the dropdown on Loss Details.
  // Need to filter by the profit center/claim group for the claim.
  static function getValueRange():String[]{
    var query: TPAAdminExtQuery = find (var tpa in TPAAdminExt where tpa.TPAEnabledExt)
    var returnlist = new java.util.ArrayList()
    // need to filter ONLY the value of the TPA that is going 
    returnlist.add("GAI")
    for (each in query.toList().sortBy(\ t -> t.NameExt )){
      returnlist.add(each.NameExt)
    }
    return returnlist as String[]
  }
  
  static function setSavedValue(value: String, claim: Claim){
    var prev = claim.ExternalHandlingExt
    setValue(value, claim)
    addToHistory(claim, prev, claim.ExternalHandlingExt)
  }
  
    static function setValue(value: String, claim: Claim) {
    if (value == "GAI"){
      claim.ExternalHandlingExt = null
    }
    else {
      var query = Query.make(TPAAdminExt)
      query.compare("NameExt", Equals, value)
      query.compare("TPAEnabledExt", Equals, true)
      if (!query.select().toList().Empty){
          claim.ExternalHandlingExt = query.select().toList().first()
      }
    }
  }    

  
  static function setExternalUser(claim: Claim){
    var prev = claim.ExternalHandlingExt
    var list:  List<TPAAdminExt>
    // if claim is assigned check for the claim group
    if (claim.AssignmentStatus == typekey.AssignmentStatus.TC_ASSIGNED){
      var q1 = Query.make(TPAAdminExt)
      q1.compare("ClaimGroupExt", Equals, claim.AssignedGroup)
      q1.compare("TPAEnabledExt", Equals, true)
      list = q1.select().toList()
      claim.ExternalHandlingExt = list.first()

    }
    if (list == null || list.Empty){
      var q2 = Query.make(TPAAdminExt)
      q2.compare("ProfitCenterGroupExt", NotEquals, null)
      q2.compare("TPAEnabledExt", Equals, true)
      list = q2.select().toList()
    }
      
    var count = 0
    var first: TPAAdminExt = null
    for (each in list){
      if (checkForMatchingProfitCenter(each.ProfitCenterGroupExt, claim.Policy.ex_Agency.ex_AgencyProfitCenter)){
        if (first == null){
          first = each
        }
        count ++
      }
    }
    // If there are multiple matches for the External Users then we want to default to GAI; if there is only one match then set the value.
    if (count == 1){
      claim.ExternalHandlingExt = first
    } else {
      claim.ExternalHandlingExt = null
    }
    //addToHistory(claim, prev, claim.ExternalHandlingExt)
  }
     
  static function addToHistory(claim: Claim, prev: TPAAdminExt, newtpa: TPAAdminExt){
    // if external user group changed, add to claim history
    if (prev != newtpa){
      var var1 = prev.NameExt
      var var2 = newtpa.NameExt
      if (prev == null){
        var1 = "GAI"
      }
      if (newtpa == null){
        var2 = "GAI"
      }
      claim.addToHistory(claim.createCustomHistoryEvent("DataChange", displaykey.Java.Claim.ExternalUserUpdate(var1, var2)))
    }
  }
  
  static function checkForMatchingProfitCenter(pcgroup: ProfitCenterGroupingExt, claimpc: String): Boolean{
    if (exists(pc in pcgroup.ProfitCenterItemExt where claimpc == pc.ProfitCenter)){
      return true
    }
    else return false
  }
  
  // Function to determine if the claim should send to ISO based on the 'Claim Handled By' field.
  static function sendToISO( message: MessageContext): Boolean{
    var claim: Claim
    //Set the claim based on the type of message
    if (message.Root typeis Claim){
      claim = message.Root
    } 
    else if (message.Root typeis ClaimContact){
      claim = message.Root.Claim
    }
    else if (message.Root typeis ClaimContactRole){
      claim = message.Root.ClaimContact.Claim
    }
    else if (message.Root typeis Exposure && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Policy && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    if (claim != null){
      if (claim.ExternalHandlingExt == null){
        return true
      } else {
        return claim.ExternalHandlingExt.EnableISOExt
      }
    } else {
      return true
    }
  }
  
  // Function to determine if the claim should send to LSS based on the 'Claim Handled By' field.
  static function isLitAdvisorEnabled( message: MessageContext): Boolean{
    var claim: Claim
    //Set the claim based on the type of message
    if (message.Root typeis Claim){
      claim = message.Root
    } 
    else if (message.Root typeis ClaimContact){
      claim = message.Root.Claim
    }
    else if (message.Root typeis ClaimContactRole){
      claim = message.Root.ClaimContact.Claim
    }
    else if (message.Root typeis Exposure && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Policy && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Check && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Payment && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Reserve && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Matter && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    if (claim != null){
      if (claim.ExternalHandlingExt == null){
        return true
      } else {
        return claim.ExternalHandlingExt.LegalActionsExt
      }
    } else {
      return true
    }
  }
  
  static function isMedVendorEnabled(message : MessageContext) : Boolean{
    var claim: Claim
    //Set the claim based on the type of message
    if (message.Root typeis Claim){
      claim = message.Root
    } 
    else if (message.Root typeis ClaimContact){
      claim = message.Root.Claim
    }
    else if (message.Root typeis ClaimContactRole){
      claim = message.Root.ClaimContact.Claim
    }
    else if (message.Root typeis Exposure && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Policy && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Check && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Payment && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Reserve && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    else if (message.Root typeis Matter && message.Root.Claim != null){
      claim = message.Root.Claim
    }
    if (claim != null){
      if (claim.ExternalHandlingExt == null){
        return true
      } else {
        return claim.ExternalHandlingExt.EnableMedVendorsExt
      }
    } else {
      return true
    }
  }
  
  // Function to determine if 1099 Taxport is enabled based on the 'Claim Handled By' field.
  static function is1099Enabled( chk: Check ): Boolean{
    if (chk.Claim.ExternalHandlingExt != null){
      return chk.Claim.ExternalHandlingExt.Taxport1099Ext
    } 
    else {
      return true
    }
  }
  
  static function createLetters(claim: Claim): Boolean{
    // Need to figure out how to determine whether the previous version of the Claim Handled by field had the auto ack letters set to no... 
    if (claim.ExternalUserAdminExt == null && exists(event in claim.History where (event.Description != null && event.Description.contains("Claim Handled by group updated")))){
      return false
    }
    else {
      return true
    }
  }
}


