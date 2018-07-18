package gw.fnolmapper.acord

uses java.util.Map
uses java.util.HashMap
uses java.util.Set
uses java.util.HashSet

/**
 * Keeps references to processed contacts.
 */
@ReadOnly
class ContactManager 
{
  static final var EMPTY_SET = new HashSet<ClaimContact>();
  
  var contactsById:Map<String,ClaimContact>
  var contactsForRole:Map<ContactRole,Set<ClaimContact>>
  
  construct() {
    contactsById = new HashMap<String,ClaimContact>()
    contactsForRole = new HashMap<ContactRole,Set<ClaimContact>>()
  }
  
  /**
   * Adds a processed contact
   */
  function addContact(id:String, contact:ClaimContact) {
    if(id!=null)
      contactsById.put(id, contact)
    addRoles(contact)
  }
  
  private function addRoles(contact:ClaimContact) {
    for(role in contact.Roles) {
      var s:Set<ClaimContact> = contactsForRole.get(role.Role)
      if(s==null) {
        s = new HashSet<ClaimContact>()
        contactsForRole.put(role.Role, s)
      }
      s.add(contact)
    }
  }
  
  /**
   * Lookup a contact by its XML id
   */
  function getById(id:String) : ClaimContact {
    return contactsById.get(id);
  }
  
  /**
   * Lookup all contacts that have the given claim role.
   */
  function getByRole(role:ContactRole) : Set<ClaimContact> {
    var contacts = contactsForRole.get(role)
    return contacts!=null ? contacts : EMPTY_SET
  }
  
  /**
   * Checks for existence of the role on the contact
   */
  static function hasRole(contact:ClaimContact, role:ContactRole) : boolean {
    for(cr in contact.Roles) {
      if(cr.Role==role) return true
    }
    return false
  }
}
