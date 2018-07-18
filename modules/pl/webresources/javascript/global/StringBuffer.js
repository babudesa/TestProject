/**
 * (c) 2003 Guidewire Software
 *
 * Class: StringBuffer
 *
 * Contains global object type simulating a (subset of the functionality of a) Java-style StringBuffer
 * Feel free to add your own helper functions here.
 */

function StringBuffer() {

  this.stringArray = new Array();

}

StringBuffer.prototype.append = function(str) {
  ArrayUtil.appendElement(this.stringArray, str);
  return this;
}

StringBuffer.prototype.toString = function() {
  return this.stringArray.join('');
}

