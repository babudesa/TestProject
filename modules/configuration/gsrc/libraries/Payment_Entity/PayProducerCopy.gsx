package libraries.Payment_Entity
uses util.AgentCopyHelper;

enhancement PayProducerCopy : entity.Payment {
  //function to update producer copy if a cost type on a payment is changed.
  function updateProducerCopy(){
    var agentCopy : AgentCopyHelper = new AgentCopyHelper();
    if(this.Claim.LossType=="KIDNAPRANSOM"){
      this.Check.ex_ProducerCopy = "No"
      return;
    }
    if (this == this.Check.FirstPayment and !agentCopy.agentCopySetbyUser(this.Claim.ClaimNumber)){
      //only update ex_Producer Copy if the change occured on the first payment
      //and user has not already selected a value.
      if(this.Claim.Policy.ex_Agency.ex_ExpenseCheckCopy and this.CostType=="expense"){
        this.Check.ex_ProducerCopy = "Yes"
      }   
      else if(this.Claim.Policy.ex_Agency.ex_LossCheckCopy and this.CostType=="claimcost"){
        this.Check.ex_ProducerCopy = "Yes"
      }
      else {
        this.Check.ex_ProducerCopy = "No";
      }
    }
  }
}
