package gw.lang;

uses gw.lang.annotation.AnnotationUsage

/**
  * The DoNotPublish annotation is 'hide' a public method of a class annotated 
  * with Gosu web service class from publication as part of the web service.
  */
@AnnotationUsage(gw.lang.annotation.UsageTarget.MethodTarget, gw.lang.annotation.UsageModifier.One)
class DoNotPublish implements IAnnotation
{
  construct()
  {
  }
}
