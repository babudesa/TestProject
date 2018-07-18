package libraries.Check_Entity
uses java.util.HashSet
uses java.util.ArrayList
uses pcf.GeneralErrorWorksheet


enhancement CheckUI : entity.Check {
  
      
    
    /**
    * Fitlers the reserve lines for the NewPaymentDetialV pcf.
    * 
    * @param reserveLines the payable Reserve Lines on the Claim
    * @return the filtered list of Reserve Lines
    */
    public function filterReserveLines(reserveLines : List<Object>) : List<ReserveLine> {      
        return util.financials.CheckFunctions.filterReserveLines(reserveLines, this.Claim, this.PaymentMethod, this.BankAccount)
    }
    
    
    /**
    * Validates the Cost Types on the given Check
    * 
    * @param theCheck the check to validate the payment cost types on
    * @throws a user displayable exception with the validation message if the checks 
    * cost types are invalid
    */
    public function validateCostTypes() {
    
        if(exists(costType in this.Payments*.CostType where util.financials.CheckFunctions.is1099ReportableCostType(costType) == false) &&
            exists(costType in this.Payments*.CostType where util.financials.CheckFunctions.is1099ReportableCostType(costType) == true)) {
          
        
           var reportableSet : HashSet<CostType> = new HashSet<CostType>()
           var nonReportableSet : HashSet<CostType> = new HashSet<CostType>()

           reportableSet
             .addAll(this.Payments*.CostType
             .where(\ c -> util.financials.CheckFunctions.is1099ReportableCostType(c)))
     
           nonReportableSet
             .addAll(this.Payments*.CostType
             .where(\ c -> !util.financials.CheckFunctions.is1099ReportableCostType(c)))
          
            throw new com.guidewire.pl.web.controller.UserDisplayableException(displaykey.Rules.Validation.Transaction.Enterprise.Payment.MixedReportablityError)
        }
    }
  
    /**
    * if both PayTo and MailTo are the same and their new Addresses are the same or different we are calling check.syncPayeeMaitoAddresses()
    */
    public function syncPayeeMaitoAddresses(){
      if(this.PayTo == (this.ex_MailTo as java.lang.String) and this.ex_PayToAddress.New){ 
        // when new PayTo address is typed in and 'Same as Primary Payee' flag is marked
        if(this.ex_PayToAddress != null and this.ex_PayToAddress==this.ex_MailToAddress 
          and !this.Payees[0].Payee.AllAddresses.contains(this.ex_PayToAddress)){
          // add address to addresses array on contact
          this.Payees[0].Payee.addAddress(this.ex_PayToAddress)
          // sync the contact with AB if it was pulled from AB
          if (this.Payees[0].Payee.AddressBookUID != null) {
            this.Payees[0].Payee.updateAddressBook(true)
          }
        }
        // if both PayTo and MailTo addresses in New Check Wizard are new and not the same
        else if(this.ex_MailToAddress.New and this.ex_PayToAddress!=this.ex_MailToAddress){
          // add both new addresses to addresses array on payee, shallowCopy is to prevent shared addresses
          this.Payees[0].Payee.addAddress(this.ex_PayToAddress)
          this.Payees[0].Payee.addAddress(this.ex_MailToAddress.shallowCopy() as Address)
         
          if(this.Payees[0].Payee.AddressBookUID != null){
            this.Payees[0].Payee.updateAddressBook(true) 
          }
        }
      }
    }

    /**
    * Guidewire solution to update the payment type on BIN items
    * when a check is transferred on the CheckTransfer.pcf. A similar fix is implemented 
    * on the RecodePayment.pcf. The code is placed here instead of on the pcf so that we
    * can actually debug if needed.
    */  
    function syncBIOnTransfer() {
  
      if (this.Bulked == true) {   
    
        gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
         this.Payments.each(\ p -> { 
           var temp = bundle.add(this.BulkInvoiceItem)
           temp.setFieldValue("PaymentType", p.PaymentType )
           temp.setFieldValue("NonEroding", p.DoesNotErodeReserves )
         })
        }, "su")
      }
    }  
  
    
    /**
    * Validates net amounts on the line items are not negative.
    */ 
    function validateNetAmounts() {
      if(this.NetAmount == 0) {
        throw new com.guidewire.pl.web.controller.UserDisplayableException(displaykey.LV.Financials.Checks.NetAmount.IsZero)
      } else if(exists(item in this.Payments*.LineItems where item.TransactionAmount < 0)) {
        throw new com.guidewire.pl.web.controller.UserDisplayableException(displaykey.LV.Financials.EditablePaymentLineItems.PaymentLineItem.Negative)
      }
    }
/**
  * temporarily hide the new TPA related values from this Sprint
  * as TPA is not going to production yet as of June 21, 2017  --kmolnar2
  * the invokation of this filter should be taken out when TPA - Athens is going to production
  * CheckDV.pcf uses this filter
*/        
 public function filterCheckCategoryExternal(value: CheckCategoryExt ) : boolean { 
        var showValue : boolean = null
        var env = gw.api.system.server.ServerUtil.getEnv();
        if(value == CheckCategoryExt.TC_ATHENS and (env =="uat" or env=="cert" or env=="prod") ){
         // do not enable yet in production
                showValue = false
            }else {
                showValue = true
            }
        return showValue
    }    
    
}//End CheckUI

       
 