package gaic.ui.tools.edwpush
uses java.lang.String
uses java.lang.Long

/***
 * cprakash - 3/30/2016 - This class will hold the values retreived from EDW External Tables (trigger, holder, transaction)
 * and passes them to the Gosu Class to populate the information on the Newly Designed Screen for EDW Push
 */
class HolderConvClmItem {
 
  private var _claimnumber:String as readonly ClaimNumber;
 // private var _noofmessages :int as readonly NoOfMessages;
  private var _transactionname:String as readonly TransactionName;
  private var _loadcommandid : Long as readonly LoadCommandID;
  private var _processed : int as readonly Processed;


 construct(claim:String,  tname:String, lid : Long, processedstatus : int  ) {
    _claimnumber = claim
   // _noofmessages = noofmgs
    _transactionname = tname
    _loadcommandid = lid
    _processed = processedstatus
   }

}
