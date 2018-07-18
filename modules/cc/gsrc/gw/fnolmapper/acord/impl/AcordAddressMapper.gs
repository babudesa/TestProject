package gw.fnolmapper.acord.impl
uses gw.fnolmapper.acord.IAddressMapper
uses typekey.State
uses entity.Address
uses gw.fnolmapper.acord.AcordConfig

uses xsd.acord.Addr_Type

/**
 * Maps an ACORD address XML element to an Address entity.
 */
@Export
class AcordAddressMapper implements IAddressMapper
{
    var config:AcordConfig
    
    construct(configuration:AcordConfig) {
      this.config = configuration
    }
  
    //maps the Addr_Type to an Address entity
    override function getAddress(addr:Addr_Type) : Address {
      var address = new Address()
      address.AddressLine1 = addr.Choice.Addr1!=null ? addr.Choice.Addr1 : addr.Choice.DetailAddr.DisplayName
      address.AddressLine2 = addr.Addr2
      address.AddressLine3 = addr.Addr3
      address.City = addr.City
      address.State = State.get(addr.StateProvCd)
      address.PostalCode = addr.PostalCode
      address.County = addr.County
      address.Country = addr.Country
      return address
    }
}
