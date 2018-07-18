package xsd.AdminDataSyncTool
uses xsd.AdminDataSyncTool.Models.*

/**
 * This class acts as a holder for all data to be custom exported. Each top level entity that is exported needs a
 * List property to be stored in. Each of those properties <b>must</b> also be mapped in AdminDataExportModel.<br><br>
 * 
 * After populating an AdminDataExport with data, it can be converted into its model with:<br>
 * <i>new AdminDataExportModel.AdminDataExport(<b>adminDataExport</b>)</i><br><br>
 * 
 * That model in tern can be converted into a string by using <i><b>adminDataExportModel</b>.asUTF8String()</i>
 */
public class AdminDataExport {

  private var _users : List<User>
  private var _groups : List<Group>
  private var _roles : List<Role>

  /**
   * Empty contructor. This is meant to create a AdminDataExport to be subsequently loaded with data
   * and exported.
   */
  construct() {
    _users = new List<User>()
    _groups = new List<Group>()
    _roles = new List<Role>()
  }
  
  /**
   * Create an AdminDataExport from a model (probably imported from file). Committing the AdminDataExport
   * will update/create the entities that were loaded.
   */
  construct(model : AdminDataExportModel.AdminDataExport) {
    _roles = new List<Role>()
    _users = new List<User>()
    _groups = new List<Group>()
    
    xsd.AdminDataSyncTool.Importer.loadRoles(model.Roles.Entrys)
    xsd.AdminDataSyncTool.Importer.loadUsers(model.Users.Entrys)
    xsd.AdminDataSyncTool.Importer.loadGroups(model.Groups.Entrys)
  }

  private function loadUsers(userModels : List<UserModel.User>) : List<User> {
    for (userModel in userModels){
      _users.add(xsd.AdminDataSyncTool.Importer.loadUser(userModel))
    }
    return _users
  }
  /**
   * Queries the database to fetch all Groups and adds them to AdminDataExport.
   * 
   * It is likely there are opportunities to improve performance by creating a version
   * that only adds changed entities.
   */
  public function exportGroupsToAdminData() : AdminDataExport{
    var databaseGroups = gw.api.database.Query.make(Group).select()
    
    for (group in databaseGroups){
      Groups.add(group)
    }
    return this
  }
  /**
   * Queries the database to fetch all Users and adds them to AdminDataExport.
   * 
   * It is likely there are opportunities to improve performance by creating a version
   * that only adds changed entities.
   */  
  public function exportUsersToAdminData() : AdminDataExport{
    var databaseUsers = gw.api.database.Query.make(User).select()
    
    for (user in databaseUsers){
      Users.add(user)
    }
    return this
  }
  /**
   * Queries the database to fetch all Roles and adds them to AdminDataExport.
   * 
   * It is likely there are opportunities to improve performance by creating a version
   * that only adds changed entities.
   */
  public function exportRolesToAdminData() : AdminDataExport{
    var databaseRoles = gw.api.database.Query.make(Role).select()

    for (role in databaseRoles){
      Roles.add(role)
    }
    return this
  }
  
  /**
   * Converts the AdminDataExport to its GX Model
   */
  public function toModel() : AdminDataExportModel.AdminDataExport {
    return new AdminDataExportModel.AdminDataExport(this)
  }

  /**
   * Converts the AdminDataExport to a UTF8 XML String
   */
  public function toXMLString() : String {
    return new AdminDataExportModel.AdminDataExport(this).asUTFString()
  }
  
  /**
   * When the Admin Data is exported from one enviroment to another, there are often public key issue that require
   * extensive manual intervention. This process exports the data in a set of cutom entity mappings and can be imported on
   * different primary keys to get arround the conflicts.
   */
  public static function exportAllData(){
    var adminDataExport = new AdminDataExport()
      adminDataExport.exportRolesToAdminData()
      adminDataExport.exportUsersToAdminData()
      adminDataExport.exportGroupsToAdminData()
    //adminDataExport.exportSecuirtyZones()
    //adminDataExport.exportOrganization()
    //adminDataExport.exportAssignableQueue()
    
    /*
    <AssignableQueue public-id="cc:624">
    <Description>Auto-created FNOL queue for group</Description>
    <Group public-id="cc:1125"/>
    <Name>FNOL</Name>
    <SubGroupVisible>false</SubGroupVisible>
    */
    
    SaveFileUtility.writeAndDisplayFile(adminDataExport.toModel().asUTFString(), "exportAllDataFile.xml")
  }
  
  public static function exportRolesOnly(){
    var adminDataExport = new AdminDataExport()
      adminDataExport.exportRolesToAdminData()
    SaveFileUtility.writeAndDisplayFile(adminDataExport.toModel().asUTFString(), "testRoleImport.xml")
  }
  public static function exportRolesAndUsersOnly(){
    var adminDataExport = new AdminDataExport()
      adminDataExport.exportRolesToAdminData()
      adminDataExport.exportUsersToAdminData()
    SaveFileUtility.writeAndDisplayFile(adminDataExport.toModel().asUTFString(), "testRolesAndUsersImport.xml")
  }

  //Boilerplate getters and setters
  public property get Users() : List<User> {
    return _users }
  public property set Users(userArray : List<User>) {
    _users = userArray }
  public property get Groups() : List<Group> {
    return _groups }
  public property set Groups(groupArray : List<Group>) {
    _groups = groupArray }
  public property get Roles() : List<Role> {
    return _roles }
  public property set Roles(roleArray : List<Role>) {
    _roles = roleArray }
}