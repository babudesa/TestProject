package gw.lang;

uses gw.api.webservice.WSRunlevel;
uses gw.api.webservice.WebServiceAnnotation;
uses gw.lang.annotation.AnnotationUsage

/**
  * The WebServiceMethod annotation is used to set properties of a single 
  * web service operation within a WebService class.
  * 
  * Restrictions.
  * A. The method must be public
  * B. The method must be a part of a Gosu class with the 'WebService' annotation.
  *
  * Any conflicts between settings defined in the class level 'WebService' annotation 
  * and this method level annotation will resolve to the method level annotation.  This 
  * annotation is not required to exposed web service methods, all public methods of a 
  * class with the 'WebService' annotation are exposed by default (unless the 
  * 'DoNotPublish' annotation is set).
  */
@AnnotationUsage(gw.lang.annotation.UsageTarget.MethodTarget, gw.lang.annotation.UsageModifier.One)
class WebServiceMethod implements IAnnotation, WebServiceAnnotation
{
  //Defaults to null.  This means that it will inherit the value of the WebService annotation for the class.
  private var _requiredPermissions : SystemPermissionType[] as readonly RequiredPermissions 
  
  //Defaults to null.  This means that it will inherit the value of the WebService annotation for the class.
  private var _runLevel : WSRunlevel as readonly RunLevel
  
  construct() {
  }
    
  construct(theRequiredPermissions : SystemPermissionType[]) {
    _requiredPermissions = theRequiredPermissions
  }

  construct(theRunLevel : WSRunlevel, theRequiredPermissions : SystemPermissionType[]) {
    _runLevel = theRunLevel;
    _requiredPermissions = theRequiredPermissions
  }

  construct(theRunLevel : WSRunlevel) {
    _runLevel = theRunLevel;
  }
}
