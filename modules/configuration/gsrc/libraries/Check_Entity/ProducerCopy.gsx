package libraries.Check_Entity
uses util.AgentCopyHelper;

enhancement ProducerCopy : entity.Check {
  function GetProducerCopy(){
    //blawless - changed the condition from new payment to now only set the producer copy if it is null. 
    //Updates to cost type will use the UpdateProducerCopy function in PayProducerCopy.xml.
    if(this.Claim.LossType=="KIDNAPRANSOM" or this.Claim.LossType == typekey.LossType.TC_PERSONALAUTO){
      this.ex_ProducerCopy = "No"
      return;
    }
    if (this.ex_ProducerCopy == null) {
    
      if(this.Claim.Policy.ex_Agency.ex_ExpenseCheckCopy and this.FirstPayment.CostType=="expense"){
        this.ex_ProducerCopy = "Yes"
      }   
      else if(this.Claim.Policy.ex_Agency.ex_LossCheckCopy and this.FirstPayment.CostType=="claimcost"){
        this.ex_ProducerCopy = "Yes"
      }
      else {
        this.ex_ProducerCopy = "No";
      }
    }
  }

  function setUserSetProducerCopy(){
   var agentCopy : AgentCopyHelper = new AgentCopyHelper();
    
    agentCopy.setAgentCopy( this.Claim.ClaimNumber );
  }

  function clearUserSetProducerCopy(){
    var agentCopy : AgentCopyHelper = new AgentCopyHelper();
    
    agentCopy.removeAgentCopy( this.Claim.ClaimNumber );
  }
}
