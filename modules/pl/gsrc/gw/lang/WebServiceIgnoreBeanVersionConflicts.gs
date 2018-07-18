package gw.lang;

uses gw.lang.annotation.AnnotationUsage
uses gw.lang.reflect.IValidationContributor
uses gw.lang.reflect.IFeatureInfo
uses gw.lang.reflect.gs.IGosuMethodInfo
uses gw.lang.parser.resources.Res
uses gw.lang.reflect.gs.IGosuClassTypeInfo

/**
  * Use this annotation to indicate that this method or class should perform bean version checking
  * on commit
  */
@AnnotationUsage(gw.lang.annotation.UsageTarget.MethodTarget, gw.lang.annotation.UsageModifier.One)
class WebServiceIgnoreBeanVersionConflicts implements IAnnotation, IValidationContributor {

  construct() {
  }

  override function afterDefnCompile(feature : IFeatureInfo) {
    if (feature typeis IGosuClassTypeInfo) {
      var anns = feature.getAnnotation(WebService)
      if (anns == null || anns.Count == 0) {
        feature.GosuClass.ClassStatement.ClassDeclaration.addParseException(Res.WSDL_NOT_WEBSERVICE, new String[]{ } )
      }
    }
    else if (feature typeis IGosuMethodInfo) {
      var anns = feature.OwnersType.TypeInfo.getAnnotation(WebService)
      if (anns == null || anns.Count == 0) {
        feature.Dfs.DeclFunctionStmt.addParseException(Res.WSDL_NOT_WEBSERVICE, new String[]{ } )
      }
    }
    else {
      // let the annotation throw that it is on the wrong feature
    }
  }

}
