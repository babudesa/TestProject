package gw.api.databuilder

class DoctorBuilder extends PersonBuilderBase<Doctor, DoctorBuilder>
{
  construct()
  {
    super(entity.Doctor, 0)
  }
  
  public function withSpecialtyType(specialtyType : SpecialtyType) : DoctorBuilder {
    set(Doctor.Type.TypeInfo.getProperty( "SpecialtyType" ), specialtyType)
    return this
  }

  public function withFaxPhone(faxPhone : String) : DoctorBuilder {
    set(Doctor.Type.TypeInfo.getProperty( "FaxPhone" ), faxPhone)
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
  public function withPrimaryAddressSetEarly(address : Address) : DoctorBuilder {
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
  public function withPrimaryAddressSetEarly(address : ValueGenerator<? extends Address>) : DoctorBuilder {
    this.set(DataBuilder.DEFAULT_ORDER - 1, entity.Contact.Type.TypeInfo.getProperty("PrimaryAddress"), address);
    return this
  }
}