package gw.webservice;

uses gw.transaction.Transaction
uses gw.api.webservice.exception.RequiredFieldException;
uses gw.api.webservice.exception.DuplicateKeyException;
uses gw.api.webservice.exception.DataConversionException;
uses gw.api.webservice.exception.SOAPException;

/**
 * IGroupAPI provides mechanisms for adding new Groups to and obtaining information for
 * existing Groups from ClaimCenter
 */
@WebService
@ReadOnly
class IGroupAPI
{
  construct()
  {
  }
  
  /**
   * Retrieves a group given the group identifier or returns null if no group could be found.
   *
   * @param groupPublicID The public ID of the group to retrieve
   * @return The GroupData representing the group
   */
  function getGroup(groupID : String) : Group {
    return Transaction.getCurrent().loadByPublicId( Group, groupID) as Group
  }
    
  /**
   * Adds the given group data to the system.
   * if the data object doesn't contain a PublicID, one will be assigned.
   * The parent, grouptype, and securityzone of the group data cannot be null.
   *
   * @param groupData The <code>GroupData</code> object
   * @return The public identifier of the group data object.
   */
  @Throws(DataConversionException, "")
  @Throws(DuplicateKeyException, "If the group has a public id that exists already.")
  @Throws(RequiredFieldException, "If any of the required fields are missing.")
  function addGroup(groupData : Group) : String {
    if (null == groupData) {
      throw new RequiredFieldException("Group cannot be null in method addGroup().");
    }
    var b = groupData.getBundle();
    if (groupData.getGroupType() == null) {
      throw new RequiredFieldException("Field Group.GroupType cannot be null");
    }
    if (groupData.getSecurityZone() == null) {
      throw new RequiredFieldException("Field Group.SecurityZone cannot be null");
    }
    if (groupData.getParent() == null) {
      throw new RequiredFieldException("Field Group.Parent cannot be null");
    }

    b.commit();
    return groupData.getPublicID();
  }

  /**
   * Finds the public id of a group by the name.
   *
   * @param groupName the name of the group to match
   * @return the matching group's publicId, or <code>null</code> if no Group exists with the given name.
   * 
   */
  function findPublicIdByName(groupName : String) : String {
    var groups = find(g in Group where g.name==groupName)
    return groups.getFirstResult().PublicID;
  }
}
