package util.gaic.test;
uses java.util.ArrayList;

class PSARTestCase
{
  private var policyID_ : String
  private var description_ : String
  private var threshold_ : String
  private var results_ : PSARTestResult[]
  
  public property get policyID() : String{ return policyID_; }
  public property get description() : String { return description_; }
  public property get threshold() : String { return threshold_; }
  public property get results() : PSARTestResult[] { return results_; }
  
  construct(){
  }
  
  construct(newPolicyID : String, newDesc : String, newThreshold : String, newResults : java.util.List){
    policyID_ = newPolicyID
    threshold_ = newThreshold
    description_ = newDesc
    var x : java.util.Iterator = newResults.iterator();
    var tempList  = new ArrayList()
    while (x.hasNext()){
      var tempVar : com.gaic.claims.dto.PSARTestResultsDTO = x.next() as com.gaic.claims.dto.PSARTestResultsDTO;
      var tr : PSARTestResult = new PSARTestResult((tempVar.getTestDuration() as java.lang.String), tempVar.getDatetime(), tempVar.getPsarVersion());
      tempList.add(tr)
    }
      
    results_ = tempList as util.gaic.test.PSARTestResult[]
  }
}
