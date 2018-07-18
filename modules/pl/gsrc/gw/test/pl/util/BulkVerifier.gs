package gw.test.pl.util;

uses java.lang.StringBuilder
uses junit.framework.Assert

class BulkVerifier {
  
  var errors : StringBuilder
  
  construct() {
    errors = new StringBuilder()
  }
 
  function throwIfErrors() {
    Assert.assertTrue(errors.toString(), errors.length() == 0)
  }
  
  // Returns an error message if given values are not equal.
  function verifyEquals(field : String, expected : String, found : String) {
    var tmp = (expected == null) ? "" : expected
    if (tmp != found) {
      errors.append(field).append( ": expected ").append(expected).append(", found ").append(found).append("\n")
    }
  }
  
  // Returns an error message if given values are not equal.
  function verifyEquals(field : String, expected : Object, found : Object) {
    if (expected != found) {
      errors.append(field).append( ": expected ").append(expected).append(", found ").append(found).append("\n")
    }
  }
  
  /**
   * Adds an error if given object is not null or ""
   */
  function verifyEmpty(field : String, found : Object) {
    if (found != null && found != "") {
      errors.append(field).append(" is not empty").append("\n")
    }
  }
  
  // Returns an error message if given value is not null.
  function verifyNull(field : String, found : Object) {
    if (found != null) {
      errors.append(field).append(" is not null").append("\n")
    }
  }
  
  // Returns an error message if given value is not null.
  function verifyNotNull(field : String, found : Object) {
    if (found == null) {
      errors.append(field).append(" is null").append("\n")
    }
  }
  
  // Returns an error message if given values are not equal.
  function verifyStartsWith(field : String, expectedPrefix : String, found : String) {
    if (found == null || !found.startsWith( expectedPrefix )) {
      errors.append(field).append( ": expected value to start with ").append(expectedPrefix).append(", found ").append(found).append("\n")
    }
  }
}
