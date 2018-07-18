package gw.lang;

uses gw.lang.annotation.AnnotationUsage

/**
  * Use this annotation to indicate a class which should not be edited by customers.
  */
@AnnotationUsage(gw.lang.annotation.UsageTarget.TypeTarget, gw.lang.annotation.UsageModifier.One)
class ReadOnly implements IAnnotation {

  construct() {
  }

}
