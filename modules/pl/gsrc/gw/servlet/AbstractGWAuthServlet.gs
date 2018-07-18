package gw.servlet

uses javax.servlet.http.*
uses com.guidewire.pl.system.service.context.*
uses com.guidewire.pl.system.dependency.PLDependencies

abstract class AbstractGWAuthServlet extends HttpServlet
{
  construct()
  {
  }
  
  override protected function service(req : HttpServletRequest, resp : HttpServletResponse) {
    var tokenStr = authenticate( req )
    var token : ServiceToken
    try {
      token = PLDependencies.getServiceTokenManager().unlockToken( tokenStr )
    } catch (e) {
      token = null;
    }
    if (token == null && !isAuthenticationRequired( req )) {
      token = PLDependencies.getServiceTokenManager().createUnathenticatedToken()
    }
    
    if (token == null) {
      invalidAuthentication(req, resp)
    } else {
      PLDependencies.getCommonDependencies().setServiceToken(token);
      try {
        super.service( req, resp )
      } finally {
        var newToken = PLDependencies.getCommonDependencies().getServiceToken()
        if (newToken.isAuthenticatedUser()) {
          storeToken(req, newToken.SessionID)
        } else {
          PLDependencies.getServiceTokenManager().removeToken(token);
        }
      }
    }
  }
  
  protected function logout(req : HttpServletRequest) {
    var newToken = PLDependencies.getCommonDependencies().getServiceToken()
    PLDependencies.getServiceTokenManager().removeToken(newToken);
    storeToken(req, newToken.SessionID)
  }
  
  abstract protected function isAuthenticationRequired(req : HttpServletRequest) : boolean
  
  abstract protected function authenticate(req : HttpServletRequest) : String;
  
  abstract protected function storeToken(req : HttpServletRequest, token : String);
  
  abstract protected function invalidAuthentication(req : HttpServletRequest, resp : HttpServletResponse)
}
