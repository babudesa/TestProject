package util;

uses java.util.ArrayList;
uses java.util.Collections;
uses java.util.List;

class AgentCopyHelper{
  
   private var agentCopySet application : java.util.List;
  
  construct(){
  }
  
  public function setAgentCopy(clmNum : String){
    if(agentCopySet==null){
      agentCopySet = Collections.synchronizedList(new ArrayList());
    }
    if(!agentCopySet.contains(clmNum)){
      agentCopySet.add(clmNum);
    }
  }// end setAgentCopy
  
  public function removeAgentCopy(clmNum : String){
    if(agentCopySet != null and agentCopySet.contains(clmNum)){
      agentCopySet.remove(clmNum);
      if(agentCopySet.length == 0){
        agentCopySet = null;
      }    
    }
  }//end removeAgentCopy  
  
   public static function agentCopySetbyUser(clmNum : String): Boolean{
    if(agentCopySet != null){
      return agentCopySet.contains(clmNum);
    }
    return false;  
  }//end agentCopySetbyUser
  
}//end class


