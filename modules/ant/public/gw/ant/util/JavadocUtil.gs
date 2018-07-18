package gw.ant.util

uses gw.ant.wrappers.Javadoc

class JavadocUtil
{
  static function applyCopyrightBoilerplate(jd : Javadoc) {
    jd.Bottom = "<i>Copyright &#169; 2001-2009 Guidewire Software, Inc. All Rights Reserved.<br>" +
        "Guidewire, Guidewire Software, Guidewire ClaimCenter, Guidewire PolicyCenter, and the Guidewire " +
        "logo are registered trademarks, and Guidewire Insurance Suite, Guidewire BillingCenter, Guidewire " +
        "ContactCenter, and Guidewire Studio are trademarks of Guidewire Software, Inc. All other product " +
        "names are the trademarks of their respective companies.</i>"
  }
}
