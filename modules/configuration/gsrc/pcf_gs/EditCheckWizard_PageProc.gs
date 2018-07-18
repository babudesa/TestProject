package pcf_gs

class EditCheckWizard_PageProc {
  private var wiz : gw.api.financials.EditCheckWizardInfo
  
  construct(theWiz : gw.api.financials.EditCheckWizardInfo) {
    wiz = theWiz
  }
  
  //If the mail to address has been assigned to the same memory location as the pay to address in
  //the checkMailToAddy(...) function of Check.gsx, then re-assign it to a shallow copy to prevent
  //erroneous updates when the pay to address is modified from Parties Involved.
  public function unsynchMailTo(){
    if(wiz.Check.ex_MailToAddress == wiz.Check.ex_PayToAddress){
      wiz.Check.ex_MailToAddress = wiz.Check.ex_PayToAddress.shallowCopy() as Address 
    }
  }
}
