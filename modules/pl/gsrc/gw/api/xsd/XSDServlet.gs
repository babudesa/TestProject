package gw.api.xsd

uses gw.servlet.Servlet
uses javax.servlet.http.HttpServletRequest
uses javax.servlet.http.HttpServletResponse
uses javax.servlet.http.HttpServlet
uses gw.xml.xsd.typeloader.XSDTypeLoaderBase
uses gw.util.StreamUtil
uses gw.xml.xsd.typeloader.XSDBuiltInTypeFactory

@Servlet( \ path : String ->path.matches( "/xsd(/.*)?" ) )
class XSDServlet extends HttpServlet
{

  static final var PREFIX = "/xsd"
  static final var SUFFIX = ".xsd"
  static final var PREFIX_LENGTH = PREFIX.length
  static final var SUFFIX_LENGTH = SUFFIX.length

  override function doGet(req: HttpServletRequest, resp : HttpServletResponse)
  { 
    final var origPath = req.getPathInfo().substring( PREFIX_LENGTH )
    if ( origPath.endsWith( SUFFIX ) ) // User is looking up an actual XSD
    {
      if (XSDPublishHelper.getAdditionalPaths().contains(origPath.substring(1))) {
        resp.ContentType = "text/xml"
        resp.setStatus( HttpServletResponse.SC_OK )
        XSDPublishHelper.outputSchema(origPath.substring(1), resp.OutputStream)
        return;
      }
      var path = origPath.substring( 1, origPath.length - SUFFIX_LENGTH ) // /foo/bar.xsd -> foo/bar
      path = path.replace( "/", "." ) // foo/bar -> foo.bar (path to namespace)

      var bytes = XSDTypeLoaderBase.getSchemaFromXSDTypeLoaders( path ).XSDSource.XSDSchema.getBytes()
      resp.ContentType = "text/xml"
      resp.setStatus( HttpServletResponse.SC_OK )
      resp.Writer.append( StreamUtil.toString( bytes ) )
      return
    }
    else if ( origPath == "" or origPath == "/" )
    {
      var dir = ""
      if ( origPath == "" )
      { 
        // User requested http://hostname:port/cc/service/xsd... Which gives a URL base of
        // http://hostname:port/cc/service/... But when they click links we want to navigate
        // them to files in the 'xsd' subdir, so we prepend "xsd/" to the generated hrefs
        dir = "xsd/"   
      }
      resp.ContentType = "text/html"
      resp.setStatus( HttpServletResponse.SC_OK )
      resp.Writer.append( "<html><body><h2>Available schemas:</h2>" )
      XSDTypeLoaderBase.getAllNamespacesFromXSDTypeLoaders().sort().each( \ namespace ->{
        var includeSchema = false
        try {
          includeSchema = namespace != XSDBuiltInTypeFactory.BUILT_IN_NAMESPACE and XSDTypeLoaderBase.getSchemaFromXSDTypeLoaders( namespace ).XSDSource != null
        }
        catch ( ex ) {
          resp.Writer.append( "${ namespace } <b><font color='red'>*</font></b><br><br>" )
        }
        if ( includeSchema )
        {
          namespace = namespace.replace( ".", "/" )
          resp.Writer.append( "<a href='${ dir }${ namespace }.xsd'>${ namespace }</a><br><br>" )
        }
      })
      resp.Writer.append( "<h2>Generate schemas:</h2>" )
      for (genPath in XSDPublishHelper.getAdditionalPaths()) {
          resp.Writer.append( "<a href='${ dir }${ genPath }'>${ genPath }</a><br><br>" )
      }

      resp.Writer.append( "</body></html>\n" )
      return
    }
    resp.ContentType = "text/plain"
    resp.setStatus( HttpServletResponse.SC_NOT_FOUND )
    resp.Writer.append( "Not found: " + origPath )

  }

}

