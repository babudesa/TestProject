package xsd.AdminDataSyncTool
uses xsd.AdminDataSyncTool.Models.*
uses gw.api.database.Query
uses com.guidewire.pl.system.exim.ImportResults
uses java.util.Date
uses xsd.AdminDataSyncTool.Models.RolePrivilegeModel.RolePrivilege_Permission
uses java.util.Map
uses java.util.LinkedHashMap

/**
 * This static class is used to import a collection of entity models imported as a AdminDataExportModel
 * and update/create entities for each model it contains. It contains a singleton bundle that gets refreshed whenever
 * init() is called, and has a commit() method to finish commiting to the database.<br><br>
 * 
 * For each entity being imported, I've used five methods:<br><br>
 * 
 * <b>getEntity()</b><br>
 * returns <b>List&lt;Entity&gt;</b><br><br>
 * This just runs a query to populate a list of the existing entities in the system.
 * <br><br>
 * 
 * <b>loadEntity(List&lt;EntityModel &gt;.Entity)</b><br>
 * returns <b>List&lt;Entity&gt;</b><br><br>
 * 
 * This method handles determining whether the model matches an existing entity in the system or if a new entity needs
 * to be added. It can NOT safely handle removal of entities, and so syncing removals was out of scope. If that is needed,
 * there is a bundle.remove(entity) method that can be used, but this could easily break linked entities. This methods 
 * should look something like:<br><br>
 * {<br>
 * var matchingEntities = entities.where(\ e -> e.KeyProperty == entityModel.KeyProperty)<br>
 * &nbsp&nbsp if (matchingEntities == null or matchingEntities.size == 0){<br>
 * &nbsp&nbsp&nbsp&nbsp return createEntity(entityModel) }<br>
 * &nbsp&nbsp else if (matchingRoles.size > 1){ Throw Exception or Handle }<br>
 * return updateRole(entityModel, matchingEntities.first())<br>
 * }<br><br>
 * 
 * <b>createEntity(entityModel)</b><br>
 * returns <b>Entity</b><br><br>
 * This method will create a new empty Entity and add it to the bundle, then pass it and the Model into mapEntity()
 * <br><br>
 * 
 * <b>updateEntity(entity,entityModel)</b><br>
 * returns <b>Entity</b><br><br>
 * This method adds the fetched entity to the bundle and passes the bundled entity and model to mapEntity()
 * <br><br>
 * 
 * <b>mapEntity(entityModel, entity)</b><br>
 * returns <b>Entity</b><br><br>
 * This method simply takes the values from the model and stores them in the entity. For SubEntities being mapped,
 * the method will need to expand that Entity or list of Entities and then store them.
 * <br><br>
 * 
 * This class was written in haste and is not the best design - collecting all Import functions in one class may have
 * been a mistake. Moreover, it may be possible to make the code more modular by creating a single set of these methods
 * that take the Entity type and the key comparison logic (probably as a block) as arguments instead of creating one offs
 * for each entity model to be imported.
 */
class Importer {

  static var bundle : gw.transaction.Bundle
  static var roles : List<Role> // Roles are identified by name
  static var users : List<User> // Users are identified by username
  static var groups : List<Group> // Users are identified by username

  /**
   * sets the Importer's bundle and data up, needs to be called each time a new set of data is
   * going to be imported.
   */
  public static function init(){
    if (bundle == null){
      bundle = gw.transaction.Transaction.getCurrent()
    }
  }
  
  /**
   * Commits the bundle. Calling some kind of close() methods that nulls out the model, adminDataExport,
   * all lists, and so on to free up memory is a good idea. This set of classes *could* create cyclical references
   * (and therefor memory leaks) so intentionally clear all vars would be a good idea.
   */
  public static function commit(){
    bundle.commit()
    bundle = null
    //close() // Null all list items, then null the lists to prevent a memory leak
  }

  public static property get InsertedBeans() : int {
    return bundle.InsertedBeans.Count
  }
  public static property get UpdatedBeans() : int {
    return bundle.UpdatedBeans.Count
  }
  public static property get RemovedBeans() : int {
    return bundle.RemovedBeans.Count
  }
  public static property get Results() : ImportResults {
    // TODO : Could reverse engineer and implement this to show the Result on the import screen
    return null
  }

  //--------------------------------- IMPORT FUNCTIONS ---------------------------------//

  /* ROLES IMPORT FUNCTIONS */
  
  /**
   * Iterates through a List of RoleModels and updates or creates Roles to match them. The Roles are
   * added to Importer's bundle, which can be store with Importer.commit() or backed out with
   * Importer.cancel()
   */
  public static function loadRoles(roleModels : List<RoleModel.Role>) : List<Role>{
    init()

    roles = Query.make(Role).select().toList()
    var loadedRoles = new List<Role>()
    
    for (roleModel in roleModels){
      loadedRoles.add(loadRole(roleModel))
    }
    return loadedRoles
  }
  
  /**
   * Updates or create a Role entity based on a RoleModel. The Updated Role is added to Importer's
   * bundle, which can be stored with Importer.commit() or backed out with Importer.cancel()
   */
  public static function loadRole(roleModel:RoleModel.Role) : Role {
    var matchingRoles = roles.where(\ r -> r.Name == roleModel.Name)
      if (matchingRoles == null or matchingRoles.size == 0){
        return createRole(roleModel)
      }
      else if (matchingRoles.size > 1){
        // Throws Exception ?
      }
      return updateRole(roleModel, matchingRoles.first())
  }
  /**
   * Creates a new Role entity to be imported
   */
  private static function createRole(roleModel : RoleModel.Role) : Role {
    return mapRole(roleModel, new Role(bundle))
  }
  /**
   * Prepares an existing Role entity to be updated with an imported Role
   */
  private static function updateRole(roleModel : RoleModel.Role, role : Role) : Role {
    return mapRole(roleModel, bundle.add(role))
  }
  /**
   * Maps the attributes of an imported RoleModel with a Role entity. Returns the 
   * updated role.
   */
  private static function mapRole(roleModel : RoleModel.Role, role : Role) : Role {
    role.CarrierInternalRole = roleModel.CarrierInternalRole
    role.Description = roleModel.Description
    role.Name = roleModel.Name
    mapPrivileges(roleModel, role)
    return role
  }

  /**
   * Maps the Permissions to the role - note, this code is NOT optimised and may have extra loop cycles
   * but given the number of Roles it may not matter much
   */
  private static function mapPrivileges(roleModel : RoleModel.Role, role : Role){

    if ((role.Privileges == null or role.Privileges.IsEmpty) and
     (roleModel.Privileges == null or roleModel.Privileges.Entrys.Empty)){
      return
    }
    // iterate through and add all model privileges
    else if (role.Privileges == null or role.Privileges.IsEmpty){
      for (roleModelPrivilege in roleModel.Privileges.Entrys){
        var rp = new RolePrivilege()
        rp.Permission = roleModelPrivilege.Permission.Code
        role.addToPrivileges(rp)
      }
    // iterate through role.Privileges keeping only matching privileges, then through roleModel adding all new privileges
    } else {
      for (privilege in role.Privileges){
        if (roleModel.Privileges.Entrys == null or
          (not roleModel.Privileges.Entrys.hasMatch(\ r -> r.Permission.Code == privilege.Permission.Code))){
          role.removeFromPrivileges(privilege)
        }
      }
      for (roleModelPrivilege in roleModel.Privileges.Entrys){
        if (not role.Privileges.hasMatch(\ m -> m.Permission.Code == roleModelPrivilege .Permission.Code)){
          var rp = new RolePrivilege()
          rp.Permission = roleModelPrivilege.Permission.Code
          role.addToPrivileges(rp)
        }
      }
      
    }
  }

  /* USER IMPORT FUNCTIONS */
  
  /**
   * Iterates through a List of UserModels and updates or creates Users to match them. The Users are
   * added to Importer's bundle, which can be store with Importer.commit() or backed out with
   * Importer.cancel()
   */
  public static function loadUsers(userModels : List<UserModel.User>) : List<User>{
    init()
    users = Query.make(User).select().toList()
    var loadedUsers = new List<User>()
    
    var c = userModels.Count
    var i = 1
    for (userModel in userModels){
      print(new Date().toString() + ": user " + i + " of " + c)
      loadedUsers.add(loadUser(userModel))
      i++
    }
    return loadedUsers
  }
  
  /**
   * Updates or create a Role entity based on a RoleModel. The Updated Role is added to Importer's
   * bundle, which can be stored with Importer.commit() or backed out with Importer.cancel()
   * 
   * OPEN QUESTION: Should certain users, such as system users, not export/import?
   */
  public static function loadUser(userModel:UserModel.User) : User {
    var matchingUsers = users.where(\ u -> u.Credential.UserName == userModel.Credential.UserName)

      if (matchingUsers == null or matchingUsers.size == 0){
        return createUser(userModel)
      }
      else if (matchingUsers.size > 1){
        // Throws Exception
      }
      return updateUser(userModel, matchingUsers.first())
  }
  /**
   * Creates a new User entity to be imported
   */
  private static function createUser(userModel : UserModel.User) : User {
    return mapUser(userModel, new User(bundle))
  }
  /**
   * Prepares an existing User entity to be updated with an imported User
   */
  private static function updateUser(userModel : UserModel.User, user : User) : User {
    return mapUser(userModel, bundle.add(user))
  }
  /**
   * Maps the attributes of an imported UserModel with a User entity. Returns the 
   * updated User.
   */
  private static function mapUser(userModel : UserModel.User, user : User) : User {
    user.Contact = loadUserContact(userModel.Contact, user.Contact)
    user.Department = userModel.Department
    user.ExperienceLevel = userModel.ExperienceLevel.Code
    user.ExternalUser = userModel.ExternalUser
    user.JobTitle = userModel.JobTitle
    user.Language = userModel.Language.Code
    loadUserRoles(userModel.Roles.Entrys,user)
    loadGroupUsers(userModel.GroupUsers.Entrys,user)
    //user.SystemUser = if userModel.SystemUser //NOT WRITEABLE?
    return user
  }
  /**
   * Updates or create a UserContact entity based on a UserContactModel. The Updated UserContact is added to
   * Importer's bundle, which can be stored with Importer.commit() or backed out with Importer.cancel()
   */
  public static function loadUserContact(contactXSD: UserContactModel.UserContact, contact : UserContact) : UserContact {
    if (contact == null and contactXSD!=null){
      return mapUserContact(contactXSD, new UserContact(bundle))
    } else {
      return mapUserContact(contactXSD, bundle.add(contact))
    }
  }
  
  /**
   * Handles the actual mapping of a UserContactModel to a passed in UserContact
   */
  private static function mapUserContact(contactXSD: UserContactModel.UserContact, contact : UserContact) : UserContact {
      // Address*es* are keyed on AddressType, hopefully nobody has more than one billing, home, etc address.
      // If so, it will clear and load all of a type. Only safe option i can think of.
      loadAddresses(contactXSD.ContactAddresses.Entrys*.Address, contact)

      contact.EmailAddress1 = contactXSD.EmailAddress1
      contact.EmailAddress2 = contactXSD.EmailAddress2
      contact.PrimaryPhone = contactXSD.PrimaryPhone.Code
      contact.CellPhone = contactXSD.CellPhone
      contact.CellPhoneExt = contactXSD.CellPhoneExt
      contact.FaxPhone = contactXSD.FaxPhone
      contact.HomePhone = contactXSD.HomePhone
      contact.WorkPhone = contactXSD.WorkPhone
      contact.FirstName = contactXSD.FirstName
      contact.LastName = contactXSD.LastName
      contact.MiddleName = contactXSD.MiddleName
      contact.Prefix = contactXSD.Prefix.Code
      contact.Suffix = contactXSD.Suffix.Code
      contact.Gender = contactXSD.Gender.Code
      contact.PrimaryAddress = loadAddress(contactXSD.PrimaryAddress,contact.PrimaryAddress)
      return contact
  }
  
  /**
   * Takes an Array of AddressModels and maps them to a Contact by AddressType. When there is more than one address
   * of an AddressType, this code will clear and replace all of that type. This 'clear and replace' will remove the 
   * addresses from any field where they were used, but there is no way to safely key the data otherwise.
   * <br><br>
   * There are a few eager optimizations since I won't have time to test performance: null models and null address
   * return null, null models and not null addresses remove all addresses, one model and one address then just set
   * the model to the address, otherwise do the heavy weight version of this
   */
  public static function loadAddresses(addressModels: AddressModel.Address[], contact : UserContact) : Address[] {
    print("loadAddresses - contact.PublicID:" +contact.PublicID)
    
    if ((addressModels == null or addressModels.size == 0) and 
      (contact.ContactAddresses == null or contact.ContactAddresses.size == 0)){
      return null
    }
    if ((addressModels == null or addressModels.size == 0) and 
      (contact.ContactAddresses != null and contact.ContactAddresses.size != 0)){

      for(contactAddress in contact.ContactAddresses){
        contact.removeAddress(contactAddress.Address)
      }
      return null
    }

    var returnAddresses = new Address[addressModels.size]

    // If one model to one address then this is faster
    if (addressModels != null and addressModels.size == 1 and 
      contact.ContactAddresses != null and contact.ContactAddresses.size == 1){
      returnAddresses[0] = loadAddress(addressModels.first(),contact.ContactAddresses.first().Address)
      print("loadAddresses - just one address")
      return returnAddresses
    }
    
    print("loadAddresses - full run")
    var i = 0
    var addressesByType = getAddressesByType(contact.ContactAddresses*.Address)
    var addressModelsByType = getAddressModelsByType(addressModels)
    var addressTypeSet = addressesByType.Keys.union(addressModelsByType.Keys)

    for (addressType in addressTypeSet){
      var addressesOfType = addressesByType != null ? addressesByType.get(addressType) : null
      var addressModelsOfType = addressModelsByType != null ? addressModelsByType.get(addressType) : null

      /* 
        If only one address and only one model address, map the Model to the Address
      */
      if (addressesOfType != null and addressModelsOfType != null and
        (addressesOfType.size == 1 and addressModelsOfType.size == 1)){
          returnAddresses[i] = loadAddress(addressModelsOfType.first(),addressesOfType.first())
          i++
      }
      /*
        If more than 1 of either addressesOfType or addressModelsOfType, clear all of the Addresses
        and then map all of the Address Models
      */
      else if (addressesOfType != null and addressModelsOfType != null and
        (addressesOfType.size > 1 or addressModelsOfType.size > 1)){
          for (address in addressesOfType){ contact.removeAddress(address) }
          for (addressModel in addressModelsOfType){
            returnAddresses[i] = loadAddress(addressModel,null)
            contact.addAddress(returnAddresses[i])
            i++
          }
      }
      /*
        No addresses but there are models, add all the models
      */
      else if (addressesOfType == null and addressModelsOfType != null){
        for (addressModel in addressModelsOfType){
          returnAddresses[i] = loadAddress(addressModel,null)
          contact.addAddress(returnAddresses[i])
          i++
        }
      }
      /*
        No models of type, then clear the addresses (Not the same as the earlier optimsation
        code. This run on each AddressType as opposed to all addresses)
      */
      else if (addressesOfType != null and (addressModelsOfType == null or addressModelsOfType.size == 0)){
        print("remove all")
        for (address in addressesOfType){
          contact.removeAddress(address) }
      }
    }
    return returnAddresses
  }
  
  private static function getAddressesByType(addresses : Address[]): LinkedHashMap<AddressType,List<Address>>{
    
    var addressesByType = new LinkedHashMap<AddressType,List<Address>>()
    
    for (address in addresses){
      if (addressesByType.containsKey(address.AddressType.Code)){
        addressesByType.get(address.AddressType.Code).add(address)
      }
      else {
        var list = new List<Address>()
        list.add(address)
        addressesByType.put(address.AddressType.Code, list)
      }
    }
    return addressesByType    
  }
  
  private static function getAddressModelsByType(addressModels : AddressModel.Address[]) :
    LinkedHashMap<AddressType,List<AddressModel.Address>>{
    
    var addressModelsByType = new LinkedHashMap<AddressType,List<AddressModel.Address>>()
    
    for (addressModel in addressModels){
      // Duplicate addressModel, will end up clear and replacing all of them
      if (AddressModelsByType.containsKey(addressModel.AddressType.Code)){
        AddressModelsByType.get(addressModel.AddressType.Code).add(addressModel)
      }
      else {
        // First addressModel of type
        var list = new List<AddressModel.Address>()
        list.add(addressModel)
        AddressModelsByType.put(addressModel.AddressType.Code, list)
      }
    }
    return addressModelsByType
  }
  
  /**
   * Will update, create, or remove an address to match the passed in AddressModel
   */
  public static function loadAddress(addressModel:AddressModel.Address, address:Address) : Address {
    if (address == null and addressModel!=null){
      // create the new address
      return mapAddress(addressModel, new Address(bundle))
    } else if (address != null and addressModel==null){
      // delete the old address
      bundle.remove(address)
      return null
    } else if (address != null and addressModel!=null){
      return mapAddress(addressModel, bundle.add(address))
    }
    return null
  }
  
  private static function mapAddress(addressModel:AddressModel.Address, address : Address) : Address {
    address.AddressBookUID = addressModel.AddressBookUID
    address.AddressLine1 = addressModel.AddressLine1
    address.AddressLine2 = addressModel.AddressLine2
    address.AddressLine3 = addressModel.AddressLine3
    address.AddressType = addressModel.AddressType.Code
    address.City = addressModel.City
    address.County = addressModel.County
    address.State = addressModel.State.Code
    address.Country = addressModel.Country.Code
    address.Description = addressModel.Description
    address.PostalCode = addressModel.PostalCode
    return address
  }

  /* GROUP IMPORT FUNCTIONS */
  
  /**
   * Iterates through a List of UserModels and updates or creates Users to match them. The Users are
   * added to Importer's bundle, which can be store with Importer.commit() or backed out with
   * Importer.cancel()
   */
  public static function loadGroups(groupModels : List<GroupModel.Group>) : List<Group>{
    init()
    groups = Query.make(Group).select().toList()
    var loadedGroups = new List<Group>()
    
    var c = groupModels.Count
    var i = 1
    for (groupModel in groupModels){
      print(new Date().toString() + ": group " + i + " of " + c)
      loadedGroups.add(loadGroup(groupModel))
      i++
    }
    return loadedGroups
  }

  /**
   * Updates or create a Group entity based on a GroupModel. The Updated Group is added to Importer's
   * bundle, which can be stored with Importer.commit() or backed out with Importer.cancel()
   */
  public static function loadGroup(groupModel:GroupModel.Group) : Group {
    var matchingGroups = groups.where(\ g -> g.Name == groupModel.Name)

      if (matchingGroups == null or matchingGroups.size == 0){
        return createGroup(groupModel)
      }
      else if (matchingGroups.size > 1){
        // Throws Exception
      }
      return updateGroup(groupModel, matchingGroups.first())
  }
  /**
   * Creates a new Group entity to be imported
   */
  private static function createGroup(groupModel : GroupModel.Group) : Group {
    return mapGroup(groupModel, new Group(bundle))
  }
  /**
   * Prepares an existing Role entity to be updated with an imported Role
   */
  private static function updateGroup(groupModel : GroupModel.Group, group : Group) : Group {
    return mapGroup(groupModel, bundle.add(group))
  }
  /**
   * Maps the attributes of an imported RoleModel with a Role entity. Returns the 
   * updated role.
   */
  private static function mapGroup(groupModel : GroupModel.Group, group: Group) : Group {
    group.CompanyNameExt = groupModel.CompanyNameExt.Code
    group.DivisionNameExt.DivisionNameValue = groupModel.DivisionNameExt.DivisionNameValue
    loadAddress(groupModel.GroupAddressExt, group.GroupAddressExt)
    group.GroupType = groupModel.GroupType.Code
    group.ISOAgencyIDExt = groupModel.ISOAgencyIDExt.Code
    group.Name = groupModel.Name
    //group.RootGroup = groupModel.RootGroup
    loadGroupSupervisor(groupModel,group)
    //group.VisibilityZone = groupModel.VisibilityZone.Code
    return group
  }
  
  private static function loadGroupSupervisor(groupModel : GroupModel.Group, group : Group) : User{
    var supervisor : User = null

    if (groupModel.Supervisor != null){
      supervisor = users.where(\ s -> s.Credential.UserName == groupModel.Supervisor.Credential.UserName).first()
    }
       
    group.Supervisor = supervisor
    return supervisor
  }
  
/**
   * Takes an array of userroles from the userrolemodel of the imported file, and compares that with existing file, 
   * creates or removes the userroles of the user after mapping and load the resulting userroles in the user.
   */
  public static function loadUserRoles(userrolemodel : UserRoleModel.UserRole[], user: User): UserRole[]{
    if(userrolemodel == null && userrolemodel.size == 0){
      if(user.Roles == null && user.Roles.size == 0){
        return null
      }
    }
  // if roles does exist in local file, but none in the import file, then remove all the roles associated to user.  
    if(userrolemodel == null && userrolemodel.size == 0){
      if(user.Roles != null && user.Roles.size > 0){
        for(role in user.Roles){
          user.removeFromRoles(role)
          return null
        }
       
      }
    }
   /*if roles does not exist for user in existing file, whereas there are roles in the import file, then new instance of it is created and mapped.
   this has small issue while committing the bundle, has to be implemented. 
    if(user.Roles == null && user.Roles.size == 0){
      if(userrolemodel != null && userrolemodel.size >0){
        for(y in userrolemodel){
        var ur = new UserRole()
        ur.Role.Name = y.Role.Name
        user.addToRoles(ur)
        }
      }
    }
*/
    else if(userrolemodel != null && userrolemodel.size > 0 and user.Roles != null && user.Roles.size > 0){
      /*Checks for the roles in user with the roles in UserRoleModel, removes if such that does not exst in UserRoleModel.
      */
        for(y in user.Roles){
          if(!(userrolemodel.hasMatch(\ u -> u.Role.Name == y.Role.Name))){
            user.removeFromRoles(y)
            }
          }
        }
      /* Checks for each role in UserRoleModel with role for the User, and adds if any such that does not exist for the User.
         Need to make small changes in this loop as there seems to be small issue while commiting the bundle, there seems some problem, did not have enough time to look into it.
         */
      /*for(y in userrolemodel){
          if(!(user.Roles.hasMatch(\ u -> u.Role.Name == y.Role.Name)))
          {
            var ur = new UserRole()
            ur.Role.Name = y.Role.Name
            user.addToRoles(ur)

          }
          }*/
    

    return user.Roles
  }
 /**
   * Takes an array of groupusers from the groupusermodel of the imported file, and compares that with existing file, 
   * creates or removes the groupusers of the user after mapping and load the resulting groupusers in the user.
   */ 
  public static function loadGroupUsers(groupusermodel : GroupUserModel.GroupUser[],user : User) : GroupUser[]{
    if((groupusermodel == null or groupusermodel.size == 0) and (user.GroupUsers == null or user.GroupUsers.size == 0)){
      return null
    }
    if(groupusermodel == null && groupusermodel.size == 0 and user.GroupUsers != null && user.GroupUsers.size > 0){
      for(groupuser in user.GroupUsers){
        user.removeFromGroupUsers(groupuser)
        return null
      }
    }
    /* if there are no groupuser associated with the user in the existing file, but there are some in import file, then create new groupuser objects and map them.
    this loop has to modified as there are few issues while committing the bundle.
    if(groupusermodel != null  && groupusermodel.size > 0 and user.GroupUsers == null && user.GroupUsers.size == 0){
      for(g in groupusermodel){
       var gu = new GroupUser()
       gu.Group.Name = g.Group.Name
       user.addToGroupUsers(gu)
      }
    }
    */
    if(groupusermodel != null && groupusermodel.size > 0 and user.GroupUsers != null && user.GroupUsers.size > 0){
      for(groupuser in user.GroupUsers){
   /*Checks for the groupusers associated with user, and compares it with the groupuser from groupusermodel,
     does nothing if exists in both, removes if it exists only in user, but not in the import groupusermodel.
      */     
        if(!(groupusermodel.hasMatch(\ g -> g.Group.Name == groupuser.Group.Name))){
          user.removeFromGroupUsers(groupuser)
        }
      }
   /*Checks for each groupuser in the groupusermodel wih the groupusers associated with user object, if exists does nothing,
   if not, creates a new instance of the groupuser and maps the group name to the groupuser.
   */
  /*
 // This method has to be modified as there seems to be some problems while committing the bundle, didn't have enough time to look nto it.
      for(gum in groupusermodel){
        if(!(user.GroupUsers.hasMatch(\ g -> g.Group.Name == gum.Group.Name))){
          var gu = new GroupUser()
          gu.Group.Name = gum.Group.Name
          user.addToGroupUsers(gu)
        }
      }
      */
    }
    return user.GroupUsers
  }
}

