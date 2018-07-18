package util.gaic.groupuserexport
uses util.gaic.groupuserexport.gaiggroupuserexport.enums.RecordTypeEnum
uses util.gaic.claimexport.ClaimExportUtil
uses util.user.GroupsHelper
uses util.gaic.groupuserexport.gaiggroupuserexport.enums.AddressTypeEnum
uses java.util.ArrayList


class GroupUserExportUtil {

  construct() {}
  
  
  /**
  * Generates a group message for the group/user export
  */
  @Param("group", "the group to generate the message from")
  @Param("recordType", "the record type associated with this message") 
  @Returns("the group export message XML string")
  static function buildGroupMessage(group : Group, recordType : RecordTypeEnum) : String {
    var exportGroup = new util.gaic.groupuserexport.gaiggroupuserexport.CCExportGroup();
    exportGroup.GroupID = group.PublicID
    exportGroup.CreateDate = ClaimExportUtil.formatDateforXSD(group.CreateTime)
    exportGroup.ModifiedDate = ClaimExportUtil.formatDateforXSD(group.UpdateTime)
    exportGroup.DivisionName = group.DivisionNameExt.DivisionNameValue
    exportGroup.GroupName = group.Name
    exportGroup.SupervisorUserId = group.Supervisor.PublicID
    exportGroup.Addresses = new util.gaic.groupuserexport.gaiggroupuserexport.Addresses()
    exportGroup.Addresses.Addresss = new ArrayList<util.gaic.groupuserexport.gaiggroupuserexport.Address>()
    exportGroup.Addresses.Addresss.add(getMailingAddress(group.Supervisor.Contact))
    exportGroup.Addresses.Addresss.add(getBusinessAddress(group.Supervisor.Contact))
    exportGroup.RecordType = recordType
    return exportGroup.asUTFString();
  } 
  
  
  /**
  * Generates a user message for the group/user export
  */
  @Param("user", "the user to generate the message from")
  @Param("recordType", "the record type associated with this message") 
  @Returns("the group export message XML string")
  static function buildUserMessage(user : User, recordType : RecordTypeEnum) : String {
    var exportUser = new util.gaic.groupuserexport.gaiggroupuserexport.CCExportUser()
    exportUser.UserID = user.PublicID
    exportUser.UserName = user.Credential.UserName
    exportUser.CreateDate = ClaimExportUtil.formatDateforXSD(user.CreateTime)
    exportUser.ModifiedDate = ClaimExportUtil.formatDateforXSD(user.UpdateTime)
    exportUser.Addresses = new util.gaic.groupuserexport.gaiggroupuserexport.Addresses()
    exportUser.Addresses.Addresss = new ArrayList<util.gaic.groupuserexport.gaiggroupuserexport.Address>()
    exportUser.Addresses.Addresss.add(getMailingAddress(user.Contact))
    exportUser.Addresses.Addresss.add(getBusinessAddress(user.Contact))
    exportUser.EmailAddress = user.Contact.EmailAddress1
    exportUser.FaxNumber = user.Contact.FaxPhone
    exportUser.FirstName = user.Contact.FirstName
    exportUser.JobTitle = user.JobTitle
    exportUser.GroupID = GroupsHelper.getUsersGroup(user).PublicID
    exportUser.LastName = user.Contact.LastName
    exportUser.MiddleName = user.Contact.MiddleName

    exportUser.PhoneNumber = user.Contact.PrimaryPhoneValue
    exportUser.RecordType = recordType
    return exportUser.asUTFString();
  }
  
  
  /**
  * Generates a user contact message for the group/user export
  */
  @Param("user", "the user to generate the message from")
  @Param("contact", "the user contact to generate the message from")
  @Param("recordType", "the record type associated with this message") 
  @Returns("the group export message XML string")
  static function buildContactMessage(user : User, contact : UserContact, recordType : RecordTypeEnum) : String {
    var exportUser = new util.gaic.groupuserexport.gaiggroupuserexport.CCExportUser()
    exportUser.UserID = user.PublicID
    exportUser.CreateDate = ClaimExportUtil.formatDateforXSD(user.CreateTime)
    exportUser.ModifiedDate = ClaimExportUtil.formatDateforXSD(user.UpdateTime)
    exportUser.Addresses = new util.gaic.groupuserexport.gaiggroupuserexport.Addresses()
    exportUser.Addresses.Addresss = new ArrayList<util.gaic.groupuserexport.gaiggroupuserexport.Address>()
    exportUser.Addresses.Addresss.add(getMailingAddress(contact))
    exportUser.Addresses.Addresss.add(getBusinessAddress(contact))
    exportUser.EmailAddress = contact.EmailAddress1
    exportUser.FaxNumber = contact.FaxPhone
    exportUser.FirstName = contact.FirstName
    exportUser.JobTitle = user.JobTitle
    exportUser.GroupID = GroupsHelper.getUsersGroup(user).PublicID
    exportUser.LastName = contact.LastName
    exportUser.MiddleName = contact.MiddleName
    exportUser.PhoneNumber = contact.PrimaryPhoneValue
    exportUser.RecordType = recordType
    return exportUser.asUTFString();
  }
  
  
  /**
  * Generates a group contact message for the group/user export
  */
  @Param("group", "the group to generate the message from")
  @Param("contact", "the user contact to generate the message from")
  @Param("recordType", "the record type associated with this message") 
  @Returns("the group export message XML string")
  static function buildContactGroupMessage(group : Group, contact : UserContact, recordType : RecordTypeEnum) : String {
    var exportGroup = new util.gaic.groupuserexport.gaiggroupuserexport.CCExportGroup();
    exportGroup.GroupID = group.PublicID
    exportGroup.CreateDate = ClaimExportUtil.formatDateforXSD(group.CreateTime)
    exportGroup.ModifiedDate = ClaimExportUtil.formatDateforXSD(group.UpdateTime)
    exportGroup.DivisionName = group.DivisionNameExt.DivisionNameValue
    exportGroup.GroupName = group.Name
    exportGroup.SupervisorUserId = group.Supervisor.PublicID
    exportGroup.Addresses = new util.gaic.groupuserexport.gaiggroupuserexport.Addresses()
    exportGroup.Addresses.Addresss = new ArrayList<util.gaic.groupuserexport.gaiggroupuserexport.Address>()
    exportGroup.Addresses.Addresss.add(getMailingAddress(contact))
    exportGroup.Addresses.Addresss.add(getBusinessAddress(contact))
    exportGroup.RecordType = recordType
    return exportGroup.asUTFString();
  }
  
  
  /**
  * Generates a groupUser message for the group/user export
  */
  @Param("groupUser", "the user to generate the message from")
  @Param("recordType", "the record type associated with this message") 
  @Returns("the group export message XML string")
  static function buildGroupUserMessage(groupUser : GroupUser, recordType : RecordTypeEnum) : String {
    return buildUserMessage(groupUser.User, recordType)
  }
  
 
  public static function getMailingAddress(contact : Contact) : util.gaic.groupuserexport.gaiggroupuserexport.Address {
    return  buildAddress(AddressTypeEnum.MAILING, 
      contact.AllAddresses.firstWhere(\ a -> a.AddressType == AddressType.TC_MAILING))
  }
  
  
  public static function getBusinessAddress(contact : Contact) : util.gaic.groupuserexport.gaiggroupuserexport.Address {
    return  buildAddress(AddressTypeEnum.BUSINESS, 
      contact.AllAddresses.firstWhere(\ a -> a.AddressType == AddressType.TC_BUSINESS))
  }
  
  
  private static function buildAddress(type : AddressTypeEnum, address : Address) : util.gaic.groupuserexport.gaiggroupuserexport.Address {
    var exportAddress = new util.gaic.groupuserexport.gaiggroupuserexport.Address()
    exportAddress.AddressType = type
    exportAddress.AddressLine1 = address.AddressLine1
    exportAddress.AddressLine2 = address.AddressLine2
    exportAddress.City = address.City
    exportAddress.State = address.State.Code
    exportAddress.Zip = address.PostalCode
    return exportAddress
  }
  
  
  /**
  * Sends the message to CC External
  */
  @Param("messageContext", "the context of the message")
  @Param("messageContent", "the message content")
  static function sendMessage(messageContext : MessageContext, messageContent : String) {
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, messageContent);   
  }
  
  /**
  * Checks to see if any fields on the adresses changed
  */
  @Param("contact", "the contact to check for address changes")
  @Returns("the changed status of the contact adresses")
  static function userAddressChanged(contact : Contact) : boolean {

    var changed : boolean = null
      
      //check for specified changed fields on each address
      for(address in contact.AllAddresses.where(\ a -> a.AddressType == AddressType.TC_MAILING
          || a.AddressType == AddressType.TC_BUSINESS)) {          
        if(GroupUserExportUtil.addressChanged(address)){
          changed = true
          break
        }       
      }   
       
    return changed
  } 
  
  /**
  * Checks to see if the address changed
  */
  @Param("address","the address to check for changes")
  @Returns("did the address change")
  static function addressChanged(address : Address) : boolean {
    var fields = new String[] {"AddressType", "AddressLine1", "AddressLine2", "City", "State", "PostalCode"}
    var changed : boolean = null
  
    if (util.gaic.CommonFunctions.fieldFromListChanged(address, fields)) {
      changed = true
    }
  
    return changed
  }
  
    
  /**
  * Determines if we should create the export message for a user
  */
  @Param("user","the user to check")
  @Returns("is this user valid to send to the export") 
  public static function sendUserToExport(user : User) : boolean {
    var doSend : boolean = false
    var group : Group = GroupsHelper.getUsersGroup(user)
    if(ClaimExportUtil.isWcExportGroup(group)) {
        doSend = true
      } else {
        doSend = false
      }
    return doSend
  }
  
    /**
  * Determines if we should create the export message for a user contact
  */
  @Param("contact","the user to check")
  @Returns("is this contact valid to send to the export") 
  public static function sendContactToExport(contact : Contact) : boolean {
    var usercont = find(userC in UserContact where userC == contact).AtMostOneRow
    var user = find(u in User where u.Contact == usercont).AtMostOneRow
    var doSend : boolean = false
    var group : Group = GroupsHelper.getUsersGroup(user)
    if(ClaimExportUtil.isWcExportGroup(group)) {
        doSend = true
      } else {
        doSend = false
      }
    return doSend
  }

  
  /**
  * Determines if we should create the export message for a group
  */
  @Param("group","the group to check")
  @Returns("is this group valid to send to the export") 
  public static function sendGroupToExport(group : Group) : boolean {
    var doSend : boolean = false

    if(ClaimExportUtil.isWcExportGroup(group)) {    
        doSend = true
      } else {
        doSend = false
      }
    
    return doSend
  }

}
