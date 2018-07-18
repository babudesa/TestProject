package gw.api.databuilder
uses java.lang.Integer

enhancement EFTDataBuilderEnhancement : gw.api.databuilder.EFTDataBuilder {

  /**
   * Sets the name on the account
   * @param accountName the desired value
   * @return the modified builder
   */
  function withAccountName(accountName : String) : EFTDataBuilder {
    this.set(EFTData.Type.TypeInfo.getProperty("AccountName"), accountName);
    return this;
  }

  /**
   * Sets the bank account number
   * @param bankAccountNumber the desired value
   * @return the modified builder
   */
  function withBankAccountNumber(bankAccountNumber : String) : EFTDataBuilder {
    this.set(EFTData.Type.TypeInfo.getProperty("BankAccountNumber"), bankAccountNumber)
    return this;
  }

  /**
   * Sets the type of bank accout e.g. checking, savings etc
   * @param bankAccountType the desired value
   * @return the modified builder
   */
  function withBankAccountType(bankAccountType : BankAccountType) : EFTDataBuilder {
    this.set(EFTData.Type.TypeInfo.getProperty("BankAccountType"), bankAccountType)
    return this;
  }

  /**
   * Sets the name of the bank
   * @param bankName the desired value
   * @return the modified builder
   */
  function withBankName(bankName : String) : EFTDataBuilder {
    this.set(EFTData.Type.TypeInfo.getProperty("BankName"), bankName)
    return this;
  }

  /**
   * Sets the routing number is a nine digit bank code used in the United States
   * @param bankRoutingNumber the desired value
   * @return the modified builder
   */
  function withBankRoutingNumber(bankRoutingNumber : String) : EFTDataBuilder {
    this.set(EFTData.Type.TypeInfo.getProperty("BankRoutingNumber"), bankRoutingNumber)
    return this;
  }

  /**
   * Sets the indicates if this is the primary EFT record for the contact
   * @param isPrimary the desired value
   * @return the modified builder
   */
  function withIsPrimary(isPrimary : Boolean) : EFTDataBuilder {
    this.set(EFTData.Type.TypeInfo.getProperty("IsPrimary"), isPrimary)
    return this;
  }
 
}
