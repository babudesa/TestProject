package gw.api.databuilder

class AttorneyBuilder extends PersonBuilderBase<Attorney, AttorneyBuilder>
{
  construct()
  {
    super(entity.Attorney, 0)
  }
  
  public function withAttorneyLicense(license : String) : AttorneyBuilder {
    set(Attorney.Type.TypeInfo.getProperty( "AttorneyLicense" ), license)
    return this
  }
  
  public function withFaxPhone(faxPhone : String) : AttorneyBuilder {
    set(Attorney.Type.TypeInfo.getProperty( "FaxPhone" ), faxPhone)
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
  public function withPrimaryAddressSetEarly(address : Address) : AttorneyBuilder {
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
  public function withPrimaryAddressSetEarly(address : ValueGenerator<? extends Address>) : AttorneyBuilder {
    this.set(DataBuilder.DEFAULT_ORDER - 1, entity.Contact.Type.TypeInfo.getProperty("PrimaryAddress"), address);
    return this
  }
}
