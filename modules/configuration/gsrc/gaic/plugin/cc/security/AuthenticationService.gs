package gaic.plugin.cc.security
uses entity.UserRole
uses entity.GroupUser
uses gw.lang.ScriptParameters
uses java.lang.String
uses gw.lang.Export

uses com.guidewire.logging.LoggerCategory
uses com.guidewire.pl.plugin.security.AuthenticationSource
uses com.guidewire.pl.plugin.security.AuthenticationServicePluginCallbackHandler
uses com.guidewire.pl.plugin.security.UserNamePasswordAuthenticationSource
uses com.guidewire.util.Assert
uses java.lang.IllegalArgumentException
uses javax.security.auth.login.FailedLoginException
uses gw.api.database.Query
uses gw.api.util.DisplayableException
uses gw.entity.IEntityType

/**
 * WC Defect 8408
 * AuthenticationService converted from Java as part of an enhancement to lock non conversion-users out
 * while doing maintance on ClaimCenter.
 */
@Export
class AuthenticationService implements gw.plugin.security.AuthenticationServicePlugin {

  private var _handler : AuthenticationServicePluginCallbackHandler = null;
  private var logger : LoggerCategory = new LoggerCategory(LoggerCategory.PLUGIN, "Security");

  public override function authenticate(source : AuthenticationSource) : String {

    if (!(source typeis UserNamePasswordAuthenticationSource)) {
      throw new IllegalArgumentException("Authentication source type " + 
        //"source.getClass().getName()" is not valid in Gosu, this should be about the same effect//
        (typeof source).TypeInfo.Name + " is not known to this plugin");
    }

    Assert.check(_handler != null ? null : "Callback handler not set");

    var uNameSource : UserNamePasswordAuthenticationSource = source as UserNamePasswordAuthenticationSource;
    var username : String = uNameSource.getUsername();
    var userPublicId : String = _handler.findUser(username);
    logger.debug("user " + username + " has PublicID " + userPublicId);
    
    if (userPublicId == null) {
      throw new FailedLoginException("Bad user name " + username);
    }
    checkLoginRestricted(userPublicId)

    return userPublicId;
  }

  public override function setCallback(callbackHandler : AuthenticationServicePluginCallbackHandler) {
    _handler = callbackHandler;
  }
  
  /**
   * Check wether ClaimCenter is in maintance mode and if so whether the user is allowed to log in.
   */
  private function checkLoginRestricted(userPublicId : String){
    if (ScriptParameters.Login_ClaimsITOnly == true and !claimsITUser(userPublicId)) {
        throw new DisplayableException("The server is currently undergoing maintenance. Please retry later.");
    }
  }

  /**
   * Handles login criterea for maintance mode: currently, only users in the Claims IT group are allowed
   * to login
   */  
  function claimsITUser(userPublicId:String):boolean {

    // Query if user has a role of Superuser
    var query = gw.api.database.Query.make(entity.User);
      // user from User table based on userPublicId
      query.compare("PublicID", Equals, userPublicId);
      query.or( \ user -> 
        {
          // If the user is a SystemUser
          user.compare("SystemUserType", NotEquals, Null);
          
          // Or if user is a Superuser
          var userRoles = user.subselect( "ID", CompareIn, UserRole as IEntityType, "User")
            userRoles.join("Role").compare("Name", Equals, "Superuser")

          // Or if user is in Claims IT
          var groupUsers = user.subselect( "ID", CompareIn, GroupUser as IEntityType, "User")
            groupUsers.join("Group").compare("Name", Equals, "Claims IT")
        });

    if (query.select().Count > 0) return true;
    return false;
  }
  
  construct(){}
}