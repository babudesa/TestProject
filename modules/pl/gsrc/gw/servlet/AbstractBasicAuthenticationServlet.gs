package gw.servlet
uses javax.servlet.http.HttpServletResponse
uses javax.servlet.http.HttpServletRequest
uses gw.api.webservice.login.LoginAPIHelper
uses org.apache.commons.codec.binary.Base64;

abstract class AbstractBasicAuthenticationServlet extends AbstractGWAuthServlet
{
  construct()
  {
  }

  override protected function service(req : HttpServletRequest, resp : HttpServletResponse) {
    if (req.ParameterMap["_logout_"] != null) {
      logout(req)
      invalidAuthentication( req, resp )
    } else {
      super.service( req, resp )
    }
  }
  
  override function authenticate( req: HttpServletRequest ) : String
  {
    var retValue : String = null
    var authHeader = req.getHeader( "authorization" )
    if (authHeader != null) {
      if (authHeader.toLowerCase().startsWith( "basic ")) {
        // We can deal with basic...
        var fullAuth = new String(Base64.decodeBase64( authHeader.substring( 6 ).getBytes("UTF-8")))
        var unamePasswd = fullAuth.split( ":" )
        try {
          retValue = LoginAPIHelper.login( unamePasswd[0], unamePasswd[1] )
        } catch (e) {
          retValue = null
        }
      }
    }
    
    return retValue
  }

  override function storeToken( req: HttpServletRequest, token: String ) : void
  {
    // we don't do this
  }

  override function invalidAuthentication( req: HttpServletRequest, resp: HttpServletResponse ) : void
  {
    resp.setHeader( "WWW-Authenticate", "Basic realm=\"Secure Area\"")
    resp.setStatus( HttpServletResponse.SC_UNAUTHORIZED )
  }

}
