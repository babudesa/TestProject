package gw.servlet

uses gw.lang.annotation.AnnotationUsage
uses org.apache.commons.io.FilenameUtils

@AnnotationUsage(TypeTarget, One)
class Servlet implements IAnnotation, IServletAnnotation
{
  private var _pathMatcher : block( path : String ) : boolean;
  
  construct(final pathPattern : String)
  {
    _pathMatcher = \ path -> {
      return FilenameUtils.wildcardMatch( path, pathPattern)
    }
  }
  
  construct(pathMatcher : block( path : String ) : boolean) {
    _pathMatcher = pathMatcher;
  }
  
  override function matchesPath(path : String) : boolean {
    return _pathMatcher(path == null ? "" : path);
  }
}
