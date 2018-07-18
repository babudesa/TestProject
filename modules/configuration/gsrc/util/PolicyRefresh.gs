package util;

uses java.util.ArrayList;
uses java.util.Collections;
uses java.util.List;

class PolicyRefresh{
  
  private var claimsInRefresh application : java.util.List;
  
  construct(){
  }// end PolicyRefresh constructor
  
  public function setClaimRefresh(clmNum : String){
    if(claimsInRefresh==null){
      claimsInRefresh = Collections.synchronizedList(new List());
    }
    if(!claimsInRefresh.contains(clmNum)){
      claimsInRefresh.add(clmNum);
    }
  }//end setClaimRefresh
  
  public function removeClaimRefresh(clmNum : String){
    if(claimsInRefresh != null and claimsInRefresh.contains(clmNum)){
      claimsInRefresh.remove(clmNum);
      if(claimsInRefresh.length == 0){
        claimsInRefresh = null;
      }    
    }
    if(claimsInRefresh != null and claimsInRefresh.contains(clmNum+"Fail")){
      claimsInRefresh.remove(clmNum+"Fail");
      if(claimsInRefresh.length == 0){
        claimsInRefresh = null;
      }    
    }
  }//end removeClaimRefresh  
 
  public static function policyIsInRefresh(clmNum : String): Boolean{
    if(claimsInRefresh != null){
      return claimsInRefresh.contains(clmNum);
    }
    return false;  
  }//end policyIsInRefresh
  
  public static function policyRefreshFailed(clmNum : String): Boolean{
    if(claimsInRefresh != null){
      return claimsInRefresh.contains(clmNum);
    }
    return false;  
  }//end policyRefreshFailed
  
  
}//end policyRefresh class
