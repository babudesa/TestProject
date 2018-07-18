package libraries.Check_Entity

enhancement CheckAddressFunctions : entity.Check {
  function checkAddress(){
    if(this.DeliveryMethod == "agent"){
      this.ex_MailTo = this.Claim.Policy.ex_Agency;
      this.ex_MailToAddress = this.Claim.Policy.ex_Agency.PrimaryAddress;
    }
    else if(this.DeliveryMethod == "hold"){
      for(each in this.Claim.AssignedUser.Contact.AllAddresses){
        if(each.AddressType ==  "business"){
          this.ex_MailTo = this.Claim.AssignedUser.Contact;
          this.ex_MailToAddress = each;
        }
      }
    }
    else if(this.DeliveryMethod == "send"){ //make sure to clear out agency or agent mail to if mail to recipient is chosen
      if(this.ex_MailTo == this.Claim.AssignedUser.Contact || this.ex_MailTo == this.Claim.Policy.ex_Agency){
        this.ex_MailTo = null;  
      }
    }
  }
  function setAttention()
  {
    if(this.DeliveryMethod=="hold")
    {
      this.AttentionMailToExt=this.Claim.AssignedUser.DisplayName
    }
    else
    {
      this.AttentionMailToExt="";
    }
  }
  
}
