package util.custom_Ext;

// 03/27/2008 - zthomas - Defect 938, Class used to ensure verified policy numbers are obtained through policy search only.
class VerifiedPolicyInfo
{
  private var _verifiedPolicySelected : Boolean;
  private var _selectedVerifiedPolicyNumber : String;
  private var _searchLossDate : DateTime;
  private var _previousLossDate : DateTime;
  private var _claimsMadeDate : Boolean;
  private var _claimsMadePolicy : Boolean;
  private var _reportedDate : DateTime;
  
    construct()
    {
      VerifiedPolicySelected = false
      SelectedVerifiedPolicyNumber = null
    }
  
    public property set VerifiedPolicySelected(selected : Boolean){
      _verifiedPolicySelected = selected;
    }
    
    public property get VerifiedPolicySelected() : Boolean { 
      return _verifiedPolicySelected;
    }
    
    public property set SelectedVerifiedPolicyNumber(policyNumber : String){
      _selectedVerifiedPolicyNumber = policyNumber;
    }
    
    public property get SelectedVerifiedPolicyNumber() : String {
      return _selectedVerifiedPolicyNumber
    }
     
    public property set SearchLossDate(lossDate : DateTime){
      _searchLossDate = lossDate;
    }
    
    public property get SearchLossDate() : DateTime {
      return _searchLossDate
    }
    
    public property set PreviousLossDate(lossDate : DateTime){
      _previousLossDate = lossDate;
    }
    
    public property get PreviousLossDate() : DateTime {
      return _previousLossDate
    }
    
    public property set ClaimsMadeDate(value : Boolean){
      _claimsMadeDate = value;
    }
    
    public property get ClaimsMadeDate() : Boolean { 
      return _claimsMadeDate;
    }
    
     public property set ClaimsMadePolicy (value : Boolean){
      _claimsMadePolicy = value;
    }
    
    public property get ClaimsMadePolicy() : Boolean { 
      return _claimsMadePolicy;
    }
    
    public property set ReportedDate(lossDate : DateTime){
      _reportedDate = lossDate;
    }
    
    public property get ReportedDate() : DateTime {
      return _reportedDate
    }
    

          
}

