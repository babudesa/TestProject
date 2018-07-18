package gw.api.financials

enhancement GWCheckCreatorEnhancement : CheckCreator {
  /**
   * sets payee and related fields (recipient, payTo, mailToAddress) to payee's information
   * @param payee  payee to set
   * @return modified CheckCreator
   */
  function withPayeeAndRelatedFields(payee : Contact) : CheckCreator {
    return this.withPayee(payee)
               .withRecipient(payee)
               .withPayTo(payee.getDisplayName())
               .withMailToAddress(payee.getPrimaryAddress())
  }
}
