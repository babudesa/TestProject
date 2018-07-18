package util.custom_Ext;

class ApprovalRules
{
  construct(){
  }

  public static function hasApprovalHistory(bulkInvoice : BulkInvoice) : Boolean{
    if(!bulkInvoice.New && bulkInvoice.ApprovalHistory.length > 0){
      return true;
    }
    else{
      return false;
    }
  }
}
