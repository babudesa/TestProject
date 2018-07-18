package gw.api.sree;

uses gw.api.sree.GWSRUser
uses gw.api.webservice.login.LoginAPIHelper
uses gw.api.webservice.exception.LoginException
uses com.guidewire.pl.system.dependency.ServerDependencies
uses gw.api.system.PLConfigParameters
uses com.guidewire.pl.system.dependency.PLDependencies
uses com.guidewire.pl.web.controller.UserDisplayableException
uses java.util.ArrayList;
uses gw.api.database.Query
@WebService
@Export
class ISREEAuthenticationAPI {
  construct() {
  }
  
  /**
   * Returns GWSRUser if the ticket is associated with the correct service request. Returns null otherwise.
   */
  function validateTicket(ticket : String) : GWSRUser {
    
    // always check locally first because clusterchannel will only check other memebers in the cluster.
    var serviceTokenManager = PLDependencies.getServiceTokenManager()
    var serviceTokens = serviceTokenManager.getActiveServiceTokens()
    var serviceToken = serviceTokens.firstWhere( \ serviceToken -> serviceToken.SessionID.equals( ticket ) )
    if( serviceToken != null && serviceToken.isAuthenticatedUser()) {
       return new GWSRUser( serviceToken.User )
    }

    if(PLConfigParameters.ClusteringEnabled.Value) {
      var authHandler = ServerDependencies.getAuthenticationHandler()
      var userObject = authHandler.authenticate(ticket)
      if( userObject != null ) {
        return new GWSRUser( userObject.toString() )
      }
    }
    return null
  }

  /**
   * return the current GWSRUser with the most up-to-date information such as groupIDs.
   */
  function updateGWUser(username: String) : GWSRUser {
    return GWSRUser.getByUsername( username )
  }

  /**
   * Returns the GWSRUser if the given user can successfully log in with supplied password.
   */
  function getUser(username : String, password : String) : GWSRUser {
    try{      
      LoginAPIHelper.login( username, password )
      return new GWSRUser(username)
    }catch( e : LoginException ) {
      throw new UserDisplayableException( "Not able to log in user: " + username, e)
    }
  }
  
  /**
   * Returns a set of prefixes. Access to all reports under these paths will be allowed 
   * when accessed directly through the replet API in InetSoft
   */
  function getDocumentRepletPaths() : String[] {
    var docReports = find(report in SREEReport where report.DocumentReport == true)
    var paths = new ArrayList<String>()
    for (docReport in docReports) {
      paths.add(docReport.FullPath)
    }
    return paths as String[]
  }

  /**
   * Get all user names in the system
   */
  function getUserNames() : String[] {
    return Query.make(Credential).select(\ row -> row.UserName).toTypedArray()
  }

  /**
   * Get all role names in the system
   */
  function getRoleNames() : String[] {
    return Query.make(Role).select(\ row -> row.Name).toTypedArray()
  }

  /**
   * Get all group IDs in the system
   */
  function getGroupIDs() : String[] {
    return Query.make(Group).select(\ row -> row.ID as String).toTypedArray()
  }

  /**
   * Get role by name or return null
   */
  function getRole(name:String) : GWSRRole {
    var roleQuery = find(role in Role where role.Name == name)
    var role = roleQuery.FirstResult
    return role == null ? null : new GWSRRole(role)
  }

  /**
   * Get group by ID or return null
   */
  function getGroup(id:String) : GWSRGroup {
    return GWSRGroup.load(id)
  }
}
