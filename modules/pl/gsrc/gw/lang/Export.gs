package gw.lang;

uses gw.lang.annotation.AnnotationUsage

/**
  * Use this annotation to indicate a class which should be visible to customers.
  */
@AnnotationUsage(gw.lang.annotation.UsageTarget.TypeTarget, gw.lang.annotation.UsageModifier.One)
class Export implements IAnnotation {

  construct() {
  }

}
