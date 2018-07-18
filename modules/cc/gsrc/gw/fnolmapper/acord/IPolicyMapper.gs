package gw.fnolmapper.acord

uses xsd.acord.ClaimsNotificationAddRq_Type

/**
 * Maps the ACORD policy element to the Policy entity.
 */
@ReadOnly
interface IPolicyMapper {
  /**
   * Populates an (empty) entity.Policy from an ACORD ClaimsNotificatoinAddRq_Type.
   */
  function populate(claimPolicy:Policy, req:ClaimsNotificationAddRq_Type)
}
