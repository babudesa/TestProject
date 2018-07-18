/**
 * (c) 2003 Guidewire Software
 *
 * Class: StringUtil
 *
 * Contains global helper functions for manipluating string data.
 * Feel free to add your own helper functions here.
 */

/**
 * Register the StringUtil class as a global library
 */
window.StringUtil = new StringUtilImpl();

/**
 * Constructor
 */
function StringUtilImpl() {
  // Do nothing
}

/**
 * Returns the passed-in string with its first letter capitalized
 */
StringUtilImpl.prototype.capitalizeFirstLetter = function(str) {
  if (str.length > 0) {
    var firstChar = str.substring(0,1);
    var end = str.substring(1, str.length);
    return firstChar.toUpperCase() + end;
  } else {
    return str;
  }
}

/**
 * True if string A ends with string B
 */
StringUtilImpl.prototype.endsWith = function(strA, strB) {
  if (!strA || strA.length < strB.length) {
    return false;
  }
  return strA.substr(strA.length - strB.length) == strB;
}

/**
 * Splits an entity option into an array.
 *
 * @param entityOption A string having the gw establish entity format, "<bean-class-name>:<bean-instance-id>"
 * @return An two element array where the first element is the class and the second is the id.
 */
StringUtilImpl.prototype.splitEntityOption = function(entityOption) {
  if(entityOption == null) {
    return null;
  }

  return entityOption.split( ":" );
}

/**
 * Takes in a user and group id (as ints) and composes a string of the form User:id;Group:id
 *
 * @param user the id of the user
 * @param group the id of the group
 * @return
 */
StringUtilImpl.prototype.composeUserGroupValue = function(user, group) {
  return "User:" + user + ";Group:" + group;
}

/**
 * Retruns a string after trim white space from the left and the right of the given string
 */
StringUtilImpl.prototype.trim = function(str) {
  return str == null ? str : str.replace(/^\s+|\s+$/g,"");
}
