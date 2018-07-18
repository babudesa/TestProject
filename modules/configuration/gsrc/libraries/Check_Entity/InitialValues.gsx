package libraries.Check_Entity

enhancement InitialValues : entity.Check {
  /* This function is no longer needed - We are using Check.MailTo once more.
     kmboyd - Defect 1293 - 7/16/08
  function setInitialValues(){
    this.MailTo = "Refer to Check.ex_Mailto"; 
  }
  */
  /* Commenting out as part of 4.0.3 upgrade. Replacing with function provided by Guidewire
  function checkPayTo(){
      var payTo = "";
      var numPayees = this.Payees.length;
      var i = 0;
      var payees = this.Payees;
    
      while(i<numPayees){
         if(payees[i].Payee.DisplayName != null){
           payTo = payTo + payees[i].Payee.DisplayName;
         }
  //       else if(payees[i].Payee.Person.LastName != null){
  //         payTo = payTo + payees[i].Payee.Person.FirstName + " " + payees[i].Payee.Person.LastName;
  //       }
       
         if(i!=numPayees-1 and payees[i+1].Payee.DisplayName != null and payees[i].Payee.DisplayName!=null){
           payTo = payTo + " &amp; ";
         }
         i = i + 1;
      }
      this.PayTo = payTo;
  }
  */
  //* New Guidewire function used as Hidden Input on Check screens.
  function checkPayTo(){
    var payto : String = "";
    var first : boolean = true;
    for (payee in this.Payees) {
      var name : String = payee.Payee.DisplayName;
      if (name != null) {
        if (!first) {
          payto = payto + " &amp; ";
        } else {
          first = false;
        }
        payto = payto + name;
      }
    }
    this.PayTo = payto;
  }
}
