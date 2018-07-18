package gw.fnolmapper.acord

uses xsd.acord.Addr_Type

/**
 * Interface for mapping Address entities.
 */
@ReadOnly
interface IAddressMapper {
  /**
   * Creates an entity.Address from an ACORD Addr_Type.
   */
  function getAddress(addr:Addr_Type) : Address
}
