package gw.webservice.cc.contact

uses gw.api.contact.ContactAutoSyncUtil

/**
 * API for submitting Contacts for automatic synchronization from an external system
 * (This is normally used by ContactCenter, but can be used by any system implementing linking 
 * and sync-ing via IAddressBookAPI)
 */
@WebService({})
@ReadOnly
class IContactAutoSyncAPI
{
  construct()
  {
  }
 
  /**
   * Submits the Contacts associated with this AddressBookUID to be automatically synchronized. 
   * If the system config parameter, "InstantaneousContactAutoSync" is set to true, then system 
   * will begin synchronizing contacts immediately.  If the parameter is set to false, the system
   * will add the AddressBookUID to the Contact Autosync work queue and will start synchronizing 
   * contacts when the batch job is next run.
   *
   * @param addressBookUID - Address book uid for the contacts need to re-sync
   */
  function autoSyncContactWithABUID(addressBookUID : String) {
    ContactAutoSyncUtil.createAutoSyncWorkItem(addressBookUID);
  }
}
