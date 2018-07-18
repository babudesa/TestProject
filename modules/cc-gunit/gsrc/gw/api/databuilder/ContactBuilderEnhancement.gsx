package gw.api.databuilder

enhancement ContactBuilderEnhancement : gw.api.databuilder.ContactBuilder {
  
  public function withEFTRecord(eftData : EFTData) : ContactBuilder {
    withEFTRecord(ExistingBean.wrap(eftData))
    return this
  }
  
  public function withEFTRecord(eftData : ValueGenerator<? extends EFTData>) : ContactBuilder {
    this.addArrayElement(Contact.Type.TypeInfo.getProperty("EFTRecords"), eftData)
    return this
  }

}
