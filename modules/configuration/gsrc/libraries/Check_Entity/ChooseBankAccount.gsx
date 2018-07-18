package libraries.Check_Entity

enhancement ChooseBankAccount : entity.Check {
    
    /**
    * Sets the Bank Account
    */
    function setBankAccount(){      

        if(this.ex_ManualPaymentMethod == ManualPaymentMethod.TC_TOMIC) {            
              this.BankAccount = BankAccount.TC_TOMIC 
         
        } else if(this.Claim.Policy.CurrencyTypeExt == CurrencyTypeExt.TC_CAD) {
              
            this.BankAccount =  BankAccount.TC_ROYAL_BANK_OF_CANADA
            this.TypeOfCheckExt = TypeOfCheck.TC_CANADIAN_CHECK
          
        }else {
      
            this.BankAccount = BankAccount.TC_NATIONAL_CITY
            this.TypeOfCheckExt = TypeOfCheck.TC_US_CHECK
        } 
    }   
    
}// End ChooseBankAccount Enhancement
