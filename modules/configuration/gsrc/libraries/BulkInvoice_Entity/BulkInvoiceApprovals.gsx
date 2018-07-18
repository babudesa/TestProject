package libraries.BulkInvoice_Entity
uses gw.api.util.StringUtil


enhancement BulkInvoiceApprovals : entity.BulkInvoice {
  
  
  
    property get LastApprovingGroup() : Group {
      
        var group : Group = null
      
        if(this.LastApprovingUser != null) {
            group = this.LastApprovingUser.AllGroups.first() as Group
        }
      
        return group
    }
    
  
    function setRequestingUser(user : User){
        this.RequestingUser = user
    }
    
    
    property get HasApprovalHistory() : boolean {        
        return this.ApprovalHistory.Empty ? false : true
    }
    
    
    function wasApprovedByUser(user : User) : boolean {
        
        var wasApprovedBy : boolean = false
        
        if(exists(act in this.returnApprovalHistory() where act.Approved && act.AssignedUser == user)){
            wasApprovedBy = true
        }else {
            wasApprovedBy = false
        }
        
        return wasApprovedBy        
    }
    
    
    function returnApprovalHistory() : List<Activity> {
       return this.ApprovalHistory as List<Activity>
    }
    
    public function getPayToAppearingOnCheck():String{
      if((this.BulkInvoiceTypeExt == BulkInvoiceType.TC_LIT_ADVISOR ||  
          this.BulkInvoiceTypeExt == BulkInvoiceType.TC_HEALTHSOLUTION || 
          this.BulkInvoiceTypeExt == BulkInvoiceType.TC_ONECALLCARE ||
          this.BulkInvoiceTypeExt == BulkInvoiceType.TC_MITCHELL) &&  this.PayToLine1Ext == null){
            return StringUtil.toUpperCase(this.PayTo)
         }else{
            var payToString:String = "";

            if(this.PayToLine1Ext != null){
              payToString = payToString + this.PayToLine1Ext + "\n";
            }
            if(this.PayToLine2Ext != null){
              payToString = payToString + this.PayToLine2Ext + "\n";
            }
            if(this.PayToLine3Ext != null){
              payToString = payToString + this.PayToLine3Ext + "\n";
            }
            if(this.PayToLine4Ext != null){
              payToString = payToString + this.PayToLine4Ext + "\n";
            }
            if(this.PayToLine5Ext != null){
              payToString = payToString + this.PayToLine5Ext + "\n";
            }
            if(this.PayToLine6Ext != null){
              payToString = payToString + this.PayToLine6Ext + "\n";
            }     
             return payToString.toUpperCase();
          }
      }


  public function setCheckPayTo(){
    var payToString:String = "";
  
    if(this.PayToLine1Ext != null){
      payToString = payToString + this.PayToLine1Ext + " ";
    }
    if(this.PayToLine2Ext != null){
      payToString = payToString + this.PayToLine2Ext + " ";
    }
    if(this.PayToLine3Ext != null){
      payToString = payToString + this.PayToLine3Ext + " ";
    }
    if(this.PayToLine4Ext != null){
      payToString = payToString + this.PayToLine4Ext + " ";
    }
    if(this.PayToLine5Ext != null){
      payToString = payToString + this.PayToLine5Ext + " ";
    }
    if(this.PayToLine6Ext != null){
      payToString = payToString + this.PayToLine6Ext;
    }
  
    this.PayTo = payToString;
  }
    
   


    
    
}//End BulkInvoiceApproval enhancement