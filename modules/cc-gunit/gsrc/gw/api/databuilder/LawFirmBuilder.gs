package gw.api.databuilder

class LawFirmBuilder extends CompanyBuilderBase<LawFirm, LawFirmBuilder>
{
  construct()
  {
    super(entity.LawFirm, 0)
  }
  
  public function withFaxPhone(faxPhone : String) : LawFirmBuilder {
    set(LawFirm.Type.TypeInfo.getProperty( "FaxPhone" ), faxPhone)
    return this
  } 

  public function withName(name : String) : LawFirmBuilder {
    set(LawFirm.Type.TypeInfo.getProperty( "Name" ), name)
    return this
  }

  /**
   * Sets the primary address on the company and also sets the initialization order of the address so
   * it will be set up before other fields on the company. This is useful because the country of the
   * primary address is used to determine the validators for other fields on the contact (such as
   * phone number and tax identification number) so the primary address should typically be one of the
   * first fields to be set.
   * @param address the desired primary address
   * @return the modified builder
   */
  public function withPrimaryAddressSetEarly(address : Address) : LawFirmBuilder {
    return withPrimaryAddressSetEarly(ExistingBean.wrap(address))
  }

  /**
   * Sets the primary address on the company and also sets the initialization order of the address so
   * it will be set up before other fields on the company. This is useful because the country of the
   * primary address is used to determine the validators for other fields on the contact (such as
   * phone number and tax identification number) so the primary address should typically be one of the
   * first fields to be set.
   * @param address a generator that will return the desired primary address
   * @return the modified builder
   */
  public function withPrimaryAddressSetEarly(address : ValueGenerator<? extends Address>) : LawFirmBuilder {
    this.set(DataBuilder.DEFAULT_ORDER - 1, entity.Contact.Type.TypeInfo.getProperty("PrimaryAddress"), address);
    return this
  }
}
