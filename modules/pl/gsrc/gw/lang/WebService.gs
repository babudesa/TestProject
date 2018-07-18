package gw.lang;

uses gw.api.webservice.WSRunlevel
uses gw.api.webservice.WebServiceClassAnnotation
uses gw.lang.annotation.AnnotationUsage
uses gw.lang.reflect.IFeatureInfo
uses gw.lang.parser.resources.Res
uses gw.internal.gosu.parser.GosuClassTypeInfo
uses gw.lang.reflect.gs.IGosuMethodInfo
uses gw.lang.reflect.IValidationContributor
uses gw.lang.parser.expressions.ITypeLiteralExpression
uses gw.internal.gosu.parser.expressions.ParameterDeclaration
uses com.guidewire.pl.system.webservices.axis.GWServiceDesc
uses com.guidewire.pl.system.webservices.typeloader.SOAPOutboundRegistry
uses com.guidewire.pl.system.webservices.typeloader.verify.SOAPTypeVerifier
uses com.guidewire.pl.system.webservices.typeloader.verify.SOAPVerificationError
uses com.guidewire.pl.system.webservices.typeloader.verify.SOAPVerificationWarning
uses com.guidewire.pl.system.webservices.wsdl.WSMethodSignature
uses java.util.ArrayList
uses java.util.HashMap
uses gw.api.system.PLConfigParameters

/**
  * The WebService annotation is used to expose a class as a web service.  Adding the WebService annotation
  * will cause the class to automatically be exposed as a web service.
  *
  * The methods of the class need to be tagged in addition to tagging the class as a web service.  You do this
  * by adding the @WebMethod annotation on each method you wish to expose.
  */
@AnnotationUsage(gw.lang.annotation.UsageTarget.TypeTarget, gw.lang.annotation.UsageModifier.One)
class WebService implements IAnnotation, WebServiceClassAnnotation, IValidationContributor
{
  //The default permissions required for users, users with SOAP Admin privilages.
  private var _requiredPermissions : SystemPermissionType[] = {SystemPermissionType.TC_SOAPADMIN}
  
  //The default run level is with No Daemons running.
  private var _runLevel : WSRunlevel = WSRunlevel.NODAEMONS;
  
  //GererateInToolkit.  This will create java stubs for the web service in the toolkit.  default true.
  private var _generateInToolkit : boolean = true;
  
  construct() {
  }

  construct(runLvl : WSRunlevel, reqPerms : SystemPermissionType[], genTk :boolean) {
    _runLevel = runLvl
    _requiredPermissions = reqPerms
    _generateInToolkit = genTk
  }

  construct(runLvl : WSRunlevel, reqPerms : SystemPermissionType[]) {
    _runLevel = runLvl
    _requiredPermissions = reqPerms
  }
    
  construct(reqPerms : SystemPermissionType[], genTk :boolean) {
    _requiredPermissions = reqPerms
    _generateInToolkit = genTk
  }
  
  construct(runLvl : WSRunlevel, genTk :boolean) {
    _runLevel = runLvl;
    _generateInToolkit = genTk;
  }
    
  construct(runLvl : WSRunlevel) {
    _runLevel = runLvl;
  }
  
  construct(reqPerms : SystemPermissionType[]) {
    _requiredPermissions = reqPerms;
  }
    
  construct(genTk :boolean) {
    _generateInToolkit = genTk;
  }
  
  override property get RunLevel():WSRunlevel{
    return _runLevel;
  }
  
  override property get RequiredPermissions():SystemPermissionType[] {
    return _requiredPermissions;
  }
  
  override property get GenerateInToolkit():boolean{
    return _generateInToolkit;
  }
  
  override function afterDefnCompile(feature : IFeatureInfo) {
    var typeInfo = feature as GosuClassTypeInfo

    var namespaceMap = new HashMap<String, String>()
    // Check for duplicate web service names
    var allWSDL = SOAPOutboundRegistry.getInstance().AllWSDL
    //print( "${ allWSDL.Count } WSDLs" )
    allWSDL.each( \ w ->{
      if (w.Name.equals( typeInfo.OwnersType.RelativeName ) && w.ImplClass != typeInfo.OwnersType) {
        typeInfo.GosuClass.ClassStatement.ClassDeclaration.addParseException( Res.WSDL_DUPLICATE_WEB_SERVICE, new String[]{ w.ImplClass.Name, typeInfo.Name} )
      }
      //This is required to detect duplicate names across web services.  This is disabled for perf reasons. CC-45132
      else if (w.Name != typeInfo.OwnersType.RelativeName)
      {
        SOAPTypeVerifier.buildTypeGraph( w.ImplClass, namespaceMap )
      }
      else {
        SOAPTypeVerifier.clearBuildTypeGraphCache( w.ImplClass )
      }
    })    
    var methodMap = new HashMap<WSMethodSignature, List<IGosuMethodInfo>>()
    // Iterate each method and check the args+return type
    typeInfo.Methods.each(\ m -> {
      if (GWServiceDesc.belongsOnSOAP( m )) {
        var gM = m as IGosuMethodInfo

        //Detect duplicate methods
        var wsSignature = new WSMethodSignature( ( gM as gw.lang.reflect.IMethodInfo ).DisplayName, gM.Parameters.Count)
        var methods = methodMap.get( wsSignature)
        if (methods == null){
          methods = new ArrayList<IGosuMethodInfo>()
          methodMap.put(wsSignature, methods)
        }
        methods.add(gM)

        var typeLiterals = new ArrayList<ITypeLiteralExpression>();
        gM.Dfs.DeclFunctionStmt.Location.Children.each( \ p -> {
            if (ITypeLiteralExpression.Type.isAssignableFrom(typeof p.ParsedElement)) {
              typeLiterals.add(p.ParsedElement as ITypeLiteralExpression)
            } else if (ParameterDeclaration.Type.isAssignableFrom(typeof p.ParsedElement)) {
              p.ParsedElement.getContainedParsedElementsByType( ITypeLiteralExpression, typeLiterals )
            }
        } )

        for (tl in typeLiterals) {
          var issues = SOAPTypeVerifier.getSoapVerificationErrors( tl.Type.Type )
          issues.addAll(SOAPTypeVerifier.getNameConflicts( tl.Type.Type, namespaceMap ))
          for (error in issues.whereTypeIs(SOAPVerificationError)){
            tl.addParseException( error.Msg, error.Args )
          }
          for (warning in issues.whereTypeIs(SOAPVerificationWarning)){
            tl.addParseWarning( warning.Msg, warning.Args )
          }
        }
      }
    })    
    
    methodMap.Values.each( \ methodList -> {
        if (methodList.Count > 1){
          var methodDescList = methodList.map( \ mi -> methodAsString(mi))
          for (m in methodList){
            var methodDesc = methodAsString(m)
            methodDescList.remove( methodDesc )
            m.Dfs.DeclFunctionStmt.addParseException( Res.WSDL_DUPLICATE_METHOD, new String[]{ methodDesc, methodDescList.join(",")} )
            methodDescList.add( methodDesc )
          }   
        }
      })
  }
  
  //----------------------------------------------------------------- private helper methods

  private function methodAsString(methodInfo : gw.lang.reflect.IMethodInfo) : String{
     var params = methodInfo.Parameters.map( \ p -> p.Name + ":" + p.Type )
     return methodInfo.DisplayName + "(" + params.join( "," ) + ")"
  }
}
