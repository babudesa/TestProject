package gw.fnolmapper.acord

uses xsd.acord.InsuredOrPrincipal_Type
uses xsd.acord.ClaimsParty_Type

/**
 * Interface for mapping ClaimContact entities.
 */
@ReadOnly
interface IContactMapper {
  /**
   * Creates a ClaimContact from the InsuredOrPrincipal_Type
   */
  function getContact(principal:InsuredOrPrincipal_Type, policy:Policy) : ClaimContact
  
  /**
   * Creates a ClaimContact from the ACORD ClaimsParty_Type
   */
  function getContact(claimParty:ClaimsParty_Type) : ClaimContact
}
