package libraries.History_Entity

enhancement History : entity.History {
  /* create function for Def 518.  This will include exposure type in the exposure string
  */
  
  function getClaimRelatedToDesc() : String {
    var newClaimRelatedToDesc:String;
    
    if (this.Exposure == null) {
      newClaimRelatedToDesc =  displaykey.Java.HistoryView.EntireClaim;
    }
    else {
      newClaimRelatedToDesc = this.Exposure.FullDescriptionWithLossParty;    
    }
    return newClaimRelatedToDesc;
  }
  

  /* Def 483 - Replace History.Description for Pending Final payment issue.
     Needed only when there is a pending reserve and someone sends out a pending
     Final Payment */
  function getDescription(hist : History) : String {
    var strAmount : String
    var strType : String
    var strStatus : String
    //var strRationale : String
    
    for(trans in this.TransactionSet.Transactions){
      
      strAmount = "$" + trans.Amount.toString();
    
      strType = trans.TransactionTypeName;
          
      if(trans.Status == "Rejected"){
        strStatus = "Rejected"
      }
      else if(hist.getDescription().containsIgnoreCase("Rejected")){
        strStatus = "Rejected"
      }
      else {
        strStatus = "Approved"
      }
    }
    return strAmount + " " + strType + " " + strStatus;
  }
}

