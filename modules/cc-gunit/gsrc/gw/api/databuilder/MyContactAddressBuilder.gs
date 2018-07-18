package gw.api.databuilder

uses com.guidewire.pl.domain.contact.AddressBaseBuilder

/**
 * Builder for {@link ContactAddress}
 *
 * @author paulyoung
 */
class MyContactAddressBuilder extends DataBuilder<ContactAddress, MyContactAddressBuilder> {

  construct()
  {
    super( ContactAddress.Type);
  }

  function withAddress( addrBuilder : AddressBaseBuilder ) : MyContactAddressBuilder
  {
    set( ContactAddress.Type.TypeInfo.getProperty( "Address"), addrBuilder )
    return this
  }
} 