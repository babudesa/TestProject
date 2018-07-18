// 03/27/2008 - zthomas - Defect 938, Class used to ensure verified policy numbers are obtained through policy search only.
package util.custom_Ext;
uses java.util.ArrayList
uses java.lang.StringBuffer;

class AutomatedCheckInfo
{
  private var _displayMNIPayeeWarning : Boolean;
  private var _insuredWarningDisplayed : Boolean;
  private var _insuredPayeeWarningMsg : String;
  private var _validPayToAddress : Boolean;
  private var _deductions : Deduction[]
  private var _showFullCoName : Boolean;
  
    construct()
    {
      DisplayMNIPayeeWarning = false
      InsuredWarningDisplayed = false
      ShowFullCoName = false      
    }
  
    public property set DisplayMNIPayeeWarning(value : Boolean){
      _displayMNIPayeeWarning = value;
    }
    
    public property get DisplayMNIPayeeWarning() : Boolean { 
      return _displayMNIPayeeWarning;
    }
    
    public property set InsuredWarningDisplayed(value : Boolean){
      _insuredWarningDisplayed = value;
    }
    
   public property get InsuredWarningDisplayed() : Boolean { 
      return _insuredWarningDisplayed;
    }
    
    public property set InsuredPayeeWarningMsg(chk : Check){      

      var warningMsg :StringBuffer = null;
      var allInsuredList:List = new ArrayList();
      var nonPayeeInsuredList:List = new ArrayList();
      
      for(cont in chk.Claim.Contacts){
        if(cont.isInsuredContact()){
          allInsuredList.add( cont.Contact );
        }
      }

      if(allInsuredList.length > 1){
        
        for(insCont in (allInsuredList.toArray() as Contact[])){
          if(!exists(chkPayee in chk.Payees where chkPayee.Payee == insCont)){
            nonPayeeInsuredList.add( insCont )
          }
        }
        
        warningMsg = new StringBuffer();      
        warningMsg.append( "In addition to the Insured selected this policy has multiple Insureds as follows:\n\n" );
        
        for(nonPayeeIns in nonPayeeInsuredList){
          warningMsg.append( "\t" + nonPayeeIns + "\n" );
        }
  
        _insuredPayeeWarningMsg = warningMsg.toString();
      }else{
        _insuredPayeeWarningMsg = null;
      }
    }
    
    public property get InsuredPayeeWarningMsg() : String {
      return _insuredPayeeWarningMsg
    }
    
    public property set ValidPayToAddress(value : Boolean){
      _validPayToAddress = value;
    }
    
    public property get ValidPayToAddress() : Boolean { 
      return _validPayToAddress;
    }
    
    public property set Deductions(value : Deduction[]){
      _deductions = value;
    }
    
    public property get Deductions() : Deduction[] { 
      return _deductions;
    }
    
    public property set ShowFullCoName(value : Boolean){
      _showFullCoName = value;
    }
    
    public property get ShowFullCoName() : Boolean { 
      return _showFullCoName;
    }
      
}
